import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../dataBase/db";
import { rooms, room_members, items, type Room,type Entity,type AuditLog, type RoomMeta, type RoomContract, type UserMeta,type Item ,type ItemAnalytics} from "../dataBase/schema";
import { generateId } from "./utils";
import { EntityService } from "./entities";
import { AuditService } from "./Audit";
import { UserService } from "./user";

const entityService = new EntityService();
const auditService = new AuditService();
const userService = new UserService();

export class RoomsService {
  private table = rooms;

  private _mergeMetadata(existing: RoomMeta, patch?: Partial<RoomMeta>): RoomMeta {
    return {
      ...existing,
      ...(patch ?? {})
    };
  }

  private _mergeContract(existing: RoomContract, patch?: Partial<RoomContract>): RoomContract {
    return {
      ...existing,
      ...(patch ?? {})
    };
  }

  // ========================================================
  // CORE LOWER-LEVEL DATABASE METHODS (PRIVATE PRIMITIVES)
  // ========================================================

  private async _create(client: any, values: Room): Promise<Room> {
    const result = await client
      .insert(this.table)
      .values(values)
      .returning();

    if (!result || result.length === 0 || !result) {
      throw new Error("Database execute failed: Room insert returned empty data array.");
    }
    return result;
  }

  private async _update(client: any, id: string, values: Partial<Room>): Promise<Room> {
    const result = await client
      .update(this.table)
      .set({
        ...values,
        updated_at: new Date(),
      })
      .where(eq(this.table.id, id))
      .returning();

    if (!result || result.length === 0 || !result) {
      throw new Error(`Database execution tracking mismatch: Update failed or target Room ID ${id} not found.`);
    }
    return result;
  }

  private async _getById(client: any, id: string): Promise<Room> {
    const result = await client
      .select()
      .from(this.table)
      .where(and(eq(this.table.id, id), eq(this.table.is_deleted, false)))
      .limit(1);

    if (!result || result.length === 0 || !result) {
      throw new Error(`Database fetch failed: Target Room ID ${id} not found.`);
    }
    return result;
  }

  private async _getAll(client: any, limit: number, offset: number): Promise<Room[]> {
    const result = await client
      .select()
      .from(this.table)
      .where(eq(this.table.is_deleted, false))
      .limit(limit)
      .offset(offset);

    if (!result) {
      throw new Error("Room selections returned an invalid execution context.");
    }
    return result;
  }

  private async _delete(client: any, id: string): Promise<Room> {
  const result = await client
    .update(this.table)
    .set({
      is_deleted: true,
      deleted_at: new Date(),
      updated_at: new Date(),
    })
    .where(eq(this.table.id, id))
    .returning();

  if (!result || result.length === 0 || !result[0]) {
    throw new Error(`Soft delete failed: Room ID ${id} not found.`);
  }

  return result[0];
}

  // ========================================================
  // TRANSACTION HOOKS (PUBLIC EXTERNAL HOOKS)
  // ========================================================

  async useCreate(client: any, values: Room): Promise<Room> {
    return await this._create(client, values);
  }

  async useUpdate(client: any, id: string, values: Partial<Room>): Promise<Room> {
    return await this._update(client, id, values);
  }

  async useGetById(client: any, id: string): Promise<Room> {
    return await this._getById(client, id);
  }

  async useDelete(client: any, id: string): Promise<Room> {
    return await this._delete(client, id);
  }

  // ========================================================
  // HIGH-LEVEL COMPOSITE WORKFLOWS (PUBLIC BUSINESS LOGIC)
  // ========================================================

  /**
   * CREATE ROOM
   */
  async createRoom(name: string, metadata: RoomMeta, contract: RoomContract, createdBy: string) {
  try {
    const roomId = generateId("room");
    if (!roomId) return { msg: "Id generation failed", ans: null };

    const result = await db.transaction(async (tx) => {
      // 1. Register the new room id inside your generic entity service mapping
      await entityService.useCreate(tx, { id: roomId, type: "room" } as any);

      // 2. Query user meta profile records to fetch their certified authorization rights
      const creatorRecord = await userService.useGetById(tx, createdBy);
      let derivedPermissions: string[] = [];

      if (creatorRecord && creatorRecord.metadata) {
        const userMeta = creatorRecord.metadata as UserMeta;
        if (userMeta.permissions && Array.isArray(userMeta.permissions)) {
          // Extract only the rights that are marked as 'authorised'
          derivedPermissions = userMeta.permissions
            .filter(p => p.status === "authorised" || (p.status as string) === "authorized")
            .map(p => p.right);
        }
      }

      // 3. Assemble and build your final Room schema row payload object
      const roomPayload: any = {
        id: roomId,
        name,
        metadata: metadata,
        contract: contract,
        permissions: derivedPermissions, // Accredit user permissions to the group natively 🚀
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
        deleted_at: null
      };

      const room = await this._create(tx, roomPayload);

      // 4. Attach the creating actor as the founding group member link
      await tx.insert(room_members).values({
        room_id: roomId,
        user_id: createdBy,
        created_at: new Date()
      });

      // 5. Generate system tracking audit events log
      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: createdBy,
        action: "CREATE",
        flag: "info",
        detail: `User ${createdBy} successfully configured Room ${roomId} with permissions: [${derivedPermissions.join(", ")}]`
      });

      return room;
    });

    return { msg: "success", ans: result };
  } catch (e: any) {
    return { msg: `Room configuration failed and rolled back: ${e.message}`, ans: null };
  }
}



  /**
   * GET SINGLE ROOM BY ID
   */
  async getRoomById(id: string) {
    try {
      const room = await this._getById(db, id);
      return { msg: "success", ans: room };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  /**
   * GET ROOMS LIST INVOLVING USER CORRELATIONS
   */
  async getRoomsByUserId(userId: string) {
  try {
    const result = await db.transaction(async (tx) => {
      // 1. Fetch all room rows joined with the junction membership table
      const rows = await tx
        .select({ rooms: this.table })
        .from(this.table)
        .innerJoin(room_members, eq(room_members.room_id, this.table.id))
        .where(
          and(
            eq(room_members.user_id, userId),
            eq(this.table.is_deleted, false)
          )
        );

      const formattedRooms = rows.map((r) => r.rooms);

      // 2. Add an audit trail log inside the transaction loop
      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: userId,
        action: "ROOM",
        flag: "info",
        detail: `User ${userId} fetched their active joined room indices list. Total items found: ${formattedRooms.length}`
      });

      return formattedRooms;
    });

    return { msg: "success", ans: result };
  } catch (e: any) {
    return { msg: e.message, ans: [] };
  }
}


  /**
   * ACCUMULATE TOTAL AMOUNT METRICS RECORDED WITHIN ROOM ESCROWS
   */
  async getFinancialsByRoomId(id: string, actor: string) {
  try {
    const result = await db.transaction(async (tx) => {
      const room = await this._getById(tx, id);
      if (!room) return { msg: "not_found", ans: null };

      const roomItems = await tx
        .select()
        .from(items)
        .where(and(eq(items.room_id, id), eq(items.is_deleted, false)));

      if(!roomItems) return { msg: "not_found", ans: null };

      let totalRecordedValue = 0;
      let totalCompletedSalesVolume = 0;
      let totalAccruedExpenses = 0;
      let globalInteractionDensity = 0;
      let activeItemsCount = 0;
      let negotiatingItemsCount = 0;
      let completedDealsCount = 0;
      let unloggedStockDiscrepanciesCount = 0;

      // Temporary map object to isolate weekly timelines cleanly
      const unifiedTimelineMap = new Map<string, { total_sales: number; expense: number; demand_score: number }>();

      // 4. Single loop execution path across rows to aggregate financial vectors
      for (const item of roomItems) {
        totalRecordedValue += item.amount_cents || 0;
        const analytics = item.analytics || {};

        // Track item status clusters
        if (analytics.status === "active") activeItemsCount++;
        if (analytics.status === "negotiating") negotiatingItemsCount++;

        if (analytics.status === "completed") {
          completedDealsCount++;
          // Flag inventory dips below zero (unlogged inventory stock)
          if ((analytics.instore ?? 0) < 0) {
            unloggedStockDiscrepanciesCount++;
          }
        }

        // Deep extract timeline summaries from historical weekly array objects
        if (analytics.weekly_status && Array.isArray(analytics.weekly_status)) {
          for (const week of analytics.weekly_status) {
            totalCompletedSalesVolume += week.total_sales || 0;
            totalAccruedExpenses += week.expense || 0;
            globalInteractionDensity += week.demand_score || 0;

            const existingWeekData = unifiedTimelineMap.get(week.week_ending) || { total_sales: 0, expense: 0, demand_score: 0 };
            unifiedTimelineMap.set(week.week_ending, {
              total_sales: existingWeekData.total_sales + (week.total_sales || 0),
              expense: existingWeekData.expense + (week.expense || 0),
              demand_score: existingWeekData.demand_score + (week.demand_score || 0)
            });
          }
        }
      }

      // Convert timeline map values back to structured query list formats
      const globalWeeklyFinancialTrend = Array.from(unifiedTimelineMap.entries()).map(([weekEnding, data]) => ({
        week_ending: weekEnding,
        ...data
      })).sort((a, b) => b.week_ending.localeCompare(a.week_ending)); // Descending chronological sorting order

      // 5. Contextualize Room performance against target objectives
      const roomTargetGoal = room.metadata?.goals?.monthly_target || 0;
      const targetCurrency = room.metadata?.goals?.currency || "USD";

      const netProfitOrLoss = totalCompletedSalesVolume - totalAccruedExpenses;
      const progressToTargetPercent = roomTargetGoal > 0
        ? Number(((totalCompletedSalesVolume / roomTargetGoal) * 100).toFixed(2))
        : 0;

      // 6. Generate action tracking records inside system audit trail mapping tables
      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: actor,
        action: "ROOM",
        flag: "info",
        detail: `User ${actor} compiled room financial dashboard auditing for room ${id}. Extracted aggregate data metrics over ${roomItems.length} listed item allocations.`
      });

      // 7. Pack a beautifully detailed financial analysis object payload response
      return {
        msg: "success",
        ans: {
          room_id: id,
          room_name: room.name,
          currency_scope: targetCurrency,
          pipeline_summary: {
            total_items_tracked: roomItems.length,
            active_listings: activeItemsCount,
            negotiating_threads: negotiatingItemsCount,
            closed_deals: completedDealsCount
          },
          financial_totals: {
            total_valuation_recorded_cents: totalRecordedValue,
            gross_sales_cents: totalCompletedSalesVolume,
            operating_expenses_cents: totalAccruedExpenses,
            net_profit_cents: netProfitOrLoss
          },
          goal_tracking: {
            monthly_target_cents: roomTargetGoal,
            completion_percentage: progressToTargetPercent,
            target_status: totalCompletedSalesVolume >= roomTargetGoal ? "TARGET_ACHIEVED" : "IN_PROGRESS"
          },
          inventory_integrity: {
            unlogged_stock_warnings: unloggedStockDiscrepanciesCount,
            status: unloggedStockDiscrepanciesCount > 0 ? "REVIEW_REQUIRED" : "STABLE"
          },
          interaction_analytics: {
            global_demand_score: globalInteractionDensity
          },
          weekly_trend_history: globalWeeklyFinancialTrend
        }
      };
    });

    return result;
  } catch (e: any) {
    return { msg: e.message, ans: null };
  }
}


  /**
   * EXTRACT ITEMS SELECTION FILTER FROM SPECIFIC ROOM ID
   */
  async getItemsByRoomId(id: string, actor: string) {
  try {
    const result = await db.transaction(async (tx) => {
      // 1. Fetch room context inside the transaction instance
      const room = await this._getById(tx, id);
      if (!room) return { msg: "not_found", ans: null };

      // 2. Query all active items linked to this target room
      const res = await tx
        .select()
        .from(items)
        .where(and(eq(items.room_id, id), eq(items.is_deleted, false)));

      // 3. Log user tracking record inside your system audit trail table
      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: actor,
        action: "ROOM",
        flag: "info",
        detail: `User ${actor} queried item inventory listings for room ${id} (${room.name}). Retrieved ${res.length} rows.`,
      });

      return res;
    });

    return { msg: "success", ans: result };
  } catch (e: any) {
    return { msg: e.message, ans: null };
  }
}

  /**
   * UPDATE ROOM CONFIGURATION AND METADATA CONTRACT ENVELOPES
   */
  async updateRoom(id: string, patch: any, actorId: string) {
  try {
    const result = await db.transaction(async (tx) => {
      const existing = await this._getById(tx, id);
      if (!existing) throw new Error("Room record target not found");

      const oldMeta = existing.metadata || {};
      const newMeta = patch.metadata || {};

      const oldContract = existing.contract || {};
      const newContract = patch.contract || {};

      // Explicitly process structural deep-destructuring spread overrides
      const updateData = {
        name: patch.name ?? existing.name,
        permissions: patch.permissions ?? existing.permissions,

        // --- DEEP METADATA OBJECT DESTRUCTURING ---
        metadata: {
          ...oldMeta,
          ...newMeta,
          goals: {
            ...(oldMeta.goals || {}),
            ...(newMeta.goals || {})
          },
          // Append and unroll historical arrays cleanly without loss
          tags: [
            ...(oldMeta.tags || []),
            ...(newMeta.tags || [])
          ],
          members_rules: [
            ...(oldMeta.members_rules || []),
            ...(newMeta.members_rules || [])
          ]
        },

        // --- DEEP CONTRACT OBJECT DESTRUCTURING ---
        contract: {
          ...oldContract,
          ...newContract,
          sections: {
            ...(oldContract.sections || {}),
            ...(newContract.sections || {})
          },
          metadata: {
            ...(oldContract.metadata || {}),
            ...(newContract.metadata || {})
          },
          // Append custom contract signers history
          signed: [
            ...(oldContract.signed || []),
            ...(newContract.signed || [])
          ]
        }
      };

      // De-duplicate array assignments using native Set mechanisms
      updateData.metadata.tags = Array.from(new Set(updateData.metadata.tags));
      updateData.contract.signed = Array.from(new Set(updateData.contract.signed));

      // Filter out duplicate user profile listings inside membership rules mappings
      const dynamicRulesMap = new Map();
      updateData.metadata.members_rules.forEach((rule: any) => dynamicRulesMap.set(rule.actor, rule));
      updateData.metadata.members_rules = Array.from(dynamicRulesMap.values());

      const updated = await this._update(tx, id, updateData as any);

      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: actorId,
        action: "ROOM",
        flag: "info",
        detail: `User ${actorId} updated room configuration details for room ${id}.`,
      });

      return updated;
    });

    return { msg: "success", ans: result };
  } catch (e: any) {
    return { msg: e.message, ans: null };
  }
}


  /**
   * TRACK METADATA SOFT DELETE FOR THE ROOM
   */
  async softDeleteRoom(id: string) {
    try {
      const result = await db.transaction(async (tx) => {
        const updated = await this._delete(tx, id);

        await entityService.useDelete(tx, id);

        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: id,
          action: "ROOM_SOFT_DELETE",
          flag: "critical",
          detail: {}
        } as any);

        return updated;
      });

      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  /**
   * GET ALL ROOMS (ADMIN DASHBOARD CONTROLS FEED)
   */
  async GetAll(limit: number, offset: number) {
    try {
      const safeLimit = limit > 0 ? limit : 10;
      const safeOffset = offset >= 0 ? offset : 0;

      const result = await this._getAll(db, safeLimit, safeOffset);
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: [] };
    }
  }
}
