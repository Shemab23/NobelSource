import type { ApiItem } from "./item";

// --- CONTRACT & METADATA SUB-SCHEMAS ---
export interface RoomMemberRule {
  actor: string;
  role: string;
  isAdmin: boolean;
}

export interface RoomMetadata {
  description?: string;
  tags?: string[];
  members_rules?: RoomMemberRule[];
  goals?: {
    monthly_target: number;
    currency: string;
  };
}

export interface RoomContractSections {
  shipment_rules?: string;
  payment_terms?: string;
  penalties?: string;
  dispute_resolution?: string;
}

export interface RoomContract {
  version: number;
  introduction?: string;
  sections?: RoomContractSections;
  metadata?: {
    provider_id: string;
    receiver_id: string;
    jurisdiction: string;
  };
  signed?: string[];
}

// --- MAIN ROOM RECORD ENTITY ---
export interface ApiRoom {
  id: string;
  name: string;
  metadata: RoomMetadata;
  contract: RoomContract;
  permissions: string[];
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
}

// --- FINANCIALS REPORT NESTED SCHEMA ---
export interface RoomFinancials {
  room_id: string;
  room_name: string;
  currency_scope: string;
  pipeline_summary: {
    total_items_tracked: number;
    active_listings: number;
    negotiating_threads: number;
    closed_deals: number;
  };
  financial_totals: {
    total_valuation_recorded_cents: number;
    gross_sales_cents: number;
    operating_expenses_cents: number;
    net_profit_cents: number;
  };
  goal_tracking: {
    monthly_target_cents: number;
    completion_percentage: number;
    target_status: "IN_PROGRESS" | string;
  };
  inventory_integrity: {
    unlogged_stock_warnings: number;
    status: "STABLE" | string;
  };
  interaction_analytics: {
    global_demand_score: number;
  };
  weekly_trend_history: Array<{
    week_ending: string;
    total_sales: number;
    expense: number;
    demand_score: number;
  }>;
}

// --- REQ/RES PAYLOAD PACKAGES ---
export interface CreateRoomPayload {
  name: string;
  metadata: RoomMetadata;
  contract: RoomContract;
}

export interface PatchRoomPayload {
  name?: string;
  metadata?: Partial<RoomMetadata>;
  contract?: Partial<Pick<RoomContract, "signed">>;
}

export interface RoomResponse {
  msg: "success";
  ans: ApiRoom;
}

export interface RoomListResponse {
  msg: "success";
  ans: ApiRoom[];
}

export interface RoomFinancialsResponse {
  msg: "success";
  ans: RoomFinancials;
}

export interface RoomItemsResponse {
  msg: "success";
  ans: ApiItem[];
}
