import { apiRequest } from "@/lib/api/client";
import type { AdminCategory, Page } from "@/lib/api/contract";
import type { AdminCategoriesParams, AdminCategoryPayload } from "./types";

export function getAdminCategories(
  params: AdminCategoriesParams
): Promise<Page<AdminCategory>> {
  return apiRequest<Page<AdminCategory>>({
    url: "/admin/categories",
    method: "GET",
    params: {
      keyword: params.keyword || undefined,
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort ?? "name,asc",
    },
  });
}

export function createAdminCategory(
  payload: AdminCategoryPayload
): Promise<AdminCategory> {
  return apiRequest<AdminCategory>({
    url: "/admin/categories",
    method: "POST",
    data: payload,
  });
}

export function updateAdminCategory(
  id: number,
  payload: AdminCategoryPayload
): Promise<AdminCategory> {
  return apiRequest<AdminCategory>({
    url: `/admin/categories/${id}`,
    method: "PUT",
    data: payload,
  });
}

export function deleteAdminCategory(id: number): Promise<null> {
  return apiRequest<null>({
    url: `/admin/categories/${id}`,
    method: "DELETE",
  });
}
