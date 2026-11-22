"use client";

import { useMutation } from "@tanstack/react-query";
import { createReport } from "./api";
import type { CreateReportRequest } from "./types";

export function useCreateReport() {
  return useMutation({
    mutationFn: (body: CreateReportRequest) => createReport(body),
  });
}
