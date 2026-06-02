import { mutationOptions } from "@tanstack/react-query";
import type {
  Register,
  RegisterResponse,
  Login,
  LoginResponse,
  LogoutResponse
} from "@/api/config/types/auth";
import { BaseApiUrl } from "@/api/config/general";
import { FetchTemplate } from "@/api/config/FetchTemplate";

// ==========================================
// 1. REGISTER ENDPOINT
// ==========================================
const RegisterFn = async (data: Register): Promise<RegisterResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const formData = new FormData();

  // Basic fields
  formData.append("email", data.email);
  if (data.password) formData.append("password", data.password);
  formData.append("registration_number", data.registration_number);

  // Stringify metadata objects
  formData.append("profile", JSON.stringify(data.metadata.profile));

  if (data.permission_keys) {
    formData.append("permission_names", JSON.stringify(data.permission_keys));
  }

  // File: Profile Image
  if (data.display_image instanceof File) {
    formData.append("display_image", data.display_image);
  }

  // Files: Permissions
  // FIX: Access nested metadata.permissions and explicitly type the file argument
  // Files: Permissions
if (data.permission_files) {
  data.permission_files.forEach((file: File) => {
    formData.append("permissions", file);
  });
}

  return await FetchTemplate<RegisterResponse>(
    `${BaseApiUrl}/auth/register`,
    "POST",
    formData
  );
};

export const RegisterOption = () => {
  return mutationOptions({
    mutationKey: ["Register"] as const,
    mutationFn: (data: Register) => RegisterFn(data),
  });
};

// ==========================================
// 2. LOGIN ENDPOINT
// ==========================================
const LoginFn = async (data: Login): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // realistic delay
  return await FetchTemplate<LoginResponse>(
    `${BaseApiUrl}/auth/login`,
    "POST",
    data
  );
};

export const LoginOption = () => {
  return mutationOptions({
    mutationKey: ["Login"] as const,
    mutationFn: (data: Login) => LoginFn(data),
  });
};

// ==========================================
// 3. LOGOUT ENDPOINT
// ==========================================
const LogoutFn = async (): Promise<LogoutResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // realistic delay
  return await FetchTemplate<LogoutResponse>(
    `${BaseApiUrl}/auth/logout`,
    "POST"
  );
};

export const LogoutOption = () => {
  return mutationOptions({
    mutationKey: ["Logout"] as const,
    mutationFn: () => LogoutFn(),
  });
};
