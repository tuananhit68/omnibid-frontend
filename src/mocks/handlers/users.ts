import type { AvatarResponse, MessageResponse, UserProfile } from "@/lib/api/contract";
import { requireMockAuth } from "../auth";
import { persistMockDb } from "../db";
import { mockError } from "../errors";
import { toUserProfile } from "./auth";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function isValidImageMagicBytes(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false;
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
  // PNG: 89 50 4E 47
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return true;
  }
  // WEBP: RIFF....WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return true;
  }
  return false;
}

export async function readValidatedImageAsDataUrl(file: File): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) {
    throw mockError("INVALID_IMAGE", "Dung lượng ảnh vượt quá 5 MB");
  }
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  if (!isValidImageMagicBytes(bytes)) {
    throw mockError("INVALID_IMAGE", "Chỉ hỗ trợ định dạng ảnh JPG, PNG, WEBP");
  }

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(mockError("IMAGE_UPLOAD_FAILED"));
    reader.readAsDataURL(file);
  });
}

export function handleGetMe(authHeader?: string): UserProfile {
  const user = requireMockAuth(authHeader);
  return toUserProfile(user);
}

export function handlePatchMe(
  authHeader: string | undefined,
  body: Record<string, unknown>
): UserProfile {
  const user = requireMockAuth(authHeader);

  if (body.fullName !== undefined) {
    const fullName = String(body.fullName).trim();
    if (fullName.length < 2) {
      throw mockError("VALIDATION_ERROR", "Dữ liệu đầu vào không hợp lệ", {
        fields: { fullName: "Họ tên phải có ít nhất 2 ký tự" },
      });
    }
    user.fullName = fullName;
  }

  if (body.phoneNumber !== undefined) {
    const phone = body.phoneNumber === null ? null : String(body.phoneNumber).trim();
    user.phoneNumber = phone || null;
  }

  if (body.address !== undefined) {
    const addr = body.address === null ? null : String(body.address).trim();
    user.address = addr || null;
  }

  persistMockDb();
  return toUserProfile(user);
}

export function handlePatchPassword(
  authHeader: string | undefined,
  body: Record<string, unknown>
): MessageResponse {
  const user = requireMockAuth(authHeader);
  const currentPassword = String(body.currentPassword ?? "");
  const newPassword = String(body.newPassword ?? "");
  const confirmPassword = String(body.confirmPassword ?? "");

  const fields: Record<string, string> = {};
  if (currentPassword !== user.password) {
    fields.currentPassword = "Mật khẩu hiện tại không đúng";
  }
  if (!PASSWORD_REGEX.test(newPassword)) {
    fields.newPassword = "Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và chữ số";
  }
  if (newPassword !== confirmPassword) {
    fields.confirmPassword = "Xác nhận mật khẩu không khớp";
  }

  if (Object.keys(fields).length > 0) {
    throw mockError("VALIDATION_ERROR", "Dữ liệu đầu vào không hợp lệ", { fields });
  }

  user.password = newPassword;
  user.tokenVersion += 1;
  persistMockDb();

  return { message: "Đổi mật khẩu thành công, vui lòng đăng nhập lại" };
}

export async function handleUploadAvatar(
  authHeader: string | undefined,
  formData: FormData
): Promise<AvatarResponse> {
  const user = requireMockAuth(authHeader);
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw mockError("INVALID_IMAGE", "Vui lòng chọn tệp ảnh hợp lệ");
  }

  const dataUrl = await readValidatedImageAsDataUrl(file);
  user.avatarUrl = dataUrl;
  persistMockDb();

  return { avatarUrl: dataUrl };
}
