import { and, eq } from "drizzle-orm";
import { db } from "../dataBase/db";
import { room_members, type AuditAction, type RoomMember } from "../dataBase/schema";
import { generateId } from "./utils";
import { AuditService } from "./Audit";

const auditService = new AuditService();

export class RoomMembersService {
  private table = room_members;

  /**
   * Strips immutable metadata keys and merges client updates over target records cleanly.
   */
  private _mergeAllowedPatch(existing: RoomMember, patch: Partial<RoomMember>): Partial<RoomMember> {
    const {
      room_id: _roomId,
      user_id: _userId,
      created_at: _createdAt,
      ...allowedExisting
    } = existing;

    return {
      ...allowedExisting,
      ...patch,
    };
  }

  // ========================================================
  // CORE LOWER-LEVEL DATABASE METHODS (PRIVATE PRIMITIVES)
  // ========================================================

  private async _create(client: any, values: Omit<RoomMember, "is_deleted"|"deleted_at">): Promise<RoomMember> {
    const result = await client
      .insert(this.table)
      .values(values)
      .returning();

    if (!result || result.length === 0 || !result[0]) {
      throw new Error("Database execute failed: Room member insert returned empty data array.");
    }
    return result[0];
  }


  private async _update(client: any, roomId: string, userId: string, values: Partial<RoomMember>): Promise<RoomMember> {
    const result = await client
      .update(this.table)
      .set(values)
      .where(
        and(
          eq(this.table.room_id, roomId),
          eq(this.table.user_id, userId)
        )
      )
      .returning();

    if (!result || result.length === 0 || !result[0]) {
      throw new Error("Database execution tracking mismatch: Update failed or target Room Member correlation not found.");
    }
    return result[0];
  }

  private async _getById(client: any, roomId: RoomMember['room_id'], userId: RoomMember['user_id']): Promise<RoomMember> {
    const result = await client
      .select()
      .from(this.table)
      .where(
        and(
          eq(this.table.room_id, roomId),
          eq(this.table.user_id, userId)
        )
      )
      .limit(1);

    if (!result || result.length === 0 || !result[0]) {
      throw new Error(`Database fetch failed: Room member association with Room ID ${roomId} and User ID ${userId} was not found.`);
    }
    return result[0];
  }

  private async _getAll(client: any, limit: number, offset: number): Promise<RoomMember[]> {
    const result = await client
      .select()
      .from(this.table)
      .limit(limit)
      .offset(offset);

    if (!result) {
      throw new Error("Room members selection returned an invalid execution context.");
    }
    return result;
  }

  private async _delete(client: any, roomId: string, userId: string): Promise<RoomMember> {
    const result = await client
      .delete(this.table)
      .where(
        and(
          eq(this.table.room_id, roomId),
          eq(this.table.user_id, userId)
        )
      )
      .returning();

    if (!result || result.length === 0 || !result[0]) {
      throw new Error("Database execution tracking mismatch: Deletion failed or target Room Member correlation not found.");
    }
    return result[0];
  }

  // ========================================================
  // TRANSACTION HOOKS (PUBLIC EXTERNAL HOOKS)
  // ========================================================

  async useCreate(client: any, values: RoomMember): Promise<RoomMember> {
    return await this._create(client, values);
  }

  async useUpdate(client: any, roomId: string, userId: string, values: Partial<RoomMember>): Promise<RoomMember> {
    return await this._update(client, roomId, userId, values);
  }

  async useGetById(client: any, roomId: string, userId: string): Promise<RoomMember> {
    return await this._getById(client, roomId, userId);
  }

  async useDelete(client: any, roomId: string, userId: string): Promise<RoomMember> {
    return await this._delete(client, roomId, userId);
  }

  // ========================================================
  // HIGH-LEVEL COMPOSITE WORKFLOWS (PUBLIC BUSINESS LOGIC)
  // ========================================================

  async addMember(roomId: string, userId: string) {
    try {
      const result = await db.transaction(async (tx) => {
        const payload: Omit<RoomMember, "is_deleted"|"deleted_at"> = {
          room_id: roomId,
          user_id: userId,
          created_at: new Date()
        }; // Cast safely if your schema includes other properties

        const member = await this._create(tx, payload);

        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: userId,
          action: "CREATE" as AuditAction,
          flag: "info",
          detail:  ` room id[${roomId}] : active`
        } as any);

        return member;
      });
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }


  async joinRoomTransaction(roomId: string, userId: string) {
  try {
    const result = await db.transaction(async (tx) => {
      const existingMember = await tx
        .select()
        .from(room_members)
        .where(
          and(
            eq(room_members.room_id, roomId),
            eq(room_members.user_id, userId)
          )
        )
        .limit(1);

      if (existingMember.length > 0) {
        return { msg: "already_member", ans: null };
      }

      const payload: Omit<RoomMember, "is_deleted" | "deleted_at"> = {
        room_id: roomId,
        user_id: userId,
        created_at: new Date()
      };

      const newMember = await this._create(tx, payload);

      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: userId,
        action: "ROOM",
        flag: "info",
        detail: `User ${userId} joined room ${roomId} successfully as an active participant.`
      });

      return { msg: "success", ans: newMember };
    });

    return result;
  } catch (e: any) {
    return { msg: "failed_to_join", ans: e.message };
  }
}


  async addMemberSafe(roomId: string, userId: string) {
    try {
      const lookupResult = await db
        .select()
        .from(this.table)
        .where(
          and(
            eq(this.table.room_id, roomId),
            eq(this.table.user_id, userId)
          )
        )
        .limit(1);

      if (lookupResult?.[0]) {
        return { msg: "success", ans: lookupResult[0] };
      }

      const result = await db.transaction(async (tx) => {
        const payload: RoomMember = {
          room_id: roomId,
          user_id: userId,
          created_at: new Date()
        } as any;

        const created = await this._create(tx, payload);

        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: userId,
          action: "CREATE" as AuditAction,
          flag: "info",
          detail: ` room id[${roomId}] : idempotent_safe_path`
        });

        return created;
      });
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  async updateMember(roomId: string, userId: string, patch: Partial<RoomMember>) {
    try {
      const result = await db.transaction(async (tx) => {
        const existing = await this._getById(tx, roomId, userId);
        const cleanUpdatePayload = this._mergeAllowedPatch(existing, patch);
        const updated = await this._update(tx, roomId, userId, cleanUpdatePayload);

        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: userId,
          action: "ROOM",
          flag: "info",
          detail:` room id[${roomId}] : Existing [${JSON.stringify(existing)}] : Updated [${JSON.stringify(updated)}]`
        });

        return updated;
      });
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  async revokeMember(roomId: string, userId: string) {
    try {
      const result = await db.transaction(async (tx) => {
        const member = await this._delete(tx, roomId, userId);

        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: userId,
          action: "ROOM_MEMBER_REVOKE" as any,
          flag: "critical",
          detail:` room id[${roomId}] : revoked_member_payload: ${member}`
        });

        return member;
      });
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  async isMember(roomId: string, userId: string) {
    try {
      await this._getById(db, roomId, userId);
      return { msg: "success", ans: true };
    } catch {
      return { msg: "success", ans: false };
    }
  }

  async getMembersByRoomId(roomId: string) {
    try {
      const res = await db
        .select()
        .from(this.table)
        .where(eq(this.table.room_id, roomId));

      return { msg: "success", ans: res };
    } catch (e: any) {
      return { msg: e.message, ans: [] };
    }
  }

  /**
   * BACKWARD COMPATIBLE RAW CONTROLLER ALIAS
   * Satisfies legacy implementations accessing raw unboxed arrays directly.
   */
  async getMbembersByroomId(roomId: string): Promise<RoomMember[]> {
    try {
      const result = await db
        .select()
        .from(this.table)
        .where(eq(this.table.room_id, roomId));
      return result ?? [];
    } catch {
      return [];
    }
  }

  async getMemberData(roomId: string, userId: string) {
    try {
      const res = await this._getById(db, roomId, userId);
      return { msg: "success", ans: res };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  async GetAll(limit: number, offset: number, actor: string) {
  try {
    const safeLimit = limit > 0 ? limit : 10;
    const safeOffset = offset >= 0 ? offset : 0;

    const result = await db.transaction(async (tx) => {
      // 1. Fetch records using the transactional client instance
      const roomsList = await this._getAll(tx, safeLimit, safeOffset);

      // 2. Log user tracking record inside your system audit trail table
      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: actor,
        action: "ROOM",
        flag: "info",
        detail: `User ${actor} retrieved global room listings (Limit: ${safeLimit}, Offset: ${safeOffset}). Retrieved ${roomsList ? roomsList.length : 0} records.`,
      });

      return roomsList;
    });

    return { msg: "success", ans: result };
  } catch (e: any) {
    return { msg: e.message, ans: [] };
  }
}

}
