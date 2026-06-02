import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { BaseApiUrl } from "@/api/config/general";
import { FetchTemplate } from "@/api/config/FetchTemplate";
import type { PaginationParams } from "@/api/config/types/audit";
import type {
  UserHealthResponse,
  UserResponse,
  UserListResponse,
  PatchUserProfilePayload,
  UpdateUserImagePayload,
  UpdateUserRolePayload,
  GetMeResponse,
} from "@/api/config/types/user";

// ==========================================
// 1. PING SERVICE OPERATIONAL HANDSHAKE
// ==========================================
const GetUserHealthFn = async (): Promise<UserHealthResponse> => {
  return await FetchTemplate<UserHealthResponse>(`${BaseApiUrl}/users/in`, "GET");
};

export const GetUserHealthOption = () => {
  return queryOptions({
    queryKey: ["UserHealth"] as const,
    queryFn: () => GetUserHealthFn(),
  });
};

// ==========================================
// 2. FETCH UN-DELETED IDENTITY RECORD BY ID
// ==========================================
const GetUserByIdFn = async (id: string): Promise<UserResponse> => {
  return await FetchTemplate<UserResponse>(`${BaseApiUrl}/users/${id}`, "GET");
};

export const GetUserByIdOption = (id: string) => {
  return queryOptions({
    queryKey: ["UserItem", id] as const,
    queryFn: () => GetUserByIdFn(id),
    enabled: !!id,
  });
};

// ==========================================
// 3. FETCH DIRECTORY LISTING WITH PAGINATION
// ==========================================
const GetUsersDirectoryFn = async (params?: PaginationParams): Promise<UserListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.offset !== undefined) queryParams.append("offset", params.offset.toString());

  const queryStr = queryParams.toString();
  const endpoint = `${BaseApiUrl}/users${queryStr ? `?${queryStr}` : ""}`;

  return await FetchTemplate<UserListResponse>(endpoint, "GET");
};

export const GetUsersDirectoryOption = (params?: PaginationParams) => {
  return queryOptions({
    queryKey: ["UsersDirectory", params] as const,
    queryFn: () => GetUsersDirectoryFn(params),
  });
};

// ==========================================
// 4. SECURE SELF PROFILE PARAMETERLESS UPDATE
// ==========================================
const PatchUserProfileFn = async (data: PatchUserProfilePayload): Promise<UserResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<UserResponse>(`${BaseApiUrl}/users/profile/update`, "PATCH", data);
};

export const PatchUserProfileOption = () => {
  return mutationOptions({
    mutationKey: ["PatchUserProfile"] as const,
    mutationFn: (data: PatchUserProfilePayload) => PatchUserProfileFn(data),
  });
};

// ==========================================
// 5. PROFILE AVATAR UPDATE (MULTIPART FORM)
// ==========================================
const UpdateUserImageFn = async (data: UpdateUserImagePayload): Promise<UserResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const formData = new FormData();
  formData.append("image", data.image);

  return await FetchTemplate<UserResponse>(
    `${BaseApiUrl}/users/profile/image`,
    "PUT",
    formData
  );
};

export const UpdateUserImageOption = () => {
  return mutationOptions({
    mutationKey: ["UpdateUserImage"] as const,
    mutationFn: (data: UpdateUserImagePayload) => UpdateUserImageFn(data),
  });
};

// ==========================================
// 6. MUTATE ACCOUNT ACCOUNT ROLES (ADMIN)
// ==========================================
const UpdateUserRoleFn = async ({ id, data }: { id: string; data: UpdateUserRolePayload }): Promise<UserResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<UserResponse>(`${BaseApiUrl}/users/${id}/role`, "PATCH", data);
};

export const UpdateUserRoleOption = () => {
  return mutationOptions({
    mutationKey: ["UpdateUserRole"] as const,
    mutationFn: (variables: { id: string; data: UpdateUserRolePayload }) => UpdateUserRoleFn(variables),
  });
};

// ==========================================
// 7. OWNER-ONLY PROFILE SOFT DELETION
// ==========================================
const SoftDeleteUserFn = async (id: string): Promise<UserResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<UserResponse>(`${BaseApiUrl}/users/${id}`, "DELETE");
};

export const SoftDeleteUserOption = () => {
  return mutationOptions({
    mutationKey: ["SoftDeleteUser"] as const,
    mutationFn: (id: string) => SoftDeleteUserFn(id),
  });
};

// ==========================================
// 8. GET CURRENT AUTHENTICATED USER SESSION
// ==========================================
const GetMeFn = async (): Promise<GetMeResponse> => {
  return await FetchTemplate<GetMeResponse>(`${BaseApiUrl}/users/me`, "GET");
};

export const GetMeOption = () => {
  return queryOptions({
    queryKey: ["CurrentUserSession"] as const,
    queryFn: () => GetMeFn(),
    retry: false,            // Prevents infinite looping back to the server when unauthenticated
    staleTime: 1000 * 60 * 5, // Data stays fresh inside cache for 5 minutes before re-validating
  });
};
