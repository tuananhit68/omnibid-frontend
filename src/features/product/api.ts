import { apiRequest } from "@/lib/api/client";
import type { Page, Product, ProductListItem } from "@/lib/api/contract";
import type {
  AddProductImagesInput,
  CreateProductInput,
  DeleteProductImageInput,
  MyProductsParams,
  UpdateProductInput,
} from "./types";

export async function getMyProducts(
  params?: MyProductsParams
): Promise<Page<ProductListItem>> {
  const cleanParams: Record<string, string | number> = {};
  if (params) {
    if (params.keyword?.trim()) cleanParams.keyword = params.keyword.trim();
    if (params.status) cleanParams.status = params.status;
    if (params.page !== undefined) cleanParams.page = params.page;
    if (params.size !== undefined) cleanParams.size = params.size;
    if (params.sort) cleanParams.sort = params.sort;
  }

  return apiRequest<Page<ProductListItem>>({
    method: "GET",
    url: "/products/mine",
    params: cleanParams,
  });
}

export async function getProductDetail(id: number): Promise<Product> {
  return apiRequest<Product>({
    method: "GET",
    url: `/products/${id}`,
  });
}

export async function createProduct(
  input: CreateProductInput
): Promise<Product> {
  const formData = new FormData();
  formData.append(
    "product",
    new Blob([JSON.stringify(input.product)], { type: "application/json" })
  );
  for (const file of input.files) {
    formData.append("files", file);
  }

  return apiRequest<Product>({
    method: "POST",
    url: "/products",
    data: formData,
    onUploadProgress: (evt) => {
      if (!input.onUploadProgress) return;
      if (evt.total && evt.total > 0) {
        input.onUploadProgress(Math.min(100, Math.round((evt.loaded / evt.total) * 100)));
      } else if (evt.progress !== undefined) {
        input.onUploadProgress(Math.min(100, Math.round(evt.progress * 100)));
      }
    },
  });
}

export async function updateProduct(
  input: UpdateProductInput
): Promise<Product> {
  return apiRequest<Product>({
    method: "PATCH",
    url: `/products/${input.id}`,
    data: input.payload,
  });
}

export async function deleteProduct(id: number): Promise<null> {
  return apiRequest<null>({
    method: "DELETE",
    url: `/products/${id}`,
  });
}

export async function addProductImages(
  input: AddProductImagesInput
): Promise<Product> {
  const formData = new FormData();
  for (const file of input.files) {
    formData.append("files", file);
  }

  return apiRequest<Product>({
    method: "POST",
    url: `/products/${input.id}/images`,
    data: formData,
    onUploadProgress: (evt) => {
      if (!input.onUploadProgress) return;
      if (evt.total && evt.total > 0) {
        input.onUploadProgress(Math.min(100, Math.round((evt.loaded / evt.total) * 100)));
      } else if (evt.progress !== undefined) {
        input.onUploadProgress(Math.min(100, Math.round(evt.progress * 100)));
      }
    },
  });
}

export async function deleteProductImage(
  input: DeleteProductImageInput
): Promise<Product> {
  return apiRequest<Product>({
    method: "DELETE",
    url: `/products/${input.productId}/images/${input.imageId}`,
  });
}
