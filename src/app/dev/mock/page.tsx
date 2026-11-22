"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IS_MOCK_MODE } from "@/lib/api/client";
import { clearSession, saveSession, useSession } from "@/lib/auth/session";
import { formatDateTime, formatMoney } from "@/lib/format";
import {
  advanceMockClock,
  getMockDb,
  mockNowIso,
  resetMockDb,
  setDefaultPaymentOutcome,
} from "@/mocks/db";
import { handleLogin } from "@/mocks/handlers/auth";
import { placeMockBidAsUser } from "@/mocks/handlers/auctions";
import { tickMockScheduler } from "@/mocks/scheduler";
import { AuctionStatus, PaymentStatus, UserRole, UserStatus } from "@/types/enums";

const DEMO_ACCOUNTS = [
  { email: "seller@omnibid.local", password: "Demo@1234", label: "Người bán (seller)" },
  { email: "buyer1@omnibid.local", password: "Demo@1234", label: "Người mua 1 (buyer1)" },
  { email: "buyer2@omnibid.local", password: "Demo@1234", label: "Người mua 2 (buyer2)" },
  { email: "admin@omnibid.local", password: "Admin@123456", label: "Quản trị viên (admin)" },
];

const emptySubscribe = () => () => {};

export default function DevMockPage() {
  if (!IS_MOCK_MODE) {
    notFound();
  }

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { user, isAuthenticated } = useSession();
  const [, setVersion] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedAuctionId, setSelectedAuctionId] = useState<number>(1);
  const [selectedBidderId, setSelectedBidderId] = useState<number>(4);

  const refresh = () => setVersion((v) => v + 1);

  if (!mounted) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-body text-text-secondary">Đang tải bảng điều khiển dữ liệu giả lập…</p>
      </main>
    );
  }

  const db = getMockDb();
  const activeAuctions = db.auctions.filter((a) => a.status === AuctionStatus.ACTIVE);
  const bidderUsers = db.users.filter(
    (u) => u.role === UserRole.USER && u.status === UserStatus.ACTIVE
  );

  const handleQuickLogin = (email: string, password: string) => {
    try {
      const loginResp = handleLogin({ email, password });
      saveSession(loginResp);
      setFeedback(`Đã đăng nhập nhanh với ${loginResp.user.fullName} (${loginResp.user.role}).`);
      refresh();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Đăng nhập thất bại.");
    }
  };

  const handleTimeTravel = (minutes: number, label: string) => {
    advanceMockClock(minutes * 60_000);
    tickMockScheduler();
    setFeedback(`Đã tua đồng hồ ${label}. Thời gian hiện tại: ${formatDateTime(mockNowIso())}.`);
    refresh();
  };

  const handleSimulateBid = () => {
    const auction = db.auctions.find((a) => a.id === selectedAuctionId);
    if (!auction) {
      setFeedback("Không tìm thấy phiên đấu giá được chọn.");
      return;
    }
    const nextAmount =
      auction.bidCount === 0
        ? auction.startPrice
        : auction.currentPrice + auction.bidIncrement;
    try {
      const res = placeMockBidAsUser(auction.id, selectedBidderId, nextAmount);
      setFeedback(
        `Đã đặt giá ${formatMoney(res.amount)} vào phiên AUC-${res.auctionId} (sự kiện BID_PLACED đã phát).`
      );
      refresh();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Không thể đặt giá giả lập.");
    }
  };

  const handlePaymentOutcomeChange = (outcome: PaymentStatus) => {
    setDefaultPaymentOutcome(outcome);
    setFeedback(`Đã đặt kết quả thanh toán mặc định: ${outcome}.`);
    refresh();
  };

  const handleReset = () => {
    resetMockDb();
    clearSession();
    setFeedback("Đã đặt lại toàn bộ dữ liệu giả lập về trạng thái ban đầu và đăng xuất.");
    refresh();
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 text-text">Bảng điều khiển chế độ giả lập</h1>
          <p className="text-small text-text-secondary mt-1">
            Thời gian giả lập hiện tại:{" "}
            <strong className="tabular text-text">{formatDateTime(mockNowIso())}</strong>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-md border border-border-brand bg-surface px-4 text-small font-medium text-text hover:bg-surface-subtle"
          >
            Về trang chủ
          </Link>
          <Link
            href="/dev/ui"
            className="inline-flex h-10 items-center rounded-md border border-border-brand bg-surface px-4 text-small font-medium text-text hover:bg-surface-subtle"
          >
            Xem UI Kit
          </Link>
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          className="rounded-xl border border-info-border bg-info-bg px-4 py-3 text-small text-info"
        >
          {feedback}
        </div>
      )}

      {/* 1. Phiên hiện tại & Đăng nhập nhanh */}
      <section className="rounded-xl border border-border-brand bg-surface p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-h3 text-text">1. Đăng nhập nhanh tài khoản mẫu</h2>
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="text-small text-text-secondary">
                Đang đăng nhập: <strong className="text-text">{user.fullName}</strong> ({user.email} · {user.role})
              </span>
              <button
                type="button"
                onClick={() => {
                  clearSession();
                  setFeedback("Đã đăng xuất phiên hiện tại.");
                  refresh();
                }}
                className="inline-flex h-8 items-center rounded-md bg-danger-bg px-3 text-label text-danger hover:opacity-90"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <span className="text-small text-text-tertiary">Chưa đăng nhập (Khách)</span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => handleQuickLogin(acc.email, acc.password)}
              className="flex flex-col items-start rounded-lg border border-border-brand bg-surface-subtle px-4 py-3 text-left transition-colors hover:bg-surface-muted"
            >
              <span className="text-body font-medium text-text">{acc.label}</span>
              <span className="text-caption text-text-tertiary">{acc.email}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Người khác đặt giá (phát BID_PLACED) */}
      <section className="rounded-xl border border-border-brand bg-surface p-6 space-y-4">
        <h2 className="text-h3 text-text">2. Giả lập người khác đặt giá (realtime)</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="label block">Chọn phiên đang diễn ra</span>
            <select
              value={selectedAuctionId}
              onChange={(e) => setSelectedAuctionId(Number(e.target.value))}
              className="h-11 w-full rounded-md border border-border-brand bg-surface-subtle px-3 text-body text-text"
            >
              {activeAuctions.map((a) => {
                const product = db.products.find((p) => p.id === a.productId);
                return (
                  <option key={a.id} value={a.id}>
                    AUC-{a.id} · {product?.title ?? ""} ({formatMoney(a.currentPrice)})
                  </option>
                );
              })}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="label block">Tài khoản đặt giá</span>
            <select
              value={selectedBidderId}
              onChange={(e) => setSelectedBidderId(Number(e.target.value))}
              className="h-11 w-full rounded-md border border-border-brand bg-surface-subtle px-3 text-body text-text"
            >
              {bidderUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} ({u.email})
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={handleSimulateBid}
          disabled={activeAuctions.length === 0}
          className="inline-flex h-11 items-center rounded-md bg-primary-600 px-4 text-body font-medium text-text-inverse hover:bg-primary-700 disabled:opacity-50"
        >
          Đặt giá bước tiếp theo
        </button>
      </section>

      {/* 3. Tua đồng hồ giả lập */}
      <section className="rounded-xl border border-border-brand bg-surface p-6 space-y-4">
        <h2 className="text-h3 text-text">3. Tua đồng hồ giả lập</h2>
        <p className="text-small text-text-secondary">
          Dùng để kiểm tra mở phiên SCHEDULED, chốt phiên ACTIVE, hết hạn thanh toán đơn hàng và tự động hoàn tất giao hàng.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleTimeTravel(1, "+1 phút")}
            className="inline-flex h-10 items-center rounded-md bg-surface-muted px-4 text-small font-medium text-text hover:bg-surface-strong"
          >
            +1 phút
          </button>
          <button
            type="button"
            onClick={() => handleTimeTravel(5, "+5 phút")}
            className="inline-flex h-10 items-center rounded-md bg-surface-muted px-4 text-small font-medium text-text hover:bg-surface-strong"
          >
            +5 phút
          </button>
          <button
            type="button"
            onClick={() => handleTimeTravel(60, "+1 giờ")}
            className="inline-flex h-10 items-center rounded-md bg-surface-muted px-4 text-small font-medium text-text hover:bg-surface-strong"
          >
            +1 giờ
          </button>
          <button
            type="button"
            onClick={() => handleTimeTravel(48 * 60, "+2 ngày")}
            className="inline-flex h-10 items-center rounded-md bg-surface-muted px-4 text-small font-medium text-text hover:bg-surface-strong"
          >
            +2 ngày
          </button>
        </div>
      </section>

      {/* 4. Kết quả thanh toán mặc định & Reset */}
      <section className="rounded-xl border border-border-brand bg-surface p-6 space-y-4">
        <h2 className="text-h3 text-text">4. Thanh toán & Đặt lại dữ liệu</h2>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-small text-text-secondary">Kết quả thanh toán mặc định:</span>
            <button
              type="button"
              onClick={() => handlePaymentOutcomeChange(PaymentStatus.SUCCESS)}
              className={`h-9 rounded-md px-3 text-small font-medium ${
                db.defaultPaymentOutcome === PaymentStatus.SUCCESS
                  ? "bg-success-bg text-success border border-success-border"
                  : "bg-surface-subtle text-text-secondary"
              }`}
            >
              SUCCESS
            </button>
            <button
              type="button"
              onClick={() => handlePaymentOutcomeChange(PaymentStatus.FAILED)}
              className={`h-9 rounded-md px-3 text-small font-medium ${
                db.defaultPaymentOutcome === PaymentStatus.FAILED
                  ? "bg-danger-bg text-danger border border-danger-border"
                  : "bg-surface-subtle text-text-secondary"
              }`}
            >
              FAILED
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-10 items-center rounded-md bg-danger-bg px-4 text-small font-medium text-danger hover:opacity-90"
          >
            Đặt lại dữ liệu về ban đầu
          </button>
        </div>
      </section>
    </main>
  );
}
