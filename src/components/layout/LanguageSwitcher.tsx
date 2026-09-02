"use client";

import { useLayoutEffect } from "react";
import { Languages } from "lucide-react";
import { useLocale } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";

import { cn } from "@/lib/cn";

const POSITION_KEY = "chantha-language-position";

const SECTION_IDS = [
  "home",
  "about",
  "skills",
  "github",
  "experience",
  "projects",
  "certificates",
  "achievements",
  "journey",
  "teaching",
  "gallery",
  "contact",
] as const;

type LanguageSwitcherProps = {
  variant?: "default" | "dashboard";
};

type SavedPosition = {
  sectionId: string | null;
  sectionOffset: number;
  scrollY: number;
};

/* =========================================================
   FIND CURRENT SECTION + POSITION INSIDE IT
   ========================================================= */

function getCurrentPosition(): SavedPosition {
  const scrollY = window.scrollY;

  /*
   * Probe below fixed navbar.
   */
  const probeY = scrollY + 120;

  for (const id of SECTION_IDS) {
    const element = document.getElementById(id);

    if (!element) {
      continue;
    }

    const rect = element.getBoundingClientRect();

    const sectionTop = rect.top + scrollY;

    const sectionBottom = sectionTop + rect.height;

    if (probeY >= sectionTop && probeY < sectionBottom) {
      return {
        sectionId: id,

        /*
         * Keep exact relative position inside section.
         */
        sectionOffset: scrollY - sectionTop,

        scrollY,
      };
    }
  }

  /*
   * For pages such as project details,
   * there may be no homepage section.
   */
  return {
    sectionId: null,
    sectionOffset: 0,
    scrollY,
  };
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function LanguageSwitcher({
  variant = "default",
}: LanguageSwitcherProps) {
  const locale = useLocale();

  const pathname = usePathname();

  const router = useRouter();

  const nextLocale = locale === "en" ? "km" : "en";

  /* =======================================================
     RESTORE AFTER LOCALE CHANGES
     ======================================================= */

  useLayoutEffect(() => {
    const saved = sessionStorage.getItem(POSITION_KEY);

    if (!saved) {
      return;
    }

    let position: SavedPosition;

    try {
      position = JSON.parse(saved) as SavedPosition;
    } catch {
      sessionStorage.removeItem(POSITION_KEY);

      return;
    }

    const root = document.documentElement;

    const previousScrollBehavior = root.style.scrollBehavior;

    /*
     * Prevent smooth-scroll animation while restoring.
     */
    root.style.scrollBehavior = "auto";

    if (position.sectionId) {
      const element = document.getElementById(position.sectionId);

      if (element) {
        const sectionTop = element.getBoundingClientRect().top + window.scrollY;

        const targetY = sectionTop + position.sectionOffset;

        window.scrollTo(0, Math.max(0, targetY));
      } else {
        window.scrollTo(0, position.scrollY);
      }
    } else {
      /*
       * Other public pages:
       * preserve exact scroll position.
       */
      window.scrollTo(0, position.scrollY);
    }

    sessionStorage.removeItem(POSITION_KEY);

    requestAnimationFrame(() => {
      root.style.scrollBehavior = previousScrollBehavior;
    });
  }, [locale]);

  /* =======================================================
     CHANGE LANGUAGE
     ======================================================= */

  const handleLanguageChange = () => {
    const position = getCurrentPosition();

    sessionStorage.setItem(POSITION_KEY, JSON.stringify(position));

    /*
     * IMPORTANT:
     *
     * No /#gallery
     * No scrollIntoView()
     * No router.refresh()
     *
     * scroll:false tells Next.js to keep
     * the current viewport during navigation.
     */
    router.replace(pathname, {
      locale: nextLocale,
      scroll: false,
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
