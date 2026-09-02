"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
  Star,
  Trophy,
  X,
} from "lucide-react";

import { cn } from "@/lib/cn";

import type { PublicActivity } from "@/types/publicPortfolio";

type Props = {
  locale: "en" | "km";
  items: PublicActivity[];
};

export default function AchievementsSection({ locale, items }: Props) {
  const khmer = locale === "km";

  const touchStartX = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  /* =====================================================
     SORT
     Featured first, then newest
     ===================================================== */

  const achievements = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }

      const dateA = new Date(a.activityDate).getTime();
      const dateB = new Date(b.activityDate).getTime();

      if (dateA !== dateB) {
        return dateB - dateA;
      }

      return b.id - a.id;
    });
  }, [items]);

  useEffect(() => {
    if (activeIndex >= achievements.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, achievements.length]);

  /* =====================================================
     LIGHTBOX
     ===================================================== */

  useEffect(() => {
    if (previewIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPreviewIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setPreviewIndex((current) =>
          previousIndex(current, achievements.length),
        );
      }

      if (event.key === "ArrowRight") {
        setPreviewIndex((current) => nextIndex(current, achievements.length));
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewIndex, achievements.length]);

  if (achievements.length === 0) {
    return null;
  }

  const previewItem =
    previewIndex === null ? null : (achievements[previewIndex] ?? null);

  /* =====================================================
     NAVIGATION
     ===================================================== */

  function previous() {
    setActiveIndex(
      (current) => (current - 1 + achievements.length) % achievements.length,
    );
  }

  function next() {
    setActiveIndex((current) => (current + 1) % achievements.length);
  }

  function handleDeckKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
  }

  /* =====================================================
     MOBILE SWIPE
     ===================================================== */

  function handleTouchStart(event: ReactTouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: ReactTouchEvent<HTMLDivElement>) {
    const start = touchStartX.current;

    const end = event.changedTouches[0]?.clientX;

    touchStartX.current = null;

    if (start === null || end === undefined) {
      return;
    }

    const distance = end - start;

    if (Math.abs(distance) < 45) {
      return;
    }

    if (distance < 0) {
      next();
    } else {
      previous();
    }
  }

  return (
    <>
      <section id="achievements" className="portfolio-section scroll-mt-28">
        {/* =================================================
            HEADER
           ================================================= */}

        <div className="max-w-3xl">
          <p
            className={
              khmer
                ? "khmer-input-value text-[11px] font-normal leading-6 text-[var(--portfolio-cyan)]"
                : "font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--portfolio-cyan)]"
            }
          >
            {khmer ? "ការទទួលស្គាល់" : "RECOGNITION"}
          </p>

          <h2
            className={
              khmer
                ? "khmer-input-value mt-3 text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.45] text-[var(--portfolio-text)]"
                : "font-display mt-3 text-[clamp(2.8rem,6vw,5.3rem)] leading-[0.92] text-[var(--portfolio-text)]"
            }
          >
            {khmer ? "សមិទ្ធផល" : "Achievements"}
          </h2>

          <p
            className={
              khmer
                ? "khmer-input-value mt-4 max-w-2xl text-[13px] font-normal leading-7 text-[var(--portfolio-muted)]"
                : "font-body mt-4 max-w-2xl text-[13px] leading-7 text-[var(--portfolio-muted)]"
            }
          >
            {khmer
              ? "ពានរង្វាន់ ការទទួលស្គាល់ និងសមិទ្ធផលសំខាន់ៗដែលបង្ហាញពីដំណើរ និងការរីកចម្រើនរបស់ខ្ញុំ។"
              : "Awards, recognitions and meaningful milestones that reflect my growth and accomplishments."}
          </p>
        </div>

        {/* =================================================
            DECK
           ================================================= */}

        <div className="mt-8 overflow-hidden rounded-[28px] border border-[var(--portfolio-border)] bg-[var(--portfolio-panel)] px-3 py-5 shadow-[0_20px_60px_rgba(30,40,90,0.08)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:px-6 sm:py-6 lg:px-8">
          {/* ===============================================
              CONTROLS
             =============================================== */}

          <div className="mx-auto flex max-w-[920px] items-center justify-between gap-4">
            <div>
              <p className="font-number text-[10px] text-[var(--portfolio-muted)]">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(achievements.length).padStart(2, "0")}
              </p>

              <p
                className={
                  khmer
                    ? "khmer-input-value mt-1 text-[11px] font-normal leading-6 text-[var(--portfolio-muted)]"
                    : "font-body mt-1 text-[11px] text-[var(--portfolio-muted)]"
                }
              >
                {khmer
                  ? "ចុចកាតខាងឆ្វេង ឬខាងស្តាំ ដើម្បីមើលសមិទ្ធផលបន្ទាប់។"
                  : "Select a side card or use the arrows to explore."}
              </p>
            </div>

            {achievements.length > 1 ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={previous}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] text-[var(--portfolio-text)] transition hover:-translate-x-0.5 hover:border-[var(--portfolio-cyan)]/40"
                  aria-label="Previous achievement"
                >
                  <ChevronLeft size={17} />
                </button>

                <button
                  type="button"
                  onClick={next}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] text-[var(--portfolio-text)] transition hover:translate-x-0.5 hover:border-[var(--portfolio-cyan)]/40"
                  aria-label="Next achievement"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            ) : null}
          </div>

          {/* ===============================================
              CARDS
             =============================================== */}

          <div
            className="relative mx-auto mt-1 h-[560px] max-w-[920px] outline-none sm:h-[500px] md:h-[410px] lg:h-[410px]"
            tabIndex={0}
            onKeyDown={handleDeckKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {achievements.map((item, index) => {
              const offset = circularOffset(
                index,
                activeIndex,
                achievements.length,
              );

              const depth = Math.abs(offset);

              /*
               * 1 item  -> active only
               * 2 items -> active + one side
               * 3 items -> left + active + right
               * 4 items -> still only 3 visible
               * 5+      -> five visible positions
               */
              const visibleRadius =
                achievements.length >= 5 ? 2 : achievements.length >= 2 ? 1 : 0;

              const visible = depth <= visibleRadius;

              const activeCard = offset === 0;

              /* ===========================================
                 VISUAL DEPTH
                 =========================================== */

              const scale = activeCard ? 1 : depth === 1 ? 0.9 : 0.78;

              const opacity = activeCard ? 1 : depth === 1 ? 0.66 : 0.3;

              const x =
                offset === 0
                  ? 0
                  : Math.sign(offset) * (depth === 1 ? 190 : 345);

              const zIndex = activeCard ? 30 : depth === 1 ? 20 : 10;

              const shadowClass = activeCard
                ? "shadow-[0_24px_60px_rgba(35,45,100,0.16)] dark:shadow-[0_28px_80px_rgba(0,0,0,0.42)]"
                : depth === 1
                  ? "shadow-[0_14px_34px_rgba(35,45,100,0.10)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
                  : "shadow-[0_8px_20px_rgba(35,45,100,0.06)] dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)]";

              return (
                <article
                  key={item.id}
                  className={cn(
                    "absolute left-1/2 top-1/2 w-[92%] max-w-[620px] overflow-hidden rounded-[24px] border border-[var(--portfolio-border)] bg-[var(--portfolio-panel-strong)] ring-1 ring-black/[0.03] backdrop-blur-xl will-change-transform motion-safe:transition-[transform,opacity] motion-safe:duration-500 sm:w-[82%] md:w-[68%] dark:ring-white/[0.06]",
                    shadowClass,
                  )}
                  style={{
                    transform: `translate3d(calc(-50% + ${x}px), -50%, 0) scale(${scale})`,
                    opacity: visible ? opacity : 0,
                    zIndex,
                    pointerEvents: visible ? "auto" : "none",
                  }}
                  aria-hidden={!visible}
                >
                  <div className="grid min-h-[340px] md:grid-cols-[0.9fr_1.1fr]">
                    {/* =====================================
                        IMAGE
                       ===================================== */}

                    <div className="relative flex min-h-[190px] items-center justify-center overflow-hidden bg-[var(--portfolio-chip)] md:min-h-[340px]">
                      {item.coverImage ? (
                        <img
                          src={item.coverImage}
                          alt={activityTitle(item, locale)}
                          className="h-full w-full object-contain p-3 sm:p-4"
                        />
                      ) : (
                        <Trophy
                          size={48}
                          className="text-[var(--portfolio-cyan)]"
                        />
                      )}

                      {activeCard && item.coverImage ? (
                        <button
                          type="button"
                          onClick={() => setPreviewIndex(index)}
                          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-black/45 text-white backdrop-blur-md transition hover:bg-black/65"
                          aria-label="View full achievement image"
                        >
                          <Maximize2 size={15} />
                        </button>
                      ) : null}
                    </div>

                    {/* =====================================
                        CONTENT
                       ===================================== */}

                    <div className="flex min-w-0 flex-col p-5 md:p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.featured ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2.5 py-1 font-body text-[8px] font-semibold uppercase tracking-[0.12em] text-violet-700 dark:text-violet-300">
                            <Star size={9} fill="currentColor" />

                            {khmer ? "ពិសេស" : "Featured"}
                          </span>
                        ) : null}

                        <span className="rounded-full border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] px-2.5 py-1 font-number text-[8px] text-[var(--portfolio-muted)]">
                          {formatAchievementDate(item.activityDate, locale)}
                        </span>
                      </div>

                      <h3
                        className={
                          khmer && item.titleKm
                            ? "khmer-input-value mt-4 line-clamp-3 text-[21px] font-normal leading-9 text-[var(--portfolio-text)] sm:text-[23px]"
                            : "font-display mt-4 line-clamp-4 text-[clamp(1.8rem,3.4vw,2.7rem)] leading-[1.04] text-[var(--portfolio-text)]"
                        }
                      >
                        {activityTitle(item, locale)}
                      </h3>

                      {activityOrganization(item, locale) ? (
                        <p
                          className={
                            khmer && item.organizationKm
                              ? "khmer-input-value mt-2 text-[10px] font-normal leading-6 text-[var(--portfolio-cyan)]"
                              : "font-body mt-2 text-[10px] font-semibold text-[var(--portfolio-cyan)]"
                          }
                        >
                          {activityOrganization(item, locale)}
                        </p>
                      ) : null}

                      {activitySummary(item, locale) ? (
                        <p
                          className={
                            khmer && item.summaryKm
                              ? "khmer-input-value mt-3 line-clamp-3 text-[11px] font-normal leading-6 text-[var(--portfolio-muted)]"
                              : "font-body mt-3 line-clamp-3 text-[11px] leading-5 text-[var(--portfolio-muted)]"
                          }
                        >
                          {activitySummary(item, locale)}
                        </p>
                      ) : null}

                      {/* ===================================
                          ACTIONS
                         =================================== */}

                      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                        {item.coverImage ? (
                          <button
                            type="button"
                            onClick={() => setPreviewIndex(index)}
                            className="portfolio-secondary-button"
                          >
                            <Maximize2 size={12} />

                            {khmer ? "មើលរូបពេញ" : "View Image"}
                          </button>
                        ) : null}

                        {item.externalUrl ? (
                          <a
                            href={item.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="portfolio-secondary-button"
                          >
                            <ExternalLink size={12} />

                            {khmer ? "មើលភស្តុតាង" : "View Proof"}
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* =====================================
                      SIDE CARD FADE
                     ===================================== */}

                  {!activeCard ? (
                    <div
                      className={cn(
                        "pointer-events-none absolute inset-0 z-30 transition",
                        depth === 1
                          ? "bg-white/22 dark:bg-[#070b18]/24"
                          : "bg-white/60 dark:bg-[#070b18]/58",
                      )}
                    />
                  ) : null}

                  {/* =====================================
                      SIDE CARD CLICK
                     ===================================== */}

                  {!activeCard ? (
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className="absolute inset-0 z-40 cursor-pointer bg-transparent"
                      aria-label={`Show ${activityTitle(item, locale)}`}
                    />
                  ) : null}
                </article>
              );
            })}
          </div>

          {/* ===============================================
              DOTS
             =============================================== */}

          {achievements.length > 1 ? (
            <div className="mx-auto flex max-w-[920px] items-center justify-center gap-2">
              {achievements.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={
                    index === activeIndex
                      ? "h-2 w-7 rounded-full bg-[var(--portfolio-cyan)] transition-all"
                      : "h-2 w-2 rounded-full bg-[var(--portfolio-border)] transition-all hover:bg-[var(--portfolio-muted)]"
                  }
                  aria-label={`Achievement ${index + 1}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* =================================================
          FULL IMAGE LIGHTBOX
         ================================================= */}

      {previewItem?.coverImage ? (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-6"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPreviewIndex(null);
            }
          }}
        >
          <div className="relative flex h-full max-h-[94vh] w-full max-w-[1250px] flex-col">
            {/* HEADER */}

            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p
                  className={
                    khmer && previewItem.titleKm
                      ? "khmer-input-value truncate text-[13px] font-normal leading-6 text-white"
                      : "font-body truncate text-[13px] font-semibold text-white"
                  }
                >
                  {activityTitle(previewItem, locale)}
                </p>

                <p className="font-number mt-0.5 text-[10px] text-white/60">
                  {formatAchievementDate(previewItem.activityDate, locale)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewIndex(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/15"
                aria-label="Close preview"
              >
                <X size={18} />
              </button>
            </div>

            {/* IMAGE */}

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/35">
              <img
                src={previewItem.coverImage}
                alt={activityTitle(previewItem, locale)}
                className="h-full w-full object-contain"
              />

              {achievements.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewIndex((current) =>
                        previousIndex(current, achievements.length),
                      )
                    }
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-md transition hover:bg-black/65"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPreviewIndex((current) =>
                        nextIndex(current, achievements.length),
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-md transition hover:bg-black/65"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              ) : null}
            </div>

            {/* BOTTOM */}

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="font-number text-[10px] text-white/55">
                {previewIndex === null
                  ? ""
                  : `${previewIndex + 1} / ${achievements.length}`}
              </p>

              {previewItem.externalUrl ? (
                <a
                  href={previewItem.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3.5 font-body text-[11px] font-semibold text-white transition hover:bg-white/15"
                >
                  <ExternalLink size={13} />

                  {khmer ? "មើលភស្តុតាង" : "View Proof"}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/* =========================================================
   POSITION
   ========================================================= */

function circularOffset(index: number, activeIndex: number, total: number) {
  if (total <= 1) {
    return 0;
  }

  let difference = index - activeIndex;

  const half = total / 2;

  if (difference > half) {
    difference -= total;
  }

  if (difference < -half) {
    difference += total;
  }

  return difference;
}

/* =========================================================
   LIGHTBOX INDEX
   ========================================================= */

function previousIndex(current: number | null, total: number) {
  if (current === null || total === 0) {
    return null;
  }

  return (current - 1 + total) % total;
}

function nextIndex(current: number | null, total: number) {
  if (current === null || total === 0) {
    return null;
  }

  return (current + 1) % total;
}

/* =========================================================
   LANGUAGE
   ========================================================= */

function localized(locale: "en" | "km", en: string | null, km: string | null) {
  return locale === "km" ? km || en || "" : en || km || "";
}

function activityTitle(item: PublicActivity, locale: "en" | "km") {
  return localized(locale, item.titleEn, item.titleKm);
}

function activitySummary(item: PublicActivity, locale: "en" | "km") {
  return localized(locale, item.summaryEn, item.summaryKm);
}

function activityOrganization(item: PublicActivity, locale: "en" | "km") {
  return localized(locale, item.organizationEn, item.organizationKm);
}

/* =========================================================
   DATE
   ========================================================= */

function formatAchievementDate(value: string, locale: "en" | "km") {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const englishMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const khmerMonths = [
    "មករា",
    "កុម្ភៈ",
    "មីនា",
    "មេសា",
    "ឧសភា",
    "មិថុនា",
    "កក្កដា",
    "សីហា",
    "កញ្ញា",
    "តុលា",
    "វិច្ឆិកា",
    "ធ្នូ",
  ];

  const month = date.getUTCMonth();

  const year = date.getUTCFullYear();

  return locale === "km"
    ? `${khmerMonths[month]} ${year}`
    : `${englishMonths[month]} ${year}`;
}
