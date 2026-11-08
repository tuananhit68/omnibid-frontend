import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getStoredToken, clearAuthSession } from "./auth-storage";
import { getErrorMessage } from "../errors";
import type { ApiResponse } from "./types";

export class ApiError extends Error {
  status: number;
  errorCode: string;
  fieldErrors?: Record<string, string>;
  data?: unknown;

  constructor(status: number, errorCode: string, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
    this.data = data;
    if (
      errorCode === "VALIDATION_ERROR" &&
      typeof data === "object" &&
      data !== null
    ) {
      this.fieldErrors = data as Record<string, string>;
    }
  }
}

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Gắn token Bearer
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Chuẩn hoá envelope & lỗi
apiClient.interceptors.response.use(
  (response) => {
    const resData = response.data as ApiResponse;
    // Kiểm tra envelope { success, data, ... }
    if (resData && typeof resData === "object" && "success" in resData) {
      if (resData.success === false) {
        const errorCode = resData.errorCode || "INTERNAL_ERROR";
        const message = getErrorMessage(errorCode, resData.message);
        throw new ApiError(response.status, errorCode, message, resData.data);
      }
      return resData.data;
    }
    return response.data;
  },
  (error: AxiosError<ApiResponse>) => {
    const status = error.response?.status || 500;
    const resData = error.response?.data;

    // 401 Unauthorized: Chuyển hướng đăng nhập
    if (status === 401) {
      clearAuthSession();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        const currentPath = window.location.pathname + window.location.search;
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    const errorCode = resData?.errorCode || (status === 401 ? "UNAUTHORIZED" : "INTERNAL_ERROR");
    const message = getErrorMessage(errorCode, resData?.message || error.message);

    return Promise.reject(
      new ApiError(status, errorCode, message, resData?.data)
    );
  }
);
