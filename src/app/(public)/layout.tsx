import type { ReactNode } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function PublicGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}

