import { queryOptions } from "@tanstack/react-query";
import { BaseApiUrl } from "@/api/config/general";
import { FetchTemplate } from "@/api/config/FetchTemplate";
import type {
  PaginationParams,
  GetAuditsResponse,
  GetEntityAuditResponse,
  GetRoomAuditsResponse,
  GetAuditsSinceParams,
  GetAuditsSinceResponse
} from "@/api/config/types/audit";

// ==========================================
// 1. GET ALL AUDITS (ADMIN)
// ==========================================
const GetAuditsFn = async (params?: PaginationParams): Promise<GetAuditsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.offset !== undefined) queryParams.append("offset", params.offset.toString());

  const queryString = queryParams.toString();
  const endpoint = `${BaseApiUrl}/audit${queryString ? `?${queryString}` : ""}`;

  return await FetchTemplate<GetAuditsResponse>(endpoint, "GET");
};

export const GetAuditsOption = (params?: PaginationParams) => {
  return queryOptions({
    queryKey: ["Audits", params] as const,
    queryFn: () => GetAuditsFn(params),
  });
};

// ==========================================
// 2. GET AUDIT BY ENTITY ID
// ==========================================
const GetEntityAuditFn = async (id: string): Promise<GetEntityAuditResponse> => {
  return await FetchTemplate<GetEntityAuditResponse>(
    `${BaseApiUrl}/audit/entity/${id}`,
    "GET"
  );
};

export const GetEntityAuditOption = (id: string) => {
  return queryOptions({
    queryKey: ["EntityAudit", id] as const,
    queryFn: () => GetEntityAuditFn(id),
    enabled: !!id, // Only run query if id is provided
  });
};

// ==========================================
// 3. GET ROOM TIMELINE AUDITS
// ==========================================
const GetRoomAuditsFn = async (roomId: string, params?: PaginationParams): Promise<GetRoomAuditsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.offset !== undefined) queryParams.append("offset", params.offset.toString());

  const queryString = queryParams.toString();
  const endpoint = `${BaseApiUrl}/audit/room/${roomId}${queryString ? `?${queryString}` : ""}`;

  return await FetchTemplate<GetRoomAuditsResponse>(endpoint, "GET");
};

export const GetRoomAuditsOption = (roomId: string, params?: PaginationParams) => {
  return queryOptions({
    queryKey: ["RoomAudits", roomId, params] as const,
    queryFn: () => GetRoomAuditsFn(roomId, params),
    enabled: !!roomId,
  });
};

// ==========================================
// 4. GET AUDITS SINCE TIMESTAMP
// ==========================================
const GetAuditsSinceFn = async (params: GetAuditsSinceParams): Promise<GetAuditsSinceResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("since", params.since);
  if (params.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params.offset !== undefined) queryParams.append("offset", params.offset.toString());

  return await FetchTemplate<GetAuditsSinceResponse>(
    `${BaseApiUrl}/audit/since?${queryParams.toString()}`,
    "GET"
  );
};

export const GetAuditsSinceOption = (params: GetAuditsSinceParams) => {
  return queryOptions({
    queryKey: ["AuditsSince", params] as const,
    queryFn: () => GetAuditsSinceFn(params),
    enabled: !!params.since,
  });
};
