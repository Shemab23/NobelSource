import type { ApiUser } from "./auth";

// --- MAIN JUNCTION RELATION ENTITY ---
export interface ApiRoomMemberRelation {
  room_id: string;
  user_id: string;
  created_at: string;
  is_deleted?: boolean;
  deleted_at?: string | null;
}

// --- REQ/RES PAYLOAD PACKAGES ---
export interface RoomMemberHealthResponse {
  msg: string;
}

export interface JoinRoomResponse {
  msg: "success";
  ans: ApiRoomMemberRelation;
}

// GET /api/room-member/:id hydrates full user accounts directly
export type HydratedRoomMembersResponse = ApiUser[];

export interface RemoveMemberPayload {
  user_id: string;
}

export interface RemoveMemberResponse {
  msg: "success";
  ans: ApiRoomMemberRelation & {
    is_deleted: boolean;
    deleted_at: string;
  };
}

export interface GetAllRoomMembersResponse {
  msg: "success";
  ans: ApiRoomMemberRelation[];
}
