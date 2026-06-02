import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { BaseApiUrl } from "@/api/config/general";
import { FetchTemplate } from "@/api/config/FetchTemplate";
import type { PaginationParams } from "@/api/config/types/audit";
import type {
  EntityHealthResponse,
  GetEntityResponse,
  EntityExistsResponse,
  EntityTypeCheckResponse,
  CreateEntityPayload,
  GetAllEntitiesResponse,
  UpdateEntityResponse,
} from "@/api/config/types/entity";

// ==========================================
// 1. GET HEALTH CHECK (DEBUG ENTRY POINT)
// ==========================================
const GetEntityHealthFn = async (): Promise<EntityHealthResponse> => {
  return await FetchTemplate<EntityHealthResponse>(`${BaseApiUrl}/entities/in`, "GET");
};

export const GetEntityHealthOption = () => {
  return queryOptions({
    queryKey: ["EntityHealth"] as const,
    queryFn: () => GetEntityHealthFn(),
  });
};

// ==========================================
// 2. GET ENTITY BY ID
// ==========================================
const GetEntityByIdFn = async (id: string): Promise<GetEntityResponse> => {
  return await FetchTemplate<GetEntityResponse>(`${BaseApiUrl}/entities/${id}`, "GET");
};

export const GetEntityByIdOption = (id: string) => {
  return queryOptions({
    queryKey: ["Entity", id] as const,
    queryFn: () => GetEntityByIdFn(id),
    enabled: !!id,
  });
};

// ==========================================
// 3. CHECK IF ENTITY EXISTS
// ==========================================
const CheckEntityExistsFn = async (id: string): Promise<EntityExistsResponse> => {
  return await FetchTemplate<EntityExistsResponse>(`${BaseApiUrl}/entities/${id}/exists`, "GET");
};

export const CheckEntityExistsOption = (id: string) => {
  return queryOptions({
    queryKey: ["EntityExists", id] as const,
    queryFn: () => CheckEntityExistsFn(id),
    enabled: !!id,
  });
};

// ==========================================
// 4. CHECK ENTITY TYPE CLASSIFICATION
// ==========================================
const CheckEntityTypeFn = async (id: string, type: string): Promise<EntityTypeCheckResponse> => {
  return await FetchTemplate<EntityTypeCheckResponse>(
    `${BaseApiUrl}/entities/${id}/type-check?type=${encodeURIComponent(type)}`,
    "GET"
  );
};

export const CheckEntityTypeOption = (id: string, type: string) => {
  return queryOptions({
    queryKey: ["EntityTypeCheck", id, type] as const,
    queryFn: () => CheckEntityTypeFn(id, type),
    enabled: !!id && !!type,
  });
};

// ==========================================
// 5. CREATE NEW ENTITY CONTAINER (ADMIN)
// ==========================================
const CreateEntityFn = async (data: CreateEntityPayload): Promise<GetEntityResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<GetEntityResponse>(`${BaseApiUrl}/entities/admin`, "POST", data);
};

export const CreateEntityOption = () => {
  return mutationOptions({
    mutationKey: ["CreateEntity"] as const,
    mutationFn: (data: CreateEntityPayload) => CreateEntityFn(data),
  });
};

// ==========================================
// 6. GET ALL ENTITY CONTAINERS (ADMIN)
// ==========================================
const GetAdminAllEntitiesFn = async (params?: PaginationParams): Promise<GetAllEntitiesResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.offset !== undefined) queryParams.append("offset", params.offset.toString());

  const queryStr = queryParams.toString();
  const endpoint = `${BaseApiUrl}/entities/admin/all${queryStr ? `?${queryStr}` : ""}`;

  return await FetchTemplate<GetAllEntitiesResponse>(endpoint, "GET");
};

export const GetAdminAllEntitiesOption = (params?: PaginationParams) => {
  return queryOptions({
    queryKey: ["AdminAllEntities", params] as const,
    queryFn: () => GetAdminAllEntitiesFn(params),
  });
};

// ==========================================
// 7. UPDATE ENTITY CLASSIFICATION (ADMIN)
// ==========================================
const UpdateEntityFn = async ({ id, data }: { id: string; data: CreateEntityPayload }): Promise<UpdateEntityResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<UpdateEntityResponse>(`${BaseApiUrl}/entities/admin/${id}`, "PATCH", data);
};

export const UpdateEntityOption = () => {
  return mutationOptions({
    mutationKey: ["UpdateEntity"] as const,
    mutationFn: (variables: { id: string; data: CreateEntityPayload }) => UpdateEntityFn(variables),
  });
};

// ==========================================
// 8. SOFT-DELETE ENTITY (ADMIN)
// ==========================================
const DeleteEntityFn = async (id: string): Promise<GetEntityResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<GetEntityResponse>(`${BaseApiUrl}/entities/admin/${id}`, "DELETE");
};

export const DeleteEntityOption = () => {
  return mutationOptions({
    mutationKey: ["DeleteEntity"] as const,
    mutationFn: (id: string) => DeleteEntityFn(id),
  });
};
