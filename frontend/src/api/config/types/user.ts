import type { ApiUser } from "./auth";

// --- REQ/RES PAYLOAD PACKAGES ---
export interface UserHealthResponse {
  msg: string;
}

// --- GET /api/users/me ---
export interface GetMeResponse {
  msg: "success";
  ans: ApiUser;
}


export interface UserResponse {
  msg: "success";
  ans: ApiUser;
}

export interface UserListResponse {
  msg: "success";
  ans: ApiUser[];
}

export interface PatchUserProfilePayload {
  metadata: {
    profile: {
      name?: string;
      phone?: string;
      country?: string;
      website?: string;
      currency?: "USD" | "RWF" | "EUR";
    };
  };
}

export interface UpdateUserImagePayload {
  image: File;
}

export interface UpdateUserRolePayload {
  role: "user" | "admin" | "arbitrator";
}
