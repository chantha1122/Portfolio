import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type DashboardPageHeaderProps = {
  locale: string;

  eyebrow: string;

  title: string;

  description?: string;

  action?: ReactNode;
};

export default function DashboardPageHeader({
  locale,
  eyebrow,
  title,
  description,
  action,
}: DashboardPageHeaderProps) {
  const isKhmer = locale === "km";

  return (
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div className="min-w-0">
        <p
          className={cn(
            "font-body text-violet-600 dark:text-cyan-300",

            isKhmer
              ? "text-[13px] font-normal leading-6"
              : "text-[11px] font-semibold uppercase tracking-[0.16em]",
          )}
        >
          {eyebrow}
        </p>

        <h1
          className={cn(
            "font-body mt-1.5 text-[var(--foreground)]",

            isKhmer
              ? "text-[28px] font-normal leading-[1.55]"
              : "text-[28px] font-semibold leading-tight",
          )}
        >
          {title}
        </h1>

        {description ? (
          <p
            className={cn(
              "font-body mt-1.5 max-w-2xl text-[var(--foreground-muted)]",

              isKhmer
                ? "text-[14px] font-normal leading-7"
                : "text-[14px] leading-6",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
