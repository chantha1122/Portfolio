import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
};

export default function DashboardCard({
  children,
  className,
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-black/[0.065] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_8px_24px_rgba(15,23,42,0.035)] dark:border-white/[0.075] dark:bg-[#0d0f19] dark:shadow-none",
        className,
      )}
    >
      {children}
    </section>
  );
}
