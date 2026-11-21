import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { mockNowMs } from "./db";
import { MockHttpError, mockError } from "./errors";
import { ensureMockSchedulerStarted, tickMockScheduler } from "./scheduler";
import { handleLogin, handleLogout, handleRegister } from "./handlers/auth";
import {
  handleGetMe,
  handlePatchMe,
  handlePatchPassword,
  handleUploadAvatar,
} from "./handlers/users";
import { handleGetCategories } from "./handlers/categories";
import {
  handleGetAuctionBids,
  handleGetAuctionDetail,
  handleGetAuctions,
  handleGetMyBids,
  handlePlaceBid,
} from "./handlers/auctions";
import { handleCreateReport } from "./handlers/reports";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelayMs(): number {
  return 150 + Math.floor(Math.random() * 250);
}

function parseJsonBody(data: unknown): Record<string, unknown> {
  if (!data) return {};
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof data === "object") {
    return data as Record<string, unknown>;
  }
  return {};
}

function extractPathAndParams(config: InternalAxiosRequestConfig): {
  path: string;
  params: URLSearchParams;
} {
  const rawUrl = config.url ?? "";
  const [pathnamePart, queryPart] = rawUrl.split("?");
  const normalizedPath = pathnamePart
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/^\/api\/v1/, "")
    .replace(/\/+$/, "") || "/";

  const params = new URLSearchParams(queryPart ?? "");
  if (config.params && typeof config.params === "object") {
    for (const [k, v] of Object.entries(config.params as Record<string, unknown>)) {
      if (v !== undefined && v !== null && v !== "") {
        params.set(k, String(v));
      }
    }
  }
  return { path: normalizedPath, params };
}

function getAuthHeader(config: InternalAxiosRequestConfig): string | undefined {
  const headers = config.headers;
  if (!headers) return undefined;
  if (typeof headers.get === "function") {
    const val = headers.get("Authorization");
    return typeof val === "string" ? val : undefined;
  }
  const raw =
    (headers as Record<string, unknown>).Authorization ??
    (headers as Record<string, unknown>).authorization;
  return typeof raw === "string" ? raw : undefined;
}

async function routeMockRequest(
  method: string,
  path: string,
  params: URLSearchParams,
  config: InternalAxiosRequestConfig
): Promise<{ status: number; data: unknown }> {
  const authHeader = getAuthHeader(config);

  // 2.1 Auth & Users
  if (method === "POST" && path === "/auth/register") {
    return { status: 201, data: handleRegister(parseJsonBody(config.data)) };
  }
  if (method === "POST" && path === "/auth/login") {
    return { status: 200, data: handleLogin(parseJsonBody(config.data)) };
  }
  if (method === "POST" && path === "/auth/logout") {
    return { status: 200, data: handleLogout(authHeader) };
  }
  if (method === "GET" && path === "/users/me") {
    return { status: 200, data: handleGetMe(authHeader) };
  }
  if (method === "PATCH" && path === "/users/me") {
    return { status: 200, data: handlePatchMe(authHeader, parseJsonBody(config.data)) };
  }
  if (method === "PATCH" && path === "/users/me/password") {
    return {
      status: 200,
      data: handlePatchPassword(authHeader, parseJsonBody(config.data)),
    };
  }
  if (method === "POST" && path === "/users/me/avatar") {
    if (!(config.data instanceof FormData)) {
      throw mockError("INVALID_IMAGE", "Yêu cầu tải ảnh phải là multipart/form-data");
    }
    return { status: 200, data: await handleUploadAvatar(authHeader, config.data) };
  }

  // 2.2 Categories
  if (method === "GET" && path === "/categories") {
    return { status: 200, data: handleGetCategories(params) };
  }

  // 2.3 Auctions & Bids (phần đọc/đặt giá cho Phase 1 & /dev/mock)
  if (method === "GET" && path === "/auctions") {
    return { status: 200, data: handleGetAuctions(params) };
  }
  const auctionDetailMatch = path.match(/^\/auctions\/(\d+)$/);
  if (method === "GET" && auctionDetailMatch) {
    return {
      status: 200,
      data: handleGetAuctionDetail(Number(auctionDetailMatch[1]), authHeader),
    };
  }
  const auctionBidsMatch = path.match(/^\/auctions\/(\d+)\/bids$/);
  if (auctionBidsMatch) {
    const auctionId = Number(auctionBidsMatch[1]);
    if (method === "GET") {
      return {
        status: 200,
        data: handleGetAuctionBids(auctionId, params, authHeader),
      };
    }
    if (method === "POST") {
      return {
        status: 201,
        data: handlePlaceBid(auctionId, authHeader, parseJsonBody(config.data)),
      };
    }
  }
  if (method === "GET" && path === "/bids/mine") {
    return { status: 200, data: handleGetMyBids(authHeader, params) };
  }

  // 2.5 Reports
  if (method === "POST" && path === "/reports") {
    return { status: 201, data: handleCreateReport(authHeader, parseJsonBody(config.data)) };
  }

  throw mockError(
    "NOT_FOUND",
    `Mock handler chưa được cài cho ${method} ${path}`
  );
}

export async function mockAdapter(
  config: InternalAxiosRequestConfig
): Promise<AxiosResponse> {
  ensureMockSchedulerStarted();
  tickMockScheduler();

  await sleep(randomDelayMs());

  const method = (config.method ?? "GET").toUpperCase();
  const { path, params } = extractPathAndParams(config);
  const dateHeader = new Date(mockNowMs()).toUTCString();

  try {
    const { status, data } = await routeMockRequest(method, path, params, config);
    return {
      data: { success: true, data },
      status,
      statusText: status === 201 ? "Created" : "OK",
      headers: {
        "content-type": "application/json",
        date: dateHeader,
      },
      config,
    };
  } catch (err) {
    const mockErr =
      err instanceof MockHttpError
        ? err
        : mockError("INTERNAL_ERROR", err instanceof Error ? err.message : undefined);

    const response: AxiosResponse = {
      data: {
        success: false,
        error: {
          code: mockErr.code,
          message: mockErr.message,
          ...(mockErr.details ? { details: mockErr.details } : {}),
        },
      },
      status: mockErr.status,
      statusText: mockErr.code,
      headers: {
        "content-type": "application/json",
        date: dateHeader,
      },
      config,
    };

    throw new AxiosError(
      mockErr.message,
      mockErr.code,
      config,
      undefined,
      response
    );
  }
}
