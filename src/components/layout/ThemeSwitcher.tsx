"use client";

import { Moon, Sun } from "lucide-react";

import { useLocale } from "next-intl";

import { cn } from "@/lib/cn";

const THEME_COOKIE_KEY = "chantha-theme";

type Theme = "light" | "dark";

type ThemeSwitcherProps = {
  variant?: "default" | "dashboard";
};

export default function ThemeSwitcher({
  variant = "default",
}: ThemeSwitcherProps) {
  const locale = useLocale();

  const setTheme = (theme: Theme) => {
    const isDark = theme === "dark";

    document.documentElement.classList.toggle("dark", isDark);

    document.cookie =
      `${THEME_COOKIE_KEY}=${theme}; ` +
      "Path=/; " +
      "Max-Age=31536000; " +
      "SameSite=Lax";
  };

  const toggleTheme = () => {
    const currentlyDark = document.documentElement.classList.contains("dark");

    setTheme(currentlyDark ? "light" : "dark");
  };

  const darkLabel = locale === "km" ? "ងងឹត" : "Dark";

  const lightLabel = locale === "km" ? "ភ្លឺ" : "Light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "font-body inline-flex items-center justify-center border border-black/[0.08] bg-white text-[var(--foreground)] transition hover:bg-black/[0.03] dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:bg-white/[0.055]",

        variant === "dashboard"
          ? "h-9 gap-1.5 rounded-xl px-3 text-[12px] font-medium"
          : "rounded-full px-4 py-2 text-sm font-medium",
      )}
      aria-label="Change theme"
    >
      <span className="inline-flex items-center gap-1.5 dark:hidden">
        <Moon size={14} strokeWidth={1.8} />

        {darkLabel}
      </span>

      <span className="hidden items-center gap-1.5 dark:inline-flex">
        <Sun size={14} strokeWidth={1.8} />

        {lightLabel}
      </span>
    </button>
  );
}
