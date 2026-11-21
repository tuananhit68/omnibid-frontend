"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addProductImages,
  createProduct,
  deleteProduct,
  deleteProductImage,
  getMyProducts,
  getProductDetail,
  updateProduct,
} from "./api";
import type {
  AddProductImagesInput,
  CreateProductInput,
  DeleteProductImageInput,
  MyProductsParams,
  UpdateProductInput,
} from "./types";

export const productKeys = {
  all: ["products"] as const,
  mine: (params?: MyProductsParams) => ["products", "mine", params] as const,
  detail: (id: number) => ["products", "detail", id] as const,
};

export function useMyProducts(params?: MyProductsParams) {
  return useQuery({
    queryKey: productKeys.mine(params),
    queryFn: () => getMyProducts(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useProductDetail(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductDetail(id),
    enabled: Number.isInteger(id) && id > 0,
    staleTime: 30_000,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProductInput) => updateProduct(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(productKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: ["products", "mine"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["products", "mine"] });
    },
  });
}

export function useAddProductImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddProductImagesInput) => addProductImages(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(productKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: ["products", "mine"] });
    },
  });
}

export function useDeleteProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DeleteProductImageInput) => deleteProductImage(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(productKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: ["products", "mine"] });
    },
  });
}
