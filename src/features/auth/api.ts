import { apiClient, type AuthResponse } from "@/lib/api";
import type { RegisterRequest } from "./types";

/**
 * Đăng ký tài khoản USER mới
 * Endpoint: POST /api/v1/auth/register
 */
export async function registerUser(
  body: RegisterRequest
): Promise<AuthResponse> {
  return apiClient.post<unknown, AuthResponse>("/auth/register", body);
}

