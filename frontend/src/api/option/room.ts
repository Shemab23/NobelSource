import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { BaseApiUrl } from "@/api/config/general";
import { FetchTemplate } from "@/api/config/FetchTemplate";
import type { PaginationParams } from "@/api/config/types/audit";
import type {
  CreateRoomPayload,
  PatchRoomPayload,
  RoomResponse,
  RoomListResponse,
  RoomFinancialsResponse,
  RoomItemsResponse,
} from "@/api/config/types/room";

// ==========================================
// 1. INITIALIZE NEW WORKSPACE CONTRACT ROOM
// ==========================================
const CreateRoomFn = async (data: CreateRoomPayload): Promise<RoomResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<RoomResponse>(`${BaseApiUrl}/rooms`, "POST", data);
};

export const CreateRoomOption = () => {
  return mutationOptions({
    mutationKey: ["CreateRoom"] as const,
    mutationFn: (data: CreateRoomPayload) => CreateRoomFn(data),
  });
};

// ==========================================
// 2. FETCH TOKEN ACTOR'S ACTIVE PARTICIPATING ROOMS
// ==========================================
const GetMyRoomsFn = async (): Promise<RoomListResponse> => {
  return await FetchTemplate<RoomListResponse>(`${BaseApiUrl}/rooms/mine`, "GET");
};

export const GetMyRoomsOption = () => {
  return queryOptions({
    queryKey: ["MyRooms"] as const,
    queryFn: () => GetMyRoomsFn(),
  });
};

// ==========================================
// 3. FETCH COMPLETE LAYOUT BY HASH ID
// ==========================================
const GetRoomByIdFn = async (id: string): Promise<RoomResponse> => {
  return await FetchTemplate<RoomResponse>(`${BaseApiUrl}/rooms/${id}`, "GET");
};

export const GetRoomByIdOption = (id: string) => {
  return queryOptions({
    queryKey: ["RoomItem", id] as const,
    queryFn: () => GetRoomByIdFn(id),
    enabled: !!id,
  });
};

// ==========================================
// 4. PERFORM EXPLICIT LEVEL SPREADING MUTATION
// ==========================================
const PatchRoomFn = async ({ id, data }: { id: string; data: PatchRoomPayload }): Promise<RoomResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<RoomResponse>(`${BaseApiUrl}/rooms/${id}`, "PATCH", data);
};

export const PatchRoomOption = () => {
  return mutationOptions({
    mutationKey: ["PatchRoom"] as const,
    mutationFn: (variables: { id: string; data: PatchRoomPayload }) => PatchRoomFn(variables),
  });
};

// ==========================================
// 5. TRANSACTION-LOCKED SOFT-DELETION PROTOCOL
// ==========================================
const SoftDeleteRoomFn = async (id: string): Promise<RoomResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<RoomResponse>(`${BaseApiUrl}/rooms/${id}/soft-delete`, "PATCH");
};

export const SoftDeleteRoomOption = () => {
  return mutationOptions({
    mutationKey: ["SoftDeleteRoom"] as const,
    mutationFn: (id: string) => SoftDeleteRoomFn(id),
  });
};

// ==========================================
// 6. AGGREGATE REAL-TIME FINANCIAL INTEL
// ==========================================
const GetRoomFinancialsFn = async (id: string): Promise<RoomFinancialsResponse> => {
  return await FetchTemplate<RoomFinancialsResponse>(`${BaseApiUrl}/rooms/${id}/financials`, "GET");
};

export const GetRoomFinancialsOption = (id: string) => {
  return queryOptions({
    queryKey: ["RoomFinancials", id] as const,
    queryFn: () => GetRoomFinancialsFn(id),
    enabled: !!id,
  });
};

// ==========================================
// 7. RETRIEVE UN-DELETED ACTIVE INVENTORY ITEMS
// ==========================================
const GetRoomItemsFn = async (id: string): Promise<RoomItemsResponse> => {
  return await FetchTemplate<RoomItemsResponse>(`${BaseApiUrl}/rooms/${id}/items`, "GET");
};

export const GetRoomItemsOption = (id: string) => {
  return queryOptions({
    queryKey: ["RoomItemsList", id] as const,
    queryFn: () => GetRoomItemsFn(id),
    enabled: !!id,
  });
};

// ==========================================
// 8. DIRECTORY SEARCH LOG UTILS (ADMIN)
// ==========================================
const GetAdminAllRoomsFn = async (params?: PaginationParams): Promise<RoomListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.offset !== undefined) queryParams.append("offset", params.offset.toString());

  const queryStr = queryParams.toString();
  const endpoint = `${BaseApiUrl}/rooms/all${queryStr ? `?${queryStr}` : ""}`;

  return await FetchTemplate<RoomListResponse>(endpoint, "GET");
};

export const GetAdminAllRoomsOption = (params?: PaginationParams) => {
  return queryOptions({
    queryKey: ["AdminAllRooms", params] as const,
    queryFn: () => GetAdminAllRoomsFn(params),
  });
};
