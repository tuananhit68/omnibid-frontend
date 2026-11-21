import type { ReactNode } from "react";
import { AccountLayout } from "@/components/layout";

export default function AccountRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AccountLayout>{children}</AccountLayout>;
}
