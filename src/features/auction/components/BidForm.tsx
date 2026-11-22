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
  const [syncedMinNextBid, setSyncedMinNextBid] = useState<number>(minNextBid);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (minNextBid !== syncedMinNextBid) {
    setSyncedMinNextBid(minNextBid);
    if (amount < minNextBid) {
      setAmount(minNextBid);
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!amount || !Number.isInteger(amount) || amount < minNextBid) {
      setErrorMsg(`Mức giá tối thiểu là ${formatMoney(minNextBid)}.`);
      return;
    }

    placeBidMutation.mutate(
      { auctionId, amount },
      {
        onSuccess: (res) => {
          toast.success(`Đặt giá ${formatMoney(res.amount)} thành công.`);
          setAmount(res.minNextBid);
          setSyncedMinNextBid(res.minNextBid);
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            if (
              err.code === "BID_TOO_LOW" &&
              typeof err.details?.minNextBid === "number"
            ) {
              const nextMin = err.details.minNextBid;
              setAmount(nextMin);
              setSyncedMinNextBid(nextMin);
              setErrorMsg(
                `Vừa có người đặt cao hơn, mức tối thiểu mới là ${formatMoney(nextMin)}.`
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

  const isDisabled = disabled || placeBidMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 border-t border-border-subtle pt-4"
      noValidate
    >
      <MoneyInput
        label={`Tối thiểu ${formatMoney(minNextBid)}`}
        value={amount}
        onChange={(val) => {
          setAmount(val);
          if (errorMsg) setErrorMsg(null);
        }}
        disabled={isDisabled}
        error={errorMsg ?? undefined}
      />

      <div className="flex flex-wrap gap-2">
        {[0, 1, 2].map((mult) => {
          const suggested = minNextBid + mult * bidIncrement;
          return (
            <button
              key={mult}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                setAmount(suggested);
                if (errorMsg) setErrorMsg(null);
              }}
              className="min-h-11 md:min-h-9 rounded-md border border-border-brand bg-surface-subtle px-3 py-1.5 text-caption font-medium text-text transition-colors hover:border-primary-600 hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 tabular disabled:opacity-50"
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
        Đặt giá
      </Button>

      <p className="text-caption text-text-tertiary text-center">
        Lượt đặt giá đã ghi nhận không thể rút.
      </p>
    </form>
  );
}
