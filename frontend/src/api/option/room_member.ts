import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { BaseApiUrl } from "@/api/config/general";
import { FetchTemplate } from "@/api/config/FetchTemplate";
import type { PaginationParams } from "@/api/config/types/audit";
import type {
  RoomMemberHealthResponse,
  JoinRoomResponse,
  HydratedRoomMembersResponse,
  RemoveMemberPayload,
  RemoveMemberResponse,
  GetAllRoomMembersResponse,
} from "@/api/config/types/room_member";

// ==========================================
// 1. PING SERVICE CONNECTIVITY HANDSHAKE
// ==========================================
const GetRoomMemberHealthFn = async (): Promise<RoomMemberHealthResponse> => {
  return await FetchTemplate<RoomMemberHealthResponse>(`${BaseApiUrl}/room_member/member/in`, "GET");
};

export const GetRoomMemberHealthOption = () => {
  return queryOptions({
    queryKey: ["RoomMemberHealth"] as const,
    queryFn: () => GetRoomMemberHealthFn(),
  });
};

// ==========================================
// 2. SECURE ATOMIC PROTOCOL SELF-JOIN ROOM
// ==========================================
const JoinRoomFn = async (roomId: string): Promise<JoinRoomResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<JoinRoomResponse>(`${BaseApiUrl}/room_member/${roomId}/join`, "POST");
};

export const JoinRoomOption = () => {
  return mutationOptions({
    mutationKey: ["JoinRoom"] as const,
    mutationFn: (roomId: string) => JoinRoomFn(roomId),
  });
};

// ==========================================
// 3. FETCH AND HYDRATE ALL ROOM ACTIVE MEMBERS
// ==========================================
const GetHydratedRoomMembersFn = async (roomId: string): Promise<HydratedRoomMembersResponse> => {
  return await FetchTemplate<HydratedRoomMembersResponse>(`${BaseApiUrl}/room_member/${roomId}`, "GET");
};

export const GetHydratedRoomMembersOption = (roomId: string) => {
  return queryOptions({
    queryKey: ["HydratedRoomMembers", roomId] as const,
    queryFn: () => GetHydratedRoomMembersFn(roomId),
    enabled: !!roomId,
  });
};

// ==========================================
// 4. REVOKE MEMBER RELATION FROM WORKSPACE
// ==========================================
const RemoveRoomMemberFn = async ({ roomId, data }: { roomId: string; data: RemoveMemberPayload }): Promise<RemoveMemberResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<RemoveMemberResponse>(`${BaseApiUrl}/room_member/${roomId}/members`, "DELETE", data);
};

export const RemoveRoomMemberOption = () => {
  return mutationOptions({
    mutationKey: ["RemoveRoomMember"] as const,
    mutationFn: (variables: { roomId: string; data: RemoveMemberPayload }) => RemoveRoomMemberFn(variables),
  });
};

// ==========================================
// 5. GLOBAL DIRECTORY junction REGISTRY (ADMIN)
// ==========================================
const GetAdminAllRoomMembersFn = async (params?: PaginationParams): Promise<GetAllRoomMembersResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.offset !== undefined) queryParams.append("offset", params.offset.toString());

  const queryStr = queryParams.toString();
  const endpoint = `${BaseApiUrl}/room_member/all${queryStr ? `?${queryStr}` : ""}`;

  return await FetchTemplate<GetAllRoomMembersResponse>(endpoint, "GET");
};

export const GetAdminAllRoomMembersOption = (params?: PaginationParams) => {
  return queryOptions({
    queryKey: ["AdminAllRoomMembers", params] as const,
    queryFn: () => GetAdminAllRoomMembersFn(params),
  });
};
