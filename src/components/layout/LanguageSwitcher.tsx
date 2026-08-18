"use client";

import { Languages } from "lucide-react";

import { useLocale } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";

import { cn } from "@/lib/cn";

type LanguageSwitcherProps = {
  variant?: "default" | "dashboard";
};

export default function LanguageSwitcher({
  variant = "default",
}: LanguageSwitcherProps) {
  const locale = useLocale();

  const pathname = usePathname();

  const router = useRouter();

  const nextLocale = locale === "en" ? "km" : "en";

  const handleLanguageChange = () => {
    router.replace(pathname, {
      locale: nextLocale,
    });
  };

  return (
    <button
      type="button"
      onClick={handleLanguageChange}
      className={cn(
        "font-body inline-flex items-center justify-center border border-black/[0.08] bg-white text-[var(--foreground)] transition hover:bg-black/[0.03] dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:bg-white/[0.055]",

        variant === "dashboard"
          ? "h-9 min-w-9 gap-1.5 rounded-xl px-3 text-[12px] font-medium"
          : "rounded-full px-4 py-2 text-sm font-medium",
      )}
      aria-label="Change language"
    >
      {variant === "dashboard" ? (
        <Languages size={14} strokeWidth={1.8} />
      ) : null}

      <span>{locale === "en" ? "ខ្មែរ" : "EN"}</span>
    </button>
  );
}
