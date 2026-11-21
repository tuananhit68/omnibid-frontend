import { apiRequest } from "@/lib/api/client";
import type {
  AvatarResponse,
  ChangePasswordRequest,
  MessageResponse,
  UpdateProfileRequest,
  UserProfile,
} from "./types";

export async function getMe(): Promise<UserProfile> {
  return apiRequest<UserProfile>({
    method: "GET",
    url: "/users/me",
  });
}

export async function updateMe(body: UpdateProfileRequest): Promise<UserProfile> {
  return apiRequest<UserProfile>({
    method: "PATCH",
    url: "/users/me",
    data: body,
  });
}

export async function uploadAvatar(file: File): Promise<AvatarResponse> {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest<AvatarResponse>({
    method: "POST",
    url: "/users/me/avatar",
    data: formData,
  });
}

export async function changePassword(
  body: ChangePasswordRequest
): Promise<MessageResponse> {
  return apiRequest<MessageResponse>({
    method: "PATCH",
    url: "/users/me/password",
    data: body,
  });
}
