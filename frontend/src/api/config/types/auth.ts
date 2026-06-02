// --- SHARED ENTITIES ---
export interface ApiSession {
  id: string;
  entity_id: string;
  token: string;
  created_at: string;
  expires_at: string;
}

export interface ApiProfile {
  name: string;
  image?: string;
  phone?: string;
  country?: string;
  website?: string;
  currency?: "USD" | "RWF" | "EUR";
}

export interface ApiPermission {
  right: string;
  status: "pending" | "authorised" | "denied";
  by: string;
  document: string;
}

export interface ApiUser {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  email: string;
  registration_number: string;
  role: "user" | "admin" | "arbitrator";
  metadata: {
    profile: ApiProfile;
    rating?: number;
    rating_count?: number;
    permissions: ApiPermission[];
  };
}

export interface ApiEntity {
  id: string;
  type: "user";
  created_at: string;
  updated_at: string | null;
}

// --- POST /register ---
// src/types/auth.ts

export type PermissionStatus = "pending" | "authorised" | "denied";

export interface Permission {
  right: string;
  status: PermissionStatus;
  by: string;
  document: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  country: string;
  website: string;
  currency: string;
  image?: string; // Added to handle the Cloudinary URL
}

export interface Register {
  email: string;
  password?: string;
  registration_number: string;
  metadata: {
    profile: UserProfile;
    permissions: Permission[]; // Contains status, right, etc.
  };
  permission_keys?: string[];
  permission_files?: File[]; // ADD THIS: For the actual file uploads
  display_image?: File | string;
}
export interface RegisterResponse {
  msg: "success";
  ans: {
    entity: ApiEntity;
    user: ApiUser;
    session: {
      msg: "success";
      ans: ApiSession;
    };
  };
}

// --- POST /login ---
export interface Login {
  email: string;
  password: string;
}

export interface LoginResponse {
  msg: "success";
  ans: {
    user: ApiUser;
    session: {
      msg: "success";
      ans: ApiSession;
    };
  };
}

// --- POST /logout ---
export interface LogoutResponse {
  msg: "success";
  ans: {
    id: string;
    entity_id: string;
    token: string;
    created_at: string;
    expires_at: string;
    is_active: boolean;
  };
}
