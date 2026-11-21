// TODO fe-v4 auction-detail
"use client";

import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/types";
import { formatMoney } from "@/lib/format";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { usePlaceBid } from "../hooks";

export interface BidFormProps {
  auctionId: number;
  minNextBid: number;
  bidIncrement: number;
  disabled?: boolean;
}

export function BidForm({
  auctionId,
  minNextBid,
  bidIncrement,
  disabled = false,
}: BidFormProps) {
  const toast = useToast();
  const placeBidMutation = usePlaceBid();
  const [amount, setAmount] = useState<number>(minNextBid);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!amount || amount < minNextBid) {
      setErrorMsg(`Mức giá tối thiểu là ${formatMoney(minNextBid)}.`);
      return;
    }

    placeBidMutation.mutate(
      { auctionId, amount },
      {
        onSuccess: (res) => {
          toast.success(`Đặt giá ${formatMoney(res.amount)} thành công.`);
          setAmount(res.minNextBid);
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            if (err.code === "BID_TOO_LOW" && typeof err.details?.minNextBid === "number") {
              const nextMin = err.details.minNextBid;
              setAmount(nextMin);
              setErrorMsg(
                `Mức giá vừa thay đổi. Mức tối thiểu mới là ${formatMoney(nextMin)}.`
              );
              return;
            }
            setErrorMsg(err.message);
            return;
          }
          setErrorMsg("Không thể đặt giá. Vui lòng thử lại.");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border-t border-border-subtle pt-4">
      <MoneyInput
        label="Nhập mức giá đặt của bạn"
        value={amount}
        onChange={setAmount}
        disabled={disabled || placeBidMutation.isPending}
        error={errorMsg ?? undefined}
        hint={`Tối thiểu ${formatMoney(minNextBid)}`}
      />

      <div className="flex flex-wrap gap-2">
        {[0, 1, 2].map((mult) => {
          const suggested = minNextBid + mult * bidIncrement;
          return (
            <button
              key={mult}
              type="button"
              disabled={disabled || placeBidMutation.isPending}
              onClick={() => setAmount(suggested)}
              className="rounded-md bg-surface-subtle px-3 py-1.5 text-caption font-medium text-text hover:bg-surface-muted tabular disabled:opacity-50"
            >
              {formatMoney(suggested)}
            </button>
          );
        })}
      </div>

      <Button
        type="submit"
        variant="money"
        size="xl"
        loading={placeBidMutation.isPending}
        disabled={disabled}
        className="w-full"
      >
        Đặt giá ngay
      </Button>
    </form>
  );
}
