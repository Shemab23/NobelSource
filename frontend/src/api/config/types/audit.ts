// --- SHARED AUDIT ENTITY ---
export interface ApiAuditLog {
  id: string;
  entity_id: string;
  action: string;
  detail: string;
  flag: "log" | "critical";
  created_at: string;
}

// --- PAGINATION QUERY PARAMS ---
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

// --- GET /api/audit ---
export interface GetAuditsResponse {
  msg: "success";
  ans: ApiAuditLog[];
}

// --- GET /api/audit/entity/:id ---
export interface GetEntityAuditResponse {
  msg: "success";
  ans: ApiAuditLog;
}

// --- GET /api/audit/room/:roomId ---
export interface GetRoomAuditsResponse {
  msg: "success";
  ans: ApiAuditLog[];
}

// --- GET /api/audit/since ---
export interface GetAuditsSinceParams extends PaginationParams {
  since: string; // ISO 8601 Datetime string
}

export interface GetAuditsSinceResponse {
  msg: "success";
  ans: ApiAuditLog[];
}
