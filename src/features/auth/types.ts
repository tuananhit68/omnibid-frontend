import type { AuthResponse } from "@/lib/api/types";

export type { AuthResponse };

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

