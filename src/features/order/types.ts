import type {
  ConfirmReceiptResult,
  OrderDetail,
  OrderSummary,
  PaymentHistoryItem,
  PaymentResult,
  ShipResult,
} from "@/lib/api/contract";
import type { OrderStatus, PaymentMethod, PaymentStatus } from "@/types/enums";

export type {
  ConfirmReceiptResult,
  OrderDetail,
  OrderSummary,
  PaymentHistoryItem,
  PaymentResult,
  ShipResult,
};

export type OrderRole = "BUYER" | "SELLER";

export interface OrdersListParams {
  role?: OrderRole;
  status?: OrderStatus;
  page?: number;
  size?: number;
  sort?: string;
}

export interface UpdateShippingInfoRequest {
  shippingAddress: string;
  phoneNumber: string;
}

export interface CreatePaymentRequest {
  method: PaymentMethod;
  simulateResult?: PaymentStatus;
}

export interface ShipOrderRequest {
  trackingCode?: string;
}

export interface OrderPaymentsParams {
  page?: number;
  size?: number;
  sort?: string;
}
