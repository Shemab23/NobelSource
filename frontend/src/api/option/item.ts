import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { BaseApiUrl } from "@/api/config/general";
import { FetchTemplate } from "@/api/config/FetchTemplate";
import type { PaginationParams } from "@/api/config/types/audit";
import type {
  ItemResponse,
  ItemListResponse,
  ItemFocusType,
  CreateItemPayload,
  UpdateItemAmountPayload,
} from "@/api/config/types/item";

// ==========================================
// 1. GET ALL ITEMS (ADMIN DASHBOARD INDEX)
// ==========================================
const GetItemsDashboardFn = async (params?: PaginationParams): Promise<ItemListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.offset !== undefined) queryParams.append("offset", params.offset.toString());

  const queryStr = queryParams.toString();
  const endpoint = `${BaseApiUrl}/items${queryStr ? `?${queryStr}` : ""}`;

  return await FetchTemplate<ItemListResponse>(endpoint, "GET");
};

export const GetItemsDashboardOption = (params?: PaginationParams) => {
  return queryOptions({
    queryKey: ["ItemsDashboard", params] as const,
    queryFn: () => GetItemsDashboardFn(params),
  });
};

// ==========================================
// 2. INITIALIZE NEW INVENTORY ITEM
// ==========================================
const CreateItemFn = async ({ focus, data }: { focus: ItemFocusType; data: CreateItemPayload }): Promise<ItemResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<ItemResponse>(`${BaseApiUrl}/items/${focus}`, "POST", data);
};

export const CreateItemOption = () => {
  return mutationOptions({
    mutationKey: ["CreateItem"] as const,
    mutationFn: (variables: { focus: ItemFocusType; data: CreateItemPayload }) => CreateItemFn(variables),
  });
};

// ==========================================
// 3. FETCH ALL ITEMS ASSOCIATED WITH A ROOM
// ==========================================
const GetItemsByRoomFn = async (roomId: string): Promise<ItemListResponse> => {
  return await FetchTemplate<ItemListResponse>(`${BaseApiUrl}/items/room/${roomId}`, "GET");
};

export const GetItemsByRoomOption = (roomId: string) => {
  return queryOptions({
    queryKey: ["RoomItems", roomId] as const,
    queryFn: () => GetItemsByRoomFn(roomId),
    enabled: !!roomId,
  });
};

// ==========================================
// 4. READ INDIVIDUAL INVENTORY RECORD BY ID
// ==========================================
const GetItemByIdFn = async (id: string): Promise<ItemResponse> => {
  return await FetchTemplate<ItemResponse>(`${BaseApiUrl}/items/${id}`, "GET");
};

export const GetItemByIdOption = (id: string) => {
  return queryOptions({
    queryKey: ["Item", id] as const,
    queryFn: () => GetItemByIdFn(id),
    enabled: !!id,
  });
};

// ==========================================
// 5. UPDATE STOCK QUANTITY COUNTS
// ==========================================
const UpdateItemAmountFn = async ({ id, data }: { id: string; data: UpdateItemAmountPayload }): Promise<ItemResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<ItemResponse>(`${BaseApiUrl}/items/${id}/amount`, "PATCH", data);
};

export const UpdateItemAmountOption = () => {
  return mutationOptions({
    mutationKey: ["UpdateItemAmount"] as const,
    mutationFn: (variables: { id: string; data: UpdateItemAmountPayload }) => UpdateItemAmountFn(variables),
  });
};
