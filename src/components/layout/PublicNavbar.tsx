"use client";

import { useEffect, useRef, useState } from "react";

import { Menu, X } from "lucide-react";

import { motion } from "framer-motion";

import { usePathname } from "next/navigation";

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

type PortfolioNavigationDetail = {
  href: string;
};

const NAVBAR_OFFSET = 150;

const NAVIGATION_START_EVENT = "portfolio:navigation-start";
const NAVIGATION_END_EVENT = "portfolio:navigation-end";

export default function PublicNavbar({ locale }: Props) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const [activeHref, setActiveHref] = useState("#home");

  const frameRef = useRef<number | null>(null);

  const manualNavigationRef = useRef<string | null>(null);

  const khmer = locale === "km";

  /* =====================================================
     DETECT HOMEPAGE
     ===================================================== */

  const isHomePage =
    pathname === `/${locale}` || pathname === `/${locale}/` || pathname === "/";

  /*
   * Homepage:
   * #gallery
   *
   * Detail page:
   * /en#gallery
   * /km#gallery
   */
  function getNavigationHref(hash: string) {
    if (isHomePage) {
      return hash;
    }

    return `/${locale}${hash}`;
  }

  /* =====================================================
     ACTIVE SECTION
     ===================================================== */

  useEffect(() => {
    /*
     * Project detail / projects archive / journey archive
     * do not contain all homepage sections.
     *
     * Scroll spy is only needed on the homepage.
     */
    if (!isHomePage) {
      setActiveHref("#home");

      return;
    }

    const updateActiveSection = () => {
      frameRef.current = null;

      /*
       * Navbar item was clicked and Lenis is still moving.
       */
      if (manualNavigationRef.current) {
        setActiveHref(manualNavigationRef.current);

        return;
      }

      let currentHref = "#home";

      for (const [href] of items) {
        const id = href.slice(1);

        const section = document.getElementById(id);

        if (!section) {
          continue;
        }

        const rect = section.getBoundingClientRect();

        if (rect.top <= NAVBAR_OFFSET) {
          currentHref = href;
        }
      }

      /*
       * Contact can be shorter than the viewport.
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

    /* ===================================================
       LENIS NAVIGATION START
       =================================================== */

    const handleNavigationStart = (event: Event) => {
      const customEvent = event as CustomEvent<PortfolioNavigationDetail>;

      const href = customEvent.detail?.href;

      if (!href) {
        return;
      }

      manualNavigationRef.current = href;

      /*
       * Move line immediately.
       */
      setActiveHref(href);
    };

    /* ===================================================
       LENIS NAVIGATION END
       =================================================== */

    const handleNavigationEnd = (event: Event) => {
      const customEvent = event as CustomEvent<PortfolioNavigationDetail>;

      const href = customEvent.detail?.href;

      if (href && manualNavigationRef.current === href) {
        manualNavigationRef.current = null;
      }

      window.requestAnimationFrame(updateActiveSection);
    };

    /* ===================================================
       USER INTERRUPTS LENIS
       =================================================== */

    const cancelManualNavigation = () => {
      if (!manualNavigationRef.current) {
        return;
      }

      manualNavigationRef.current = null;

      handleScroll();
    };

    updateActiveSection();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    window.addEventListener(NAVIGATION_START_EVENT, handleNavigationStart);

    window.addEventListener(NAVIGATION_END_EVENT, handleNavigationEnd);

    window.addEventListener("wheel", cancelManualNavigation, {
      passive: true,
    });

    window.addEventListener("touchstart", cancelManualNavigation, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      window.removeEventListener("resize", handleScroll);

      window.removeEventListener(NAVIGATION_START_EVENT, handleNavigationStart);

      window.removeEventListener(NAVIGATION_END_EVENT, handleNavigationEnd);

      window.removeEventListener("wheel", cancelManualNavigation);

      window.removeEventListener("touchstart", cancelManualNavigation);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isHomePage]);

  /* =====================================================
     NAV CLICK
     ===================================================== */

  function handleNavClick(hash: string) {
    setOpen(false);

    /*
     * On a detail page we are leaving this page,
     * so don't try to run homepage scroll-spy.
     */
    if (!isHomePage) {
      return;
    }

    setActiveHref(hash);

    const target = document.getElementById(hash.slice(1));

    if (target) {
      /*
       * PortfolioMotion will finish the Lenis navigation
       * and send navigation-end.
       */
      manualNavigationRef.current = hash;
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <div className="portfolio-nav mx-auto max-w-[1240px] rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* =================================================
              LOGO
             ================================================= */}

          <a
            href={getNavigationHref("#home")}
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
              DESKTOP
             ================================================= */}

          <nav className="hidden items-center gap-0.5 xl:flex">
            {items.map(([hash, en, km]) => {
              const active = isHomePage && activeHref === hash;

              return (
                <a
                  key={hash}
                  href={getNavigationHref(hash)}
                  onClick={() => handleNavClick(hash)}
                  className={
                    active
                      ? "relative rounded-xl px-3 py-2 font-body text-[12px] font-semibold text-[var(--portfolio-text)] transition-colors duration-300"
                      : "relative rounded-xl px-3 py-2 font-body text-[12px] font-medium text-[var(--portfolio-muted)] transition-colors duration-300 hover:text-[var(--portfolio-text)]"
                  }
                >
                  <span className="relative z-10">{khmer ? km : en}</span>

                  {active ? (
                    <motion.span
                      layoutId="portfolio-nav-active"
                      className="absolute inset-x-2 bottom-[3px] h-[2px] rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400"
                      transition={{
                        type: "spring",
                        stiffness: 360,
                        damping: 32,
                        mass: 0.7,
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
            MOBILE
           ================================================= */}

        {open ? (
          <nav className="mt-3 grid gap-1 border-t border-[var(--portfolio-border)] pt-3 xl:hidden">
            {items.map(([hash, en, km]) => {
              const active = isHomePage && activeHref === hash;

              return (
                <a
                  key={hash}
                  href={getNavigationHref(hash)}
                  onClick={() => handleNavClick(hash)}
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
                        stiffness: 360,
                        damping: 32,
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
