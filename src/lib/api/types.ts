/**
 * OmniBid - Types chuẩn cho API Response và Phân trang
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  errorCode?: string;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  role: "USER" | "ADMIN";
}
