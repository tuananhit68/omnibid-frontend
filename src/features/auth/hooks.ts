"use client";

import { useMutation } from "@tanstack/react-query";
import { saveAuthSession } from "@/lib/api";
import { registerUser } from "./api";
import type { RegisterRequest } from "./types";

export function useRegister() {
  return useMutation({
    mutationFn: (body: RegisterRequest) => registerUser(body),
    onSuccess: (auth) => {
      saveAuthSession(auth);
    },
  });
}

