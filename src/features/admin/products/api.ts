import { apiRequest } from "@/lib/api/client";
import type {
  AdminHideProductResponse,
  AdminProductDetail,
  AdminProductItem,
  Page,
} from "@/lib/api/contract";
import type { AdminProductsParams, HideProductPayload } from "./types";

export function getAdminProducts(
  params: AdminProductsParams
): Promise<Page<AdminProductItem>> {
  return apiRequest<Page<AdminProductItem>>({
    url: "/admin/products",
    method: "GET",
    params: {
      keyword: params.keyword || undefined,
      categoryId: params.categoryId || undefined,
      status: params.status || undefined,
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort ?? "createdAt,desc",
    },
  });
}

export function getAdminProductDetail(id: number): Promise<AdminProductDetail> {
  return apiRequest<AdminProductDetail>({
    url: `/admin/products/${id}`,
    method: "GET",
  });
}

export function hideAdminProduct({
  productId,
  reason,
}: HideProductPayload): Promise<AdminHideProductResponse> {
  return apiRequest<AdminHideProductResponse>({
    url: `/admin/products/${productId}/hide`,
    method: "POST",
    data: reason ? { reason } : {},
  });
}
