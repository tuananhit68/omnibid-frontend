import type { ProductCondition, ProductStatus } from "@/types/enums";

export interface MyProductsParams {
  keyword?: string;
  status?: ProductStatus;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ProductPayload {
  title: string;
  description: string;
  categoryId: number;
  condition: ProductCondition;
}

export interface CreateProductInput {
  product: ProductPayload;
  files: File[];
  onUploadProgress?: (percent: number) => void;
}

export interface UpdateProductInput {
  id: number;
  payload: ProductPayload;
}

export interface AddProductImagesInput {
  id: number;
  files: File[];
  onUploadProgress?: (percent: number) => void;
}

export interface DeleteProductImageInput {
  productId: number;
  imageId: number;
}
