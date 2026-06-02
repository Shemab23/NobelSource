import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { BaseApiUrl } from "@/api/config/general";
import { FetchTemplate } from "@/api/config/FetchTemplate";
import type { PaginationParams } from "@/api/config/types/audit";
import type {
  MessageHealthResponse,
  MessageResponse,
  MessageListResponse,
  CreateMessagePayload,
  RespondMessagePayload,
} from "@/api/config/types/message";

// Helper to stringify limit and offset parameters
const appendPagination = (params?: PaginationParams): string => {
  if (!params) return "";
  const search = new URLSearchParams();
  if (params.limit !== undefined) search.append("limit", params.limit.toString());
  if (params.offset !== undefined) search.append("offset", params.offset.toString());
  const str = search.toString();
  return str ? `?${str}` : "";
};

// ==========================================
// 1. PING MESSAGE GATEWAY HEALTH
// ==========================================
const GetMessageHealthFn = async (): Promise<MessageHealthResponse> => {
  return await FetchTemplate<MessageHealthResponse>(`${BaseApiUrl}/messages/in`, "GET");
};

export const GetMessageHealthOption = () => {
  return queryOptions({
    queryKey: ["MessageHealth"] as const,
    queryFn: () => GetMessageHealthFn(),
  });
};

// ==========================================
// 2. FETCH CURRENT USER'S MESSAGES FEED
// ==========================================
const GetMyMessagesFn = async (params?: PaginationParams): Promise<MessageListResponse> => {
  const query = appendPagination(params);
  return await FetchTemplate<MessageListResponse>(`${BaseApiUrl}/messages/mymessages${query}`, "GET");
};

export const GetMyMessagesOption = (params?: PaginationParams) => {
  return queryOptions({
    queryKey: ["MyMessages", params] as const,
    queryFn: () => GetMyMessagesFn(params),
  });
};

// ==========================================
// 3. GLOBAL SNAPSHOT INDEX (ADMIN)
// ==========================================
const GetAdminAllMessagesFn = async (params?: PaginationParams): Promise<MessageListResponse> => {
  const query = appendPagination(params);
  return await FetchTemplate<MessageListResponse>(`${BaseApiUrl}/messages/admin/all${query}`, "GET");
};

export const GetAdminAllMessagesOption = (params?: PaginationParams) => {
  return queryOptions({
    queryKey: ["AdminAllMessages", params] as const,
    queryFn: () => GetAdminAllMessagesFn(params),
  });
};

// ==========================================
// 4. PUBLISH FRESH COMMUNICATION UNIT
// ==========================================
const CreateMessageFn = async (data: CreateMessagePayload): Promise<MessageResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<MessageResponse>(`${BaseApiUrl}/messages`, "POST", data);
};

export const CreateMessageOption = () => {
  return mutationOptions({
    mutationKey: ["CreateMessage"] as const,
    mutationFn: (data: CreateMessagePayload) => CreateMessageFn(data),
  });
};

// ==========================================
// 5. APPEND CONTEXTUAL REPLY STRING LAYER
// ==========================================
const RespondMessageFn = async ({ id, data }: { id: string; data: RespondMessagePayload }): Promise<MessageResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<MessageResponse>(`${BaseApiUrl}/messages/${id}/respond`, "PATCH", data);
};

export const RespondMessageOption = () => {
  return mutationOptions({
    mutationKey: ["RespondMessage"] as const,
    mutationFn: (variables: { id: string; data: RespondMessagePayload }) => RespondMessageFn(variables),
  });
};

// ==========================================
// 6. FETCH CONVERSATION ENTRIES BY ROOM ID
// ==========================================
const GetMessagesByRoomFn = async (roomId: string, params?: PaginationParams): Promise<MessageListResponse> => {
  const query = appendPagination(params);
  return await FetchTemplate<MessageListResponse>(`${BaseApiUrl}/messages/${roomId}/room${query}`, "GET");
};

export const GetMessagesByRoomOption = (roomId: string, params?: PaginationParams) => {
  return queryOptions({
    queryKey: ["RoomMessages", roomId, params] as const,
    queryFn: () => GetMessagesByRoomFn(roomId, params),
    enabled: !!roomId,
  });
};

// ==========================================
// 7. PULL MUTUAL PRIVATE CHAT RECOGNITION
// ==========================================
const GetConversationWithTargetFn = async (targetId: string, params?: PaginationParams): Promise<MessageListResponse> => {
  const query = appendPagination(params);
  return await FetchTemplate<MessageListResponse>(`${BaseApiUrl}/messages/conversation/${targetId}${query}`, "GET");
};

export const GetConversationWithTargetOption = (targetId: string, params?: PaginationParams) => {
  return queryOptions({
    queryKey: ["PrivateConversation", targetId, params] as const,
    queryFn: () => GetConversationWithTargetFn(targetId, params),
    enabled: !!targetId,
  });
};

// ==========================================
// 8. SOFT-DELETE TARGETED MESSAGE (ADMIN)
// ==========================================
const DeleteMessageFn = async (id: string): Promise<MessageResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<MessageResponse>(`${BaseApiUrl}/messages/${id}`, "DELETE");
};

export const DeleteMessageOption = () => {
  return mutationOptions({
    mutationKey: ["DeleteMessage"] as const,
    mutationFn: (id: string) => DeleteMessageFn(id),
  });
};
