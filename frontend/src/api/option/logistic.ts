import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { BaseApiUrl } from "@/api/config/general";
import { FetchTemplate } from "@/api/config/FetchTemplate";
import type { PaginationParams } from "@/api/config/types/audit";
import type {
  LogisticsFocusType,
  CreateLogisticsPayload,
  LogisticsResponse,
  LogisticsListResponse,
  RoomLogisticsResponse,
  LogisticsPipelineResponse,
  UpdateLogisticsStatusPayload,
  PaymentReleasePayload,
  PaymentConfirmPayload,
} from "@/api/config/types/logistic";

// ==========================================
// 1. INITIALIZE NEW SHIPMENT CONTRACT
// ==========================================
const CreateLogisticsFn = async ({ focus, data }: { focus: LogisticsFocusType; data: CreateLogisticsPayload }): Promise<LogisticsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<LogisticsResponse>(`${BaseApiUrl}/logistics/${focus}`, "POST", data);
};

export const CreateLogisticsOption = () => {
  return mutationOptions({
    mutationKey: ["CreateLogistics"] as const,
    mutationFn: (variables: { focus: LogisticsFocusType; data: CreateLogisticsPayload }) => CreateLogisticsFn(variables),
  });
};

// ==========================================
// 2. ADMINISTRATIVE GLOBAL LEDGER INDEX
// ==========================================
const GetLogisticsDashboardFn = async (params?: PaginationParams): Promise<LogisticsListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.offset !== undefined) queryParams.append("offset", params.offset.toString());

  const queryStr = queryParams.toString();
  const endpoint = `${BaseApiUrl}/logistics${queryStr ? `?${queryStr}` : ""}`;

  return await FetchTemplate<LogisticsListResponse>(endpoint, "GET");
};

export const GetLogisticsDashboardOption = (params?: PaginationParams) => {
  return queryOptions({
    queryKey: ["LogisticsDashboard", params] as const,
    queryFn: () => GetLogisticsDashboardFn(params),
  });
};

// ==========================================
// 3. LOOKUP SHIPMENT BY PRIMARY KEY ID
// ==========================================
const GetLogisticsByIdFn = async (id: string): Promise<LogisticsResponse> => {
  return await FetchTemplate<LogisticsResponse>(`${BaseApiUrl}/logistics/${id}`, "GET");
};

export const GetLogisticsByIdOption = (id: string) => {
  return queryOptions({
    queryKey: ["LogisticsItem", id] as const,
    queryFn: () => GetLogisticsByIdFn(id),
    enabled: !!id,
  });
};

// ==========================================
// 4. QUERY SHIPMENTS BY INVENTORY ITEM ID
// ==========================================
const GetLogisticsByItemFn = async (itemId: string): Promise<LogisticsListResponse> => {
  return await FetchTemplate<LogisticsListResponse>(`${BaseApiUrl}/logistics/item/${itemId}`, "GET");
};

export const GetLogisticsByItemOption = (itemId: string) => {
  return queryOptions({
    queryKey: ["ItemLogistics", itemId] as const,
    queryFn: () => GetLogisticsByItemFn(itemId),
    enabled: !!itemId,
  });
};

// ==========================================
// 5. LIST LOGISTICS PROFILES BY ROOM ID
// ==========================================
const GetLogisticsByRoomFn = async (roomId: string): Promise<RoomLogisticsResponse> => {
  return await FetchTemplate<RoomLogisticsResponse>(`${BaseApiUrl}/logistics/room/${roomId}`, "GET");
};

export const GetLogisticsByRoomOption = (roomId: string) => {
  return queryOptions({
    queryKey: ["RoomLogistics", roomId] as const,
    queryFn: () => GetLogisticsByRoomFn(roomId),
    enabled: !!roomId,
  });
};

// ==========================================
// 6. EXTRACT LIFE CYCLE TIMELINE DIAGNOSTIC
// ==========================================
const GetLogisticsPipelineFn = async (id: string): Promise<LogisticsPipelineResponse> => {
  return await FetchTemplate<LogisticsPipelineResponse>(`${BaseApiUrl}/logistics/${id}/pipeline`, "GET");
};

export const GetLogisticsPipelineOption = (id: string) => {
  return queryOptions({
    queryKey: ["LogisticsPipeline", id] as const,
    queryFn: () => GetLogisticsPipelineFn(id),
    enabled: !!id,
  });
};

// ==========================================
// 7. TRANSITION SHIPMENT STATE PHASE
// ==========================================
const UpdateLogisticsStatusFn = async ({ id, data }: { id: string; data: UpdateLogisticsStatusPayload }): Promise<LogisticsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<LogisticsResponse>(`${BaseApiUrl}/logistics/${id}/status`, "PATCH", data);
};

export const UpdateLogisticsStatusOption = () => {
  return mutationOptions({
    mutationKey: ["UpdateLogisticsStatus"] as const,
    mutationFn: (variables: { id: string; data: UpdateLogisticsStatusPayload }) => UpdateLogisticsStatusFn(variables),
  });
};

// ==========================================
// 8. INITIATE PAYMENT RELEASE (MULTIPART FORM)
// ==========================================
const ReleaseLogisticsPaymentFn = async ({ id, data }: { id: string; data: PaymentReleasePayload }): Promise<LogisticsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const formData = new FormData();
  formData.append("amount", data.amount);
  formData.append("rate", data.rate);
  if (data.proof) {
    formData.append("proof", data.proof);
  }

  return await FetchTemplate<LogisticsResponse>(
    `${BaseApiUrl}/logistics/${id}/payment-release`,
    "PATCH",
    formData
  );
};

export const ReleaseLogisticsPaymentOption = () => {
  return mutationOptions({
    mutationKey: ["ReleaseLogisticsPayment"] as const,
    mutationFn: (variables: { id: string; data: PaymentReleasePayload }) => ReleaseLogisticsPaymentFn(variables),
  });
};

// ==========================================
// 9. COUNTERPARTY VALIDATION CONFIRMATION LOOP
// ==========================================
const ConfirmLogisticsPaymentFn = async ({ id, data }: { id: string; data: PaymentConfirmPayload }): Promise<LogisticsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<LogisticsResponse>(`${BaseApiUrl}/logistics/${id}/payment-confirm`, "PATCH", data);
};

export const ConfirmLogisticsPaymentOption = () => {
  return mutationOptions({
    mutationKey: ["ConfirmLogisticsPayment"] as const,
    mutationFn: (variables: { id: string; data: PaymentConfirmPayload }) => ConfirmLogisticsPaymentFn(variables),
  });
};

// ==========================================
// 10. CANCEL ACTIVE LOGISTICS CONTRACT (ADMIN)
// ==========================================
const DeleteLogisticsFn = async (id: string): Promise<LogisticsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<LogisticsResponse>(`${BaseApiUrl}/logistics/${id}`, "DELETE");
};

export const DeleteLogisticsOption = () => {
  return mutationOptions({
    mutationKey: ["DeleteLogistics"] as const,
    mutationFn: (id: string) => DeleteLogisticsFn(id),
  });
};
