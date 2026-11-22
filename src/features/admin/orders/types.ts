import type { OrderStatus } from "@/types/enums";

export interface AdminOrdersParams {
  status?: OrderStatus | "";
  buyerId?: number;
  sellerId?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface CancelAdminOrderPayload {
  orderId: number;
  reason: string;
}
