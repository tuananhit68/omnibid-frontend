"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Button,
  Card,
  CategoryIcon,
  ConfirmDialog,
  CountdownTimer,
  DateTimeInput,
  EmptyState,
  ErrorState,
  ImageUploader,
  Input,
  MoneyInput,
  OrderProgress,
  PasswordInput,
  SegmentedControl,
  StatCard,
  StatusBadge,
  type UploadImageItem,
} from "@/components/ui";
import {
  AuctionStatus,
  BidPosition,
  NotificationType,
  OrderStatus,
  PaymentStatus,
  ProductStatus,
  ReportStatus,
  ReserveStatus,
  UserStatus,
} from "@/types/enums";
import { toBackendDateTimeString } from "@/lib/format";

export default function DevUiPage() {
  const [segment, setSegment] = useState<"all" | "active" | "ended">("all");
  const [money, setMoney] = useState<number | undefined>(5_400_000);
  const [dateTime, setDateTime] = useState<string>(() =>
    toBackendDateTimeString(new Date(Date.now() + 3600_000))
  );
  const [images, setImages] = useState<UploadImageItem[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [lastReason, setLastReason] = useState<string | null>(null);

  const [sampleEnd] = useState(() =>
    toBackendDateTimeString(new Date(Date.now() + 180_000))
  );

  return (
    <main className="mx-auto max-w-page px-4 py-8 md:px-6 lg:px-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 text-text">OmniBid UI Kit (v4)</h1>
          <p className="text-small text-text-secondary">
            Danh mục thành phần giao diện thuần theo DESIGN_SYSTEM.md
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dev/mock"
            className="inline-flex h-10 items-center rounded-md border border-border-brand bg-surface px-4 text-small font-medium text-text hover:bg-surface-subtle"
          >
            Bảng điều khiển mock
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-md bg-primary-600 px-4 text-small font-medium text-text-inverse hover:bg-primary-700"
          >
            Trang chủ
          </Link>
        </div>
      </div>

      {/* Buttons */}
      <Card className="space-y-4">
        <h2 className="text-h3 text-text">Button</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="money" size="xl">
            Đặt giá (money)
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger-soft">Hủy phiên</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" loading>
            Đang xử lý
          </Button>
        </div>
      </Card>

      {/* StatusBadge */}
      <Card className="space-y-4">
        <h2 className="text-h3 text-text">StatusBadge (enum v4)</h2>
        <div className="flex flex-wrap gap-2">
          {Object.values(AuctionStatus).map((s) => (
            <StatusBadge key={s} statusType="auction" value={s} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.values(ReserveStatus).map((s) => (
            <StatusBadge key={s} statusType="reserve" value={s} />
          ))}
          {Object.values(BidPosition).map((s) => (
            <StatusBadge key={s} statusType="bidPosition" value={s} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.values(ProductStatus).map((s) => (
            <StatusBadge key={s} statusType="product" value={s} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.values(OrderStatus).map((s) => (
            <StatusBadge key={s} statusType="order" value={s} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.values(PaymentStatus).map((s) => (
            <StatusBadge key={s} statusType="payment" value={s} />
          ))}
          {Object.values(NotificationType).map((s) => (
            <StatusBadge key={s} statusType="notification" value={s} />
          ))}
          {Object.values(ReportStatus).map((s) => (
            <StatusBadge key={s} statusType="report" value={s} />
          ))}
          {Object.values(UserStatus).map((s) => (
            <StatusBadge key={s} statusType="user" value={s} />
          ))}
        </div>
      </Card>

      {/* Inputs & Controls */}
      <Card className="space-y-4">
        <h2 className="text-h3 text-text">Ô nhập & SegmentedControl</h2>
        <SegmentedControl
          value={segment}
          onChange={setSegment}
          ariaLabel="Lọc mẫu"
          options={[
            { value: "all", label: "Tất cả", count: 12 },
            { value: "active", label: "Đang diễn ra", count: 3 },
            { value: "ended", label: "Đã kết thúc", count: 4 },
          ]}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Họ và tên" placeholder="Nguyễn Văn A" />
          <PasswordInput label="Mật khẩu" placeholder="Tối thiểu 8 ký tự" />
          <MoneyInput
            label="Mức giá đặt"
            value={money}
            onChange={setMoney}
          />
          <DateTimeInput
            label="Thời gian bắt đầu"
            value={dateTime}
            onChange={setDateTime}
          />
        </div>
      </Card>

      {/* OrderProgress & CountdownTimer */}
      <Card className="space-y-4">
        <h2 className="text-h3 text-text">OrderProgress & CountdownTimer</h2>
        <OrderProgress
          status={OrderStatus.SHIPPING}
          createdAt="2026-11-20T09:00:00+07:00"
          paidAt="2026-11-20T10:15:00+07:00"
          shippedAt="2026-11-21T08:30:00+07:00"
        />
        <OrderProgress
          status={OrderStatus.CANCELLED}
          cancelledAt="2026-11-21T12:00:00+07:00"
          cancelReason="Quản trị viên hủy theo yêu cầu xác minh."
        />
        <CountdownTimer endTime={sampleEnd} />
      </Card>

      {/* CategoryIcon, Avatar, StatCard */}
      <Card className="space-y-4">
        <h2 className="text-h3 text-text">CategoryIcon, Avatar & StatCard</h2>
        <div className="flex flex-wrap items-center gap-4">
          {["watch", "camera", "smartphone", "book-open", "gem", "shirt", "unknown"].map(
            (icon) => (
              <div
                key={icon}
                className="flex items-center gap-2 rounded-lg bg-surface-subtle px-3 py-2 text-small text-text"
              >
                <CategoryIcon name={icon} className="text-primary-600" />
                <span>{icon}</span>
              </div>
            )
          )}
        </div>
        <div className="flex items-center gap-3">
          <Avatar name="Nguyễn Thị Lan Anh" size="sm" />
          <Avatar name="Trần Minh Quân" size="md" />
          <Avatar name="Quản trị OmniBid" size="lg" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Tổng người dùng" value="128" subText="5 tài khoản bị khóa" />
          <StatCard label="Phiên đang diễn ra" value="14" />
          <StatCard label="Báo cáo chờ xử lý" value="3" />
        </div>
      </Card>

      {/* ImageUploader & ConfirmDialog */}
      <Card className="space-y-4">
        <h2 className="text-h3 text-text">ImageUploader & ConfirmDialog</h2>
        <ImageUploader
          items={images}
          onChange={setImages}
          allowSetPrimary
        />
        <div className="flex items-center gap-3">
          <Button variant="danger-soft" onClick={() => setConfirmOpen(true)}>
            Mở ConfirmDialog (có lý do bắt buộc)
          </Button>
          {lastReason && (
            <span className="text-small text-text-secondary">
              Lý do đã nhập: {lastReason}
            </span>
          )}
        </div>
        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={(reason) => {
            setLastReason(reason ?? null);
            setConfirmOpen(false);
          }}
          title="Hủy phiên đấu giá?"
          description="Phiên đấu giá sẽ chuyển sang trạng thái Đã hủy và không thể khôi phục."
          confirmLabel="Xác nhận hủy"
          confirmVariant="danger-soft"
          reasonMode="required"
          reasonLabel="Lý do hủy phiên"
        />
      </Card>

      {/* EmptyState & ErrorState */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <EmptyState
          title="Chưa có phiên đấu giá nào"
          description="Hiện chưa có phiên nào khớp bộ lọc của bạn."
          action={<Button variant="outline">Đặt lại bộ lọc</Button>}
        />
        <ErrorState
          message="Không kết nối được máy chủ. Kiểm tra mạng và thử lại."
          onRetry={() => {}}
        />
      </div>
    </main>
  );
}
