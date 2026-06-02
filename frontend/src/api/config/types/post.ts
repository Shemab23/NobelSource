import type { PaginationParams } from "./audit";

// --- SHARED NESTED CONTENT DESCRIPTORS ---
export interface ApiPostContent {
  title: string;
  body: string;
  description?: string;
  media?: string[];
  unit: string;
  type: "OFFER" | "WANT" | "INFO" | string;
  price_cents: number;
  currency: string;
  location: string;
  category: string;
  tags?: string[];
}

// --- MAIN POST RECORD ENTITY ---
export interface ApiPost {
  id: string;
  entity_id: string;
  content: ApiPostContent;
  status: "active" | "expired" | string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
}

// --- CORE QUERY PARAMS CRITERIA ---
export type PostFeedParams = PaginationParams;

export interface PostActiveWindowParams {
  limit?: number;
}

export interface PostSearchParams {
  q: string;
  limit?: number;
}

// --- REQ/RES PAYLOAD PACKAGES ---
export interface PostResponse {
  msg: "success";
  ans: ApiPost;
}

export interface PostListResponse {
  msg: "success";
  ans: ApiPost[];
}

export interface PostHealthResponse {
  msg: string;
}

export interface CreatePostPayload {
  title: string;
  body: string;
  description?: string;
  unit: string;
  type: "OFFER" | "WANT" | "INFO" | string;
  price_cents: string | number;
  currency: string;
  location: string;
  category: string;
  tags?: string; // Comma separated or stringified JSON array
  status?: string;
  media?: File[]; // Binary file payload buffers
}

export interface PatchPostPayload {
  status?: string;
  content?: Partial<Omit<ApiPostContent, "media">>;
}
