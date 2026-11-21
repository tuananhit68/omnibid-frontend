import { dayjs, VIETNAM_TIMEZONE } from "@/lib/format";
import type { LoginResponse, MessageResponse, UserProfile } from "@/lib/api/contract";
import { UserRole, UserStatus } from "@/types/enums";
import {
  checkLoginRateLimit,
  clearLoginFailures,
  createMockToken,
  recordLoginFailure,
  requireMockAuth,
} from "../auth";
import { getMockDb, mockNowIso, mockNowMs, persistMockDb } from "../db";
import { mockError } from "../errors";
import type { MockUser } from "../seed";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function toUserProfile(user: MockUser): UserProfile {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status,
    avatarUrl: user.avatarUrl,
    phoneNumber: user.phoneNumber,
    address: user.address,
    createdAt: user.createdAt,
  };
}

export function handleRegister(body: Record<string, unknown>): UserProfile {
  const fullName = String(body.fullName ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const phoneNumber = String(body.phoneNumber ?? "").trim();

  const fields: Record<string, string> = {};
  if (!fullName || fullName.length < 2) {
    fields.fullName = "Họ tên phải có ít nhất 2 ký tự";
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fields.email = "Email không hợp lệ";
  }
  if (!PASSWORD_REGEX.test(password)) {
    fields.password = "Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và chữ số";
  }
  if (!phoneNumber || phoneNumber.length < 9) {
    fields.phoneNumber = "Số điện thoại không hợp lệ";
  }

  const db = getMockDb();
  if (!fields.email && db.users.some((u) => u.email.toLowerCase() === email)) {
    fields.email = "Email này đã được sử dụng";
  }

  if (Object.keys(fields).length > 0) {
    throw mockError("VALIDATION_ERROR", "Dữ liệu đầu vào không hợp lệ", { fields });
  }

  const newUser: MockUser = {
    id: db.nextIds.user++,
    fullName,
    email,
    password,
    phoneNumber,
    address: null,
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    avatarUrl: null,
    tokenVersion: 1,
    createdAt: mockNowIso(),
  };

  db.users.push(newUser);
  persistMockDb();
  return toUserProfile(newUser);
}

export function handleLogin(body: Record<string, unknown>): LoginResponse {
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    throw mockError("VALIDATION_ERROR", "Vui lòng nhập email và mật khẩu", {
      fields: {
        ...(!email ? { email: "Vui lòng nhập email" } : {}),
        ...(!password ? { password: "Vui lòng nhập mật khẩu" } : {}),
      },
    });
  }

  checkLoginRateLimit(email);

  const db = getMockDb();
  const user = db.users.find((u) => u.email.toLowerCase() === email);

  if (!user || user.password !== password) {
    recordLoginFailure(email);
    throw mockError("UNAUTHORIZED", "Email hoặc mật khẩu không đúng");
  }

  if (user.status === UserStatus.BANNED) {
    throw mockError("ACCOUNT_BANNED");
  }

  clearLoginFailures(email);

  const expiresIn = 86400;
  const expiresAt = dayjs(mockNowMs() + expiresIn * 1000)
    .tz(VIETNAM_TIMEZONE)
    .format();

  return {
    accessToken: createMockToken(user),
    tokenType: "Bearer",
    expiresIn,
    expiresAt,
    role: user.role,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl,
    },
  };
}

export function handleLogout(authHeader?: string): MessageResponse {
  const user = requireMockAuth(authHeader);
  user.tokenVersion += 1;
  persistMockDb();
  return {
    message: "Đăng xuất thành công, mọi phiên đăng nhập của tài khoản đã kết thúc",
  };
}
