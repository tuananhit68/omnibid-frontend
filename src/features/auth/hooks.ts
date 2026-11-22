"use client";

import { useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { QueryClientContext, useMutation } from "@tanstack/react-query";
import { clearSession, saveSession } from "@/lib/auth/session";
import { resetWsClient } from "@/lib/ws";
import { loginUser, logoutUser, registerUser } from "./api";
import type { LoginRequest, RegisterRequest } from "./types";

export function useRegister() {
  return useMutation({
    mutationFn: (body: RegisterRequest) => registerUser(body),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginUser(credentials),
    onSuccess: (loginResp) => {
      saveSession(loginResp);
    },
  });
}

/**
 * Đăng xuất khỏi mọi thiết bị: gọi POST /auth/logout, luôn xóa phiên
 * (kể cả khi lỗi mạng), xóa cache TanStack Query, đóng WS và về /login.
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useContext(QueryClientContext);
  const [isPending, setIsPending] = useState(false);

  const logout = useCallback(async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      await logoutUser();
    } catch {
      // Luôn đăng xuất ở client kể cả lỗi mạng hoặc token đã hết hạn
    } finally {
      clearSession();
      queryClient?.clear();
      resetWsClient();
      setIsPending(false);
      router.push("/login");
    }
  }, [isPending, queryClient, router]);

  return { logout, isPending };
}
