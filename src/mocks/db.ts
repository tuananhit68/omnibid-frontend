import { dayjs, VIETNAM_TIMEZONE } from "@/lib/format";
import type { PaymentStatus } from "@/types/enums";
import { createSeedDatabase, type MockDatabase } from "./seed";

const STORAGE_KEY = "omnibid_mock_db_v4";

let memoryDb: MockDatabase | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getMockDb(): MockDatabase {
  if (memoryDb) return memoryDb;

  if (isBrowser()) {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        memoryDb = JSON.parse(raw) as MockDatabase;
        return memoryDb;
      } catch {
        // Fallback to fresh seed
      }
    }
  }

  memoryDb = createSeedDatabase();
  persistMockDb();
  return memoryDb;
}

export function persistMockDb(): void {
  if (!isBrowser() || !memoryDb) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memoryDb));
  } catch {
    // Bỏ qua lỗi quota sessionStorage (ví dụ khi upload nhiều ảnh lớn)
  }
}

export function resetMockDb(): MockDatabase {
  memoryDb = createSeedDatabase();
  if (isBrowser()) {
    sessionStorage.removeItem(STORAGE_KEY);
  }
  persistMockDb();
  return memoryDb;
}

export function mockNowMs(): number {
  const db = getMockDb();
  return Date.now() + db.clockOffsetMs;
}

export function mockNowIso(): string {
  return dayjs(mockNowMs()).tz(VIETNAM_TIMEZONE).format();
}

export function advanceMockClock(deltaMs: number): string {
  const db = getMockDb();
  db.clockOffsetMs += deltaMs;
  persistMockDb();
  return mockNowIso();
}

export function setDefaultPaymentOutcome(outcome: PaymentStatus): void {
  const db = getMockDb();
  db.defaultPaymentOutcome = outcome;
  persistMockDb();
}

/**
 * Ẩn danh tên người đặt giá theo API_SPEC_v4 §3: ký tự đầu + *** + ký tự cuối (ví dụ n***h)
 */
export function maskBidderName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "***";
  if (trimmed.length === 1) return `${trimmed}***`;
  const first = trimmed.charAt(0).toLowerCase();
  const last = trimmed.charAt(trimmed.length - 1).toLowerCase();
  return `${first}***${last}`;
}
