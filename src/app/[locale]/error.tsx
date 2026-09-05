"use client";

import { AlertTriangle, Home, RefreshCw, Sparkles } from "lucide-react";

import { useEffect } from "react";

import { useLocale } from "next-intl";

import { Link } from "@/i18n/navigation";

type Props = {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  const locale = useLocale();

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  const khmer = safeLocale === "km";

  useEffect(() => {
    /*
     * Keep detailed error information in
     * the developer console, not on the UI.
     */
    console.error("Portfolio page error:", error);
  }, [error]);

  return (
    <main className="portfolio-site flex min-h-screen items-center justify-center overflow-x-clip px-5 py-20">
      <div className="mx-auto w-full max-w-[720px]">
        <section className="portfolio-panel overflow-hidden p-6 text-center sm:p-10 md:p-12">
          {/* ICON */}

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/15 bg-red-500/[0.07] text-red-500">
            <AlertTriangle size={23} strokeWidth={1.7} />
          </div>

          {/* LABEL */}

          <div className="mt-6 flex items-center justify-center gap-2">
            <Sparkles size={12} className="text-[var(--portfolio-cyan)]" />

            <p
              className={
                khmer
                  ? "khmer-input-value text-[10px] font-normal leading-6 text-[var(--portfolio-cyan)]"
                  : "font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--portfolio-cyan)]"
              }
            >
              {khmer ? "មានបញ្ហាបណ្តោះអាសន្ន" : "TEMPORARY ERROR"}
            </p>
          </div>

          {/* CODE */}

          <p className="font-display mt-4 text-[clamp(4rem,12vw,7rem)] leading-none text-[var(--portfolio-text)]">
            OOPS
          </p>

          {/* TITLE */}

          <h1
            className={
              khmer
                ? "khmer-input-value mx-auto mt-5 max-w-xl text-[27px] font-normal leading-[1.55] text-[var(--portfolio-text)]"
                : "font-display mx-auto mt-5 max-w-xl text-[clamp(2rem,5vw,3.5rem)] leading-[0.98] text-[var(--portfolio-text)]"
            }
          >
            {khmer ? "មានអ្វីមួយដំណើរការមិនប្រក្រតី" : "Something Went Wrong"}
          </h1>

          {/* DESCRIPTION */}

          <p
            className={
              khmer
                ? "khmer-input-value mx-auto mt-5 max-w-lg text-[12px] font-normal leading-7 text-[var(--portfolio-muted)]"
                : "font-body mx-auto mt-5 max-w-lg text-[13px] leading-7 text-[var(--portfolio-muted)]"
            }
          >
            {khmer
              ? "មិនអាចបង្ហាញទំព័រនេះបាននៅពេលនេះទេ។ សូមសាកល្បងម្តងទៀត ឬត្រឡប់ទៅទំព័រដើម។"
              : "This page could not be displayed right now. Try again, or return to the portfolio home page."}
          </p>

          {/* ACTIONS */}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="portfolio-primary-button"
            >
              <RefreshCw size={15} />

              {khmer ? "សាកល្បងម្តងទៀត" : "Try Again"}
            </button>

            <Link href="/" className="portfolio-secondary-button">
              <Home size={15} />

              {khmer ? "ទៅទំព័រដើម" : "Back Home"}
            </Link>
          </div>

          {error.digest ? (
            <p className="font-number mt-8 text-[8px] text-[var(--portfolio-muted)]/60">
              Error reference: {error.digest}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
