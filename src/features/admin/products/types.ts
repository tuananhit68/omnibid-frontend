import type { ProductStatus } from "@/types/enums";

export interface AdminProductsParams {
  keyword?: string;
  categoryId?: number;
  status?: ProductStatus | "";
  page?: number;
  size?: number;
  sort?: string;
}

export interface HideProductPayload {
  productId: number;
  reason?: string;
}
