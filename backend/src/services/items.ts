import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../dataBase/db";
import { items, type Item, type ItemAnalytics } from "../dataBase/schema";
import { generateId } from "./utils";
import { AuditService } from "./Audit";

const auditService = new AuditService();

export class ItemsService {
  private table = items;

  private async __mergeUpdate(original: Item, updated: Partial<Item>): Promise<Item> {
    return {
      ...original,
      ...updated,
      analytics: {
        ...original.analytics,
        ...(updated.analytics ?? {})
      }
    };
  }

  // ========================================================
  // CORE LOWER-LEVEL DATABASE METHODS (PRIVATE PRIMITIVES)
  // ========================================================

  private async _create(client: any, values: Item): Promise<Item> {
    const result = await client
      .insert(this.table)
      .values(values)
      .returning();

    if (!result || result.length === 0 || !result[0]) {
      throw new Error("Database execution failed: Item insertion returned empty array payload.");
    }
    return result[0];
  }

  private async _getById(client: any, id: string): Promise<Item> {
    const result = await client
      .select()
      .from(this.table)
      .where(and(eq(this.table.id, id), eq(this.table.is_deleted, false)))
      .limit(1);

    if (!result || result.length === 0 || !result[0]) {
      throw new Error(`Database fetch failed: Item record with ID "${id}" was not found.`);
    }
    return result[0];
  }

  private async _getByRoomId(client: any, roomId: string): Promise<Item[]> {
    const result = await client
      .select()
      .from(this.table)
      .where(and(eq(this.table.room_id, roomId), eq(this.table.is_deleted, false)));

    if (!result) {
      throw new Error(`Database execution failed while fetching items for room ID "${roomId}".`);
    }
    return result;
  }

  private async _update(client: any, id: string, value: Item): Promise<Item> {
    const result = await client
      .update(this.table)
      .set({
        ...value,
        updated_at: new Date()
      })
      .where(eq(this.table.id, id))
      .returning();

    if (!result || result.length === 0 || !result[0]) {
      throw new Error(`Database execution mismatch: Target item record with ID "${id}" could not be updated.`);
    }
    return result[0];
  }

  private async _delete(client: any, id: string): Promise<Item> {
    const result = await client
      .update(this.table)
      .set({
        is_deleted: true,
        deleted_at: new Date(),
        updated_at: new Date()
      })
      .where(eq(this.table.id, id))
      .returning();

    if (!result || result.length === 0 || !result[0]) {
      throw new Error(`Database execution mismatch: Target item record with ID "${id}" could not be deleted.`);
    }
    return result[0];
  }

  // ========================================================
  // TRANSACTION HOOKS (PUBLIC EXTERNAL HOOKS)
  // ========================================================

  async useCreate(client: any, values: Item): Promise<Item> {
    return await this._create(client, values);
  }

  async useGetById(client: any, id: string): Promise<Item> {
    return await this._getById(client, id);
  }

  async useGetByRoomId(client: any, roomId: string): Promise<Item[]> {
    return await this._getByRoomId(client, roomId);
  }

  async useDelete(client: any, id: string): Promise<Item> {
    return await this._delete(client, id);
  }

  async useUpdate(client: any, id: string, patch: Partial<Item>): Promise<Item> {
    const original = await this._getById(client, id);
    const merged = await this.__mergeUpdate(original, patch);
    return await this._update(client, id, merged);
  }

  // ========================================================
  // HIGH-LEVEL COMPOSITE WORKFLOWS (PUBLIC BUSINESS LOGIC)
  // ========================================================

  /**
   * CREATE ITEM
   */
  async createItem(
  roomId: string,
  amount: number,
  name: string,
  senderId: string,
  receiverId: string,
  actorId: string
) {
  try {
    const id = generateId("item");

    const itemPayload: Item = {
      id,
      room_id: roomId,
      amount_cents: amount,
      created_at: new Date(),
      updated_at: new Date(),
      is_deleted: false,
      deleted_at: null,
      analytics: {
        instore: amount,
        product_name: name,
        status: "negotiating",
        participants: {
          seller_id: senderId,
          buyer_id: receiverId
        },
        weekly_status: []
      }
    };

    const result = await db.transaction(async (tx)=>{
      const item = await this._create(db, itemPayload);
      if(!item) return null ;

      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: actorId,
        action: "CREATE",
        flag: "log",
        detail: `item of id: ${item.id}, amount of ${item.amount_cents} was created.from ${senderId} to ${receiverId} by ${actorId}`
      });
      return item
    })
    return { msg: "success", ans: result };
  } catch (e: any) {
    return { msg: e.message, ans: null };
  }
}

  /**
   * GET SINGLE ITEM BY ID
   */
  async getItemById(id: string,actor:string) {
    try {
      const result = await db.transaction(async (tx)=>{
      const item = await this._getById(db, id);

      if(!item) return null ;

      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: actor,
        action: "READ",
        flag: "log",
        detail: `user of id: ${actor} queried item of id ${id}`
      });
      return item
    })
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  /**
   * LIST ITEMS IN ROOM
   */
  async listRoomItems(roomId: string,actor:string) {
  try {
    // const result = await this._getByRoomId(db, roomId);
    const result = await db.transaction(async (tx)=>{
      const items = await this._getByRoomId(db, roomId);

      if(!items) return null ;

      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: actor,
        action: "READ",
        flag: "log",
        detail: `user of id: ${actor} queried ${items.length} items in room ${roomId}`
      });
      return items
    })
    return { msg: "success", ans: result };
  } catch (e: any) {
    return { msg: "not_found", ans: [] };
  }
}

  /**
   * UPDATE STOCK AMOUNT MANUALLY
   */
  async updateItemAmount(id: string, amount: number,actor:string) {
  try {
    const original = await this._getById(db, id);

    const merged = await this.__mergeUpdate(original, {
      amount_cents: amount,
      analytics: {
        ...original.analytics,
        instore: amount
      }
    });

    // const result = await this._update(db, id, merged);
    const result = await db.transaction(async (tx)=>{
      const item = await this._update(db, id, merged);

      if(!item) return null ;

      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: actor,
        action: "UPDATE",
        flag: "log",
        detail: `user of id: ${actor}  updated amount of item of id ${id} to ${amount} cents`
      });
      return item
    })

    return { msg: "success", ans: result };
  } catch (e: any) {
    return { msg: "not_found", ans: null };
  }
}

  /**
   * SYNCHRONIZE ANALYTICS STATUS WITH SHIPMENT MIGRATIONS
   */
  async syncWithShipmentStatus(id: string, shipmentStatus: string, client: any = db) {
    try {
      const original = await this._getById(client, id);

      let targetLifecycle: "active" | "negotiating" | "completed" = "negotiating";

      if (["in_transit", "collected", "disputed"].includes(shipmentStatus)) {
        targetLifecycle = "active";
      } else if (["delivered", "paid"].includes(shipmentStatus)) {
        targetLifecycle = "completed";
      }

      const merged = await this.__mergeUpdate(original, {
        analytics: {
          ...original.analytics,
          status: targetLifecycle
        }
      });

      const result = await this._update(client, id, merged);
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  /**
   * SOFT-DELETE ITEM RECORD
   */
  async deleteItem(id: string,actor: string) {
    try {
      const result = await db.transaction(async (tx)=>{
        const item = await this._delete(db, id);

        if(!item) return null ;

        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: actor,
          action: "DELETE",
          flag: "log",
          detail: `user of id: ${actor}  deleted item of id ${id}`
        });
        return item
      })
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  /**
   * GET ALL ITEMS (ADMIN MONITOR FEED)
   */
  async getAll(limit: number, offset: number) {
  try {
    const safeLimit = limit >= 1 ? limit : 10;
    const safeOffset = offset >= 0 ? offset : 0;

    const result = await db
      .select()
      .from(this.table)
      .where(eq(this.table.is_deleted, false))
      .limit(safeLimit)
      .offset(safeOffset);

    return { msg: "success", ans: result };
  } catch (e: any) {
    return { msg: e.message, ans: [] };
  }
}
}
