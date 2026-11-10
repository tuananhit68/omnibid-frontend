"use client";

import { useMutation } from "@tanstack/react-query";
import { saveAuthSession } from "@/lib/api";
import { loginUser, registerUser } from "./api";
import type { LoginRequest, RegisterRequest } from "./types";

export function useRegister() {
  return useMutation({
    mutationFn: (body: RegisterRequest) => registerUser(body),
    onSuccess: (auth) => {
      saveAuthSession(auth, true);
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: ({
      credentials,
    }: {
      credentials: LoginRequest;
      rememberMe: boolean;
    }) => loginUser(credentials),
    onSuccess: (auth, variables) => {
      saveAuthSession(auth, variables.rememberMe);
    },
  });
}

