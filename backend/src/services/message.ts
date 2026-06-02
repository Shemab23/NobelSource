import { EntityService } from './entities';
import { eq, and, desc, lt, or, sql,arrayContains } from "drizzle-orm";
import { db } from "../dataBase/db";
import { messages, type Message } from "../dataBase/schema";
import { generateId } from "./utils";
import { AuditService } from "./Audit";

const auditService = new AuditService();
const entityService = new EntityService();

export class MessageService {
  private table = messages;

  private async __mergeUpdate(original: Message, updated: Partial<Message>): Promise<Message> {
      return {
        ...original,
        ...updated,
        metadata: {
          ...original.metadata,
          ...updated.metadata
        },
        participants: [
          ...original.participants,
          ...(updated.participants ?? [])
        ]
      };
  }

  // ========================================================
  // CORE LOWER-LEVEL DATABASE METHODS (PRIVATE PRIMITIVES)
  // ========================================================

  private async _create(client: any, values: Omit<Message, "created_at"|"deleted_at"|"is_deleted">): Promise<Message> {
    const result = await client
      .insert(this.table)
      .values(values)
      .returning();

    if (!result || result.length === 0 || !result[0]) {
      throw new Error("Database execution failed: Message insert returned empty data array.");
    }
    return result[0];
  }

  private async _delete(client: any, id: string): Promise<Message> {
    const result = await client
      .update(this.table)
      .set({
        is_deleted: true,
        deleted_at: new Date()
      })
      .where(eq(this.table.id, id))
      .returning();

    if (!result || result.length === 0 || !result[0]) {
      throw new Error(`Database execution tracking mismatch: Deletion failed for Message ID ${id}.`);
    }
    return result[0];
  }

  private async _getById(client: any, id: Message["id"]): Promise<Message> {
    const result = await client
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .limit(1);

    if (!result || result.length === 0 || !result[0]) {
      throw new Error(`Database fetch failed: Message record with ID "${id}" was not found.`);
    }
    return result[0];
  }

  private async _getByroomId(client: any, id: Message["room_id"], limit: number, offset?: number): Promise<Message[]> {
    const result = await client
      .select()
      .from(this.table)
      .where(eq(this.table.room_id, id ?? ""))
      .orderBy(desc(this.table.created_at))
      .limit(limit)
      .offset(offset ?? 0);

    if (!result) {
      throw new Error(`Database fetch failed while pulling logs for room ID "${id}".`);
    }
    return result;
  }

  private async _getAll(client: any, limit: number, offset: number): Promise<Message[]> {
    const result = await client
      .select()
      .from(this.table)
      .orderBy(desc(this.table.created_at))
      .limit(limit)
      .offset(offset);

    if (!result) {
      throw new Error(`Database execution failed while fetching global message history.`);
    }
    return result;
  }

  private async _update(client: any, id: Message["id"], value: Partial<Message>): Promise<Message> {
    const result = await client
      .update(this.table)
      .set(value)
      .where(eq(this.table.id, id))
      .returning();

    if (!result || result.length === 0 || !result[0]) {
      throw new Error(`Database execution mismatch: Target Message record with ID "${id}" was not found or could not be updated.`);
    }
    return result[0];
  }

  // ========================================================
  // TRANSACTION HELPERS (PUBLIC EXTERNAL HOOKS)
  // ========================================================

  async useCreate(client: any, values: Omit<Message, "created_at"|"deleted_at"|"is_deleted">): Promise<Message> {
    return await this._create(client, values);
  }

  async useDelete(client: any, id: string): Promise<Message> {
    return await this._delete(client, id);
  }

  async useGetById(client: any, id: Message["id"]): Promise<Message> {
    return await this._getById(client, id);
  }

  async useGetByroomId(client: any, roomId: string, limit: number, offset: number): Promise<Message[]> {
    return await this._getByroomId(client, roomId, limit, offset);
  }

  async useGetAll(client: any, limit: number, offset: number): Promise<Message[]> {
    return await this._getAll(client, limit, offset);
  }

  async useUpdate(client: any, id: Message["id"], value: Partial<Message>): Promise<Message> {
    const original = await this._getById(client, id);
    const merged = await this.__mergeUpdate(original, value);
    return await this._update(client, id, merged);
  }

  // ========================================================
  // HIGH LEVEL APPLICATION LOGIC
  // ========================================================

  async Create(values: Omit<Message, "created_at" | "id" | "deleted_at" | "is_deleted">): Promise<{ msg: string; ans: Message | null }> {
    try {
      const id = generateId("message");
      if (!id) throw new Error("Id generation failed");

      const data = {
        ...values,
        id
      };

      const result = await this._create(db, data);
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  async processSendMessage(payload: {
    sender_id: string;
    to_id?: string;
    room_id?: string | null;
    body: string;
    flag: Message["flag"];
    req_participants?: string[];
    metadata: Message["metadata"];
  }) {
    try {
      const result = await db.transaction(async (tx) => {
        let finalParticipants: string[] = [];
        let targetRoomId = payload.room_id || null;

        if (!targetRoomId) {
          if (!payload.to_id) throw new Error("Recipient target ID is required");
          const target = await entityService.getEntityById(payload.to_id, payload.sender_id);
          if (!target) return { msg: "recipient_not_found", ans: null };

          finalParticipants = [payload.sender_id, payload.to_id];
        } else {
          const uniqueParticipants = new Set([
            payload.sender_id,
            ...(payload.req_participants || [])
          ]);
          finalParticipants = Array.from(uniqueParticipants);
        }

        // Find the index of the creator in the finalized array mapping
        const senderIndex = finalParticipants.indexOf(payload.sender_id);
        const timestamp = Math.floor(Date.now() / 1000);

        // Format body to match: [index:timestamp]content
        const formattedBody = `[${senderIndex}:${timestamp}]${payload.body}`;
        const messageId = generateId("message");

        const newMessage = await this._create(tx, {
          id: messageId,
          from_id: payload.sender_id,
          body: formattedBody,
          flag: payload.flag,
          room_id: targetRoomId,
          participants: finalParticipants,
          metadata: payload.metadata
        });

        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: payload.sender_id,
          action: "ROOM",
          flag: "info",
          detail: `User ${payload.sender_id} started thread message (ID: ${messageId}) at index position ${senderIndex}.`,
        });

        return { msg: "success", ans: newMessage };
      });

      return result;
    } catch (error: any) {
      return { msg: "failed_to_create", ans: null };
    }
  }

  /**
   * Appends responses into the message body using your custom structured format:
   * [index:time]new_text #[old_index:time]old_text
   */
  async processRespondMessage(payload: {
    message_id: string;
    responder_id: string;
    response_text: string;
  }) {
    try {
      const result = await db.transaction(async (tx) => {
        const message = await this._getById(tx, payload.message_id);
        if (!message) return { msg: "not_found", ans: null };

        const participantsList = message.participants || [];
        const responderIndex = participantsList.indexOf(payload.responder_id);
        if (responderIndex === -1) {
          return { msg: "forbidden", ans: null };
        }

        const timestamp = Math.floor(Date.now() / 1000);
        const oldBody = message.body || "";

        // Append strategy: [new_index:time]new_message # old_body_chain
        const updatedBody = `[${responderIndex}:${timestamp}]${payload.response_text} # ${oldBody}`;

        // 4. Persist update modifications safely to the table row
        const updatedMessage = await this._update(tx, payload.message_id, {
          body: updatedBody
        });

        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: payload.responder_id,
          action: "ROOM",
          flag: "info",
          detail: `User ${payload.responder_id} appended response at index position ${responderIndex} on thread ${payload.message_id}.`,
        });

        return { msg: "success", ans: updatedMessage };
      });

      return result;
    } catch (error: any) {
      return { msg: "failed_to_update", ans: null };
    }
  }



  async Delete(id: string,actor:string): Promise<{ msg: string; ans: Message | null }> {
    try {
      const result = await db.transaction(async(tx)=>{
        const deleted = await this._delete(db, id);
        if(!deleted) return null;
        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: actor,
          action: "DELETE",
          flag: "log",
          detail: `user of id: ${actor} deleted message of id: ${id}`
        });
        return deleted
      })
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

 async MyMessages(userId: string, limit = 50, offset = 0): Promise<{ msg: string; ans: Message[] }> {
  try {
    const result = await db.transaction(async (tx) => {
      const messages = await tx
        .select()
        .from(this.table)
        .where(arrayContains(this.table.participants, [userId]))
        .orderBy(desc(this.table.created_at))
        .limit(limit)
        .offset(offset);

      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: userId,
        action: "ROOM",
        flag: "info",
        detail: `User ${userId} queried their message threads (Limit: ${limit}, Offset: ${offset}). Retrieved ${messages.length} rows.`,
      });

      return { msg: "success", ans: messages };
    });

    return result;
  } catch (e: any) {
    return { msg: e.message, ans: [] };
  }
}


  async MessagesInRoom(roomId: string, limit = 100, offset = 0): Promise<{ msg: string; ans: Message[] }> {
    try {
      const result = await this._getByroomId(db, roomId, limit, offset);
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: [] };
    }
  }

  async GetAll(limit: number, offset: number): Promise<{ msg: string, ans: Message[] }> {
    try {
      const cleanLimit = (typeof limit === 'number' && limit >= 1) ? limit : 10;
      const cleanOffset = (typeof offset === 'number' && offset >= 0) ? offset : 0;

      const result = await this._getAll(db, cleanLimit, cleanOffset);
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: [] };
    }
  }
}
