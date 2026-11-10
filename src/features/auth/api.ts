import { apiClient, type AuthResponse } from "@/lib/api";
import type { LoginRequest, RegisterRequest } from "./types";

/**
 * Đăng ký tài khoản USER mới
 * Endpoint: POST /api/v1/auth/register
 */
export async function registerUser(
  body: RegisterRequest
): Promise<AuthResponse> {
  return apiClient.post<unknown, AuthResponse>("/auth/register", body);
}

/**
 * Đăng nhập lấy JWT
 * Endpoint: POST /api/v1/auth/login
 */
export async function loginUser(body: LoginRequest): Promise<AuthResponse> {
  return apiClient.post<unknown, AuthResponse>("/auth/login", body);
}

