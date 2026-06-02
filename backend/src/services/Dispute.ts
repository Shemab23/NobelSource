import { and, desc, eq } from "drizzle-orm";
import { db } from "../dataBase/db";
import { disputes, type Dispute } from "../dataBase/schema";
import { generateId } from "./utils";
import { AuditService } from "./Audit";
import { open } from "node:fs";
import { UserService } from "./user";

const auditService = new AuditService();
const usersService = new UserService();

export class DisputesService {
  private table = disputes;

  // =====================================================
  // INTERNAL HELPERS
  // =====================================================

  private async _transaction<T>(
    callback: (tx: any) => Promise<T>
  ): Promise<T> {
    return await db.transaction(async (tx) => {
      return await callback(tx);
    });
  }

  private async _create(
    client: any,
    payload: Dispute
  ): Promise<Dispute> {
    const result = await client
      .insert(this.table)
      .values(payload)
      .returning();

    if (!result?.[0]) {
      throw new Error("Failed to create dispute");
    }

    return result[0];
  }

  private async _getById(
    client: any,
    id: string
  ): Promise<Dispute> {
    const result = await client
      .select()
      .from(this.table)
      .where(
        and(
          eq(this.table.id, id),
          eq(this.table.is_deleted, false)
        )
      )
      .limit(1);

    if (!result?.[0]) {
      throw new Error("Dispute not found");
    }

    return result[0];
  }

  private async _update(
    client: any,
    id: string,
    patch: Partial<Dispute>
  ): Promise<Dispute> {
    const result = await client
      .update(this.table)
      .set(patch)
      .where(eq(this.table.id, id))
      .returning();

    if (!result?.[0]) {
      throw new Error("Failed to update dispute");
    }

    return result[0];
  }

  private async _getAll(
    client: any,
    limit: number,
    offset: number
  ): Promise<Dispute[]> {
    return await client
      .select()
      .from(this.table)
      .where(eq(this.table.is_deleted, false))
      .orderBy(desc(this.table.created_at))
      .limit(limit)
      .offset(offset);
  }
  private async _arbitratorGetAll(
    client: any,
    limit: number,
    offset: number,
    arbitrator_id:string
  ): Promise<Dispute[]> {
    return await client
      .select()
      .from(this.table)
      .where(
        and(
          eq(this.table.arbitrator_id, arbitrator_id),
          eq(this.table.is_deleted, false)
        )
      )
      .orderBy(desc(this.table.created_at))
      .limit(limit)
      .offset(offset);
  }

  // =====================================================
  // BUSINESS ACTIONS
  // =====================================================

 async raiseDispute(payload: {
    room_id: string;
    logistics_id: string;
    opened_by: string;
    claim: string;
    arbitrator_id: string | null;
  }) {
    return await this._transaction(async (tx) => {

      const dispute: Dispute = {
        id: generateId("dispute"),

        room_id: payload.room_id,
        logistics_id: payload.logistics_id,
        opened_by: payload.opened_by,

        claim: payload.claim,

        status: "open",
        resolved: false,

        arbitrator_id: payload.arbitrator_id ?? null,
        resolution: null,

        selected_at: null,
        resolved_at: null,

        is_deleted: false,
        deleted_at: null,

        created_at: new Date()
      };

      const created = await this._create(tx, dispute);

      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: payload.opened_by,
        action: "DISPUTE",
        flag: "critical",
        detail: `room_id: ${created.room_id} | logistics_id: ${created.logistics_id} | opened_by: ${created.opened_by}`,
      });

      return created;
    });
  }

  async assignArbitrator(
  disputeId: string,
  arbitratorId: string,
  actorId: string
) {
  return await this._transaction(async (tx) => {

    const dispute = await this._getById(tx, disputeId);

    if (dispute.status !== "open") {
      throw new Error("Dispute is not open");
    }

    if (dispute.arbitrator_id) {
      throw new Error("Dispute already assigned");
    }

    const updated = await this._update(tx, disputeId, {
      arbitrator_id: arbitratorId,
      status: "investigating",
      selected_at: new Date()
    });

    await auditService.useCreate(tx, {
      id: generateId("audit"),
      entity_id: actorId,
      action: "DISPUTE",
      flag: "critical",
      detail: `arbitrator_id: ${updated.arbitrator_id} is assigned to ${dispute.id} | status: ${updated.status} | selected_at: ${updated.selected_at}`,
    });

    return updated;
  });
}


  async submitJudgement(payload: {
    dispute_id: string;
    arbitrator_id: string;
    resolution: string;
    status: "resolved" | "rejected";
  }) {
    return await this._transaction(async (tx) => {

      const dispute = await this._getById(
        tx,
        payload.dispute_id
      );

      if (!dispute.arbitrator_id) {
        throw new Error("No arbitrator assigned");
      }

      if (dispute.arbitrator_id !== payload.arbitrator_id) {
        throw new Error("Unauthorized arbitrator");
      }

      if (dispute.resolved) {
        throw new Error("Dispute already resolved");
      }

      const updated = await this._update(
        tx,
        payload.dispute_id,
        {
          status: payload.status,
          resolution: payload.resolution,
          resolved: true,
          resolved_at: new Date()
        }
      );

      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: payload.arbitrator_id,
        action: "DISPUTE",
        flag: "critical",
        detail: `resolution: ${payload.resolution}, status: ${payload.status}`
      });

      return updated;
    });
  }

  async rateService(payload: {
    dispute_id: string;
    rated_by: string;
    rating: number;
    review?: string;
  }) {
    return await this._transaction(async (tx) => {

      const dispute = await this._getById(
        tx,
        payload.dispute_id
      );

      if (!dispute.resolved) {
        throw new Error("Dispute is not resolved");
      }

      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: payload.rated_by,
        action: "RATE",
        flag: "log",
        detail: `rated by: ${payload.rated_by}, rating: ${payload.rating}, review: ${payload.review}`
      });

      return {
        dispute_id: dispute.id,
        rating: payload.rating,
        review: payload.review ?? null
      };
    });
  }

  async getDisputeById(id: string) {
    return await this._getById(db, id);
  }

  async getRoomDisputes(
    roomId: string,
    limit = 20,
    offset = 0
  ) {
    return await db
      .select()
      .from(this.table)
      .where(
        and(
          eq(this.table.room_id, roomId),
          eq(this.table.is_deleted, false),
          eq!(this.table.status, "open")
        )
      )
      .orderBy(desc(this.table.created_at))
      .limit(limit)
      .offset(offset);
  }



  async getAll(limit = 20, offset = 0) {
    return await this._getAll(db, limit, offset);
  }
  async arbitratorAll(limit = 20, offset = 0,arbitrator_id:string) {
    return await this._arbitratorGetAll(db, limit, offset,arbitrator_id);
  }

  async softDelete(id: string,actor:string) {
    return await this._transaction(async (tx) => {

      const deleted = await this._update(tx, id, {
        is_deleted: true,
        deleted_at: new Date()
      });


      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: actor,
        action: "DISPUTE",
        flag: "log",
        detail: `actor: ${actor},deleted dispute ID ${id} on  deleted_at: ${deleted.deleted_at}`
      });

      return deleted;
    });
  }
}
