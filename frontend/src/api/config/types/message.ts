
// --- SHARED MESSAGE FLAG SET ---
export type ApiMessageFlag = "chat" | "system" | "notification" | "proposal" | "dispute";
export type ApiMessageMetadata = {
    type?: "dispute_opened" | "dispute_response" | "shipment_update" | "system_notice" | undefined;
    logistics_id?: string | undefined;
    dispute_id?: string | undefined;
    audit_refs?: string[] | undefined;
}


// --- MAIN MESSAGE RECORD ENTITY ---
export interface ApiMessage {
  id: string;
  room_id: string | null;
  created_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  metadata: ApiMessageMetadata;
  participants: string[];
  from_id: string;
  body: string; // Format: '[index:timestamp]textContent'
  flag: ApiMessageFlag;
}

// --- STANDARD RESPONSE PACKAGES ---
export interface MessageHealthResponse {
  msg: string;
}

export interface MessageResponse {
  msg: "success";
  ans: ApiMessage;
}

export interface MessageListResponse {
  msg: "success";
  ans: ApiMessage[];
}

// --- POST /api/messages ---
export interface CreateMessagePayload {
  to_id: string | null;
  room_id: string | null;
  body: string;
  message_flag?: ApiMessageFlag;
  participants?: string[];
  metadata?: ApiMessageMetadata;
}

// --- PATCH /api/messages/:id/respond ---
export interface RespondMessagePayload {
  body: string;
}
