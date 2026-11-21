"use client";

import { isApiError } from "@/lib/api/types";
import { formatDisplayCode } from "@/lib/format";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useBanAdminUser, useUnbanAdminUser } from "../users/hooks";
import { useHideAdminProduct } from "../products/hooks";
import { useCancelAdminAuction } from "../auctions/hooks";

export interface BanUserTarget {
  id: number;
  fullName: string;
  email?: string;
}

export function BanUserDialog({
  target,
  onClose,
  onSuccess,
}: {
  target: BanUserTarget | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const toast = useToast();
  const mutation = useBanAdminUser();

  return (
    <ConfirmDialog
      open={target !== null}
      onClose={onClose}
      title={
        target
          ? `Khóa tài khoản ${formatDisplayCode("USR", target.id)}`
          : "Khóa tài khoản"
      }
      description={
        <div className="space-y-2">
          {target && (
            <p className="font-medium text-text">
              {target.fullName}
              {target.email ? ` (${target.email})` : ""}
            </p>
          )}
          <p>
            Tài khoản bị chặn ngay; các phiên đang bán bị hủy; đơn chờ thanh toán
            liên quan bị hủy; lượt đặt giá đã có được giữ nguyên.
          </p>
        </div>
      }
      confirmLabel="Khóa tài khoản"
      confirmVariant="danger-soft"
      tone="danger"
      reasonMode="optional"
      reasonLabel="Lý do khóa"
      reasonPlaceholder="Nhập lý do khóa tài khoản (tùy chọn)..."
      loading={mutation.isPending}
      onConfirm={(reason) => {
        if (!target) return;
        mutation.mutate(
          { userId: target.id, reason },
          {
            onSuccess: (res) => {
              toast.success(
                `Đã khóa; hủy ${res.cancelledAuctions} phiên, ${res.cancelledOrders} đơn`
              );
              onClose();
              onSuccess?.();
            },
            onError: (err) => {
              toast.error(
                isApiError(err) ? err.message : "Không thể khóa tài khoản."
              );
            },
          }
        );
      }}
    />
  );
}

export function UnbanUserDialog({
  target,
  onClose,
  onSuccess,
}: {
  target: BanUserTarget | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const toast = useToast();
  const mutation = useUnbanAdminUser();

  return (
    <ConfirmDialog
      open={target !== null}
      onClose={onClose}
      title={
        target
          ? `Mở khóa tài khoản ${formatDisplayCode("USR", target.id)}`
          : "Mở khóa tài khoản"
      }
      description={
        <div className="space-y-2">
          {target && (
            <p className="font-medium text-text">
              {target.fullName}
              {target.email ? ` (${target.email})` : ""}
            </p>
          )}
          <p>
            Tài khoản sẽ hoạt động trở lại. Thao tác này không khôi phục phiên, đơn
            đã bị hủy trước đó.
          </p>
        </div>
      }
      confirmLabel="Mở khóa"
      confirmVariant="primary"
      tone="info"
      reasonMode="optional"
      reasonLabel="Ghi chú"
      reasonPlaceholder="Nhập ghi chú mở khóa (tùy chọn)..."
      loading={mutation.isPending}
      onConfirm={(reason) => {
        if (!target) return;
        mutation.mutate(
          { userId: target.id, reason },
          {
            onSuccess: () => {
              toast.success("Đã mở khóa tài khoản thành công.");
              onClose();
              onSuccess?.();
            },
            onError: (err) => {
              toast.error(
                isApiError(err) ? err.message : "Không thể mở khóa tài khoản."
              );
            },
          }
        );
      }}
    />
  );
}

export interface HideProductTarget {
  id: number;
  title: string;
}

export function HideProductDialog({
  target,
  onClose,
  onSuccess,
}: {
  target: HideProductTarget | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const toast = useToast();
  const mutation = useHideAdminProduct();

  return (
    <ConfirmDialog
      open={target !== null}
      onClose={onClose}
      title={
        target
          ? `Ẩn sản phẩm ${formatDisplayCode("PRD", target.id)}`
          : "Ẩn sản phẩm"
      }
      description={
        <div className="space-y-2">
          {target && <p className="font-medium text-text">{target.title}</p>}
          <p>
            Phiên đang mở bị hủy; đơn chờ thanh toán bị hủy; đơn đã thanh toán hoặc
            đang giao vẫn tiếp tục.{" "}
            <strong className="font-semibold text-danger">Ẩn là vĩnh viễn.</strong>
          </p>
        </div>
      }
      confirmLabel="Ẩn vĩnh viễn"
      confirmVariant="danger-soft"
      tone="danger"
      reasonMode="optional"
      reasonLabel="Lý do ẩn"
      reasonPlaceholder="Nhập lý do ẩn sản phẩm (tùy chọn)..."
      loading={mutation.isPending}
      onConfirm={(reason) => {
        if (!target) return;
        mutation.mutate(
          { productId: target.id, reason },
          {
            onSuccess: (res) => {
              toast.success(
                `Đã ẩn sản phẩm; hủy ${res.cancelledAuctions} phiên, ${res.cancelledOrders} đơn`
              );
              onClose();
              onSuccess?.();
            },
            onError: (err) => {
              toast.error(
                isApiError(err) ? err.message : "Không thể ẩn sản phẩm."
              );
            },
          }
        );
      }}
    />
  );
}

export interface CancelAuctionTarget {
  id: number;
  title?: string;
  bidCount?: number;
}

export function CancelAuctionDialog({
  target,
  onClose,
  onSuccess,
}: {
  target: CancelAuctionTarget | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const toast = useToast();
  const mutation = useCancelAdminAuction();

  return (
    <ConfirmDialog
      open={target !== null}
      onClose={onClose}
      title={
        target
          ? `Hủy phiên đấu giá ${formatDisplayCode("AUC", target.id)}`
          : "Hủy phiên đấu giá"
      }
      description={
        <div className="space-y-2">
          {target?.title && <p className="font-medium text-text">{target.title}</p>}
          <p>
            Phiên đấu giá sẽ bị hủy ngay lập tức (kể cả khi đã có{" "}
            {target?.bidCount ? `${target.bidCount} lượt đặt giá` : "lượt đặt giá"}).
            Sản phẩm sẽ trở về trạng thái Sẵn sàng (trừ khi đã bị ẩn); người bán và
            người đang dẫn đầu sẽ nhận được thông báo.
          </p>
        </div>
      }
      confirmLabel="Xác nhận hủy phiên"
      confirmVariant="danger-soft"
      tone="danger"
      reasonMode="required"
      reasonLabel="Lý do hủy phiên"
      reasonPlaceholder="Nhập lý do hủy phiên (bắt buộc)..."
      loading={mutation.isPending}
      onConfirm={(reason) => {
        if (!target || !reason) return;
        mutation.mutate(
          { auctionId: target.id, reason },
          {
            onSuccess: () => {
              toast.success(
                `Đã hủy phiên ${formatDisplayCode("AUC", target.id)}.`
              );
              onClose();
              onSuccess?.();
            },
            onError: (err) => {
              toast.error(
                isApiError(err) ? err.message : "Không thể hủy phiên đấu giá."
              );
            },
          }
        );
      }}
    />
  );
}
