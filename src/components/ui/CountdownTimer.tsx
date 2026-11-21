"use client";

import { useSyncExternalStore, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";
import {
  calculateCountdown,
  formatDateTime,
  type CountdownInfo,
} from "@/lib/format";

export interface CountdownTimerProps {
  endTime: string | Date | null | undefined;
  serverOffsetMs?: number;
  onExpire?: () => void;
  className?: string;
}

// Một bộ đếm 1 giây dùng chung cho toàn bộ các CountdownTimer trên trang
const tickListeners = new Set<() => void>();
let sharedInterval: ReturnType<typeof setInterval> | null = null;
let sharedNowMs = 0;

function subscribeSharedTicker(listener: () => void): () => void {
  tickListeners.add(listener);
  if (sharedInterval === null && typeof window !== "undefined") {
    sharedNowMs = Date.now();
    sharedInterval = setInterval(() => {
      sharedNowMs = Date.now();
      tickListeners.forEach((fn) => fn());
    }, 1000);
  }
  return () => {
    tickListeners.delete(listener);
    if (tickListeners.size === 0 && sharedInterval !== null) {
      clearInterval(sharedInterval);
      sharedInterval = null;
    }
  };
}

function getSharedNowMs(): number {
  if (sharedNowMs === 0 && typeof window !== "undefined") {
    sharedNowMs = Date.now();
  }
  return sharedNowMs;
}

export function useSharedNowMs(): number {
  return useSyncExternalStore(subscribeSharedTicker, getSharedNowMs, () => 0);
}

const defaultCountdown: CountdownInfo = {
  days: 0,
  hours: "00",
  minutes: "00",
  seconds: "00",
  totalSeconds: 0,
  formatted: "00:00:00",
  isLessThanFiveMinutes: false,
  isZero: false,
};

export function CountdownTimer({
  endTime,
  serverOffsetMs = 0,
  onExpire,
  className,
}: CountdownTimerProps) {
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const nowMs = useSyncExternalStore(
    subscribeSharedTicker,
    getSharedNowMs,
    () => 0
  );

  const countdown =
    nowMs === 0
      ? defaultCountdown
      : calculateCountdown(endTime, serverOffsetMs, nowMs);

  const hasTriggeredRef = useRef(false);
  useEffect(() => {
    hasTriggeredRef.current = false;
  }, [endTime]);

  useEffect(() => {
    if (nowMs > 0 && countdown.isZero && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      onExpireRef.current?.();
    }
  }, [countdown.isZero, nowMs]);

  const formattedEnd = formatDateTime(endTime, "DD/MM/YYYY HH:mm");
  const isUrgent = countdown.isLessThanFiveMinutes;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 md:p-5 rounded-xl border transition-colors",
        isUrgent
          ? "bg-danger-bg border-danger-border"
          : "bg-warning-bg border-warning-border",
        className
      )}
    >
      <div className="space-y-0.5">
        <span
          className={cn(
            "label font-medium",
            isUrgent ? "text-danger-strong" : "text-warning-strong"
          )}
        >
          Thời gian còn lại
        </span>
        <p className="text-caption text-text-tertiary">
          Kết thúc {formattedEnd} (GMT+7)
        </p>
      </div>

      {countdown.isZero ? (
        <div
          className={cn(
            "text-h3 font-bold",
            isUrgent ? "text-danger-strong" : "text-warning-strong"
          )}
        >
          Đang chốt phiên…
        </div>
      ) : countdown.days >= 1 ? (
        <div
          className={cn(
            "text-timer tabular",
            isUrgent ? "text-danger-strong" : "text-warning-strong"
          )}
        >
          {countdown.formatted}
        </div>
      ) : (
        <div>
          <div className="hidden sm:flex items-center gap-3 tabular">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "text-timer",
                  isUrgent ? "text-danger-strong" : "text-warning-strong"
                )}
              >
                {countdown.hours}
              </span>
              <span className="text-caption text-text-tertiary">giờ</span>
            </div>
            <span
              className={cn(
                "text-h2 font-bold pb-4",
                isUrgent ? "text-danger-strong" : "text-warning-strong"
              )}
            >
              :
            </span>
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "text-timer",
                  isUrgent ? "text-danger-strong" : "text-warning-strong"
                )}
              >
                {countdown.minutes}
              </span>
              <span className="text-caption text-text-tertiary">phút</span>
            </div>
            <span
              className={cn(
                "text-h2 font-bold pb-4",
                isUrgent ? "text-danger-strong" : "text-warning-strong"
              )}
            >
              :
            </span>
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "text-timer",
                  isUrgent ? "text-danger-strong" : "text-warning-strong"
                )}
              >
                {countdown.seconds}
              </span>
              <span className="text-caption text-text-tertiary">giây</span>
            </div>
          </div>

          <div
            className={cn(
              "sm:hidden text-timer tabular",
              isUrgent ? "text-danger-strong" : "text-warning-strong"
            )}
          >
            {countdown.formatted}
          </div>
        </div>
      )}
    </div>
  );
}
