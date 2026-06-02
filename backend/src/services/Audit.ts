import {
  eq,
  desc,
  gt,
  inArray,
  StringChunk
} from "drizzle-orm";

import { db } from "../dataBase/db";
import { audit_logs, type AuditLog } from "../dataBase/schema";
import { generateId } from "./utils";

export class AuditService {
  private table = audit_logs;

  private async _create(client: any, values: Omit<AuditLog, "created_at">) {
    const result = await client.insert(this.table).values(values).returning();
    if (!result?.[0]) throw new Error("Audit insert failed");
    return result[0];
  }

  private async _getById(client: any, id: string) {
    const result = await client
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .limit(1);

    if (!result?.[0]) throw new Error("Audit not found");
    return result[0];
  }

  private async _getByEntityId(client: any, entity_id: string, limit: number, offset: number) {
    return await client
      .select()
      .from(this.table)
      .where(eq(this.table.entity_id, entity_id))
      .orderBy(desc(this.table.created_at))
      .limit(limit)
      .offset(offset);
  }

  private async _getByEntityIds(client: any, ids: string[], limit: number, offset: number) {
    return await client
      .select()
      .from(this.table)
      .where(inArray(this.table.entity_id, ids))
      .orderBy(desc(this.table.created_at))
      .limit(limit)
      .offset(offset);
  }

  private async _getAll(client: any, limit: number, offset: number) {
    return await client
      .select()
      .from(this.table)
      .orderBy(desc(this.table.created_at))
      .limit(limit)
      .offset(offset);
  }

  private async _getSince(client: any, since: Date, limit: number, offset: number) {
    return await client
      .select()
      .from(this.table)
      .where(gt(this.table.created_at, since))
      .orderBy(desc(this.table.created_at))
      .limit(limit)
      .offset(offset);
  }

  async useCreate(client: any, values: Omit<AuditLog, "created_at">) {
    return this._create(client, values);
  }

  async createAuditLog(data: Omit<AuditLog, "id" | "created_at">) {
    const id = generateId("audit");
    if (!id) return { msg: "failed", ans: null };

    const result = await this._create(db, { id, ...data });
    return { msg: "success", ans: result };
  }

  async getById(id: string) {
    try {
      const result = await this._getById(db, id);
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  async getByEntityId(entity_id: string, limit: number, offset: number,actor: string) {
    const safeLimit = limit > 0 ? limit : 10;
    const safeOffset = offset >= 0 ? offset : 0;

    const result = await this._getByEntityId(db, entity_id, safeLimit, safeOffset);

    await this.useCreate(db,{
      id: generateId("audit"),
      entity_id: actor,
      action: "ADMIN ACTION",
      flag: "log",
      detail: `User of id: ${actor} queried,audit id of etity id: ${entity_id};time: ${new Date()}`
    })

    return { msg: "success", ans: result };
  }

  async getAll(limit: number, offset: number,actor: string) {
    const result = await this._getAll(db, limit || 20, offset || 0);

    await this.useCreate(db,{
      id: generateId("audit"),
      entity_id: actor,
      action: "ADMIN ACTION",
      flag: "log",
      detail: `User of id: ${actor} queried ${limit} audits ;time: ${new Date()}`
    })
    return { msg: "success", ans: result };
  }

  async getSince(since: Date, limit: number, offset: number) {
    const clean = since instanceof Date && !isNaN(since.getTime())
      ? since
      : new Date();

    const result = await this._getSince(db, clean, limit || 20, offset || 0);
    return { msg: "success", ans: result };
  }

  async getRoomTimeline(roomMemberIds: string[], limit: number, offset: number) {
    const result = await this._getByEntityIds(db, roomMemberIds, limit || 50, offset || 0);

    // await this.useCreate(db,{
    //   id: generateId("audit"),
    //   entity_id: result[0].entity_id,
    //   action: "ADMIN ACTION",
    //   flag: "log",
    //   detail: `User of id: ${actor} queried ${limit} audits ;time: ${new Date()}`
    // })
    return { msg: "success", ans: result };
  }
}
