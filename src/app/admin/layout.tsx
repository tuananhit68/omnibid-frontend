import type { ReactNode } from "react";
import { AdminLayoutShell } from "@/features/admin/statistics";

export default function AdminRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
