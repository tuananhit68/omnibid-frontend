import type { QueryClient } from "@tanstack/react-query";

export const adminKeys = {
  all: ["admin"] as const,
  statistics: () => [...adminKeys.all, "statistics"] as const,

  users: () => [...adminKeys.all, "users"] as const,
  userList: (params: Record<string, unknown>) =>
    [...adminKeys.users(), "list", params] as const,

  categories: () => [...adminKeys.all, "categories"] as const,
  categoryList: (params: Record<string, unknown>) =>
    [...adminKeys.categories(), "list", params] as const,

  products: () => [...adminKeys.all, "products"] as const,
  productList: (params: Record<string, unknown>) =>
    [...adminKeys.products(), "list", params] as const,
  productDetail: (id: number) => [...adminKeys.products(), "detail", id] as const,

  auctions: () => [...adminKeys.all, "auctions"] as const,
  auctionList: (params: Record<string, unknown>) =>
    [...adminKeys.auctions(), "list", params] as const,
  auctionDetail: (id: number) => [...adminKeys.auctions(), "detail", id] as const,

  orders: () => [...adminKeys.all, "orders"] as const,
  orderList: (params: Record<string, unknown>) =>
    [...adminKeys.orders(), "list", params] as const,
  orderDetail: (id: number) => [...adminKeys.orders(), "detail", id] as const,

  reports: () => [...adminKeys.all, "reports"] as const,
  reportList: (params: Record<string, unknown>) =>
    [...adminKeys.reports(), "list", params] as const,
  reportDetail: (id: number) => [...adminKeys.reports(), "detail", id] as const,
};

export function invalidateAfterUserAction(queryClient: QueryClient): Promise<unknown> {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: adminKeys.users() }),
    queryClient.invalidateQueries({ queryKey: adminKeys.auctions() }),
    queryClient.invalidateQueries({ queryKey: adminKeys.orders() }),
    queryClient.invalidateQueries({ queryKey: adminKeys.products() }),
    queryClient.invalidateQueries({ queryKey: adminKeys.reports() }),
    queryClient.invalidateQueries({ queryKey: adminKeys.statistics() }),
  ]);
}

export function invalidateAfterProductHide(
  queryClient: QueryClient,
  productId?: number
): Promise<unknown> {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: adminKeys.products() }),
    ...(productId != null
      ? [queryClient.invalidateQueries({ queryKey: adminKeys.productDetail(productId) })]
      : []),
    queryClient.invalidateQueries({ queryKey: adminKeys.auctions() }),
    queryClient.invalidateQueries({ queryKey: adminKeys.orders() }),
    queryClient.invalidateQueries({ queryKey: adminKeys.reports() }),
    queryClient.invalidateQueries({ queryKey: adminKeys.statistics() }),
  ]);
}

export function invalidateAfterAuctionCancel(
  queryClient: QueryClient,
  auctionId?: number
): Promise<unknown> {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: adminKeys.auctions() }),
    ...(auctionId != null
      ? [queryClient.invalidateQueries({ queryKey: adminKeys.auctionDetail(auctionId) })]
      : []),
    queryClient.invalidateQueries({ queryKey: adminKeys.products() }),
    queryClient.invalidateQueries({ queryKey: adminKeys.reports() }),
    queryClient.invalidateQueries({ queryKey: adminKeys.statistics() }),
  ]);
}

export function invalidateAfterOrderCancel(
  queryClient: QueryClient,
  orderId?: number
): Promise<unknown> {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: adminKeys.orders() }),
    ...(orderId != null
      ? [queryClient.invalidateQueries({ queryKey: adminKeys.orderDetail(orderId) })]
      : []),
    queryClient.invalidateQueries({ queryKey: adminKeys.products() }),
    queryClient.invalidateQueries({ queryKey: adminKeys.reports() }),
    queryClient.invalidateQueries({ queryKey: adminKeys.statistics() }),
  ]);
}

export function invalidateAfterReportResolve(
  queryClient: QueryClient,
  reportId?: number
): Promise<unknown> {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: adminKeys.reports() }),
    ...(reportId != null
      ? [queryClient.invalidateQueries({ queryKey: adminKeys.reportDetail(reportId) })]
      : []),
    queryClient.invalidateQueries({ queryKey: adminKeys.statistics() }),
  ]);
}

export function invalidateAfterCategoryMutation(
  queryClient: QueryClient
): Promise<unknown> {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: adminKeys.categories() }),
    queryClient.invalidateQueries({ queryKey: ["categories"] }),
  ]);
}
