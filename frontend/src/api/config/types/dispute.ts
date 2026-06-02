// --- SHARED DISPUTE ENTITY ---
export interface ApiDispute {
  id: string;
  room_id: string;
  logistics_id: string;
  opened_by: string;
  claim: string;
  status: "open" | "investigating" | "resolved" | "rejected";
  resolved: boolean;
  arbitrator_id: string | null;
  resolution: string | null;
  selected_at: string | null;
  resolved_at: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
}

// --- POST /api/disputes ---
export interface CreateDisputePayload {
  room_id: string;
  logistics_id: string;
  claim: string;
  arbitrator?: string;
}

export interface DisputeResponse {
  msg: "success";
  ans: ApiDispute;
}

// --- GET /api/disputes/room/:room_id ---
export interface DisputeListResponse {
  msg: "success";
  ans: ApiDispute[];
}

// --- PATCH /api/disputes/:id/assign ---
export interface AssignDisputePayload {
  arbitrator_id: string;
}

// --- PATCH /api/disputes/:id/judgement ---
export interface JudgementPayload {
  resolution: string;
  status: "resolved" | "rejected";
}

// --- POST /api/disputes/:id/rate ---
export interface RateDisputePayload {
  rating: 1 | 2 | 3 | 4 | 5;
  review: string;
}

export interface RateDisputeResponse {
  msg: "success";
  ans: {
    dispute_id: string;
    rating: number;
    review: string;
  };
}
