import type {
  AvatarResponse,
  MessageResponse,
  UserProfile,
} from "@/lib/api/contract";

export type { AvatarResponse, MessageResponse, UserProfile };

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber: string | null;
  address: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
