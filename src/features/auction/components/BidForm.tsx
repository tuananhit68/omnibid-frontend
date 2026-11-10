"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ApiError, clearAuthSession } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { formatMoney } from "@/lib/format";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { GavelIcon, InfoIcon } from "@/components/icons";
import { usePlaceBid } from "../hooks";
import type { AuctionDetail } from "../types";

export interface BidFormProps {
  auction: AuctionDetail;
  onBidSuccess?: () => void;
  onRefetchAuction?: () => void;
}

export function BidForm({
  auction,
  onBidSuccess,
  onRefetchAuction,
}: BidFormProps) {
  const router = useRouter();
  const toast = useToast();
  const placeBidMutation = usePlaceBid();

  const suggestedMinNext =
    auction.minNextBid ??
    (auction.bidCount === 0
      ? auction.startPrice
      : auction.currentPrice + auction.bidIncrement);

  const [amount, setAmount] = useState<number>(suggestedMinNext);
  const [lastMinNext, setLastMinNext] = useState<number>(suggestedMinNext);
  const [inlineError, setInlineError] = useState<string | undefined>();

  // Đồng bộ giá gợi ý mới khi có bid mới qua WebSocket (tránh setState trong useEffect)
  if (suggestedMinNext !== lastMinNext) {
    setLastMinNext(suggestedMinNext);
    if (amount < suggestedMinNext) {
      setAmount(suggestedMinNext);
    }
    setInlineError(undefined);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (placeBidMutation.isPending) return;

    if (!amount || amount <= 0) {
      setInlineError("Vui lòng nhập mức giá đặt hợp lệ.");
      return;
    }

    setInlineError(undefined);

    placeBidMutation.mutate(
      { auctionId: auction.id, amount },
      {
        onSuccess: () => {
          toast.success("Đặt giá thành công!");
          onBidSuccess?.();
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            if (err.errorCode === "BID_TOO_LOW") {
              const nextMin = (err.data as { minNextBid?: number } | undefined)
                ?.minNextBid;
              if (typeof nextMin === "number" && nextMin > 0) {
                setAmount(nextMin);
                setInlineError(
                  `Mức giá đặt phải tối thiểu ${formatMoney(nextMin)}.`
                );
              } else {
                setInlineError(err.message);
              }
              return;
            }

            if (err.errorCode === "ACCOUNT_BANNED") {
              toast.error(err.message);
              clearAuthSession();
              router.push("/login");
              return;
            }

            if (
              err.errorCode === "ALREADY_LEADING" ||
              err.errorCode === "SELF_BID_NOT_ALLOWED" ||
              err.errorCode === "AUCTION_NOT_ACTIVE"
            ) {
              toast.error(err.message);
              onRefetchAuction?.();
              return;
            }

            setInlineError(err.message);
            return;
          }

          setInlineError(getErrorMessage("INTERNAL_ERROR"));
        },
      }
    );
  };

  const hintLabel =
    auction.bidCount === 0
      ? `Tối thiểu ${formatMoney(suggestedMinNext)} (giá khởi điểm)`
      : `Tối thiểu ${formatMoney(
          suggestedMinNext
        )} (giá hiện tại + bước giá ${formatMoney(auction.bidIncrement)})`;

  return (
    <>
      <form
        id="live-bid-form"
        onSubmit={handleSubmit}
        noValidate
        className="bg-surface-subtle border border-border-brand rounded-xl p-4 space-y-4"
      >
        {/* Tiêu đề */}
        <div className="flex items-center gap-2 pb-2.5 border-b border-border-brand">
          <GavelIcon className="size-4.5 text-primary-700 shrink-0" />
          <h2 className="text-body font-semibold text-text">
            Bảng đặt giá trực tiếp
          </h2>
        </div>

        {/* Nhãn mức giá của bạn + Đang dẫn đầu */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-small">
            <span className="font-semibold text-text">Mức giá của bạn</span>
            <span className="text-caption text-text-tertiary tabular">
              Hiện tại:{" "}
              <strong className="text-text font-semibold">
                {formatMoney(auction.currentPrice)}
              </strong>
            </span>
          </div>

          <MoneyInput
            value={amount}
            onChange={(val) => {
              setAmount(val);
              if (inlineError) setInlineError(undefined);
            }}
            disabled={placeBidMutation.isPending}
            error={inlineError}
          />

          <p className="flex items-start gap-1.5 text-caption text-text-tertiary pt-0.5">
            <InfoIcon className="size-3.5 shrink-0 mt-0.5 text-primary-600" />
            <span>{hintLabel}</span>
          </p>
        </div>

        {/* Nút Đặt giá trên desktop */}
        <Button
          type="submit"
          variant="primary-strong"
          size="xl"
          loading={placeBidMutation.isPending}
          leftIcon={<GavelIcon className="size-4" />}
          className="w-full hidden lg:inline-flex"
        >
          Đặt giá
        </Button>
      </form>

      {/* Thanh đáy cố định trên mobile/tablet (< 1024px) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-surface border-t border-border-brand px-4 py-3 shadow-md flex items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="label block">Giá đặt của bạn</span>
          <span className="text-price-lg font-bold text-primary-700 tabular block truncate">
            {formatMoney(amount)}
          </span>
        </div>
        <Button
          type="submit"
          form="live-bid-form"
          variant="primary-strong"
          size="xl"
          loading={placeBidMutation.isPending}
          leftIcon={<GavelIcon className="size-4" />}
          className="shrink-0"
        >
          Đặt giá
        </Button>
      </div>
    </>
  );
}

