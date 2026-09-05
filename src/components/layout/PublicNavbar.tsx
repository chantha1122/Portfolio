"use client";

import { useEffect, useRef, useState } from "react";

import { Menu, X } from "lucide-react";

import { motion } from "framer-motion";

import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";

const items = [
  ["#home", "Home", "ទំព័រដើម"],

  ["#about", "About", "អំពីខ្ញុំ"],

  ["#skills", "Skills", "ជំនាញ"],

  ["#experience", "Experience", "បទពិសោធន៍"],

  ["#projects", "Projects", "គម្រោង"],

  ["#journey", "Journey", "កំណត់ត្រា"],

  ["#gallery", "Gallery", "វិចិត្រសាល"],

  ["#contact", "Contact", "ទំនាក់ទំនង"],
] as const;

type Props = {
  locale: "en" | "km";
};

export default function PublicNavbar({ locale }: Props) {
  const [open, setOpen] = useState(false);

  const [activeHref, setActiveHref] = useState("#home");

  const frameRef = useRef<number | null>(null);

  const khmer = locale === "km";

  /* =====================================================
     ACTIVE SECTION WHILE SCROLLING
     ===================================================== */

  useEffect(() => {
    const updateActiveSection = () => {
      frameRef.current = null;

      const navbarOffset = 150;

      let currentHref = "#home";

      for (const [href] of items) {
        const id = href.slice(1);

        const section = document.getElementById(id);

        if (!section) {
          continue;
        }

        const rect = section.getBoundingClientRect();

        /*
         * If the section has reached the
         * navbar area, consider it active.
         */
        if (rect.top <= navbarOffset) {
          currentHref = href;
        }
      }

      /*
       * Special case:
       * when visitor reaches bottom,
       * force Contact active.
       */
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 80;

      if (nearBottom && document.getElementById("contact")) {
        currentHref = "#contact";
      }

      setActiveHref(currentHref);
    };

    const handleScroll = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);

      window.removeEventListener("resize", handleScroll);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  /* =====================================================
     NAV CLICK
     ===================================================== */

  function handleNavClick(href: string) {
    setActiveHref(href);

    setOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <div className="portfolio-nav mx-auto max-w-[1240px] rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* =================================================
              LOGO
             ================================================= */}

          <a
            href="#home"
            onClick={() => handleNavClick("#home")}
            className="group flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--portfolio-gradient)] font-display text-xl text-white shadow-[0_8px_28px_rgba(89,111,255,0.28)]">
              C
            </span>

            <div className="hidden sm:block">
              <p className="font-display text-xl leading-none tracking-wide">
                CHANTHA
              </p>

              <p className="font-body mt-1 text-[10px] text-[var(--portfolio-muted)]">
                Portfolio
              </p>
            </div>
          </a>

          {/* =================================================
              DESKTOP NAV
             ================================================= */}

          <nav className="hidden items-center gap-0.5 xl:flex">
            {items.map(([href, en, km]) => {
              const active = activeHref === href;

              return (
                <a
                  key={href}
                  href={href}
                  onClick={() => handleNavClick(href)}
                  className={
                    active
                      ? "relative rounded-xl px-3 py-2 font-body text-[12px] font-semibold text-[var(--portfolio-text)] transition-colors duration-300"
                      : "relative rounded-xl px-3 py-2 font-body text-[12px] font-medium text-[var(--portfolio-muted)] transition-colors duration-300 hover:text-[var(--portfolio-text)]"
                  }
                >
                  <span className="relative z-10">{khmer ? km : en}</span>

                  {/* =====================================
                        MOVING ACTIVE INDICATOR
                       ===================================== */}

                  {active ? (
                    <motion.span
                      layoutId="portfolio-nav-active"
                      className="absolute inset-x-2 bottom-[3px] h-[2px] rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400"
                      transition={{
                        type: "spring",

                        stiffness: 420,

                        damping: 34,

                        mass: 0.65,
                      }}
                    />
                  ) : null}
                </a>
              );
            })}
          </nav>

          {/* =================================================
              ACTIONS
             ================================================= */}

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            <ThemeSwitcher />

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="portfolio-nav-button flex h-10 w-10 items-center justify-center rounded-xl xl:hidden"
              aria-label="Toggle navigation"
              aria-expanded={open}
            >
              {open ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* =================================================
            MOBILE NAV
           ================================================= */}

        {open ? (
          <nav className="mt-3 grid gap-1 border-t border-[var(--portfolio-border)] pt-3 xl:hidden">
            {items.map(([href, en, km]) => {
              const active = activeHref === href;

              return (
                <a
                  key={href}
                  href={href}
                  onClick={() => handleNavClick(href)}
                  className={
                    active
                      ? "relative overflow-hidden rounded-xl bg-[var(--portfolio-hover)] px-3 py-2.5 font-body text-[13px] font-semibold text-[var(--portfolio-text)]"
                      : "relative rounded-xl px-3 py-2.5 font-body text-[13px] text-[var(--portfolio-muted)] transition hover:bg-[var(--portfolio-hover)] hover:text-[var(--portfolio-text)]"
                  }
                >
                  {active ? (
                    <motion.span
                      layoutId="portfolio-mobile-nav-active"
                      className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-gradient-to-b from-violet-500 to-cyan-400"
                      transition={{
                        type: "spring",

                        stiffness: 420,

                        damping: 34,
                      }}
                    />
                  ) : null}

                  <span className="relative z-10">{khmer ? km : en}</span>
                </a>
              );
            })}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
