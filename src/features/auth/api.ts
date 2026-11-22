import { apiRequest } from "@/lib/api/client";
import type { LoginResponse, MessageResponse, UserProfile } from "@/lib/api/contract";
import type { LoginRequest, RegisterRequest } from "./types";

export async function registerUser(body: RegisterRequest): Promise<UserProfile> {
  return apiRequest<UserProfile>({
    method: "POST",
    url: "/auth/register",
    data: body,
  });
}

export async function loginUser(body: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>({
    method: "POST",
    url: "/auth/login",
    data: body,
  });
}

export async function logoutUser(): Promise<MessageResponse> {
  return apiRequest<MessageResponse>({
    method: "POST",
    url: "/auth/logout",
  });
}
