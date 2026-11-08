"use client";

import { useSyncExternalStore, useRef, useEffect, useCallback } from "react";
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

const defaultCountdown: CountdownInfo = {
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

  const subscribe = useCallback((callback: () => void) => {
    const interval = setInterval(callback, 1000);
    return () => clearInterval(interval);
  }, []);

  const getSnapshot = useCallback(() => {
    return calculateCountdown(endTime, serverOffsetMs);
  }, [endTime, serverOffsetMs]);

  const getServerSnapshot = useCallback(() => {
    return defaultCountdown;
  }, []);

  const countdown = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const hasTriggeredRef = useRef(false);
  useEffect(() => {
    if (countdown.isZero && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      onExpireRef.current?.();
    }
  }, [countdown.isZero]);

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
      {/* Cột trái: Nhãn và thời gian kết thúc */}
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

      {/* Cột phải: Con số đếm ngược */}
      {countdown.isZero ? (
        <div
          className={cn(
            "text-h3 font-bold",
            isUrgent ? "text-danger-strong" : "text-warning-strong"
          )}
        >
          Đang chốt phiên…
        </div>
      ) : (
        <div>
          {/* Desktop: 3 nhóm số có chữ giờ / phút / giây */}
          <div className="hidden sm:flex items-center gap-3 tabular">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "text-[28px] leading-[36px] font-bold",
                  isUrgent ? "text-danger-strong" : "text-warning-strong"
                )}
              >
                {countdown.hours}
              </span>
              <span className="text-[12px] text-text-tertiary">giờ</span>
            </div>
            <span
              className={cn(
                "text-[24px] font-bold pb-4",
                isUrgent ? "text-danger-strong" : "text-warning-strong"
              )}
            >
              :
            </span>
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "text-[28px] leading-[36px] font-bold",
                  isUrgent ? "text-danger-strong" : "text-warning-strong"
                )}
              >
                {countdown.minutes}
              </span>
              <span className="text-[12px] text-text-tertiary">phút</span>
            </div>
            <span
              className={cn(
                "text-[24px] font-bold pb-4",
                isUrgent ? "text-danger-strong" : "text-warning-strong"
              )}
            >
              :
            </span>
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "text-[28px] leading-[36px] font-bold",
                  isUrgent ? "text-danger-strong" : "text-warning-strong"
                )}
              >
                {countdown.seconds}
              </span>
              <span className="text-[12px] text-text-tertiary">giây</span>
            </div>
          </div>

          {/* Mobile: Gộp chuỗi 01:12:40 */}
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
