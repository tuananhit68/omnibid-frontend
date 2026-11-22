import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale("vi");

export const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";

/**
 * Định dạng tiền tệ VND nguyên: 21.500.000 ₫
 */
export function formatMoney(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") {
    return "0 ₫";
  }
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(num)) {
    return "0 ₫";
  }
  const formattedNumber = Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedNumber} ₫`;
}

/**
 * Định dạng số nguyên có dấu chấm hàng nghìn
 */
export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "0";
  }
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) {
    return "0";
  }
  return Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Parse chuỗi ISO 8601 có offset (+07:00 hoặc Z) sang Dayjs giờ Việt Nam.
 */
export function parseBackendDateTime(
  value: string | Date | number | null | undefined
): dayjs.Dayjs | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = dayjs(value);
  if (!parsed.isValid()) return null;
  return parsed.tz(VIETNAM_TIMEZONE);
}

/**
 * Định dạng ngày giờ giờ Việt Nam (mặc định DD/MM/YYYY HH:mm)
 */
export function formatDateTime(
  value: string | Date | number | null | undefined,
  template = "DD/MM/YYYY HH:mm"
): string {
  const d = parseBackendDateTime(value);
  if (!d) return "--";
  return d.format(template);
}

export function formatDate(value: string | Date | number | null | undefined): string {
  return formatDateTime(value, "DD/MM/YYYY");
}

export function formatTime(value: string | Date | number | null | undefined): string {
  return formatDateTime(value, "HH:mm");
}

/**
 * Định dạng giờ đặt giá đến mili giây: HH:mm:ss.SSS
 */
export function formatBidTimestamp(
  value: string | Date | number | null | undefined
): string {
  return formatDateTime(value, "HH:mm:ss.SSS");
}

/**
 * Thời gian tương đối: ví dụ "5 phút trước"
 */
export function formatRelativeTime(
  value: string | Date | number | null | undefined,
  now?: dayjs.Dayjs | Date | number
): string {
  const d = parseBackendDateTime(value);
  if (!d) return "--";
  const base = now ? dayjs(now).tz(VIETNAM_TIMEZONE) : dayjs().tz(VIETNAM_TIMEZONE);
  return d.from(base);
}

/**
 * Chuyển input ngày giờ địa phương (YYYY-MM-DDTHH:mm hoặc Date/Dayjs)
 * thành chuỗi ISO 8601 có offset +07:00 để gửi backend.
 */
export function toBackendDateTimeString(
  date: dayjs.Dayjs | Date | string
): string {
  if (typeof date === "string") {
    // Nếu đã có offset (Z hoặc +/-HH:mm) thì giữ nguyên mốc thời gian và đổi sang +07:00
    if (/(Z|[+-]\d{2}:\d{2})$/.test(date.trim())) {
      return dayjs(date).tz(VIETNAM_TIMEZONE).format();
    }
    return dayjs.tz(date, VIETNAM_TIMEZONE).format();
  }
  return dayjs(date).tz(VIETNAM_TIMEZONE).format();
}

export interface CountdownInfo {
  days: number;
  hours: string;
  minutes: string;
  seconds: string;
  totalSeconds: number;
  formatted: string;
  isLessThanFiveMinutes: boolean;
  isZero: boolean;
}

/**
 * Tính đếm ngược từ endTime (ISO có offset) + serverOffsetMs.
 * Trên 24h hiển thị "X ngày Y giờ", dưới 24h hiển thị "HH:mm:ss".
 */
export function calculateCountdown(
  endTime: string | Date | null | undefined,
  serverOffsetMs = 0,
  nowMs?: number
): CountdownInfo {
  const end = parseBackendDateTime(endTime);
  if (!end) {
    return {
      days: 0,
      hours: "00",
      minutes: "00",
      seconds: "00",
      totalSeconds: 0,
      formatted: "00:00:00",
      isLessThanFiveMinutes: false,
      isZero: true,
    };
  }

  const currentMs = (nowMs ?? Date.now()) + serverOffsetMs;
  const diffMs = end.valueOf() - currentMs;

  if (diffMs <= 0) {
    return {
      days: 0,
      hours: "00",
      minutes: "00",
      seconds: "00",
      totalSeconds: 0,
      formatted: "00:00:00",
      isLessThanFiveMinutes: true,
      isZero: true,
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const remHours = Math.floor((totalSeconds % 86400) / 3600);
  const totalHours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const formatted =
    days >= 1
      ? `${days} ngày ${remHours} giờ`
      : `${pad(totalHours)}:${pad(minutes)}:${pad(seconds)}`;

  return {
    days,
    hours: pad(totalHours),
    minutes: pad(minutes),
    seconds: pad(seconds),
    totalSeconds,
    formatted,
    isLessThanFiveMinutes: totalSeconds <= 300,
    isZero: false,
  };
}

/**
 * Định dạng mã hiển thị: AUC-12, PRD-5, ORD-9, REP-3, USR-4
 */
export function formatDisplayCode(
  prefix: "AUC" | "PRD" | "ORD" | "REP" | "USR" | string,
  id: string | number
): string {
  if (id === "" || id === null || id === undefined) return "";
  const strId = String(id);
  if (strId.startsWith(`${prefix}-`)) return strId;
  return `${prefix}-${strId}`;
}

export { dayjs };
