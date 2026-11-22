import type { LoginResponse, UserProfile } from "@/lib/api/contract";

export type { LoginResponse, UserProfile };

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
