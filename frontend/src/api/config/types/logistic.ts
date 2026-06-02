import type { ApiItem } from "./item";

// --- SHARED NESTED ENTITIES ---
export interface LogisticsSchedule {
  pattern: "one-time" | string;
  start_date: string;
  time_window: string;
}

export interface LogisticsTransportMetadata {
  type: "sole" | string;
  name: string;
  phone?: string;
  plate_number?: string;
  schedule?: LogisticsSchedule;
}

export interface LogisticsPayment {
  amount_cents: number;
  currency: string;
  account_number?: string;
  method_of_payment?: string;
  proof?: string;
  proof_status?: "verified" | string;
  confirmed_by: string[];
}

// --- MAIN LOGISTICS RECORD ---
export interface ApiLogistics {
  id: string;
  room_id: string;
  status: "pending" | "in_transit" | "collected" | "delivered" | "canceled";
  from_id: string;
  item_id: string;
  to_id: string;
  transport_metadata: LogisticsTransportMetadata;
  payment: LogisticsPayment;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
}

// --- REQ/RES PAYLOAD CORES ---
export type LogisticsFocusType = "to" | "from";

export interface CreateLogisticsPayload {
  item_id: string;
  room_id: string;
  from_id?: string;
  to_id?: string;
  transport_metadata: LogisticsTransportMetadata;
  payment: Omit<LogisticsPayment, "confirmed_by">;
}

export interface LogisticsResponse {
  msg: "success";
  ans: ApiLogistics;
}

export interface LogisticsListResponse {
  msg: "success";
  ans: ApiLogistics[];
}

export interface RoomLogisticsGroup {
  item: ApiItem;
  logistics: ApiLogistics[];
}

export interface RoomLogisticsResponse {
  msg: "success";
  ans: RoomLogisticsGroup[];
}

export interface PipelineAuditLog {
  id: string;
  entity_id: string;
  action: "SHIPMENT";
  flag: "info" | string;
  detail: string;
  created_at: string;
}

export interface LogisticsPipelineResponse {
  msg: "success";
  ans: {
    shipment: PipelineAuditLog[];
  };
}

export interface UpdateLogisticsStatusPayload {
  status: string;
  note?: string;
}

export interface PaymentReleasePayload {
  amount: string;
  rate: string;
  proof?: File;
}

export interface PaymentConfirmPayload {
  rate: string;
}
