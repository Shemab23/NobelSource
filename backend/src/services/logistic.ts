import { eq, and, desc, sql, or } from "drizzle-orm";
import { db } from "../dataBase/db";
import { logistics, audit_logs, users, rooms, type Logistics } from "../dataBase/schema";
import { generateId } from "./utils";
import { AuditService } from "./Audit";
import { ItemsService } from "./items";
import { UserService } from "./user";

const auditService = new AuditService();
const itemsService = new ItemsService();
const userService = new UserService();

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ["collected", "canceled", "disputed"],// 1
  collected: ["in_transit", "canceled", "disputed"],// 2
  in_transit: ["delivered","canceled", "disputed"],// 3
  delivered: ["paid", "disputed"],
  paid: ["disputed"],
  canceled: [],
  disputed: ["pending", "in_transit", "collected", "delivered", "paid", "canceled"]
};


export class LogisticsService {
  private table = logistics;

  // ========================================================
  // SAFE MERGE
  // ========================================================

  private __mergeUpdate(
    original: Logistics,
    updated: Partial<Logistics>
  ): Logistics {
    return {
      ...original,
      ...updated,
      transport_metadata: {
        ...original.transport_metadata,
        ...(updated.transport_metadata ?? {})
      },
      payment: {
        ...original.payment,
        ...(updated.payment ?? {})
      }
    };
  }

  // ========================================================
  // DB PRIMITIVES
  // ========================================================

  private async _create(client: any, values: Logistics): Promise<Logistics> {
    const result = await client.insert(this.table).values(values).returning();
    if (!result?.[0]) throw new Error("Insert failed");
    return result[0];
  }

  private async _getById(client: any, id: string): Promise<Logistics> {
    const result = await client
      .select()
      .from(this.table)
      .where(and(eq(this.table.id, id), eq(this.table.is_deleted, false)))
      .limit(1);

    if (!result?.[0]) throw new Error("Shipment not found");
    return result[0];
  }

  private async _update(client: any, id: string, value: Partial<Logistics>) {
    const current = await this._getById(client, id);
    const merged = this.__mergeUpdate(current, value);

    const result = await client
      .update(this.table)
      .set({
        ...merged,
        updated_at: new Date()
      })
      .where(eq(this.table.id, id))
      .returning();

    if (!result?.[0]) throw new Error("Update failed");
    return result[0];
  }

  private async _delete(client: any, id: string): Promise<Logistics> {
    const result = await client
      .update(this.table)
      .set({
        is_deleted: true,
        deleted_at: new Date(),
        updated_at: new Date()
      })
      .where(eq(this.table.id, id))
      .returning();

    if (!result?.[0]) throw new Error("Delete failed");
    return result[0];
  }

  // ========================================================
  // DOMAIN APIs (CONTROLLER SAFE)
  // ========================================================

  async startShipment(values: {
    item_id: string;
    room_id: string;
    from_id: string;
    to_id: string;
    transport_metadata: Logistics["transport_metadata"];
    payment: Logistics["payment"];
  },actor: string) {
    try {
      const id = generateId("logistics");

      const data: Logistics = {
        ...values,
        id,
        status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
        deleted_at: null
      };

      const result = await db.transaction(async (tx) => {
        const ans = await this._create(tx, data);
        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: actor,
          action: "SHIPMENT",
          flag: "info",
          detail: `Shipment ${id} created by user : ${actor}`,
        });
        return ans;
      });

      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  async getById(id: string, actor: string) {
    try {
      // const ans = await this._getById(db, id);
      const ans = await db.transaction(async (tx) => {
        const ans = await this._getById(tx, id);
        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: actor,
          action: "SHIPMENT",
          flag: "info",
          detail: `Shipment ${id} queried by user : ${actor}`,
        });
        return ans;
      });
      return { msg: "success", ans };
    } catch {
      return { msg: "not_found", ans: null };
    }
  }

  async getByItem(item_id: string,actor:string) {
    const result = await db.transaction(async (tx) => {
      const record = await db
      .select()
      .from(this.table)
      .where(
        and(eq(this.table.item_id, item_id), eq(this.table.is_deleted, false))
      );

      if(!record) return [];

      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: actor,
        action: "SHIPMENT",
        flag: "info",
        detail: `user : ${actor} queried Shipment by item ${item_id}`,
      });
      return record;
    });

    if (!result) return { msg: "not_found", ans: null };
    return { msg: "success", ans: result };
  }


  async updateStatus(
  id: string,
  user_id: string,
  status: Logistics["status"],
  note?: string
) {
  try {
    const result = await db.transaction(async (tx) => {
      const currentLogistics = await this._getById(tx, id);

      if (!currentLogistics) {
        return { msg: "not_found", ans: null };
      }

      const currentStatus = currentLogistics.status;

      if (currentStatus !== status) {
        const allowedNextStates = ALLOWED_TRANSITIONS[currentStatus] || [];
        const isValidTransition = allowedNextStates.includes(status);

        if (!isValidTransition) {
          return { msg: "failed_to_update", ans: "Invalid status transition" };
        }
      }

      const updated = await this._update(tx, id, {
        status,
        transport_metadata: {
          ...currentLogistics.transport_metadata
        }
      });

      // 4. Create Audit Log
      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: user_id,
        action: "SHIPMENT",
        flag: "info",
        detail: `User ${user_id} updated shipment ${id} status from ${currentStatus} to ${status},Note: ${note}`,
      });

      return { msg: "success", ans: updated };
    });

    return result;
  } catch (error) {
    return { msg: "failed_to_update", ans: null };
  }
}


  async cancel(id: string, user_id: string) {
    try {
      const shipment = await this._getById(db, id);

      if (shipment.status === "delivered") {
        return { msg: "forbidden", ans: null };
      }

      const updated = await db.transaction(async (tx) =>{
        const update = await this._update(db, id, {
          status: "canceled",
          is_deleted: true,
          deleted_at: new Date()
        });
        if(!update) return null;
        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: user_id,
          action: "SHIPMENT",
          flag: "info",
          detail: `User ${user_id} canceled shipment ${id}`,
        });
        return update

    })

      return { msg: "success", ans: updated };
    } catch {
      return { msg: "not_found", ans: null };
    }
  }

  async GetAll(limit: number, offset: number,actor:string) {
    const result = await db.transaction(async (tx) =>{
      const all = await tx
      .select()
      .from(this.table)
      .where(eq(this.table.is_deleted, false))
      .orderBy(desc(this.table.created_at))
      .limit(limit)
      .offset(offset);

      if(!all) return [];

      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: actor,
        action: "SHIPMENT",
        flag: "info",
        detail: `user : ${actor} queried All Shipment`,
      });
      return all
    })

    return { msg: "success", ans: result };
  }

  // ========================================================
  // PAYMENT
  // ========================================================

  async processPaymentRelease(
    id: string,
    user_id: string,
    payload: { amount: number; proof?: string },
    rate: number
  ) {
    try {
      const result = await db.transaction(async (tx) => {
        const shipment = await this._getById(tx, id);
        if (!shipment) return { msg: "not_found", ans: null };

        const allowedPeople = [shipment.from_id, shipment.to_id];
        if (!allowedPeople.includes(user_id)) {
          return { msg: "forbidden", ans: null };
        }

        const existingConfirmations = shipment.payment?.confirmed_by || [];
        if (existingConfirmations.includes(user_id)) {
          return { msg: "forbidden", ans: null };
        }

        const updatedConfirmedBy = [...existingConfirmations, user_id];

        const updatedShipment = await this._update(tx, id, {
          payment: {
            ...shipment.payment,
            amount_cents: payload.amount,
            proof: payload.proof ?? shipment.payment.proof,
            confirmed_by: updatedConfirmedBy
          }
        });

        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: user_id,
          action: "SHIPMENT",
          flag: "info",
          detail: `User ${user_id} uploaded payment proof of amount ${payload.amount}. Awaiting counterparty verification confirmation.`,
        });

        // --- B. USER REPUTATION & RATING SYSTEM (Rates the Receiver/to_id) ---
        const providerId = shipment.from_id;
        if (providerId) {
          const userRecord = await userService.useGetById(tx, providerId);

          if (userRecord) {
            const currentMetadata = userRecord.metadata || { profile: { name: "Unknown" } };
            const currentCount = currentMetadata.rating_count ?? 0;
            const currentRating = currentMetadata.rating ?? 0;

            const newCount = currentCount + 1;

            const newRating = Number(((currentRating * currentCount + rate) / newCount).toFixed(2));

            await userService.useUpdate(tx, providerId, {
              metadata: {
                ...currentMetadata,
                rating: newRating,
                rating_count: newCount
              }
            });

            await auditService.useCreate(tx, {
              id: generateId("audit"),
              entity_id: user_id,
              action: "ROOM",
              flag: "info",
              detail: `User ${providerId} rating adjusted to ${newRating} (${newCount} completions) following secure release on shipment ${id}.`,
            });
          }
        }

        return { msg: "success", ans: updatedShipment };
      });

      return result;
    } catch (error) {
      return { msg: "failed_to_update", ans: null };
    }
  }


  async confirmPaymentRelease(id: string, user_id: string, rate: number) {
    try {
      const result = await db.transaction(async (tx) => {
        const shipment = await this._getById(tx, id);
        if (!shipment) return { msg: "not_found", ans: null };

        const allowedPeople = [shipment.from_id, shipment.to_id];
        if (!allowedPeople.includes(user_id)) {
          return { msg: "forbidden", ans: null };
        }

        const existingConfirmations = shipment.payment?.confirmed_by || [];
        if (existingConfirmations.includes(user_id)) {
          return { msg: "forbidden", ans: null };
        }

        const updatedConfirmedBy = [...existingConfirmations, user_id];

        const updatedShipment = await this._update(tx, id, {
          payment: {
            ...shipment.payment,
            confirmed_by: updatedConfirmedBy,
            proof_status: updatedConfirmedBy.length >= 2 ? "verified" : "pending"
          }
        });

        const isFullyConfirmed = updatedConfirmedBy.length >= 2;
        let auditDetail = `User ${user_id} approved verification. Status: Awaiting remaining participant signs.`;

        if (isFullyConfirmed) {
          auditDetail = `Payment fully closed for shipment ${id}. Both participants have verified transaction.`;
        }

        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: user_id,
          action: "SHIPMENT",
          flag: "info",
          detail: auditDetail,
        });

        if (isFullyConfirmed) {
          // --- A. ITEM ANALYTICS TRACKING ---
          const itemId = shipment.item_id;
          if (itemId) {
            const item = await itemsService.useGetById(tx, itemId);

            if (item) {
              const today = new Date();
              const dayOffset = 6 - today.getDay();
              const weekEndingDate = new Date(today.setDate(today.getDate() + dayOffset)).toISOString().split('T')[0];

              if (!weekEndingDate) return { msg: "failed_to_parse_date", ans: null };

              let weeklyStatusArray = item.analytics.weekly_status ? [...item.analytics.weekly_status] : [];
              let weekRecord = weeklyStatusArray.find(w => w.week_ending === weekEndingDate);
              const totalPaymentAmount = shipment.payment?.amount_cents || 0;

              if (weekRecord) {
                weekRecord.total_sales += totalPaymentAmount;
                weekRecord.demand_score += 1;
              } else {
                weeklyStatusArray.push({
                  week_ending: weekEndingDate,
                  total_sales: totalPaymentAmount,
                  expense: totalPaymentAmount * 0.2,
                  demand_score: 1
                });
              }

              const baseUnitCost = item.amount_cents || totalPaymentAmount || 1;
              const quantitySold = Math.max(1, Math.floor(totalPaymentAmount / baseUnitCost));
              let updatedInstore = (item.analytics.instore ?? 0) - quantitySold;

              if (updatedInstore < 0) {
                await auditService.useCreate(tx, {
                  id: generateId("audit"),
                  entity_id: user_id,
                  action: "ROOM",
                  flag: "log",
                  detail: `Inventory discrepancy on item ${itemId}: Stock fell below zero (${updatedInstore}). Mysterious items sold without being logged in-store.`,
                });
              }

              await itemsService.useUpdate(tx, itemId, {
                analytics: {
                  ...item.analytics,
                  instore: updatedInstore,
                  weekly_status: weeklyStatusArray,
                  status: "completed"
                }
              });

              await auditService.useCreate(tx, {
                id: generateId("audit"),
                entity_id: user_id,
                action: "ROOM",
                flag: "info",
                detail: `Item ${itemId} analytics synchronized. Sales increased by ${totalPaymentAmount}, instore updated to ${updatedInstore}.`,
              });
            }
          }

          // --- B. USER REPUTATION & RATING SYSTEM (Rates the Provider/from_id) ---
          const recieverId = shipment.to_id;
          if (recieverId) {
            const userRecord = await userService.useGetById(tx, recieverId);

            if (userRecord) {
              const currentMetadata = userRecord.metadata || { profile: { name: "Unknown" } };
              const currentCount = currentMetadata.rating_count ?? 0;
              const currentRating = currentMetadata.rating ?? 0;

              const newCount = currentCount + 1;
              // 🔥 FIX: Correct Weighted Cumulative Moving Average calculation formula
              const newRating = Number(((currentRating * currentCount + rate) / newCount).toFixed(2));

              await userService.useUpdate(tx, recieverId, {
                metadata: {
                  ...currentMetadata,
                  rating: newRating,
                  rating_count: newCount
                }
              });

              await auditService.useCreate(tx, {
                id: generateId("audit"),
                entity_id: user_id,
                action: "ROOM",
                flag: "info",
                detail: `User ${recieverId} rating adjusted to ${newRating} (${newCount} completions) following secure release on shipment ${id}.`,
              });
            }
          }
        }

        return { msg: "success", ans: updatedShipment };
      });

      return result;
    } catch (error) {
      return { msg: "failed_to_update", ans: null };
    }
  }


  // ========================================================
  // PIPELINE
  // ========================================================

  async getVisibilityPipeline(id: string,actor:string) {
    const shipment = await db.transaction(async(tx)=>{
      const shipment = await this._getById(db, id);

      if(!shipment) throw new Error("not_found");

      const audit = await tx .select()
      .from(audit_logs)
      .where(
        and(
          or(eq(audit_logs.entity_id, shipment.from_id), eq(audit_logs.entity_id, shipment.to_id)),
          eq(audit_logs.action, "SHIPMENT")
        ))
      .orderBy(desc(audit_logs.created_at));

      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: actor,
        action: "SHIPMENT",
        flag: "info",
        detail: `user : ${actor} queried Shipment tracking by id ${id}`,
      });
      return audit
    });



    return {
      msg: "success",
      ans: { shipment }
    };
  }
}
