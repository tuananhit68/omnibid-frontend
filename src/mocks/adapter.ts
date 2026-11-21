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
  handleAddProductImages,
  handleCreateProduct,
  handleDeleteProduct,
  handleDeleteProductImage,
  handleGetMyProducts,
  handleGetProductDetail,
  handleUpdateProduct,
} from "./handlers/products";
import {
  handleCancelAuction,
  handleCreateAuction,
  handleGetAuctionBids,
  handleGetAuctionDetail,
  handleGetAuctions,
  handleGetMyAuctions,
  handleGetMyBids,
  handlePlaceBid,
  handleUpdateAuction,
} from "./handlers/auctions";
import { handleCreateReport } from "./handlers/reports";
import {
  handleConfirmReceipt,
  handleGetOrderDetail,
  handleGetOrders,
  handleShipOrder,
  handleUpdateShippingInfo,
} from "./handlers/orders";
import {
  handleCreatePayment,
  handleGetOrderPayments,
} from "./handlers/payments";

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

function getHeader(
  config: InternalAxiosRequestConfig,
  headerName: string
): string | undefined {
  const headers = config.headers;
  if (!headers) return undefined;
  if (typeof headers.get === "function") {
    const val = headers.get(headerName) ?? headers.get(headerName.toLowerCase());
    return typeof val === "string" ? val : undefined;
  }
  const record = headers as Record<string, unknown>;
  const target = headerName.toLowerCase();
  for (const [key, val] of Object.entries(record)) {
    if (key.toLowerCase() === target && typeof val === "string") {
      return val;
    }
  }
  return undefined;
}

function getAuthHeader(config: InternalAxiosRequestConfig): string | undefined {
  return getHeader(config, "Authorization");
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

  // 2.2 Categories & Products
  if (method === "GET" && path === "/categories") {
    return { status: 200, data: handleGetCategories(params) };
  }
  if (method === "GET" && path === "/products/mine") {
    return { status: 200, data: handleGetMyProducts(authHeader, params) };
  }
  if (method === "POST" && path === "/products") {
    if (!(config.data instanceof FormData)) {
      throw mockError("VALIDATION_ERROR", "Yêu cầu tạo sản phẩm phải là multipart/form-data");
    }
    config.onUploadProgress?.({
      loaded: 40,
      total: 100,
      progress: 0.4,
      bytes: 40,
      lengthComputable: true,
    });
    const created = await handleCreateProduct(authHeader, config.data);
    config.onUploadProgress?.({
      loaded: 100,
      total: 100,
      progress: 1,
      bytes: 100,
      lengthComputable: true,
    });
    return { status: 201, data: created };
  }
  const productImageDeleteMatch = path.match(/^\/products\/(\d+)\/images\/(\d+)$/);
  if (method === "DELETE" && productImageDeleteMatch) {
    return {
      status: 200,
      data: handleDeleteProductImage(
        Number(productImageDeleteMatch[1]),
        Number(productImageDeleteMatch[2]),
        authHeader
      ),
    };
  }
  const productImagesMatch = path.match(/^\/products\/(\d+)\/images$/);
  if (method === "POST" && productImagesMatch) {
    if (!(config.data instanceof FormData)) {
      throw mockError("INVALID_IMAGE", "Yêu cầu tải ảnh phải là multipart/form-data");
    }
    config.onUploadProgress?.({
      loaded: 50,
      total: 100,
      progress: 0.5,
      bytes: 50,
      lengthComputable: true,
    });
    const updated = await handleAddProductImages(
      Number(productImagesMatch[1]),
      authHeader,
      config.data
    );
    config.onUploadProgress?.({
      loaded: 100,
      total: 100,
      progress: 1,
      bytes: 100,
      lengthComputable: true,
    });
    return { status: 201, data: updated };
  }
  const productDetailMatch = path.match(/^\/products\/(\d+)$/);
  if (productDetailMatch) {
    const productId = Number(productDetailMatch[1]);
    if (method === "GET") {
      return { status: 200, data: handleGetProductDetail(productId, authHeader) };
    }
    if (method === "PATCH") {
      return {
        status: 200,
        data: handleUpdateProduct(productId, authHeader, parseJsonBody(config.data)),
      };
    }
    if (method === "DELETE") {
      return { status: 200, data: handleDeleteProduct(productId, authHeader) };
    }
  }

  // 2.3 Auctions & Bids
  if (method === "GET" && path === "/auctions") {
    return { status: 200, data: handleGetAuctions(params) };
  }
  if (method === "GET" && path === "/auctions/mine") {
    return { status: 200, data: handleGetMyAuctions(authHeader, params) };
  }
  if (method === "POST" && path === "/auctions") {
    return {
      status: 201,
      data: handleCreateAuction(authHeader, parseJsonBody(config.data)),
    };
  }
  const auctionCancelMatch = path.match(/^\/auctions\/(\d+)\/cancel$/);
  if (method === "POST" && auctionCancelMatch) {
    return {
      status: 200,
      data: handleCancelAuction(
        Number(auctionCancelMatch[1]),
        authHeader,
        parseJsonBody(config.data)
      ),
    };
  }
  const auctionDetailMatch = path.match(/^\/auctions\/(\d+)$/);
  if (auctionDetailMatch) {
    const auctionId = Number(auctionDetailMatch[1]);
    if (method === "GET") {
      return {
        status: 200,
        data: handleGetAuctionDetail(auctionId, authHeader),
      };
    }
    if (method === "PATCH") {
      return {
        status: 200,
        data: handleUpdateAuction(auctionId, authHeader, parseJsonBody(config.data)),
      };
    }
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

  // 2.4 Orders & Payments
  if (method === "GET" && path === "/orders") {
    return { status: 200, data: handleGetOrders(authHeader, params) };
  }
  const orderShippingMatch = path.match(/^\/orders\/(\d+)\/shipping-info$/);
  if (method === "PATCH" && orderShippingMatch) {
    return {
      status: 200,
      data: handleUpdateShippingInfo(
        Number(orderShippingMatch[1]),
        authHeader,
        parseJsonBody(config.data)
      ),
    };
  }
  const orderPaymentsMatch = path.match(/^\/orders\/(\d+)\/payments$/);
  if (orderPaymentsMatch) {
    const orderId = Number(orderPaymentsMatch[1]);
    if (method === "POST") {
      return {
        status: 200,
        data: handleCreatePayment(
          orderId,
          authHeader,
          getHeader(config, "Idempotency-Key"),
          parseJsonBody(config.data)
        ),
      };
    }
    if (method === "GET") {
      return {
        status: 200,
        data: handleGetOrderPayments(orderId, authHeader, params),
      };
    }
  }
  const orderShipMatch = path.match(/^\/orders\/(\d+)\/ship$/);
  if (method === "POST" && orderShipMatch) {
    return {
      status: 200,
      data: handleShipOrder(
        Number(orderShipMatch[1]),
        authHeader,
        parseJsonBody(config.data)
      ),
    };
  }
  const orderConfirmMatch = path.match(/^\/orders\/(\d+)\/confirm-receipt$/);
  if (method === "POST" && orderConfirmMatch) {
    return {
      status: 200,
      data: handleConfirmReceipt(Number(orderConfirmMatch[1]), authHeader),
    };
  }
  const orderDetailMatch = path.match(/^\/orders\/(\d+)$/);
  if (method === "GET" && orderDetailMatch) {
    return {
      status: 200,
      data: handleGetOrderDetail(Number(orderDetailMatch[1]), authHeader),
    };
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
