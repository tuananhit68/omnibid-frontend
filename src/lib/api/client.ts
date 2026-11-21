import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { getErrorMessage, isErrorCode, type ErrorCode } from "@/lib/errors";
import { clearSession, getAccessToken } from "@/lib/auth/session";
import { validateEndpointResponse } from "./contract";
import { ApiError, type ApiFailure, type ApiSuccess } from "./types";

export const API_MODE =
  process.env.NEXT_PUBLIC_API_MODE === "mock" ? "mock" : "live";

export const IS_MOCK_MODE = API_MODE === "mock";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const isBrowser = () => typeof window !== "undefined";

function isLoginEndpoint(url?: string): boolean {
  if (!url) return false;
  const path = url.split("?")[0];
  return path === "/auth/login" || path.endsWith("/auth/login");
}

function isLogoutEndpoint(url?: string): boolean {
  if (!url) return false;
  const path = url.split("?")[0];
  return path === "/auth/logout" || path.endsWith("/auth/logout");
}

function redirectToLogin(query: string) {
  if (!isBrowser()) return;
  const pathname = window.location.pathname;
  if (pathname.startsWith("/login")) return;
  window.location.href = `/login?${query}`;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

// Gắn adapter mock động khi chạy ở chế độ mock
if (IS_MOCK_MODE) {
  apiClient.defaults.adapter = async (config) => {
    const { mockAdapter } = await import("@/mocks/adapter");
    return mockAdapter(config);
  };
}

// Request interceptor: gắn Bearer token; giữ nguyên boundary khi gửi FormData
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
      }
    } else if (config.headers && !config.headers["Content-Type"] && config.data !== undefined) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: unwrap envelope v4, xử lý 401/403 toàn cục, chuẩn hóa ApiError
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiSuccess<unknown> | ApiFailure>) => {
    const body = response.data;

    if (body && typeof body === "object" && "success" in body) {
      if (body.success === false) {
        const failure = body as ApiFailure;
        const code: ErrorCode = isErrorCode(failure.error?.code)
          ? failure.error.code
          : "INTERNAL_ERROR";
        const details = failure.error?.details;
        const fieldErrors =
          code === "VALIDATION_ERROR" &&
          details &&
          typeof details.fields === "object" &&
          details.fields !== null
            ? (details.fields as Record<string, string>)
            : undefined;

        throw new ApiError({
          status: response.status,
          code,
          message: getErrorMessage(code, failure.error?.message),
          details,
          fieldErrors,
        });
      }

      if (!IS_MOCK_MODE) {
        validateEndpointResponse(response.config.method, response.config.url, body.data);
      }

      return response;
    }

    return response;
  },
  (error: AxiosError<ApiFailure>) => {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    }

    if (!error.response) {
      return Promise.reject(
        new ApiError({
          status: 0,
          code: "NETWORK_ERROR",
          message: getErrorMessage("NETWORK_ERROR"),
        })
      );
    }

    const { status, data } = error.response;
    const rawCode = data?.error?.code;
    const code: ErrorCode = isErrorCode(rawCode)
      ? rawCode
      : status === 401
        ? "UNAUTHORIZED"
        : status === 403
          ? "FORBIDDEN"
          : status === 404
            ? "NOT_FOUND"
            : status === 413
              ? "PAYLOAD_TOO_LARGE"
              : status === 429
                ? "TOO_MANY_REQUESTS"
                : "INTERNAL_ERROR";

    const details = data?.error?.details;
    const fieldErrors =
      code === "VALIDATION_ERROR" &&
      details &&
      typeof details.fields === "object" &&
      details.fields !== null
        ? (details.fields as Record<string, string>)
        : undefined;

    const url = error.config?.url;

    // 403 ACCOUNT_BANNED ở bất kỳ request nào → xóa phiên & về /login?reason=banned
    if (status === 403 && code === "ACCOUNT_BANNED") {
      clearSession();
      if (!isLoginEndpoint(url)) {
        redirectToLogin("reason=banned");
      }
    }

    // 401 UNAUTHORIZED → xóa phiên & về /login?redirect= (ngoại lệ: POST /auth/login, POST /auth/logout)
    if (status === 401 && !isLoginEndpoint(url) && !isLogoutEndpoint(url)) {
      clearSession();
      if (isBrowser()) {
        const currentPath = window.location.pathname + window.location.search;
        redirectToLogin(`redirect=${encodeURIComponent(currentPath)}`);
      }
    }

    const message =
      status === 401 && isLoginEndpoint(url)
        ? "Email hoặc mật khẩu không đúng"
        : getErrorMessage(code, data?.error?.message);

    return Promise.reject(
      new ApiError({
        status,
        code,
        message,
        details,
        fieldErrors,
      })
    );
  }
);

/**
 * Helper trích xuất độ lệch đồng hồ từ header Date của response (ms).
 */
export function extractServerOffsetMs(headers?: Record<string, unknown>): number {
  const rawDate = headers?.date ?? headers?.Date;
  if (typeof rawDate !== "string") return 0;
  const serverMs = Date.parse(rawDate);
  if (Number.isNaN(serverMs)) return 0;
  return serverMs - Date.now();
}

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<ApiSuccess<T>>(config);
  return response.data.data;
}

export async function apiRequestWithMeta<T>(
  config: AxiosRequestConfig
): Promise<{ data: T; serverOffsetMs: number }> {
  const response = await apiClient.request<ApiSuccess<T>>(config);
  return {
    data: response.data.data,
    serverOffsetMs: extractServerOffsetMs(
      response.headers as Record<string, unknown>
    ),
  };
}
