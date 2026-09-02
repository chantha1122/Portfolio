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
    const root = document.documentElement;

    const isDark = theme === "dark";

    /*
     * Remember exact scroll position.
     */
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    /*
     * Disable transitions for one paint so changing
     * theme does not look like the page/nav is loading.
     */
    root.classList.add("theme-switching");

    const previousScrollBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = "auto";

    /*
     * Change theme immediately.
     */
    root.classList.toggle("dark", isDark);

    /*
     * Persist theme.
     */
    document.cookie =
      `${THEME_COOKIE_KEY}=${theme}; ` +
      "Path=/; " +
      "Max-Age=31536000; " +
      "SameSite=Lax";

    /*
     * Keep current position.
     */
    window.scrollTo(scrollX, scrollY);

    /*
     * Re-enable transitions after browser
     * has painted the new theme.
     */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.style.scrollBehavior = previousScrollBehavior;

        root.classList.remove("theme-switching");
      });
    });
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
