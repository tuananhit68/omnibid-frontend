"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { clearSession, updateSessionUser } from "@/lib/auth/session";
import { resetWsClient } from "@/lib/ws";
import { changePassword, getMe, updateMe, uploadAvatar } from "./api";
import type { ChangePasswordRequest, UpdateProfileRequest } from "./types";

export const accountKeys = {
  all: ["account"] as const,
  me: () => [...accountKeys.all, "me"] as const,
};

export function useMe() {
  return useQuery({
    queryKey: accountKeys.me(),
    queryFn: getMe,
    staleTime: 30_000,
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateProfileRequest) => updateMe(body),
    onSuccess: (profile) => {
      queryClient.setQueryData(accountKeys.me(), profile);
      updateSessionUser({
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
      });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: ({ avatarUrl }) => {
      queryClient.setQueryData(accountKeys.me(), (prev: unknown) => {
        if (prev && typeof prev === "object") {
          return { ...prev, avatarUrl };
        }
        return prev;
      });
      void queryClient.invalidateQueries({ queryKey: accountKeys.me() });
      updateSessionUser({ avatarUrl });
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (body: ChangePasswordRequest) => changePassword(body),
    onSuccess: () => {
      clearSession();
      queryClient.clear();
      resetWsClient();
      router.push("/login?reason=password-changed");
    },
  });
}
