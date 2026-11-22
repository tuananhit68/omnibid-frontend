"use client";

import type { ReactNode } from "react";
import { AdminLayout } from "@/components/layout";
import { useAdminStatistics } from "../hooks";

export function AdminLayoutShell({ children }: { children: ReactNode }) {
  const { data } = useAdminStatistics(true);
  return (
    <AdminLayout pendingReports={data?.pendingReports ?? 0}>
      {children}
    </AdminLayout>
  );
}
