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
 * Định dạng tiền tệ VND: 21.500.000 ₫
 * Dấu chấm hàng nghìn, cách một khoảng và ký hiệu ₫
 */
export function formatMoney(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") {
    return "0 ₫";
  }
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (isNaN(num)) {
    return "0 ₫";
  }
  const formattedNumber = Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedNumber} ₫`;
}

/**
 * Định dạng số nguyên có dấu chấm hàng nghìn (dành cho ô nhập tiền hoặc số lượng)
 */
export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "0";
  }
  const num = typeof value === "string" ? Number(value) : value;
  if (isNaN(num)) {
    return "0";
  }
  return Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Phân tích chuỗi LocalDateTime không múi giờ của backend thành Dayjs giờ Việt Nam
 */
export function parseBackendDateTime(
  value: string | Date | null | undefined
): dayjs.Dayjs | null {
  if (!value) return null;
  if (value instanceof Date) {
    return dayjs(value).tz(VIETNAM_TIMEZONE);
  }
  // Nếu chuỗi ISO có dạng 2026-10-28T21:30:00 (không múi giờ)
  return dayjs.tz(value, VIETNAM_TIMEZONE);
}

/**
 * Định dạng chuỗi ngày giờ theo định dạng chỉ định (mặc định DD/MM/YYYY HH:mm)
 */
export function formatDateTime(
  value: string | Date | null | undefined,
  template = "DD/MM/YYYY HH:mm"
): string {
  const d = parseBackendDateTime(value);
  if (!d || !d.isValid()) return "--";
  return d.format(template);
}

/**
 * Định dạng ngày: DD/MM/YYYY
 */
export function formatDate(value: string | Date | null | undefined): string {
  return formatDateTime(value, "DD/MM/YYYY");
}

/**
 * Định dạng giờ: HH:mm
 */
export function formatTime(value: string | Date | null | undefined): string {
  return formatDateTime(value, "HH:mm");
}

/**
 * Định dạng thời gian tương đối: ví dụ "5 phút trước", "vừa xong"
 */
export function formatRelativeTime(
  value: string | Date | null | undefined,
  now = dayjs()
): string {
  const d = parseBackendDateTime(value);
  if (!d || !d.isValid()) return "--";
  return d.from(now);
}

/**
 * Chuyển Dayjs thành chuỗi gửi lên backend theo chuẩn LocalDateTime Việt Nam
 * Định dạng: YYYY-MM-DDTHH:mm:ss (không có Z)
 */
export function toBackendDateTimeString(
  date: dayjs.Dayjs | Date | string
): string {
  const d = dayjs(date).tz(VIETNAM_TIMEZONE);
  return d.format("YYYY-MM-DDTHH:mm:ss");
}

/**
 * Thông tin đếm ngược thời gian còn lại
 */
export interface CountdownInfo {
  hours: string;
  minutes: string;
  seconds: string;
  totalSeconds: number;
  formatted: string;
  isLessThanFiveMinutes: boolean;
  isZero: boolean;
}

/**
 * Tính đếm ngược thời gian từ thời điểm kết thúc và độ lệch giờ máy chủ (serverOffsetMs)
 */
export function calculateCountdown(
  endTime: string | Date | null | undefined,
  serverOffsetMs = 0
): CountdownInfo {
  const end = parseBackendDateTime(endTime);
  if (!end || !end.isValid()) {
    return {
      hours: "00",
      minutes: "00",
      seconds: "00",
      totalSeconds: 0,
      formatted: "00:00:00",
      isLessThanFiveMinutes: false,
      isZero: true,
    };
  }

  // Giờ hiện tại cộng với độ lệch máy chủ
  const currentServerTime = dayjs().tz(VIETNAM_TIMEZONE).add(serverOffsetMs, "millisecond");
  const diffMs = end.diff(currentServerTime);

  if (diffMs <= 0) {
    return {
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
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const hStr = pad(hours);
  const mStr = pad(minutes);
  const sStr = pad(seconds);

  return {
    hours: hStr,
    minutes: mStr,
    seconds: sStr,
    totalSeconds,
    formatted: `${hStr}:${mStr}:${sStr}`,
    isLessThanFiveMinutes: totalSeconds <= 300,
    isZero: false,
  };
}

/**
 * Che tên hiển thị bảo mật: Tr***g, Ng***n
 */
export function maskName(name: string | null | undefined): string {
  if (!name) return "***";
  const trimmed = name.trim();
  if (trimmed.length <= 2) {
    return `${trimmed.charAt(0)}*`;
  }
  const first = trimmed.slice(0, 2);
  const last = trimmed.slice(-1);
  return `${first}***${last}`;
}

/**
 * Che số điện thoại bảo mật: 090****123
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "***";
  const clean = phone.replace(/\s+/g, "");
  if (clean.length < 7) return clean;
  const start = clean.slice(0, 3);
  const end = clean.slice(-3);
  return `${start}****${end}`;
}

/**
 * Định dạng mã hiển thị: #AUC-9821, #ORD-8841
 */
export function formatDisplayCode(prefix: string, id: string | number): string {
  if (!id) return "";
  const strId = id.toString();
  if (strId.startsWith(prefix) || strId.startsWith(`#${prefix}`)) {
    return strId.startsWith("#") ? strId : `#${strId}`;
  }
  return `#${prefix}-${strId}`;
}

export { dayjs };
