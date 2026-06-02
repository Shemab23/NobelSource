import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { BaseApiUrl } from "@/api/config/general";
import { FetchTemplate } from "@/api/config/FetchTemplate";
import type { PaginationParams } from "@/api/config/types/audit";
import type {
  CreateDisputePayload,
  DisputeResponse,
  DisputeListResponse,
  AssignDisputePayload,
  JudgementPayload,
  RateDisputePayload,
  RateDisputeResponse,
} from "@/api/config/types/dispute";

// Helper to stringify limit and offset parameters
const buildPaginationQuery = (params?: PaginationParams): string => {
  if (!params) return "";
  const queryParams = new URLSearchParams();
  if (params.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params.offset !== undefined) queryParams.append("offset", params.offset.toString());
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
};

// ==========================================
// 1. CREATE DISPUTE
// ==========================================
const CreateDisputeFn = async (data: CreateDisputePayload): Promise<DisputeResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<DisputeResponse>(`${BaseApiUrl}/disputes`, "POST", data);
};

export const CreateDisputeOption = () => {
  return mutationOptions({
    mutationKey: ["CreateDispute"] as const,
    mutationFn: (data: CreateDisputePayload) => CreateDisputeFn(data),
  });
};

// ==========================================
// 2. GET SINGLE DISPUTE BY ID
// ==========================================
const GetDisputeByIdFn = async (id: string): Promise<DisputeResponse> => {
  return await FetchTemplate<DisputeResponse>(`${BaseApiUrl}/disputes/${id}`, "GET");
};

export const GetDisputeByIdOption = (id: string) => {
  return queryOptions({
    queryKey: ["Dispute", id] as const,
    queryFn: () => GetDisputeByIdFn(id),
    enabled: !!id,
  });
};

// ==========================================
// 3. GET OPEN DISPUTES BY ROOM ID
// ==========================================
const GetDisputesByRoomFn = async (roomId: string, params?: PaginationParams): Promise<DisputeListResponse> => {
  const query = buildPaginationQuery(params);
  return await FetchTemplate<DisputeListResponse>(`${BaseApiUrl}/disputes/room/${roomId}${query}`, "GET");
};

export const GetDisputesByRoomOption = (roomId: string, params?: PaginationParams) => {
  return queryOptions({
    queryKey: ["RoomDisputes", roomId, params] as const,
    queryFn: () => GetDisputesByRoomFn(roomId, params),
    enabled: !!roomId,
  });
};

// ==========================================
// 4. GET ALL DISPUTES (ADMIN MONITOR)
// ==========================================
const GetAdminAllDisputesFn = async (params?: PaginationParams): Promise<DisputeListResponse> => {
  const query = buildPaginationQuery(params);
  return await FetchTemplate<DisputeListResponse>(`${BaseApiUrl}/disputes/admin/all${query}`, "GET");
};

export const GetAdminAllDisputesOption = (params?: PaginationParams) => {
  return queryOptions({
    queryKey: ["AdminAllDisputes", params] as const,
    queryFn: () => GetAdminAllDisputesFn(params),
  });
};

// ==========================================
// 5. GET ARBITRATOR ASSIGNED DISPUTES
// ==========================================
const GetArbitratorDisputesFn = async (params?: PaginationParams): Promise<DisputeListResponse> => {
  const query = buildPaginationQuery(params);
  return await FetchTemplate<DisputeListResponse>(`${BaseApiUrl}/disputes/arbitrator/all${query}`, "GET");
};

export const GetArbitratorDisputesOption = (params?: PaginationParams) => {
  return queryOptions({
    queryKey: ["ArbitratorDisputes", params] as const,
    queryFn: () => GetArbitratorDisputesFn(params),
  });
};

// ==========================================
// 6. ASSIGN DISPUTE TO INVESTIGATOR
// ==========================================
const AssignDisputeFn = async ({ id, data }: { id: string; data: AssignDisputePayload }): Promise<DisputeResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<DisputeResponse>(`${BaseApiUrl}/disputes/${id}/assign`, "PATCH", data);
};

export const AssignDisputeOption = () => {
  return mutationOptions({
    mutationKey: ["AssignDispute"] as const,
    mutationFn: (variables: { id: string; data: AssignDisputePayload }) => AssignDisputeFn(variables),
  });
};

// ==========================================
// 7. SUBMIT DISPUTE JUDGEMENT
// ==========================================
const SubmitJudgementFn = async ({ id, data }: { id: string; data: JudgementPayload }): Promise<DisputeResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<DisputeResponse>(`${BaseApiUrl}/disputes/${id}/judgement`, "PATCH", data);
};

export const SubmitJudgementOption = () => {
  return mutationOptions({
    mutationKey: ["SubmitJudgement"] as const,
    mutationFn: (variables: { id: string; data: JudgementPayload }) => SubmitJudgementFn(variables),
  });
};

// ==========================================
// 8. RATE RESOLVED DISPUTE
// ==========================================
const RateDisputeFn = async ({ id, data }: { id: string; data: RateDisputePayload }): Promise<RateDisputeResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<RateDisputeResponse>(`${BaseApiUrl}/disputes/${id}/rate`, "POST", data);
};

export const RateDisputeOption = () => {
  return mutationOptions({
    mutationKey: ["RateDispute"] as const,
    mutationFn: (variables: { id: string; data: RateDisputePayload }) => RateDisputeFn(variables),
  });
};

// ==========================================
// 9. SOFT DELETE DISPUTE (ADMIN)
// ==========================================
const DeleteDisputeFn = async (id: string): Promise<DisputeResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<DisputeResponse>(`${BaseApiUrl}/disputes/${id}`, "DELETE");
};

export const DeleteDisputeOption = () => {
  return mutationOptions({
    mutationKey: ["DeleteDispute"] as const,
    mutationFn: (id: string) => DeleteDisputeFn(id),
  });
};
