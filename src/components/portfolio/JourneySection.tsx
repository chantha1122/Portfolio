"use client";

import {
  Award,
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  GraduationCap,
  Layers3,
  MapPin,
  Presentation,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

import type { PublicActivity } from "@/types/publicPortfolio";

/* =========================================================
   TYPES
   ========================================================= */

type Props = {
  locale: "en" | "km";
  activities: PublicActivity[];

  /*
   * Homepage:
   * Specific category shows maximum 8.
   *
   * Archive:
   * Pass null to show everything.
   */
  maxVisible?: number | null;

  fixedYear?: string;
  initialCategory?: string;
  archiveMode?: boolean;
};

type TimelineYear = {
  year: string;
  items: PublicActivity[];
};

type CategoryOption = {
  type: string;
  label: string;
  count: number;
  Icon: LucideIcon;
};

type ActivityTypeGroup = {
  type: string;
  items: PublicActivity[];
};

/* =========================================================
   CONFIG
   ========================================================= */

const DEFAULT_VISIBLE_ITEMS = 8;

const AUTO_ROTATE_MS = 6000;

const AUTO_ROTATE_SECONDS = AUTO_ROTATE_MS / 1000;

const CATEGORY_ORDER = [
  "PROJECT",
  "WORK",
  "CERTIFICATE",
  "TEACHING",
  "EVENT",
  "ACHIEVEMENT",
  "COMPETITION",
  "EDUCATION",
  "OTHER",
];

/* =========================================================
   MONTHS
   ========================================================= */

const EN_MONTHS = [
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

const KM_MONTHS = [
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

/* =========================================================
   MAIN
   ========================================================= */

export default function JourneySection({
  locale,
  activities,
  maxVisible = DEFAULT_VISIBLE_ITEMS,
  fixedYear,
  initialCategory = "ALL",
  archiveMode = false,
}: Props) {
  const khmer = locale === "km";

  /* =======================================================
     TIMELINE SOURCE
     ======================================================= */

  const timeline = useMemo(
    () =>
      [...activities]
        .filter((item) => item.type !== "PHOTO")
        .sort((a, b) => b.activityDate.localeCompare(a.activityDate)),
    [activities],
  );

  const years = useMemo(() => buildTimelineYears(timeline), [timeline]);

  const defaultYear =
    fixedYear && years.some((group) => group.year === fixedYear)
      ? fixedYear
      : (years[0]?.year ?? "");

  const [selectedYear, setSelectedYear] = useState(defaultYear);

  const [activeCategory, setActiveCategory] = useState(initialCategory);

  /* =======================================================
     ACTIVE YEAR
     ======================================================= */

  const activeYear =
    years.find((group) => group.year === selectedYear) ?? years[0] ?? null;

  const categories = useMemo(
    () => (activeYear ? buildCategoryOptions(activeYear.items, locale) : []),
    [activeYear, locale],
  );

  /*
   * ALL filter:
   *
   * One group per activity type.
   *
   * The groups are sorted by the newest
   * activity inside each type.
   */
  const typeGroups = useMemo(
    () => (activeYear ? buildTypeGroups(activeYear.items) : []),
    [activeYear],
  );

  /* =======================================================
     FILTERED ITEMS
     ======================================================= */

  const filteredItems = activeYear
    ? activeCategory === "ALL"
      ? activeYear.items
      : activeYear.items.filter((item) => item.type === activeCategory)
    : [];

  /*
   * ALL:
   * handled by rotating type rows.
   *
   * Specific category:
   * max 8 on homepage.
   */
  const visibleItems =
    activeCategory === "ALL"
      ? []
      : maxVisible === null
        ? filteredItems
        : filteredItems.slice(0, maxVisible);

  const hasMore =
    activeCategory !== "ALL" &&
    maxVisible !== null &&
    filteredItems.length > maxVisible;

  /* =======================================================
     YEAR NAVIGATION
     ======================================================= */

  const currentYearIndex = years.findIndex(
    (group) => group.year === activeYear?.year,
  );

  const showYearArrows = years.length > 6;

  function selectYear(year: string) {
    setSelectedYear(year);

    setActiveCategory("ALL");
  }

  function goNewerYear() {
    if (currentYearIndex <= 0) {
      return;
    }

    const group = years[currentYearIndex - 1];

    if (group) {
      selectYear(group.year);
    }
  }

  function goOlderYear() {
    if (currentYearIndex === -1 || currentYearIndex >= years.length - 1) {
      return;
    }

    const group = years[currentYearIndex + 1];

    if (group) {
      selectYear(group.year);
    }
  }

  /* =======================================================
     VIEW ALL
     ======================================================= */

  const viewAllHref =
    activeYear && activeCategory !== "ALL"
      ? `/journey/${activeYear.year}?type=${encodeURIComponent(activeCategory)}`
      : "/";

  const archiveYear = fixedYear ?? activeYear?.year ?? "";

  return (
    <section id="journey" className="portfolio-section scroll-mt-28">
      {/* ===================================================
          ARCHIVE BACK
         =================================================== */}

      {archiveMode ? (
        <Link
          href="/#journey"
          className="font-body mb-8 inline-flex items-center gap-2 text-[10px] font-semibold text-[var(--portfolio-muted)] transition hover:text-[var(--portfolio-cyan)]"
        >
          <ChevronLeft size={14} />

          {khmer ? "ត្រឡប់ទៅ Portfolio" : "Back to portfolio"}
        </Link>
      ) : null}

      {/* ===================================================
          MAIN HEADING
         =================================================== */}

      <div className="max-w-3xl">
        <p
          className={cn(
            "text-[var(--portfolio-cyan)]",
            khmer
              ? "khmer-input-value text-[11px] font-normal leading-6"
              : "font-body text-[10px] font-semibold uppercase tracking-[0.2em]",
          )}
        >
          {archiveMode
            ? khmer
              ? "បណ្ណសារដំណើរ"
              : "JOURNEY ARCHIVE"
            : khmer
              ? "ដំណើររបស់ខ្ញុំ"
              : "MY JOURNEY"}
        </p>

        <h2
          className={cn(
            "mt-3 text-[var(--portfolio-text)]",
            khmer
              ? "khmer-input-value text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.45]"
              : "font-display text-[clamp(2.8rem,6vw,5.3rem)] leading-[0.92]",
          )}
        >
          {archiveMode
            ? khmer
              ? `កំណត់ត្រាសំខាន់ៗឆ្នាំ ${archiveYear}`
              : `${archiveYear} Milestones`
            : khmer
              ? "កំណត់ត្រាតាមពេលវេលា"
              : "Journey Through Time"}
        </h2>

        <p
          className={cn(
            "mt-4 max-w-2xl text-[13px] text-[var(--portfolio-muted)]",
            khmer
              ? "khmer-input-value font-normal leading-7"
              : "font-body leading-7",
          )}
        >
          {archiveMode
            ? khmer
              ? `មើលគម្រោង បទពិសោធន៍ វិញ្ញាបនបត្រ ការបង្រៀន និងសមិទ្ធផលរបស់ខ្ញុំនៅក្នុងឆ្នាំ ${archiveYear}។`
              : `Explore projects, experience, certificates, teaching and milestones from ${archiveYear}.`
            : khmer
              ? "មើលកំណត់ត្រារបស់ខ្ញុំតាមឆ្នាំ រួមមានគម្រោង បទពិសោធន៍ វិញ្ញាបនបត្រ ការបង្រៀន ការប្រកួត និងសមិទ្ធផលសំខាន់ៗ។"
              : "Explore my journey by year through projects, experience, certificates, teaching, competitions and important milestones."}
        </p>
      </div>

      {/* ===================================================
          HAS DATA
         =================================================== */}

      {years.length > 0 && activeYear ? (
        <>
          {/* =================================================
              YEAR + FILTER PANEL
             ================================================= */}

          <div className="mt-10 overflow-hidden rounded-[24px] border border-[var(--portfolio-border)] bg-[var(--portfolio-panel)]">
            {/* ===============================================
                YEAR AREA
               =============================================== */}

            <div className="border-b border-[var(--portfolio-border)] px-4 py-5 md:px-5">
              {years.length === 1 ? (
                <SingleYearHeader
                  locale={locale}
                  year={activeYear.year}
                  count={activeYear.items.length}
                />
              ) : (
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-body text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--portfolio-cyan)]">
                        {khmer ? "ស្វែងរកតាមឆ្នាំ" : "EXPLORE BY YEAR"}
                      </p>

                      <p
                        className={cn(
                          "mt-1 text-[10px] text-[var(--portfolio-muted)]",
                          khmer
                            ? "khmer-input-value font-normal leading-5"
                            : "font-body",
                        )}
                      >
                        {khmer
                          ? "ជ្រើសរើសឆ្នាំដើម្បីមើលកំណត់ត្រាសំខាន់ៗ។"
                          : "Choose a year to explore its milestones."}
                      </p>
                    </div>

                    {showYearArrows ? (
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={goNewerYear}
                          disabled={currentYearIndex <= 0}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] text-[var(--portfolio-muted)] transition hover:border-[var(--portfolio-cyan)]/35 hover:text-[var(--portfolio-text)] disabled:pointer-events-none disabled:opacity-30"
                          aria-label="Newer year"
                        >
                          <ChevronLeft size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={goOlderYear}
                          disabled={
                            currentYearIndex === -1 ||
                            currentYearIndex >= years.length - 1
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] text-[var(--portfolio-muted)] transition hover:border-[var(--portfolio-cyan)]/35 hover:text-[var(--portfolio-text)] disabled:pointer-events-none disabled:opacity-30"
                          aria-label="Older year"
                        >
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex min-w-max items-center gap-2">
                      {years.map((group) => {
                        const active = group.year === activeYear.year;

                        return (
                          <button
                            key={group.year}
                            type="button"
                            onClick={() => selectYear(group.year)}
                            className={cn(
                              "font-number relative min-w-[76px] rounded-xl border px-4 py-2.5 text-[12px] font-semibold transition",
                              active
                                ? "border-violet-500/35 bg-violet-600 text-white shadow-[0_8px_24px_rgba(124,58,237,0.18)]"
                                : "border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] text-[var(--portfolio-muted)] hover:border-[var(--portfolio-cyan)]/30 hover:text-[var(--portfolio-text)]",
                            )}
                          >
                            {group.year}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ===============================================
                FILTERS
               =============================================== */}

            <div className="px-4 py-4 md:px-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex min-w-max items-center gap-2">
                    <CategoryButton
                      active={activeCategory === "ALL"}
                      label={khmer ? "ទាំងអស់" : "All"}
                      count={activeYear.items.length}
                      Icon={Layers3}
                      onClick={() => setActiveCategory("ALL")}
                    />

                    {categories.map((category) => (
                      <CategoryButton
                        key={category.type}
                        active={activeCategory === category.type}
                        label={category.label}
                        count={category.count}
                        Icon={category.Icon}
                        onClick={() => setActiveCategory(category.type)}
                      />
                    ))}
                  </div>
                </div>

                {/* ===========================================
                    RESULT SUMMARY
                   =========================================== */}

                {activeCategory === "ALL" ? (
                  <p
                    className={cn(
                      "shrink-0 text-[9px] text-[var(--portfolio-muted)]",
                      khmer
                        ? "khmer-input-value font-normal leading-5"
                        : "font-body font-medium uppercase tracking-[0.08em]",
                    )}
                  >
                    {khmer
                      ? `${activeYear.items.length} កំណត់ត្រា · ${typeGroups.length} ប្រភេទ · ប្តូរ ${AUTO_ROTATE_SECONDS} វិនាទី`
                      : `${activeYear.items.length} milestones · ${typeGroups.length} types · rotates every ${AUTO_ROTATE_SECONDS}s`}
                  </p>
                ) : (
                  <p
                    className={cn(
                      "shrink-0 text-[9px] text-[var(--portfolio-muted)]",
                      khmer
                        ? "khmer-input-value font-normal leading-5"
                        : "font-body font-medium uppercase tracking-[0.08em]",
                    )}
                  >
                    {maxVisible !== null && filteredItems.length > maxVisible
                      ? khmer
                        ? `បង្ហាញ ${visibleItems.length} ក្នុងចំណោម ${filteredItems.length}`
                        : `Showing ${visibleItems.length} of ${filteredItems.length}`
                      : `${filteredItems.length} ${
                          khmer
                            ? "កំណត់ត្រា"
                            : filteredItems.length === 1
                              ? "Milestone"
                              : "Milestones"
                        }`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              YEAR CONTENT
             ================================================= */}

          <div className="mt-8 grid gap-7 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-10">
            {/* ===============================================
                YEAR SUMMARY
               =============================================== */}

            <aside className="min-w-0">
              <div className="lg:sticky lg:top-28">
                <p className="font-display text-[clamp(3.8rem,8vw,6rem)] leading-[0.82] tracking-[-0.025em] text-[var(--portfolio-text)]">
                  {activeYear.year}
                </p>

                <div className="mt-4 h-[3px] w-16 rounded-full bg-[var(--portfolio-gradient)]" />

                <p
                  className={cn(
                    "mt-4 max-w-[170px] text-[10px] text-[var(--portfolio-muted)]",
                    khmer
                      ? "khmer-input-value font-normal leading-6"
                      : "font-body leading-5",
                  )}
                >
                  {khmer
                    ? `${activeYear.items.length} កំណត់ត្រាដែលបង្ហាញពីការរីកចម្រើន ការងារ និងការសិក្សារបស់ខ្ញុំនៅឆ្នាំនេះ។`
                    : `${activeYear.items.length} milestones documenting growth, work and learning during this year.`}
                </p>
              </div>
            </aside>

            {/* ===============================================
                CONTENT
               =============================================== */}

            <div className="min-w-0">
              {activeCategory === "ALL" ? (
                <AllTypeShowcase locale={locale} groups={typeGroups} />
              ) : (
                <>
                  <CategoryContent
                    locale={locale}
                    type={activeCategory}
                    items={visibleItems}
                  />

                  {/* =========================================
                      VIEW ALL
                     ========================================= */}

                  {hasMore ? (
                    <div className="mt-7 flex justify-center">
                      <Link
                        href={viewAllHref}
                        className="font-body group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-violet-500/25 bg-violet-500/[0.08] px-5 text-[10px] font-semibold text-violet-700 transition hover:border-violet-500/40 hover:bg-violet-500/[0.12] dark:text-violet-300"
                      >
                        {khmer
                          ? `មើល ${formatTypePlural(
                              activeCategory,
                              locale,
                            )} ទាំង ${filteredItems.length}`
                          : `View all ${filteredItems.length} ${formatTypePlural(
                              activeCategory,
                              locale,
                            )}`}

                        <ChevronRight
                          size={14}
                          className="transition group-hover:translate-x-0.5"
                        />
                      </Link>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <EmptyJourney locale={locale} />
      )}
    </section>
  );
}

/* =========================================================
   SINGLE YEAR HEADER
   ========================================================= */

function SingleYearHeader({
  locale,
  year,
  count,
}: {
  locale: "en" | "km";
  year: string;
  count: number;
}) {
  const khmer = locale === "km";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-body text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--portfolio-cyan)]">
          {khmer ? "ឆ្នាំនៃដំណើរ" : "TIMELINE YEAR"}
        </p>

        <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-1">
          <p className="font-display text-[38px] leading-none text-[var(--portfolio-text)] md:text-[44px]">
            {year}
          </p>

          <p
            className={cn(
              "pb-1 text-[10px] text-[var(--portfolio-muted)]",
              khmer
                ? "khmer-input-value font-normal"
                : "font-body font-medium uppercase tracking-[0.1em]",
            )}
          >
            {count}{" "}
            {khmer ? "កំណត់ត្រា" : count === 1 ? "Milestone" : "Milestones"}
          </p>
        </div>

        <div className="mt-3 h-[3px] w-14 rounded-full bg-[var(--portfolio-gradient)]" />
      </div>
    </div>
  );
}

/* =========================================================
   CATEGORY BUTTON
   ========================================================= */

function CategoryButton({
  active,
  label,
  count,
  Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  Icon: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "font-body inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[9px] font-semibold transition",
        active
          ? "border-violet-500/35 bg-violet-500/10 text-violet-700 dark:text-violet-300"
          : "border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] text-[var(--portfolio-muted)] hover:border-[var(--portfolio-cyan)]/30 hover:text-[var(--portfolio-text)]",
      )}
    >
      <Icon size={11} strokeWidth={1.8} />

      <span>{label}</span>

      <span
        className={cn(
          "ml-0.5 rounded-full px-1.5 py-0.5 text-[7px]",
          active ? "bg-violet-500/10" : "bg-black/[0.035] dark:bg-white/[0.05]",
        )}
      >
        {count}
      </span>
    </button>
  );
}

/* =========================================================
   ALL FILTER
   CONTINUOUS TIMELINE
   ========================================================= */

function AllTypeShowcase({
  locale,
  groups,
}: {
  locale: "en" | "km";
  groups: ActivityTypeGroup[];
}) {
  if (groups.length === 0) {
    return <FilteredEmpty locale={locale} />;
  }

  return (
    <div className="relative">
      {/* CONTINUOUS TIMELINE */}

      <div
        aria-hidden="true"
        className="absolute bottom-6 left-[15px] top-6 z-0 w-px bg-gradient-to-b from-[var(--portfolio-cyan)]/70 via-[var(--portfolio-border)] to-transparent"
      />

      <div className="relative z-10 grid gap-3">
        {groups.map((group, groupIndex) => {
          /*
           * Important:
           *
           * Spread the animation across 5 seconds.
           *
           * 4 types:
           * 0ms
           * 1250ms
           * 2500ms
           * 3750ms
           *
           * This prevents all cards from changing together.
           */
          const rotationOffsetMs = Math.round(
            (groupIndex * AUTO_ROTATE_MS) / Math.max(groups.length, 1),
          );

          return (
            <RotatingTypeCard
              key={`${group.type}-${group.items[0]?.id ?? "empty"}-${group.items.length}`}
              locale={locale}
              type={group.type}
              items={group.items}
              rotationOffsetMs={rotationOffsetMs}
            />
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   ROTATING TYPE ROW
   ========================================================= */

function RotatingTypeCard({
  locale,
  type,
  items,
  rotationOffsetMs,
}: {
  locale: "en" | "km";
  type: string;
  items: PublicActivity[];
  rotationOffsetMs: number;
}) {
  const khmer = locale === "km";

  const [currentIndex, setCurrentIndex] = useState(0);

  const [nextIndex, setNextIndex] = useState<number | null>(null);

  const [transitioning, setTransitioning] = useState(false);

  const [paused, setPaused] = useState(false);

  const animationTimerRef = useRef<number | null>(null);

  const firstCycleRef = useRef(true);

  const safeCurrentIndex = items.length > 0 ? currentIndex % items.length : 0;

  const currentItem = items[safeCurrentIndex];

  const nextItem = nextIndex !== null ? items[nextIndex] : null;

  /* =======================================================
     PRELOAD IMAGES

     This stops the new image from looking
     like it is loading during the rotation.
     ======================================================= */

  useEffect(() => {
    items.forEach((item) => {
      if (!item.coverImage) {
        return;
      }

      const image = new window.Image();

      image.src = item.coverImage;
    });
  }, [items]);

  /* =======================================================
     SMOOTH CHANGE
     ======================================================= */

  const changeTo = useCallback(
    (requestedIndex: number) => {
      if (items.length <= 1 || nextIndex !== null) {
        return;
      }

      const normalizedIndex =
        ((requestedIndex % items.length) + items.length) % items.length;

      if (normalizedIndex === safeCurrentIndex) {
        return;
      }

      /*
       * Mount incoming content.
       */
      setNextIndex(normalizedIndex);

      setTransitioning(false);

      /*
       * Give React enough time to mount
       * the second layer before animation.
       */
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setTransitioning(true);
        });
      });

      if (animationTimerRef.current !== null) {
        window.clearTimeout(animationTimerRef.current);
      }

      /*
       * Short transition.
       *
       * 340ms feels much more natural
       * than the previous 500ms blur.
       */
      animationTimerRef.current = window.setTimeout(() => {
        setCurrentIndex(normalizedIndex);

        setNextIndex(null);

        setTransitioning(false);

        animationTimerRef.current = null;
      }, 340);
    },
    [items.length, nextIndex, safeCurrentIndex],
  );

  /* =======================================================
     AUTO ROTATION

     First rotation is staggered.
     Afterward each type changes every 5s.
     ======================================================= */

  useEffect(() => {
    if (paused || items.length <= 1 || nextIndex !== null) {
      return;
    }

    const delay = firstCycleRef.current
      ? AUTO_ROTATE_MS + rotationOffsetMs
      : AUTO_ROTATE_MS;

    const timer = window.setTimeout(() => {
      firstCycleRef.current = false;

      changeTo((safeCurrentIndex + 1) % items.length);
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    changeTo,
    items.length,
    nextIndex,
    paused,
    rotationOffsetMs,
    safeCurrentIndex,
  ]);

  /* =======================================================
     CLEANUP
     ======================================================= */

  useEffect(() => {
    return () => {
      if (animationTimerRef.current !== null) {
        window.clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  /* =======================================================
     DATA SAFETY
     ======================================================= */

  useEffect(() => {
    if (items.length === 0) {
      setCurrentIndex(0);

      setNextIndex(null);

      return;
    }

    if (currentIndex >= items.length) {
      setCurrentIndex(0);

      setNextIndex(null);
    }
  }, [currentIndex, items.length]);

  if (!currentItem) {
    return null;
  }

  const visual = getTypeVisual(type);

  const Icon = visual.Icon;

  const indicatorIndex = nextIndex ?? safeCurrentIndex;

  /* =======================================================
     MANUAL DOT
     ======================================================= */

  function handleDotClick(dotIndex: number) {
    /*
     * After user manually selects one,
     * don't apply the initial stagger again.
     */
    firstCycleRef.current = false;

    changeTo(dotIndex);
  }

  return (
    <article
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative grid min-w-0 grid-cols-[32px_minmax(0,1fr)] gap-3"
    >
      {/* ===================================================
          TIMELINE POINT
         =================================================== */}

      <div className="relative z-20 flex justify-center pt-5">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full border bg-[var(--portfolio-bg)] shadow-[0_0_18px_rgba(88,233,255,0.10)]",
            visual.pointClass,
          )}
        >
          <Icon size={11} strokeWidth={1.8} />
        </span>
      </div>

      {/* ===================================================
          CARD SHELL

          Important:
          The card itself NEVER fades.
         =================================================== */}

      <div className="group relative min-w-0 overflow-hidden rounded-[20px] border border-[var(--portfolio-border)] bg-[var(--portfolio-panel)] shadow-[0_10px_28px_rgba(15,23,42,0.07)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-[1px] hover:border-[var(--portfolio-cyan)]/25 hover:shadow-[0_16px_38px_rgba(15,23,42,0.11)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.24)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.34)]">
        {/* =================================================
            FIXED HEADER

            Type + counter do not disappear during rotation.
           ================================================= */}

        <div className="flex min-h-[38px] items-center gap-2 px-4 pt-3">
          <span
            className={cn(
              "rounded-full px-2 py-1 font-body text-[7px] font-semibold uppercase tracking-[0.09em]",
              visual.badgeClass,
            )}
          >
            {formatType(type, locale)}
          </span>

          <span className="font-number text-[7px] font-medium text-[var(--portfolio-muted)]">
            {indicatorIndex + 1} / {items.length}
          </span>
        </div>

        {/* =================================================
            ANIMATED BODY

            Fixed height prevents page jumping.
           ================================================= */}

        <div className="relative h-[158px] overflow-hidden sm:h-[128px]">
          {/* CURRENT */}

          <div
            className={cn(
              "absolute inset-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              transitioning
                ? "-translate-y-[2px] opacity-0"
                : "translate-y-0 opacity-100",
            )}
          >
            <RotatingActivityBody
              locale={locale}
              type={type}
              item={currentItem}
            />
          </div>

          {/* NEXT */}

          {nextItem ? (
            <div
              className={cn(
                "absolute inset-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                transitioning
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[3px] opacity-0",
              )}
            >
              <RotatingActivityBody
                locale={locale}
                type={type}
                item={nextItem}
              />
            </div>
          ) : null}
        </div>

        {/* =================================================
            FIXED FOOTER

            This footer never fades either.
           ================================================= */}

        <div className="relative z-30 flex min-h-[38px] items-center justify-between gap-4 border-t border-[var(--portfolio-border)] px-4 py-2">
          {/* DOTS */}

          {items.length > 1 ? (
            items.length <= 7 ? (
              <div className="flex min-w-0 items-center gap-1.5">
                {items.map((activity, dotIndex) => (
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => handleDotClick(dotIndex)}
                    aria-label={`Show ${formatType(type, locale)} ${dotIndex + 1}`}
                    className={cn(
                      "h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out",
                      dotIndex === indicatorIndex
                        ? "w-5 bg-[var(--portfolio-cyan)]"
                        : "w-1.5 bg-[var(--portfolio-border)] hover:bg-[var(--portfolio-muted)]",
                    )}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleDotClick(
                      (safeCurrentIndex - 1 + items.length) % items.length,
                    )
                  }
                  className="flex h-6 w-6 items-center justify-center rounded-lg border border-[var(--portfolio-border)] text-[var(--portfolio-muted)] transition hover:border-[var(--portfolio-cyan)]/30 hover:text-[var(--portfolio-cyan)]"
                  aria-label="Previous activity"
                >
                  <ChevronLeft size={10} />
                </button>

                <span className="font-number min-w-[42px] text-center text-[8px] text-[var(--portfolio-muted)]">
                  {indicatorIndex + 1} / {items.length}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleDotClick((safeCurrentIndex + 1) % items.length)
                  }
                  className="flex h-6 w-6 items-center justify-center rounded-lg border border-[var(--portfolio-border)] text-[var(--portfolio-muted)] transition hover:border-[var(--portfolio-cyan)]/30 hover:text-[var(--portfolio-cyan)]"
                  aria-label="Next activity"
                >
                  <ChevronRight size={10} />
                </button>
              </div>
            )
          ) : (
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-5 rounded-full bg-[var(--portfolio-cyan)]" />

              <span
                className={cn(
                  "text-[7px] text-[var(--portfolio-muted)]",
                  khmer
                    ? "khmer-input-value font-normal"
                    : "font-body uppercase tracking-[0.07em]",
                )}
              >
                {khmer ? "១ កំណត់ត្រា" : "1 activity"}
              </span>
            </div>
          )}

          {/* AUTO STATUS */}

          {items.length > 1 ? (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  paused ? "bg-amber-400" : "bg-emerald-400",
                )}
              />

              <span
                className={cn(
                  "shrink-0 text-[7px] text-[var(--portfolio-muted)]",
                  khmer
                    ? "khmer-input-value font-normal"
                    : "font-body uppercase tracking-[0.07em]",
                )}
              >
                {paused
                  ? khmer
                    ? "បានផ្អាក"
                    : "Paused"
                  : khmer
                    ? `ស្វ័យប្រវត្តិ · ${AUTO_ROTATE_SECONDS} វិនាទី`
                    : `Auto · ${AUTO_ROTATE_SECONDS}s`}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function RotatingActivityBody({
  locale,
  type,
  item,
}: {
  locale: "en" | "km";
  type: string;
  item: PublicActivity;
}) {
  const khmer = locale === "km";

  const title = activityTitle(item, locale);

  const organization = activityOrganization(item, locale);

  const summary = activitySummary(item, locale);

  const location = activityLocation(item, locale);

  const period = formatActivityPeriod(item, locale);

  return (
    <div className="flex h-full min-w-0 gap-4 px-4 pb-3 pt-2 sm:items-center">
      {/* ===================================================
          TEXT
         =================================================== */}

      <div className="min-w-0 flex-1">
        {/* DATE */}

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-number text-[8px] text-[var(--portfolio-muted)]">
            {period}
          </span>

          {item.isCurrent ? (
            <span className="rounded-full bg-cyan-500/10 px-2 py-1 font-body text-[7px] font-semibold uppercase tracking-[0.07em] text-cyan-700 dark:text-cyan-300">
              {khmer ? "បច្ចុប្បន្ន" : "Current"}
            </span>
          ) : null}
        </div>

        {/* TITLE */}

        <h3
          className={cn(
            "mt-2 line-clamp-2 text-[14px] text-[var(--portfolio-text)] md:text-[15px]",
            khmer && item.titleKm
              ? "khmer-input-value font-normal leading-7"
              : "font-body font-semibold leading-5",
          )}
        >
          {title}
        </h3>

        {/* ORGANIZATION */}

        {organization ? (
          <p
            className={cn(
              "mt-1 line-clamp-1 text-[9px] text-[var(--portfolio-cyan)]",
              khmer && item.organizationKm
                ? "khmer-input-value font-normal leading-5"
                : "font-body",
            )}
          >
            {organization}
          </p>
        ) : null}

        {/* LOCATION */}

        {location ? (
          <p className="font-body mt-1 inline-flex items-center gap-1.5 text-[8px] text-[var(--portfolio-muted)]">
            <MapPin size={9} />

            {location}
          </p>
        ) : null}

        {/* SUMMARY */}

        {summary ? (
          <p
            className={cn(
              "mt-1.5 line-clamp-2 max-w-3xl text-[9px] text-[var(--portfolio-muted)]",
              khmer && item.summaryKm
                ? "khmer-input-value font-normal leading-5"
                : "font-body leading-4",
            )}
          >
            {summary}
          </p>
        ) : null}

        {/* PROJECT LINK */}

        {type === "PROJECT" ? (
          <Link
            href={`/projects/${item.slug}`}
            className="font-body mt-1.5 inline-flex items-center gap-1 text-[8px] font-semibold text-[var(--portfolio-cyan)] transition-all duration-200 hover:gap-1.5"
          >
            {khmer ? "មើលគម្រោង" : "View project"}

            <ChevronRight size={10} />
          </Link>
        ) : null}
      </div>

      {/* ===================================================
          IMAGE
         =================================================== */}

      {item.coverImage ? (
        <div className="relative hidden h-[82px] w-[120px] shrink-0 overflow-hidden rounded-[12px] border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] sm:block">
          <img
            src={item.coverImage}
            alt={title}
            className="h-full w-full object-cover"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.08] via-transparent to-transparent" />
        </div>
      ) : null}
    </div>
  );
}

/* =========================================================
   CATEGORY CONTENT
   ========================================================= */

function CategoryContent({
  locale,
  type,
  items,
}: {
  locale: "en" | "km";
  type: string;
  items: PublicActivity[];
}) {
  if (items.length === 0) {
    return <FilteredEmpty locale={locale} />;
  }

  switch (type) {
    case "PROJECT":
      return <ProjectLayout locale={locale} items={items} />;

    case "WORK":
      return <WorkLayout locale={locale} items={items} />;

    case "CERTIFICATE":
      return <CertificateLayout locale={locale} items={items} />;

    case "TEACHING":
      return <TeachingLayout locale={locale} items={items} />;

    case "EVENT":
      return <EventLayout locale={locale} items={items} />;

    case "ACHIEVEMENT":
      return <AchievementLayout locale={locale} items={items} />;

    case "COMPETITION":
      return <CompetitionLayout locale={locale} items={items} />;

    case "EDUCATION":
      return <EducationLayout locale={locale} items={items} />;

    default:
      return <GenericLayout locale={locale} items={items} />;
  }
}

/* =========================================================
   PROJECT LAYOUT
   ========================================================= */

function ProjectLayout({
  locale,
  items,
}: {
  locale: "en" | "km";
  items: PublicActivity[];
}) {
  const khmer = locale === "km";

  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const title = activityTitle(item, locale);
        const organization = activityOrganization(item, locale);
        const summary = activitySummary(item, locale);
        const location = activityLocation(item, locale);
        const technologies = splitTechnologies(item.technologies);

        return (
          <Link
            key={item.id}
            href={`/projects/${item.slug}`}
            className="group block min-w-0"
          >
            <article className="flex min-w-0 flex-col gap-4 rounded-[20px] border border-[var(--portfolio-border)] bg-[var(--portfolio-panel)] p-4 shadow-[0_10px_28px_rgba(15,23,42,0.07)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-violet-400/30 hover:shadow-[0_16px_38px_rgba(15,23,42,0.11)] sm:flex-row sm:items-center dark:shadow-[0_12px_30px_rgba(0,0,0,0.24)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.34)]">
              {/* =================================================
                  CONTENT
                 ================================================= */}

              <div className="min-w-0 flex-1">
                {/* TYPE + DATE */}

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-violet-500/10 px-2 py-1 font-body text-[7px] font-semibold uppercase tracking-[0.09em] text-violet-700 dark:text-violet-300">
                    {khmer ? "គម្រោង" : "Project"}
                  </span>

                  <span className="font-number text-[8px] text-[var(--portfolio-muted)]">
                    {formatActivityPeriod(item, locale)}
                  </span>

                  {item.isCurrent ? (
                    <span className="rounded-full bg-cyan-500/10 px-2 py-1 font-body text-[7px] font-semibold uppercase tracking-[0.07em] text-cyan-700 dark:text-cyan-300">
                      {khmer ? "បច្ចុប្បន្ន" : "Current"}
                    </span>
                  ) : null}
                </div>

                {/* TITLE */}

                <h3
                  className={cn(
                    "mt-2.5 text-[14px] text-[var(--portfolio-text)] md:text-[15px]",
                    khmer && item.titleKm
                      ? "khmer-input-value font-normal leading-7"
                      : "font-body font-semibold leading-5",
                  )}
                >
                  {title}
                </h3>

                {/* ORGANIZATION */}

                {organization ? (
                  <p
                    className={cn(
                      "mt-1 text-[9px] text-[var(--portfolio-cyan)]",
                      khmer && item.organizationKm
                        ? "khmer-input-value font-normal leading-5"
                        : "font-body",
                    )}
                  >
                    {organization}
                  </p>
                ) : null}

                {/* SUMMARY */}

                {summary ? (
                  <p
                    className={cn(
                      "mt-2 line-clamp-2 max-w-3xl text-[9px] text-[var(--portfolio-muted)]",
                      khmer && item.summaryKm
                        ? "khmer-input-value font-normal leading-5"
                        : "font-body leading-4",
                    )}
                  >
                    {summary}
                  </p>
                ) : null}

                {/* LOCATION */}

                {location ? (
                  <p className="font-body mt-2 inline-flex items-center gap-1.5 text-[8px] text-[var(--portfolio-muted)]">
                    <MapPin size={9} />
                    {location}
                  </p>
                ) : null}

                {/* TECHNOLOGIES */}

                {technologies.length > 0 ? (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {technologies.slice(0, 5).map((technology) => (
                      <span
                        key={technology}
                        className="rounded-lg border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] px-2 py-1 font-body text-[7px] text-[var(--portfolio-muted)]"
                      >
                        {technology}
                      </span>
                    ))}

                    {technologies.length > 5 ? (
                      <span className="rounded-lg border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] px-2 py-1 font-body text-[7px] text-[var(--portfolio-muted)]">
                        +{technologies.length - 5}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                {/* LINK */}

                <div className="font-body mt-2.5 inline-flex items-center gap-1 text-[8px] font-semibold text-[var(--portfolio-cyan)] transition-all duration-200 group-hover:gap-1.5">
                  {khmer ? "មើលគម្រោង" : "View project"}
                  <ChevronRight size={10} />
                </div>
              </div>

              {/* =================================================
                  SMALL IMAGE
                 ================================================= */}

              {item.coverImage ? (
                <div className="relative h-[105px] w-full shrink-0 overflow-hidden rounded-[14px] border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] sm:h-[96px] sm:w-[145px]">
                  <img
                    src={item.coverImage}
                    alt={title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="flex h-[96px] w-full shrink-0 items-center justify-center rounded-[14px] border border-[var(--portfolio-border)] bg-gradient-to-br from-violet-500/[0.08] to-cyan-400/[0.05] text-violet-500 sm:w-[145px]">
                  <Code2 size={22} />
                </div>
              )}
            </article>
          </Link>
        );
      })}
    </div>
  );
}

/* =========================================================
   WORK LAYOUT
   ========================================================= */

function WorkLayout({
  locale,
  items,
}: {
  locale: "en" | "km";
  items: PublicActivity[];
}) {
  return <VerticalTimeline locale={locale} items={items} type="WORK" />;
}

/* =========================================================
   CERTIFICATE LAYOUT
   ========================================================= */

function CertificateLayout({
  locale,
  items,
}: {
  locale: "en" | "km";
  items: PublicActivity[];
}) {
  const khmer = locale === "km";

  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const title = activityTitle(item, locale);
        const organization = activityOrganization(item, locale);
        const summary = activitySummary(item, locale);

        return (
          <article
            key={item.id}
            className="group flex min-w-0 flex-col gap-4 rounded-[20px] border border-[var(--portfolio-border)] bg-[var(--portfolio-panel)] p-4 shadow-[0_10px_28px_rgba(15,23,42,0.07)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-amber-400/30 hover:shadow-[0_16px_38px_rgba(15,23,42,0.11)] sm:flex-row sm:items-center dark:shadow-[0_12px_30px_rgba(0,0,0,0.24)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.34)]"
          >
            {/* =================================================
                CONTENT
               ================================================= */}

            <div className="min-w-0 flex-1">
              {/* TYPE + DATE */}

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-amber-500/10 px-2 py-1 font-body text-[7px] font-semibold uppercase tracking-[0.09em] text-amber-700 dark:text-amber-300">
                  {khmer ? "វិញ្ញាបនបត្រ" : "Certificate"}
                </span>

                <span className="font-number text-[8px] text-[var(--portfolio-muted)]">
                  {formatActivityPeriod(item, locale)}
                </span>
              </div>

              {/* TITLE */}

              <h3
                className={cn(
                  "mt-2.5 text-[14px] text-[var(--portfolio-text)] md:text-[15px]",
                  khmer && item.titleKm
                    ? "khmer-input-value font-normal leading-7"
                    : "font-body font-semibold leading-5",
                )}
              >
                {title}
              </h3>

              {/* ORGANIZATION */}

              {organization ? (
                <p
                  className={cn(
                    "mt-1 text-[9px] text-[var(--portfolio-cyan)]",
                    khmer && item.organizationKm
                      ? "khmer-input-value font-normal leading-5"
                      : "font-body",
                  )}
                >
                  {organization}
                </p>
              ) : null}

              {/* SUMMARY */}

              {summary ? (
                <p
                  className={cn(
                    "mt-2 line-clamp-2 max-w-3xl text-[9px] text-[var(--portfolio-muted)]",
                    khmer && item.summaryKm
                      ? "khmer-input-value font-normal leading-5"
                      : "font-body leading-4",
                  )}
                >
                  {summary}
                </p>
              ) : null}

              {/* CREDENTIAL ID */}

              {item.credentialId ? (
                <p className="font-body mt-2 text-[8px] text-[var(--portfolio-muted)]">
                  <span className="font-semibold text-[var(--portfolio-text)]">
                    {khmer ? "លេខសម្គាល់៖" : "Credential ID:"}
                  </span>{" "}
                  {item.credentialId}
                </p>
              ) : null}

              {/* EXTERNAL URL */}

              {item.externalUrl ? (
                <a
                  href={item.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body mt-2.5 inline-flex items-center gap-1.5 text-[8px] font-semibold text-[var(--portfolio-cyan)] transition hover:gap-2"
                >
                  {khmer ? "មើលវិញ្ញាបនបត្រ" : "View credential"}
                  <ExternalLink size={10} />
                </a>
              ) : null}
            </div>

            {/* =================================================
                SMALL CERTIFICATE PREVIEW
               ================================================= */}

            {item.coverImage ? (
              <div className="relative flex h-[110px] w-full shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-[var(--portfolio-border)] bg-white p-1.5 sm:h-[100px] sm:w-[150px]">
                <img
                  src={item.coverImage}
                  alt={title}
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
            ) : (
              <div className="flex h-[100px] w-full shrink-0 items-center justify-center rounded-[14px] border border-[var(--portfolio-border)] bg-amber-500/[0.05] text-amber-500 sm:w-[150px]">
                <Award size={24} />
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

/* =========================================================
   TEACHING LAYOUT
   ========================================================= */

function TeachingLayout({
  locale,
  items,
}: {
  locale: "en" | "km";
  items: PublicActivity[];
}) {
  return <VerticalTimeline locale={locale} items={items} type="TEACHING" />;
}

/* =========================================================
   EVENT LAYOUT
   ========================================================= */

function EventLayout({
  locale,
  items,
}: {
  locale: "en" | "km";
  items: PublicActivity[];
}) {
  const khmer = locale === "km";

  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const title = activityTitle(item, locale);

        const organization = activityOrganization(item, locale);

        const summary = activitySummary(item, locale);

        const location = activityLocation(item, locale);

        return (
          <article
            key={item.id}
            className="group flex min-w-0 flex-col gap-4 rounded-[20px] border border-[var(--portfolio-border)] bg-[var(--portfolio-panel)] p-4 shadow-[0_10px_28px_rgba(15,23,42,0.07)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-[1px] hover:border-cyan-400/30 hover:shadow-[0_16px_38px_rgba(15,23,42,0.11)] sm:flex-row sm:items-center dark:shadow-[0_12px_30px_rgba(0,0,0,0.24)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.34)]"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-cyan-500/10 px-2 py-1 font-body text-[7px] font-semibold uppercase tracking-[0.09em] text-cyan-700 dark:text-cyan-300">
                  {khmer ? "ព្រឹត្តិការណ៍" : "Event"}
                </span>

                <span className="font-number text-[8px] text-[var(--portfolio-muted)]">
                  {formatActivityPeriod(item, locale)}
                </span>
              </div>

              <h3
                className={cn(
                  "mt-2.5 text-[14px] text-[var(--portfolio-text)]",
                  khmer && item.titleKm
                    ? "khmer-input-value font-normal leading-7"
                    : "font-body font-semibold leading-5",
                )}
              >
                {title}
              </h3>

              {organization ? (
                <p
                  className={cn(
                    "mt-1 text-[9px] text-[var(--portfolio-cyan)]",
                    khmer && item.organizationKm
                      ? "khmer-input-value font-normal leading-5"
                      : "font-body",
                  )}
                >
                  {organization}
                </p>
              ) : null}

              {summary ? (
                <p
                  className={cn(
                    "mt-2 line-clamp-2 max-w-3xl text-[9px] text-[var(--portfolio-muted)]",
                    khmer && item.summaryKm
                      ? "khmer-input-value font-normal leading-5"
                      : "font-body leading-4",
                  )}
                >
                  {summary}
                </p>
              ) : null}

              {location ? (
                <p className="font-body mt-2 inline-flex items-center gap-1.5 text-[8px] text-[var(--portfolio-muted)]">
                  <MapPin size={10} />

                  {location}
                </p>
              ) : null}
            </div>

            {item.coverImage ? (
              <div className="h-[92px] w-full shrink-0 overflow-hidden rounded-xl border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] sm:w-[135px]">
                <img
                  src={item.coverImage}
                  alt={title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

/* =========================================================
   ACHIEVEMENT LAYOUT
   ========================================================= */

function AchievementLayout({
  locale,
  items,
}: {
  locale: "en" | "km";
  items: PublicActivity[];
}) {
  const khmer = locale === "km";

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => {
        const title = activityTitle(item, locale);

        const organization = activityOrganization(item, locale);

        const summary = activitySummary(item, locale);

        return (
          <article
            key={item.id}
            className="relative overflow-hidden rounded-[22px] border border-[var(--portfolio-border)] bg-[var(--portfolio-panel)] p-4 shadow-[0_10px_28px_rgba(15,23,42,0.07)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-fuchsia-400/30 hover:shadow-[0_16px_38px_rgba(15,23,42,0.11)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.24)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.34)]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-fuchsia-500/[0.05] blur-3xl"
            />

            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-500/15 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-300">
                <Trophy size={17} />
              </div>

              <p className="font-number mt-4 text-[8px] text-[var(--portfolio-muted)]">
                {formatActivityPeriod(item, locale)}
              </p>

              <h3
                className={cn(
                  "mt-1.5 text-[14px] text-[var(--portfolio-text)]",
                  khmer && item.titleKm
                    ? "khmer-input-value font-normal leading-7"
                    : "font-body font-semibold leading-5",
                )}
              >
                {title}
              </h3>

              {organization ? (
                <p
                  className={cn(
                    "mt-1 text-[9px] text-[var(--portfolio-cyan)]",
                    khmer && item.organizationKm
                      ? "khmer-input-value font-normal leading-5"
                      : "font-body",
                  )}
                >
                  {organization}
                </p>
              ) : null}

              {summary ? (
                <p
                  className={cn(
                    "mt-2 line-clamp-3 text-[9px] text-[var(--portfolio-muted)]",
                    khmer && item.summaryKm
                      ? "khmer-input-value font-normal leading-5"
                      : "font-body leading-4",
                  )}
                >
                  {summary}
                </p>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* =========================================================
   COMPETITION LAYOUT
   ========================================================= */

function CompetitionLayout({
  locale,
  items,
}: {
  locale: "en" | "km";
  items: PublicActivity[];
}) {
  const khmer = locale === "km";

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => {
        const title = activityTitle(item, locale);

        const organization = activityOrganization(item, locale);

        const summary = activitySummary(item, locale);

        return (
          <article
            key={item.id}
            className="group overflow-hidden rounded-[22px] border border-[var(--portfolio-border)] bg-[var(--portfolio-panel)] transition hover:-translate-y-0.5 hover:border-orange-400/30"
          >
            {item.coverImage ? (
              <div className="aspect-[16/7] overflow-hidden border-b border-[var(--portfolio-border)]">
                <img
                  src={item.coverImage}
                  alt={title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
            ) : null}

            <div className="p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-300">
                  <Trophy size={14} />
                </span>

                <span className="font-number text-[8px] text-[var(--portfolio-muted)]">
                  {formatActivityPeriod(item, locale)}
                </span>
              </div>

              <h3
                className={cn(
                  "mt-3 text-[14px] text-[var(--portfolio-text)]",
                  khmer && item.titleKm
                    ? "khmer-input-value font-normal leading-7"
                    : "font-body font-semibold leading-5",
                )}
              >
                {title}
              </h3>

              {organization ? (
                <p
                  className={cn(
                    "mt-1 text-[9px] text-[var(--portfolio-cyan)]",
                    khmer && item.organizationKm
                      ? "khmer-input-value font-normal leading-5"
                      : "font-body",
                  )}
                >
                  {organization}
                </p>
              ) : null}

              {summary ? (
                <p
                  className={cn(
                    "mt-2 line-clamp-3 text-[9px] text-[var(--portfolio-muted)]",
                    khmer && item.summaryKm
                      ? "khmer-input-value font-normal leading-5"
                      : "font-body leading-4",
                  )}
                >
                  {summary}
                </p>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* =========================================================
   EDUCATION LAYOUT
   ========================================================= */

function EducationLayout({
  locale,
  items,
}: {
  locale: "en" | "km";
  items: PublicActivity[];
}) {
  return <VerticalTimeline locale={locale} items={items} type="EDUCATION" />;
}

/* =========================================================
   GENERIC LAYOUT
   ========================================================= */

function GenericLayout({
  locale,
  items,
}: {
  locale: "en" | "km";
  items: PublicActivity[];
}) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <GenericCard key={item.id} locale={locale} item={item} />
      ))}
    </div>
  );
}

/* =========================================================
   VERTICAL TIMELINE
   WORK / TEACHING / EDUCATION
   ========================================================= */

function VerticalTimeline({
  locale,
  items,
  type,
}: {
  locale: "en" | "km";
  items: PublicActivity[];
  type: string;
}) {
  const khmer = locale === "km";

  const visual = getTypeVisual(type);

  const Icon = visual.Icon;

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute bottom-5 left-[15px] top-5 w-px bg-gradient-to-b from-[var(--portfolio-cyan)]/60 via-[var(--portfolio-border)] to-transparent"
      />

      <div className="relative grid gap-3">
        {items.map((item) => {
          const title = activityTitle(item, locale);

          const organization = activityOrganization(item, locale);

          const location = activityLocation(item, locale);

          const summary = activitySummary(item, locale);

          return (
            <article
              key={item.id}
              className="relative grid grid-cols-[32px_minmax(0,1fr)] gap-3"
            >
              <div className="relative z-10 flex justify-center pt-4">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border bg-[var(--portfolio-bg)]",
                    visual.pointClass,
                  )}
                >
                  <Icon size={11} />
                </span>
              </div>

              <div className="rounded-[20px] border border-[var(--portfolio-border)] bg-[var(--portfolio-panel)] p-4 shadow-[0_10px_28px_rgba(15,23,42,0.07)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-[1px] hover:border-[var(--portfolio-cyan)]/25 hover:shadow-[0_16px_38px_rgba(15,23,42,0.11)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.24)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.34)]">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 font-body text-[7px] font-semibold uppercase tracking-[0.08em]",
                      visual.badgeClass,
                    )}
                  >
                    {formatType(type, locale)}
                  </span>

                  <span className="font-number text-[8px] text-[var(--portfolio-muted)]">
                    {formatActivityPeriod(item, locale)}
                  </span>

                  {item.isCurrent ? (
                    <span className="rounded-full bg-cyan-500/10 px-2 py-1 font-body text-[7px] font-semibold text-cyan-700 dark:text-cyan-300">
                      {khmer ? "បច្ចុប្បន្ន" : "Current"}
                    </span>
                  ) : null}
                </div>

                <h3
                  className={cn(
                    "mt-2.5 text-[14px] text-[var(--portfolio-text)]",
                    khmer && item.titleKm
                      ? "khmer-input-value font-normal leading-7"
                      : "font-body font-semibold leading-5",
                  )}
                >
                  {title}
                </h3>

                {organization ? (
                  <p
                    className={cn(
                      "mt-1 text-[9px] text-[var(--portfolio-cyan)]",
                      khmer && item.organizationKm
                        ? "khmer-input-value font-normal leading-5"
                        : "font-body",
                    )}
                  >
                    {organization}
                  </p>
                ) : null}

                {location ? (
                  <p className="font-body mt-1.5 inline-flex items-center gap-1 text-[8px] text-[var(--portfolio-muted)]">
                    <MapPin size={9} />

                    {location}
                  </p>
                ) : null}

                {summary ? (
                  <p
                    className={cn(
                      "mt-2 line-clamp-3 max-w-3xl text-[9px] text-[var(--portfolio-muted)]",
                      khmer && item.summaryKm
                        ? "khmer-input-value font-normal leading-5"
                        : "font-body leading-4",
                    )}
                  >
                    {summary}
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   GENERIC CARD
   ========================================================= */

function GenericCard({
  locale,
  item,
}: {
  locale: "en" | "km";
  item: PublicActivity;
}) {
  const khmer = locale === "km";

  const visual = getTypeVisual(item.type);

  const Icon = visual.Icon;

  const title = activityTitle(item, locale);

  const organization = activityOrganization(item, locale);

  const summary = activitySummary(item, locale);

  return (
    <article className="flex min-w-0 gap-3 rounded-[20px] border border-[var(--portfolio-border)] bg-[var(--portfolio-panel)] p-4">
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
          visual.pointClass,
        )}
      >
        <Icon size={14} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-1 font-body text-[7px] font-semibold uppercase tracking-[0.08em]",
              visual.badgeClass,
            )}
          >
            {formatType(item.type, locale)}
          </span>

          <span className="font-number text-[8px] text-[var(--portfolio-muted)]">
            {formatActivityPeriod(item, locale)}
          </span>
        </div>

        <h3
          className={cn(
            "mt-2 text-[14px] text-[var(--portfolio-text)]",
            khmer && item.titleKm
              ? "khmer-input-value font-normal leading-7"
              : "font-body font-semibold",
          )}
        >
          {title}
        </h3>

        {organization ? (
          <p
            className={cn(
              "mt-1 text-[9px] text-[var(--portfolio-cyan)]",
              khmer && item.organizationKm
                ? "khmer-input-value font-normal leading-5"
                : "font-body",
            )}
          >
            {organization}
          </p>
        ) : null}

        {summary ? (
          <p
            className={cn(
              "mt-2 line-clamp-2 text-[9px] text-[var(--portfolio-muted)]",
              khmer && item.summaryKm
                ? "khmer-input-value font-normal leading-5"
                : "font-body leading-4",
            )}
          >
            {summary}
          </p>
        ) : null}
      </div>
    </article>
  );
}

/* =========================================================
   TYPE VISUAL
   ========================================================= */

function getTypeVisual(type: string): {
  Icon: LucideIcon;
  badgeClass: string;
  pointClass: string;
  textClass: string;
} {
  switch (type) {
    case "PROJECT":
      return {
        Icon: Code2,

        badgeClass: "bg-violet-500/10 text-violet-700 dark:text-violet-300",

        pointClass: "border-violet-400/45 text-violet-600 dark:text-violet-300",

        textClass: "text-violet-700 dark:text-violet-300",
      };

    case "WORK":
      return {
        Icon: BriefcaseBusiness,

        badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300",

        pointClass: "border-blue-400/45 text-blue-600 dark:text-blue-300",

        textClass: "text-blue-700 dark:text-blue-300",
      };

    case "CERTIFICATE":
      return {
        Icon: Award,

        badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300",

        pointClass: "border-amber-400/45 text-amber-600 dark:text-amber-300",

        textClass: "text-amber-700 dark:text-amber-300",
      };

    case "TEACHING":
      return {
        Icon: Presentation,

        badgeClass: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",

        pointClass: "border-cyan-400/45 text-cyan-600 dark:text-cyan-300",

        textClass: "text-cyan-700 dark:text-cyan-300",
      };

    case "EVENT":
      return {
        Icon: CalendarDays,

        badgeClass: "bg-teal-500/10 text-teal-700 dark:text-teal-300",

        pointClass: "border-teal-400/45 text-teal-600 dark:text-teal-300",

        textClass: "text-teal-700 dark:text-teal-300",
      };

    case "ACHIEVEMENT":
      return {
        Icon: Trophy,

        badgeClass: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",

        pointClass:
          "border-fuchsia-400/45 text-fuchsia-600 dark:text-fuchsia-300",

        textClass: "text-fuchsia-700 dark:text-fuchsia-300",
      };

    case "COMPETITION":
      return {
        Icon: Trophy,

        badgeClass: "bg-orange-500/10 text-orange-700 dark:text-orange-300",

        pointClass: "border-orange-400/45 text-orange-600 dark:text-orange-300",

        textClass: "text-orange-700 dark:text-orange-300",
      };

    case "EDUCATION":
      return {
        Icon: GraduationCap,

        badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",

        pointClass:
          "border-emerald-400/45 text-emerald-600 dark:text-emerald-300",

        textClass: "text-emerald-700 dark:text-emerald-300",
      };

    default:
      return {
        Icon: Sparkles,

        badgeClass: "bg-slate-500/10 text-slate-700 dark:text-slate-300",

        pointClass: "border-slate-400/45 text-slate-600 dark:text-slate-300",

        textClass: "text-slate-700 dark:text-slate-300",
      };
  }
}

/* =========================================================
   BUILD TYPE GROUPS
   ========================================================= */

function buildTypeGroups(items: PublicActivity[]): ActivityTypeGroup[] {
  const groups = new Map<string, PublicActivity[]>();

  /*
   * Group all records by activity type.
   */
  items.forEach((item) => {
    const existing = groups.get(item.type) ?? [];

    groups.set(item.type, [...existing, item]);
  });

  /*
   * Sort records inside every group:
   * newest → oldest.
   */
  const result = Array.from(groups.entries())
    .filter(([type]) => CATEGORY_ORDER.includes(type))
    .map(([type, typeItems]) => ({
      type,

      items: [...typeItems].sort((a, b) =>
        b.activityDate.localeCompare(a.activityDate),
      ),
    }));

  /*
   * Sort TYPE rows by that type's
   * newest activity.
   *
   * Example:
   *
   * Certificate → Aug 21
   * Event       → Aug 01
   * Work        → Jul
   * Project     → Jun
   *
   * Result:
   *
   * Certificate
   * Event
   * Work
   * Project
   *
   * Important:
   * Rows never change position while cycling.
   */
  return result.sort((a, b) => {
    const newestA = a.items[0]?.activityDate ?? "";

    const newestB = b.items[0]?.activityDate ?? "";

    return newestB.localeCompare(newestA);
  });
}

/* =========================================================
   CATEGORY OPTIONS
   ========================================================= */

function buildCategoryOptions(
  items: PublicActivity[],
  locale: "en" | "km",
): CategoryOption[] {
  const existingTypes = new Set(items.map((item) => item.type));

  return CATEGORY_ORDER.filter((type) => existingTypes.has(type)).map(
    (type) => ({
      type,

      label: formatType(type, locale),

      count: items.filter((item) => item.type === type).length,

      Icon: getTypeVisual(type).Icon,
    }),
  );
}

/* =========================================================
   BUILD YEARS
   ========================================================= */

function buildTimelineYears(items: PublicActivity[]): TimelineYear[] {
  const groups = new Map<string, PublicActivity[]>();

  items.forEach((item) => {
    const year = getDateParts(item.activityDate).year;

    if (!year) {
      return;
    }

    const existing = groups.get(year) ?? [];

    groups.set(year, [...existing, item]);
  });

  return Array.from(groups.entries())
    .map(([year, yearItems]) => ({
      year,

      items: [...yearItems].sort((a, b) =>
        b.activityDate.localeCompare(a.activityDate),
      ),
    }))
    .sort((a, b) => Number(b.year) - Number(a.year));
}

/* =========================================================
   LOCALIZATION
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

function activityLocation(item: PublicActivity, locale: "en" | "km") {
  return localized(locale, item.locationEn, item.locationKm);
}

/* =========================================================
   TYPE LABEL
   ========================================================= */

function formatType(value: string, locale: "en" | "km") {
  if (locale === "km") {
    switch (value) {
      case "PROJECT":
        return "គម្រោង";

      case "WORK":
        return "ការងារ";

      case "CERTIFICATE":
        return "វិញ្ញាបនបត្រ";

      case "TEACHING":
        return "ការបង្រៀន";

      case "EVENT":
        return "ព្រឹត្តិការណ៍";

      case "ACHIEVEMENT":
        return "សមិទ្ធផល";

      case "COMPETITION":
        return "ការប្រកួត";

      case "EDUCATION":
        return "ការសិក្សា";

      default:
        return "ផ្សេងៗ";
    }
  }

  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/* =========================================================
   PLURAL LABEL
   ========================================================= */

function formatTypePlural(value: string, locale: "en" | "km") {
  if (locale === "km") {
    return formatType(value, locale);
  }

  switch (value) {
    case "PROJECT":
      return "projects";

    case "WORK":
      return "work experiences";

    case "CERTIFICATE":
      return "certificates";

    case "TEACHING":
      return "teaching activities";

    case "EVENT":
      return "events";

    case "ACHIEVEMENT":
      return "achievements";

    case "COMPETITION":
      return "competitions";

    case "EDUCATION":
      return "education milestones";

    default:
      return "milestones";
  }
}

/* =========================================================
   TECHNOLOGIES
   ========================================================= */

function splitTechnologies(value: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(/[,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

/* =========================================================
   DETERMINISTIC DATE
   ========================================================= */

function getDateParts(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

  if (!match) {
    return {
      year: "",

      month: 0,

      day: 0,
    };
  }

  return {
    year: match[1],

    month: Number(match[2]),

    day: Number(match[3]),
  };
}

/* =========================================================
   PERIOD
   ========================================================= */

function formatActivityPeriod(item: PublicActivity, locale: "en" | "km") {
  const start = formatSingleDate(item.activityDate, item.datePrecision, locale);

  if (item.isCurrent) {
    return `${start} — ${locale === "km" ? "បច្ចុប្បន្ន" : "Present"}`;
  }

  if (item.endDate) {
    const end = formatSingleDate(item.endDate, item.datePrecision, locale);

    return `${start} — ${end}`;
  }

  return start;
}

/* =========================================================
   SINGLE DATE
   ========================================================= */

function formatSingleDate(
  value: string,
  precision: string,
  locale: "en" | "km",
) {
  const { year, month, day } = getDateParts(value);

  if (!year) {
    return "";
  }

  if (precision === "YEAR") {
    return year;
  }

  const monthIndex = month - 1;

  if (monthIndex < 0 || monthIndex > 11) {
    return year;
  }

  const monthName =
    locale === "km" ? KM_MONTHS[monthIndex] : EN_MONTHS[monthIndex];

  if (precision === "MONTH") {
    return `${monthName} ${year}`;
  }

  if (locale === "km") {
    return `${day} ${monthName} ${year}`;
  }

  return `${monthName} ${day}, ${year}`;
}

/* =========================================================
   EMPTY JOURNEY
   ========================================================= */

function EmptyJourney({ locale }: { locale: "en" | "km" }) {
  return (
    <div className="portfolio-panel mt-10 flex min-h-[220px] items-center justify-center p-6 text-center">
      <p
        className={
          locale === "km"
            ? "khmer-input-value text-[12px] font-normal leading-6 text-[var(--portfolio-muted)]"
            : "font-body text-[12px] text-[var(--portfolio-muted)]"
        }
      >
        {locale === "km"
          ? "បន្ថែមសកម្មភាព ដើម្បីបង្កើតដំណើរតាមពេលវេលារបស់អ្នក។"
          : "Add activities to build your personal journey."}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY FILTER
   ========================================================= */

function FilteredEmpty({ locale }: { locale: "en" | "km" }) {
  return (
    <div className="rounded-[20px] border border-dashed border-[var(--portfolio-border)] bg-[var(--portfolio-panel)] p-8 text-center">
      <p
        className={
          locale === "km"
            ? "khmer-input-value text-[11px] font-normal leading-6 text-[var(--portfolio-muted)]"
            : "font-body text-[11px] text-[var(--portfolio-muted)]"
        }
      >
        {locale === "km"
          ? "មិនមានកំណត់ត្រាសម្រាប់ប្រភេទនេះនៅក្នុងឆ្នាំដែលបានជ្រើសទេ។"
          : "No milestones in this category for the selected year."}
      </p>
    </div>
  );
}
