import { Code2, ExternalLink, ImageIcon } from "lucide-react";

import { cn } from "@/lib/cn";

type Props = {
  locale: "en" | "km";
  image: string | null | undefined;
  githubUrl: string | null | undefined;
  username: string | null | undefined;
};

export default function GitHubContributionSection({
  locale,
  image,
  githubUrl,
  username,
}: Props) {
  if (!image) {
    return null;
  }

  const khmer = locale === "km";

  return (
    <section id="github" className="portfolio-section scroll-mt-28">
      {/* =====================================================
          HEADING
         ===================================================== */}

      <div className="max-w-3xl">
        <p
          className={cn(
            "text-[var(--portfolio-cyan)]",
            khmer
              ? "khmer-input-value text-[11px] font-normal leading-6"
              : "font-body text-[10px] font-semibold uppercase tracking-[0.2em]",
          )}
        >
          {khmer ? "សកម្មភាពសរសេរកូដ" : "CODING ACTIVITY"}
        </p>

        <h2
          className={cn(
            "mt-3 text-[var(--portfolio-text)]",
            khmer
              ? "khmer-input-value text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.45]"
              : "font-display text-[clamp(2.8rem,6vw,5.3rem)] leading-[0.92]",
          )}
        >
          {khmer ? "ការរួមចំណែក GitHub" : "GitHub Contributions"}
        </h2>

        <p
          className={cn(
            "mt-4 max-w-2xl text-[13px] text-[var(--portfolio-muted)]",
            khmer
              ? "khmer-input-value font-normal leading-7"
              : "font-body leading-7",
          )}
        >
          {khmer
            ? "សកម្មភាព និងការរួមចំណែករបស់ខ្ញុំក្នុងការអភិវឌ្ឍគម្រោង និងការសរសេរកូដ។"
            : "A snapshot of my coding activity and contributions across projects on GitHub."}
        </p>
      </div>

      {/* =====================================================
          MAIN CARD
         ===================================================== */}

      <div className="relative mt-10 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/[0.08] dark:bg-[#080d1b] dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        {/* BACKGROUND ACCENTS */}

        <div
          className="pointer-events-none absolute -left-24 -top-24 h-[240px] w-[240px] rounded-full bg-violet-500/[0.05] blur-[90px] dark:bg-violet-500/[0.08]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-28 -right-20 h-[260px] w-[260px] rounded-full bg-cyan-400/[0.04] blur-[100px] dark:bg-cyan-400/[0.07]"
          aria-hidden="true"
        />

        <div className="relative p-4 sm:p-5 md:p-6">
          {/* =================================================
              TOP HEADER
             ================================================= */}

          <div className="flex min-h-[54px] flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-violet-200/70 bg-violet-50 text-violet-600 dark:border-cyan-400/[0.13] dark:bg-cyan-400/[0.08] dark:text-cyan-300">
                <Code2 size={19} strokeWidth={1.9} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-body text-[13px] font-semibold text-slate-950 dark:text-white">
                    GitHub
                  </p>

                  {username ? (
                    <span className="font-body rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/45">
                      @{username}
                    </span>
                  ) : null}
                </div>

                <p className="font-body mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-cyan-200/45">
                  Contribution Activity
                </p>
              </div>
            </div>

            {githubUrl ? (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-[10px] font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-white/[0.09] dark:bg-white/[0.04] dark:text-white/75 dark:hover:border-cyan-400/25 dark:hover:bg-cyan-400/[0.07] dark:hover:text-cyan-200"
              >
                {khmer ? "មើល GitHub" : "View GitHub"}

                <ExternalLink size={12} strokeWidth={1.8} />
              </a>
            ) : null}
          </div>

          {/* =================================================
              CONTRIBUTION FRAME
             ================================================= */}

          <div className="mt-5 rounded-[22px] border border-slate-200/90 bg-slate-50 p-3 dark:border-cyan-300/[0.10] dark:bg-[#0d1426] sm:p-4">
            {/* SAME HEADER IN BOTH THEMES */}

            <div className="mb-3 flex h-7 items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/[0.07] text-violet-600 dark:bg-cyan-400/[0.07] dark:text-cyan-300">
                  <ImageIcon size={12} strokeWidth={1.8} />
                </span>

                <span className="font-body text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-white/35">
                  Contribution Graph
                </span>
              </div>

              <span className="font-body text-[9px] text-slate-400 dark:text-white/25">
                GitHub
              </span>
            </div>

            {/* =================================================
                SCREENSHOT
               ================================================= */}

            <a
              href={image}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                khmer
                  ? "មើល GitHub contribution graph ទំហំធំ"
                  : "View full GitHub contribution graph"
              }
              className="group block overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:border-white/[0.10] dark:bg-[#0d1117] dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={image}
                  alt="GitHub contribution graph"
                  className="mx-auto block h-auto w-full object-contain transition duration-500 group-hover:scale-[1.005]"
                />

                <div className="pointer-events-none absolute inset-0 bg-violet-500/0 transition duration-300 group-hover:bg-violet-500/[0.01] dark:group-hover:bg-cyan-300/[0.01]" />
              </div>
            </a>
          </div>

          {/* =================================================
              FOOTER
             ================================================= */}

          <div className="mt-4 flex min-h-[24px] flex-wrap items-center justify-between gap-3 px-1">
            <p
              className={cn(
                "text-[9px] text-slate-400 dark:text-white/30",
                khmer ? "khmer-input-value font-normal leading-5" : "font-body",
              )}
            >
              {khmer
                ? "ចុចលើរូបភាពដើម្បីមើលទំហំធំ។"
                : "Click the contribution graph to view the full image."}
            </p>

            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-200 dark:bg-emerald-400/30" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 dark:bg-emerald-400/45" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 dark:bg-emerald-400/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400/80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
