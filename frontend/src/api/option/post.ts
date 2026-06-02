import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { BaseApiUrl } from "@/api/config/general";
import { FetchTemplate } from "@/api/config/FetchTemplate";
import type {
  PostHealthResponse,
  PostResponse,
  PostListResponse,
  PostFeedParams,
  PostActiveWindowParams,
  PostSearchParams,
  CreatePostPayload,
  PatchPostPayload,
} from "@/api/config/types/post";

// ==========================================
// 1. PING POSTING API LAYER HEALTH
// ==========================================
const GetPostHealthFn = async (): Promise<PostHealthResponse> => {
  return await FetchTemplate<PostHealthResponse>(`${BaseApiUrl}/posts/in`, "GET");
};

export const GetPostHealthOption = () => {
  return queryOptions({
    queryKey: ["PostHealth"] as const,
    queryFn: () => GetPostHealthFn(),
  });
};

// ==========================================
// 2. FETCH PUBLIC GLOBAL ACTIVE FEED
// ==========================================
const GetPostsFeedFn = async (params?: PostFeedParams): Promise<PostListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.offset !== undefined) queryParams.append("offset", params.offset.toString());

  const queryStr = queryParams.toString();
  const endpoint = `${BaseApiUrl}/posts${queryStr ? `?${queryStr}` : ""}`;

  return await FetchTemplate<PostListResponse>(endpoint, "GET");
};

export const GetPostsFeedOption = (params?: PostFeedParams) => {
  return queryOptions({
    queryKey: ["PostsFeed", params] as const,
    queryFn: () => GetPostsFeedFn(params),
  });
};

// ==========================================
// 3. FETCH WINDOW LIST OF ACTIVE POSTS
// ==========================================
const GetActivePostsWindowFn = async (params?: PostActiveWindowParams): Promise<PostListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());

  const queryStr = queryParams.toString();
  const endpoint = `${BaseApiUrl}/posts/active${queryStr ? `?${queryStr}` : ""}`;

  return await FetchTemplate<PostListResponse>(endpoint, "GET");
};

export const GetActivePostsWindowOption = (params?: PostActiveWindowParams) => {
  return queryOptions({
    queryKey: ["ActivePostsWindow", params] as const,
    queryFn: () => GetActivePostsWindowFn(params),
  });
};

// ==========================================
// 4. TEXT SEARCH COLUMNS BY KEYWORD (ILIKE)
// ==========================================
const SearchPostsFn = async (params: PostSearchParams): Promise<PostListResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("q", params.q);
  if (params.limit !== undefined) queryParams.append("limit", params.limit.toString());

  return await FetchTemplate<PostListResponse>(`${BaseApiUrl}/posts/search?${queryParams.toString()}`, "GET");
};

export const SearchPostsOption = (params: PostSearchParams) => {
  return queryOptions({
    queryKey: ["SearchPosts", params] as const,
    queryFn: () => SearchPostsFn(params),
    enabled: !!params.q,
  });
};

// ==========================================
// 5. GLOBAL SNAPSHOT FEED INDEX (ADMIN)
// ==========================================
const GetAdminAllPostsFn = async (params?: PostFeedParams): Promise<PostListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.offset !== undefined) queryParams.append("offset", params.offset.toString());

  const queryStr = queryParams.toString();
  const endpoint = `${BaseApiUrl}/posts/admin/all${queryStr ? `?${queryStr}` : ""}`;

  return await FetchTemplate<PostListResponse>(endpoint, "GET");
};

export const GetAdminAllPostsOption = (params?: PostFeedParams) => {
  return queryOptions({
    queryKey: ["AdminAllPosts", params] as const,
    queryFn: () => GetAdminAllPostsFn(params),
  });
};

// ==========================================
// 6. PUBLISH LISTING (MULTIPART FORM DATA)
// ==========================================
const CreatePostFn = async (data: CreatePostPayload): Promise<PostResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("body", data.body);
  if (data.description) formData.append("description", data.description);
  formData.append("unit", data.unit);
  formData.append("type", data.type);
  formData.append("price_cents", data.price_cents.toString());
  formData.append("currency", data.currency);
  formData.append("location", data.location);
  formData.append("category", data.category);
  if (data.tags) formData.append("tags", data.tags);
  if (data.status) formData.append("status", data.status);

  if (data.media) {
    data.media.forEach((file) => {
      formData.append("media", file);
    });
  }

  return await FetchTemplate<PostResponse>(`${BaseApiUrl}/posts`, "POST", formData);
};

export const CreatePostOption = () => {
  return mutationOptions({
    mutationKey: ["CreatePost"] as const,
    mutationFn: (data: CreatePostPayload) => CreatePostFn(data),
  });
};

// ==========================================
// 7. FETCH SINGLE TARGET POST BY UUID KEY
// ==========================================
const GetPostByIdFn = async (id: string): Promise<PostResponse> => {
  return await FetchTemplate<PostResponse>(`${BaseApiUrl}/posts/${id}`, "GET");
};

export const GetPostByIdOption = (id: string) => {
  return queryOptions({
    queryKey: ["PostItem", id] as const,
    queryFn: () => GetPostByIdFn(id),
    enabled: !!id,
  });
};

// ==========================================
// 8. UPDATE FIELDS OF A POST DYNAMICALLY
// ==========================================
const PatchPostFn = async ({ id, data }: { id: string; data: PatchPostPayload }): Promise<PostResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<PostResponse>(`${BaseApiUrl}/posts/${id}`, "PATCH", data);
};

export const PatchPostOption = () => {
  return mutationOptions({
    mutationKey: ["PatchPost"] as const,
    mutationFn: (variables: { id: string; data: PatchPostPayload }) => PatchPostFn(variables),
  });
};

// ==========================================
// 9. TRANSITION LISTING TO EXPIRED ARCHIVE STATE
// ==========================================
const ArchivePostFn = async (id: string): Promise<PostResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<PostResponse>(`${BaseApiUrl}/posts/${id}/archive`, "PATCH");
};

export const ArchivePostOption = () => {
  return mutationOptions({
    mutationKey: ["ArchivePost"] as const,
    mutationFn: (id: string) => ArchivePostFn(id),
  });
};

// ==========================================
// 10. FLAG RECORD CONTEXT AS SOFT-DELETED
// ==========================================
const SoftDeletePostFn = async (id: string): Promise<PostResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<PostResponse>(`${BaseApiUrl}/posts/${id}/soft-delete`, "PATCH");
};

export const SoftDeletePostOption = () => {
  return mutationOptions({
    mutationKey: ["SoftDeletePost"] as const,
    mutationFn: (id: string) => SoftDeletePostFn(id),
  });
};

// ==========================================
// 11. HARD DESTRUCTIVE REMOVAL FROM STORAGE (ADMIN)
// ==========================================
const HardDeletePostFn = async (id: string): Promise<PostResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return await FetchTemplate<PostResponse>(`${BaseApiUrl}/posts/${id}`, "DELETE");
};

export const HardDeletePostOption = () => {
  return mutationOptions({
    mutationKey: ["HardDeletePost"] as const,
    mutationFn: (id: string) => HardDeletePostFn(id),
  });
};
