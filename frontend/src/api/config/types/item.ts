// --- SHARED ITEM ANALYTICS ---
export interface ApiItemWeeklyStatus {
  week_ending: string;
  total_sales: number;
  expense: number;
  demand_score: number;
}

export interface ApiItemParticipants {
  seller_id: string;
  buyer_id: string;
  logistics_id?: string;
}

export interface ApiItemAnalytics {
  instore: number;
  product_name: string;
  status: "negotiating" | "active" | "completed";
  participants: ApiItemParticipants;
  weekly_status: ApiItemWeeklyStatus[];
}

// --- SHARED ITEM CONTAINER ---
export interface ApiItem {
  id: string;
  room_id: string;
  amount_cents: number;
  created_at: string | null;
  updated_at: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  analytics: ApiItemAnalytics;
}

// --- STANDARD ITEM RESPONSE ---
export interface ItemResponse {
  msg: "success";
  ans: ApiItem;
}

// --- ITEM LIST RESPONSE ---
export interface ItemListResponse {
  msg: "success";
  ans: ApiItem[];
}

// --- POST /api/items/:focus ---
export type ItemFocusType = "send" | "receive";

export interface CreateItemPayload {
  room_id: string;
  amount: number;
  name: string;
  receiver?: string; // Required if focus === 'send'
  sender?: string;   // Required if focus === 'receive'
}

// --- PATCH /api/items/:id/amount ---
export interface UpdateItemAmountPayload {
  amount: number;
}
