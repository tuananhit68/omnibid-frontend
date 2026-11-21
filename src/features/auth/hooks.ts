"use client";

import { useMutation } from "@tanstack/react-query";
import { saveSession } from "@/lib/auth/session";
import { loginUser, registerUser } from "./api";
import type { LoginRequest, RegisterRequest } from "./types";

export function useRegister() {
  return useMutation({
    mutationFn: (body: RegisterRequest) => registerUser(body),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: ({ credentials }: { credentials: LoginRequest; rememberMe?: boolean }) =>
      loginUser(credentials),
    onSuccess: (loginResp) => {
      saveSession(loginResp);
    },
  });
}
