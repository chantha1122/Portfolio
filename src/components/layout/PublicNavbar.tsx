"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";

const items = [
  ["#home", "Home", "ទំព័រដើម"],
  ["#about", "About", "អំពីខ្ញុំ"],
  ["#skills", "Skills", "ជំនាញ"],
  ["#experience", "Experience", "បទពិសោធន៍"],
  ["#projects", "Projects", "គម្រោង"],
  ["#journey", "Journey", "ដំណើរ"],
  ["#contact", "Contact", "ទំនាក់ទំនង"],
] as const;

type Props = {
  locale: "en" | "km";
};

export default function PublicNavbar({ locale }: Props) {
  const [open, setOpen] = useState(false);
  const khmer = locale === "km";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <div className="portfolio-nav mx-auto max-w-[1240px] rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <a href="#home" onClick={() => setOpen(false)} className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--portfolio-gradient)] font-display text-xl text-white shadow-[0_8px_28px_rgba(89,111,255,0.28)]">
              C
            </span>
            <div className="hidden sm:block">
              <p className="font-display text-xl leading-none tracking-wide">CHANTHA</p>
              <p className="font-body mt-1 text-[10px] text-[var(--portfolio-muted)]">Portfolio</p>
            </div>
          </a>

          <nav className="hidden items-center gap-0.5 xl:flex">
            {items.map(([href, en, km]) => (
              <a
                key={href}
                href={href}
                className="font-body rounded-xl px-3 py-2 text-[12px] font-medium text-[var(--portfolio-muted)] transition hover:bg-[var(--portfolio-hover)] hover:text-[var(--portfolio-text)]"
              >
                {khmer ? km : en}
              </a>
            ))}
          </nav>

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

        {open ? (
          <nav className="mt-3 grid gap-1 border-t border-[var(--portfolio-border)] pt-3 xl:hidden">
            {items.map(([href, en, km]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="font-body rounded-xl px-3 py-2.5 text-[13px] text-[var(--portfolio-muted)] transition hover:bg-[var(--portfolio-hover)] hover:text-[var(--portfolio-text)]"
              >
                {khmer ? km : en}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
