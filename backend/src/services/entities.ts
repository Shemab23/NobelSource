import { and, eq, sql } from "drizzle-orm";
import { db } from "../dataBase/db";
import { entities, type Entity } from "../dataBase/schema";
import { generateId } from "./utils";
import { AuditService } from "./Audit";

const auditService = new AuditService();

export class EntityService {
  private table = entities;

  // ========================================================
  // CORE LOWER-LEVEL DATABASE METHODS (PRIVATE PRIMITIVES)
  // ========================================================

   private async _create(client: any, values: Omit<Entity,"deleted_at"|"is_deleted">): Promise<Entity> {
  const result = await client.insert(this.table).values(values).returning();

  if (!result || result.length === 0) {
    throw new Error("Entity insert failed");
  }
  return result[0];
}

  private async _getById(client: any, id: string): Promise<Entity> {
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
    throw new Error(`Entity not found: ${id}`);
  }

  return result[0];
}


  private async _getAll(client: any, limit: number, offset: number): Promise<Entity[]> {
  const result = await client
    .select()
    .from(this.table)
    .where(eq(this.table.is_deleted, false))
    .limit(limit)
    .offset(offset);

  return result ?? [];
}

  private async _update(client: any, id: string, typeValue: Entity["type"]): Promise<Entity> {
    const result = await client
      .update(this.table)
      .set({
        type: typeValue,
        updated_at: new Date(),
      })
      .where(eq(this.table.id, id))
      .returning();

    if (!result || result.length === 0 || !result) {
      throw new Error(`Database execution tracking mismatch: Update failed or target Entity ID ${id} not found.`);
    }
    return result;
  }

  private async _delete(client: any, id: string): Promise<Entity> {
    const result = await client
      .update(this.table)
      .set({ is_deleted: true, deleted_at: new Date() })
      .where(eq(this.table.id, id))
      .returning();

    if (!result || result.length === 0) {
      throw new Error("Entity delete failed");
    }
    return result[0];
  }

  // ========================================================
  // TRANSACTION HOOKS (PUBLIC EXTERNAL HOOKS)
  // ========================================================

  async useCreate(client: any, values: Omit<Entity,"is_deleted" | "deleted_at">): Promise<Entity> {
    return await this._create(client, values);
  }

  async useUpdate(client: any, id: string, typeValue: Entity["type"]): Promise<Entity> {
    return await this._update(client, id, typeValue);
  }

  async useGetById(client: any, id: string): Promise<Entity> {
    return await this._getById(client, id);
  }

  async useDelete(client: any, id: string): Promise<Entity> {
    return await this._delete(client, id);
  }

  // ========================================================
  // HIGH-LEVEL COMPOSITE WORKFLOWS (PUBLIC BUSINESS LOGIC)
  // ========================================================

  /**
   * CREATE ENTITY
   */

  async createEntity(typeValue: Entity["type"],actor:string) {
  try {
    // const id = generateId("entity"); //to use when i revised the enity relation
    let id:string|null;

    switch(typeValue) {
      case "user" :
        id = generateId("user");
        break;
      case "room":
        id = generateId("room");
        break;
      default:
        id = null
        break;
    }
    if (id === null) return { msg: "failed", ans: null };

    const now = new Date();
    const payload: Omit<Entity,"deleted_at"> = {
      id,
      type: typeValue,
      created_at: now,
      updated_at: now,
      is_deleted: false
    };

    const result = await db.transaction(async (tx) => {
      const entity = await this._create(tx, payload);
      if(!entity) return { msg: "failed to create entity", ans: null };

      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: actor,
        action: "CREATE",
        flag: "log",
        detail: `entity of type ${typeValue} is created by actor :${actor}`
      })
      return entity;
    })


    return { msg: "success", ans: result };
  } catch (e: any) {
    return { msg: e.message, ans: null };
  }
}

  /**
   * GET ENTITY BY ID
   */
  async getEntityById(id: string,actor:string) {
    return await db.transaction(async (tx) =>{
       const result = await this._getById(db,id);
       if(!result) return null;

       await auditService.useCreate(tx, {
         id: generateId("audit"),
         entity_id: actor,
         action: "READ",
         flag: "log",
         detail: `entity id: ${id} is read by actor :${actor}`
       })
       return result;
    })
  }

  /**
   * GET ALL ENTITIES (ADMIN DASHBOARD CONTROLS FEED)
   */
  async GetAll(limit: number, offset: number,actor:string) {
    try {
      const safeLimit = (typeof limit === 'number' && limit >= 1) ? limit : 10;
      const safeOffset = (typeof offset === 'number' && offset >= 0) ? offset : 0;

      const result = await db.transaction(async (tx)=>{
        const all = await this._getAll(db, safeLimit, safeOffset);
        if(!all) return { msg: "failed to get all entities", ans: null };

        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: actor,
          action: "ADMIN ACTION",
          flag: "log",
          detail: `all entities are fetched by actor :${actor}`
        })
        return all;
      })

      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: [] };
    }
  }

  /**
   * UPDATE ENTITY TYPE PROPERTIES
   */
  async updateEntity(id: string, typeValue: Entity["type"],actor:string) {
    try {
      return await db.transaction(async (tx) => {
        const updatedEntity = await this._update(tx, id, typeValue);

        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: actor,
          action: "UPDATE",
          flag: "log",
          detail: `entity id: ${id} changed to type ${typeValue} by actor :${actor}`
        })
        return { msg: "success", ans: updatedEntity };
      });
    } catch (e: any) {
      return { msg: `Entity update failed and rolled back: ${e.message}`, ans: null };
    }
  }

  /**
   * SOFT-DELETE ENTITY
   */
  async deleteEntity(id: string, actor:string) {
    try {
      const result = await db.transaction(async (tx) => {
        const deleted = await this._delete(tx, id);

        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: actor,
          action: "DELETE",
          flag: "log",
          detail: `entity id: ${id} is deleted by actor :${actor}`
        });

        return deleted;
      });

      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }
}
