import {
  ArrowRight,
  Compass,
  Home,
  Route,
  SearchX,
  Sparkles,
} from "lucide-react";

type Props = {
  locale: "en" | "km";
  homeHref: string;
  projectsHref: string;
};

export default function NotFoundView({
  locale,
  homeHref,
  projectsHref,
}: Props) {
  const khmer = locale === "km";

  return (
    <main className="portfolio-site relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
      {/* =====================================================
          DECORATIVE GLOW
         ===================================================== */}

      <div className="pointer-events-none absolute left-[4%] top-[8%] h-[280px] w-[280px] rounded-full bg-violet-500/[0.09] blur-[90px] dark:bg-violet-500/[0.12]" />

      <div className="pointer-events-none absolute bottom-[8%] right-[4%] h-[300px] w-[300px] rounded-full bg-cyan-400/[0.08] blur-[100px] dark:bg-cyan-400/[0.08]" />

      {/* =====================================================
          MAIN CARD
         ===================================================== */}

      <section className="portfolio-panel relative z-10 w-full max-w-[1080px] overflow-hidden rounded-[30px]">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          {/* =================================================
              LEFT CONTENT
             ================================================= */}

          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-11">
            {/* BRAND */}

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--portfolio-gradient)] font-display text-[20px] text-white shadow-[0_10px_30px_rgba(100,80,255,0.24)]">
                C
              </div>

              <div>
                <p className="font-display text-[18px] leading-none text-[var(--portfolio-text)]">
                  CHANTHA
                </p>

                <p className="font-body mt-1 text-[9px] text-[var(--portfolio-muted)]">
                  Portfolio
                </p>
              </div>
            </div>

            {/* LABEL */}

            <div className="mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] px-3 py-1.5">
              <SearchX size={12} className="text-[var(--portfolio-cyan)]" />

              <span
                className={
                  khmer
                    ? "khmer-input-value text-[10px] font-normal leading-5 text-[var(--portfolio-muted)]"
                    : "font-body text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--portfolio-muted)]"
                }
              >
                {khmer ? "រកមិនឃើញទំព័រ" : "404 • PAGE NOT FOUND"}
              </span>
            </div>

            {/* TITLE */}

            <h1
              className={
                khmer
                  ? "khmer-input-value mt-5 max-w-[520px] text-[34px] font-normal leading-[1.5] text-[var(--portfolio-text)] sm:text-[42px]"
                  : "font-display mt-5 max-w-[520px] text-[clamp(3.1rem,7vw,5.7rem)] leading-[0.9] text-[var(--portfolio-text)]"
              }
            >
              {khmer ? (
                "ទំព័រនេះរកមិនឃើញ"
              ) : (
                <>
                  THIS PAGE
                  <span className="portfolio-gradient-text block">
                    GOT LOST.
                  </span>
                </>
              )}
            </h1>

            {/* DESCRIPTION */}

            <p
              className={
                khmer
                  ? "khmer-input-value mt-5 max-w-[470px] text-[12px] font-normal leading-7 text-[var(--portfolio-muted)]"
                  : "font-body mt-5 max-w-[470px] text-[13px] leading-7 text-[var(--portfolio-muted)]"
              }
            >
              {khmer
                ? "អាសយដ្ឋានដែលអ្នកបានបើកអាចមិនត្រឹមត្រូវ ទំព័រអាចត្រូវបានផ្លាស់ប្តូរ ឬលុបចេញ។ អ្នកអាចត្រឡប់ទៅ Portfolio ឬបន្តមើលគម្រោង។"
                : "The address may be incorrect, or this page may have moved or been removed. You can return to the portfolio or keep exploring my work."}
            </p>

            {/* BUTTONS */}

            <div className="mt-7 flex flex-wrap gap-3">
              <a href={homeHref} className="portfolio-primary-button">
                <Home size={14} />

                {khmer ? "ទៅទំព័រដើម" : "Back Home"}
              </a>

              <a href={projectsHref} className="portfolio-secondary-button">
                {khmer ? "មើលគម្រោង" : "Explore Projects"}

                <ArrowRight size={14} />
              </a>
            </div>

            {/* FOOTER */}

            <div className="mt-10 flex items-center gap-2 border-t border-[var(--portfolio-border)] pt-5">
              <Sparkles size={11} className="text-[var(--portfolio-cyan)]" />

              <p className="font-body text-[9px] uppercase tracking-[0.12em] text-[var(--portfolio-muted)]">
                CHANTHA • PORTFOLIO
              </p>
            </div>
          </div>

          {/* =================================================
              RIGHT VISUAL
             ================================================= */}

          <div className="relative flex min-h-[370px] items-center justify-center overflow-hidden border-t border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] p-5 sm:min-h-[430px] sm:p-8 lg:min-h-[560px] lg:border-l lg:border-t-0">
            {/* BACKGROUND GRID */}

            <div className="pointer-events-none absolute inset-0 opacity-[0.22] dark:opacity-[0.12]">
              <div className="h-full w-full bg-[linear-gradient(to_right,var(--portfolio-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--portfolio-border)_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>

            {/* LARGE 404 */}

            <div className="pointer-events-none absolute right-[-2%] top-[8%] select-none font-display text-[clamp(8rem,20vw,15rem)] leading-none text-[var(--portfolio-text)]/[0.025] dark:text-white/[0.025]">
              404
            </div>

            {/* BROWSER CARD */}

            <div className="portfolio-panel relative z-10 w-full max-w-[470px] overflow-hidden rounded-[24px] bg-[var(--portfolio-panel-strong)]">
              {/* WINDOW HEADER */}

              <div className="flex items-center gap-3 border-b border-[var(--portfolio-border)] px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-400/70" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/70" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
                </div>

                <div className="min-w-0 flex-1 rounded-lg border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] px-3 py-1.5">
                  <p className="font-body truncate text-[9px] text-[var(--portfolio-muted)]">
                    chantha.portfolio / unknown-route
                  </p>
                </div>
              </div>

              {/* ROUTE VISUAL */}

              <div className="relative min-h-[350px] p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body text-[8px] font-semibold uppercase tracking-[0.16em] text-[var(--portfolio-cyan)]">
                      ROUTE CHECK
                    </p>

                    <p className="font-body mt-1 text-[11px] text-[var(--portfolio-muted)]">
                      Searching portfolio...
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] text-[var(--portfolio-cyan)]">
                    <Compass size={17} />
                  </div>
                </div>

                {/* MAP */}

                <div className="relative mt-7 h-[180px] overflow-hidden rounded-[18px] border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)]">
                  <svg
                    viewBox="0 0 420 180"
                    className="absolute inset-0 h-full w-full"
                  >
                    <path
                      d="M48 132 C105 35, 165 155, 224 70 S330 45, 374 105"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="7 8"
                      className="text-[var(--portfolio-cyan)]/40"
                    />
                  </svg>

                  {/* START */}

                  <div className="absolute bottom-[20%] left-[8%] flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--portfolio-border)] bg-[var(--portfolio-panel-strong)] text-[var(--portfolio-cyan)] shadow-sm">
                    <Home size={14} />
                  </div>

                  {/* MIDDLE */}

                  <div className="absolute left-[49%] top-[23%] flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--portfolio-border)] bg-[var(--portfolio-panel-strong)] text-violet-500 shadow-sm">
                    <Route size={14} />
                  </div>

                  {/* LOST */}

                  <div className="absolute right-[7%] top-[47%] flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/15 bg-red-500/[0.07] text-red-500 shadow-sm">
                    <SearchX size={17} />
                  </div>
                </div>

                {/* STATUS */}

                <div className="mt-5 flex items-center justify-between gap-3 rounded-[14px] border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-40" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                    </span>

                    <div>
                      <p className="font-body text-[10px] font-semibold text-[var(--portfolio-text)]">
                        Destination unavailable
                      </p>

                      <p className="font-body mt-0.5 text-[8px] text-[var(--portfolio-muted)]">
                        HTTP status • 404
                      </p>
                    </div>
                  </div>

                  <span className="font-number text-[10px] text-[var(--portfolio-muted)]">
                    404
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
