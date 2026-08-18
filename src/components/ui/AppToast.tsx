"use client";

import { useEffect } from "react";

import { Check, CircleAlert, X } from "lucide-react";

import { cn } from "@/lib/cn";

type AppToastProps = {
  open: boolean;

  message: string;

  variant?: "success" | "error";

  locale?: "en" | "km";

  onClose: () => void;

  duration?: number;
};

export default function AppToast({
  open,
  message,
  variant = "success",
  locale = "en",
  onClose,
  duration = 3200,
}: AppToastProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(onClose, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open, duration, onClose]);

  if (!open) {
    return null;
  }

  const success = variant === "success";

  const Icon = success ? Check : CircleAlert;

  const title =
    locale === "km"
      ? success
        ? "ជោគជ័យ"
        : "មានបញ្ហា"
      : success
        ? "Success"
        : "Error";

  return (
    <div className="fixed right-4 top-[84px] z-[300] w-[calc(100%-32px)] max-w-[330px] sm:right-6">
      <div className="animate-toast-in flex items-center gap-3 rounded-xl border border-black/[0.07] bg-white/95 p-3 shadow-[0_12px_35px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#0d0f19]/95">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",

            success
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
              : "bg-red-500/10 text-red-600 dark:text-red-300",
          )}
        >
          <Icon size={16} strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-body text-[13px] font-semibold text-[var(--foreground)]">
            {title}
          </p>

          <p className="font-body mt-0.5 line-clamp-2 text-[12px] leading-5 text-[var(--foreground-muted)]">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--foreground-muted)] transition hover:bg-black/[0.045] dark:hover:bg-white/[0.055]"
          aria-label="Close"
        >
          <X size={14} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
