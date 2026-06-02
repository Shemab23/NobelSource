// --- SHARED ENTITY CONTAINER ---
export interface ApiEntityContainer {
  id: string;
  type: "user" | "room";
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at?: string | null;
}

// --- GET /api/entities/in ---
export interface EntityHealthResponse {
  msg: string;
}

// --- GET /api/entities/:id ---
export interface GetEntityResponse {
  msg: "success";
  ans: ApiEntityContainer;
}

// --- GET /api/entities/:id/exists ---
export interface EntityExistsResponse {
  msg: "success" | "not found";
  ans: boolean;
}

// --- GET /api/entities/:id/type-check ---
export interface EntityTypeCheckResponse {
  msg: "success" | "type mismatch";
  ans: boolean;
}

// --- POST /api/entities/admin ---
export interface CreateEntityPayload {
  type: "user" | "room";
}

// --- GET /api/entities/admin/all ---
export interface GetAllEntitiesResponse {
  msg: "success";
  ans: ApiEntityContainer[];
}

// --- PATCH /api/entities/admin/:id ---
export interface UpdateEntityResponse {
  msg: "success";
  ans: ApiEntityContainer[];
}
