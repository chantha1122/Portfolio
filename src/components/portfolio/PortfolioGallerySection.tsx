"use client";

import { useEffect, useRef, useState } from "react";

import {
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Images,
  X,
} from "lucide-react";

import ActivityEngagement from "@/components/portfolio/ActivityEngagement";
import type { PublicActivity } from "@/types/publicPortfolio";
import { cn } from "@/lib/cn";

/* =========================================================
   CONFIG
   ========================================================= */

const INITIAL_ROWS = 2;

/* =========================================================
   TYPES
   ========================================================= */

type Props = {
  locale: "en" | "km";
  items: PublicActivity[];
};

/* =========================================================
   MAIN
   ========================================================= */

export default function PortfolioGallerySection({ locale, items }: Props) {
  const galleryRef = useRef<HTMLElement | null>(null);

  const [columnCount, setColumnCount] = useState(4);

  const [visibleRows, setVisibleRows] = useState(INITIAL_ROWS);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [showBackToGalleryTop, setShowBackToGalleryTop] = useState(false);

  /* =======================================================
     SORT NEWEST -> OLDEST
     ======================================================= */

  /*
   * Gallery order:
   *
   * newest activity date
   *        ↓
   * older activity date
   *        ↓
   * oldest activity date
   *
   * If two items have the same activityDate,
   * the item with the higher ID appears first.
   */
  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.activityDate).getTime();

    const dateB = new Date(b.activityDate).getTime();

    if (dateA !== dateB) {
      return dateB - dateA;
    }

    return b.id - a.id;
  });

  /* =======================================================
     RESPONSIVE COLUMN COUNT
     ======================================================= */

  useEffect(() => {
    function updateColumns() {
      const width = window.innerWidth;

      /*
       * Must match:
       *
       * mobile = 1
       * sm     = 2
       * lg     = 3
       * xl     = 4
       */

      if (width >= 1280) {
        setColumnCount(4);

        return;
      }

      if (width >= 1024) {
        setColumnCount(3);

        return;
      }

      if (width >= 640) {
        setColumnCount(2);

        return;
      }

      setColumnCount(1);
    }

    updateColumns();

    window.addEventListener("resize", updateColumns);

    return () => {
      window.removeEventListener("resize", updateColumns);
    };
  }, []);

  /* =======================================================
     ROW CALCULATION
     ======================================================= */

  const totalRows = Math.ceil(sortedItems.length / columnCount);

  const visibleCount = visibleRows * columnCount;

  const visibleItems = sortedItems.slice(0, visibleCount);

  const canShowMore = visibleRows < totalRows;

  const canShowLess = visibleRows > INITIAL_ROWS;

  const hasMoreThanThreeRows = totalRows > 3;

  /* =======================================================
     RESET ROWS WHEN RESPONSIVE COLUMNS CHANGE
     ======================================================= */

  useEffect(() => {
    setVisibleRows(INITIAL_ROWS);

    setActiveIndex(null);
  }, [columnCount]);

  /* =======================================================
     SHOW MORE
     ======================================================= */

  function handleShowMore() {
    setVisibleRows((current) => Math.min(current + 1, totalRows));
  }

  /* =======================================================
     SHOW LESS
     ======================================================= */

  function handleShowLess() {
    setVisibleRows((current) => Math.max(INITIAL_ROWS, current - 1));
  }

  /* =======================================================
     LIGHTBOX
     ======================================================= */

  function openImage(index: number) {
    setActiveIndex(index);
  }

  function closeImage() {
    setActiveIndex(null);
  }

  function previousImage() {
    setActiveIndex((current) => {
      if (current === null || visibleItems.length === 0) {
        return null;
      }

      return current === 0 ? visibleItems.length - 1 : current - 1;
    });
  }

  function nextImage() {
    setActiveIndex((current) => {
      if (current === null || visibleItems.length === 0) {
        return null;
      }

      return current === visibleItems.length - 1 ? 0 : current + 1;
    });
  }

  /* =======================================================
     LIGHTBOX KEYBOARD
     ======================================================= */

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => {
          if (current === null || visibleItems.length === 0) {
            return null;
          }

          return current === 0 ? visibleItems.length - 1 : current - 1;
        });
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => {
          if (current === null || visibleItems.length === 0) {
            return null;
          }

          return current === visibleItems.length - 1 ? 0 : current + 1;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, visibleItems.length]);

  /* =======================================================
     FLOATING BACK-TO-GALLERY-TOP
     ======================================================= */

  useEffect(() => {
    function handleScroll() {
      if (!hasMoreThanThreeRows || visibleRows <= 3 || !galleryRef.current) {
        setShowBackToGalleryTop(false);

        return;
      }

      const galleryTop =
        galleryRef.current.getBoundingClientRect().top + window.scrollY;

      const passedGalleryTop = window.scrollY > galleryTop + 650;

      setShowBackToGalleryTop(passedGalleryTop);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMoreThanThreeRows, visibleRows]);

  /* =======================================================
     SCROLL TO GALLERY TOP
     ======================================================= */

  function scrollToGalleryTop() {
    galleryRef.current?.scrollIntoView({
      behavior: "smooth",

      block: "start",
    });
  }

  /* =======================================================
     ACTIVE LIGHTBOX ITEM
     ======================================================= */

  const activeItem = activeIndex !== null ? visibleItems[activeIndex] : null;

  return (
    <>
      {/* ===================================================
          GALLERY
         =================================================== */}

      <section
        ref={galleryRef}
        id="gallery"
        className="portfolio-section scroll-mt-28"
      >
        <PortfolioGalleryHeading locale={locale} />

        {/* =================================================
            GRID
           ================================================= */}

        {visibleItems.length > 0 ? (
          <>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleItems.map((item, index) => (
                <SocialGalleryCard
                  key={item.id}
                  locale={locale}
                  item={item}
                  onImageClick={() => openImage(index)}
                />
              ))}
            </div>

            {/* ===============================================
                SHOW MORE / SHOW LESS
               =============================================== */}

            {canShowMore || canShowLess ? (
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                {/* SHOW LESS */}

                {canShowLess ? (
                  <button
                    type="button"
                    onClick={handleShowLess}
                    className="font-body inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] px-5 text-[11px] font-semibold text-[var(--portfolio-text)] transition hover:-translate-y-0.5 hover:border-violet-500/40 hover:text-violet-600 dark:hover:border-cyan-400/40 dark:hover:text-cyan-300"
                  >
                    <ChevronUp size={15} strokeWidth={1.8} />

                    {locale === "km" ? "បង្ហាញតិច" : "Show Less"}
                  </button>
                ) : null}

                {/* SHOW MORE */}

                {canShowMore ? (
                  <button
                    type="button"
                    onClick={handleShowMore}
                    className="font-body inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border border-violet-500/25 bg-violet-500/[0.07] px-5 text-[11px] font-semibold text-violet-600 shadow-[0_8px_24px_rgba(124,58,237,0.08)] transition hover:-translate-y-0.5 hover:border-violet-500/45 hover:bg-violet-500/[0.12] dark:border-cyan-400/20 dark:bg-cyan-400/[0.05] dark:text-cyan-300 dark:hover:border-cyan-400/40 dark:hover:bg-cyan-400/[0.10]"
                  >
                    {locale === "km" ? "មើលបន្ថែម" : "Show More"}

                    <ChevronDown size={15} strokeWidth={1.8} />
                  </button>
                ) : null}
              </div>
            ) : null}

            {/* ===============================================
                ROW INFORMATION
               =============================================== */}

            {totalRows > INITIAL_ROWS ? (
              <p className="font-number mt-3 text-center text-[9px] text-[var(--portfolio-muted)]">
                {locale === "km"
                  ? `កំពុងបង្ហាញ ${Math.min(
                      visibleRows,
                      totalRows,
                    )} / ${totalRows} ជួរ`
                  : `Showing ${Math.min(
                      visibleRows,
                      totalRows,
                    )} of ${totalRows} rows`}
              </p>
            ) : null}
          </>
        ) : (
          <GalleryEmpty locale={locale} />
        )}
      </section>

      {/* ===================================================
          FLOATING BACK TO GALLERY TOP
         =================================================== */}

      {showBackToGalleryTop ? (
        <button
          type="button"
          onClick={scrollToGalleryTop}
          aria-label={
            locale === "km"
              ? "ត្រឡប់ទៅផ្នែកខាងលើនៃវិចិត្រសាល"
              : "Back to top of gallery"
          }
          className="fixed bottom-6 right-5 z-[150] flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-[0_12px_32px_rgba(79,70,229,0.35)] transition hover:-translate-y-1 hover:scale-105 hover:shadow-[0_16px_38px_rgba(79,70,229,0.45)] sm:right-6 lg:bottom-8 lg:right-8"
        >
          <ArrowUp size={21} strokeWidth={2} />
        </button>
      ) : null}

      {/* ===================================================
          LIGHTBOX
         =================================================== */}

      {activeItem && activeIndex !== null ? (
        <GalleryLightbox
          locale={locale}
          item={activeItem}
          currentIndex={activeIndex}
          total={visibleItems.length}
          onClose={closeImage}
          onPrevious={previousImage}
          onNext={nextImage}
        />
      ) : null}
    </>
  );
}

/* =========================================================
   HEADING
   ========================================================= */

function PortfolioGalleryHeading({ locale }: { locale: "en" | "km" }) {
  const khmer = locale === "km";

  return (
    <div className="max-w-3xl">
      <p
        className={
          khmer
            ? "khmer-input-value text-[11px] font-normal leading-6 text-[var(--portfolio-cyan)]"
            : "font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--portfolio-cyan)]"
        }
      >
        {khmer ? "ពេលវេលាដែលបានកត់ត្រា" : "CAPTURED MOMENTS"}
      </p>

      <h2
        className={
          khmer
            ? "khmer-input-value mt-3 text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.45] text-[var(--portfolio-text)]"
            : "font-display mt-3 text-[clamp(2.8rem,6vw,5.3rem)] leading-[0.92] text-[var(--portfolio-text)]"
        }
      >
        {khmer ? "វិចិត្រសាល" : "Gallery"}
      </h2>

      <p
        className={
          khmer
            ? "khmer-input-value mt-4 text-[13px] font-normal leading-7 text-[var(--portfolio-muted)]"
            : "font-body mt-4 text-[13px] leading-7 text-[var(--portfolio-muted)]"
        }
      >
        {khmer
          ? "រូបភាពពីគម្រោង ព្រឹត្តិការណ៍ ការបង្រៀន និងពេលវេលាសំខាន់ៗរបស់ខ្ញុំ។"
          : "A visual collection of projects, events, teaching and moments behind my work."}
      </p>
    </div>
  );
}

/* =========================================================
   GALLERY CARD
   ========================================================= */

function SocialGalleryCard({
  locale,
  item,
  onImageClick,
}: {
  locale: "en" | "km";
  item: PublicActivity;
  onImageClick: () => void;
}) {
  const khmer = locale === "km";

  const title = localized(locale, item.titleEn, item.titleKm);

  const caption = localized(locale, item.summaryEn, item.summaryKm);

  return (
    <article className="group rounded-[26px] bg-gradient-to-br from-violet-500 via-indigo-400 to-cyan-400 p-[1.5px] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(76,62,180,0.14)] dark:shadow-[0_14px_36px_rgba(30,20,120,0.18),0_0_22px_rgba(64,220,255,0.04)]">
      <div className="flex h-full flex-col overflow-hidden rounded-[24px] bg-white dark:bg-[#070b18]">
        {/* IMAGE */}

        <div className="p-2 pb-0">
          <button
            type="button"
            onClick={onImageClick}
            className="relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-[20px] border border-slate-200/80 bg-[#eef1f7] text-left dark:border-white/[0.07] dark:bg-[#171b2b]"
            aria-label={`Open ${title}`}
          >
            {item.coverImage ? (
              <>
                {/* BACKGROUND */}

                <img
                  src={item.coverImage}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-[0.18] blur-xl dark:opacity-[0.24]"
                />

                <div className="absolute inset-0 bg-white/18 dark:bg-[#070a18]/12" />

                {/* REAL IMAGE */}

                <div className="absolute inset-1.5">
                  <img
                    src={item.coverImage}
                    alt={title}
                    className="h-full w-full rounded-[18px] object-cover shadow-[0_6px_16px_rgba(15,23,42,0.10)] transition duration-500 group-hover:scale-[1.02] dark:shadow-[0_6px_18px_rgba(0,0,0,0.24)]"
                  />
                </div>

                {/* HOVER */}

                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 opacity-0 transition duration-300 group-hover:bg-black/20 group-hover:opacity-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md">
                    <Images size={17} />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-100 via-indigo-50 to-cyan-100 dark:from-violet-700/20 dark:via-indigo-600/10 dark:to-cyan-500/20">
                <Images
                  size={36}
                  className="text-violet-500 dark:text-cyan-300/70"
                />
              </div>
            )}
          </button>
        </div>

        {/* TEXT */}

        <div className="px-4 pb-2 pt-3">
          <h3
            className={cn(
              "line-clamp-1 text-[12px] text-[var(--portfolio-text)]",

              khmer && item.titleKm
                ? "khmer-input-value font-normal leading-6"
                : "font-body font-semibold",
            )}
          >
            {title}
          </h3>

          {caption ? (
            <p
              className={cn(
                "mt-1 line-clamp-2 text-[9px] text-[var(--portfolio-muted)]",

                khmer && item.summaryKm
                  ? "khmer-input-value font-normal leading-5"
                  : "font-body leading-[18px]",
              )}
            >
              {caption}
            </p>
          ) : (
            <p className="font-body mt-1 text-[9px] text-[var(--portfolio-muted)]">
              {formatGalleryDate(item.activityDate, locale)}
            </p>
          )}
        </div>

        {/* SOCIAL ACTIONS */}

        <div className="mt-auto">
          <ActivityEngagement
            locale={locale}
            activityId={item.id}
            title={title}
            initialLikeCount={item.likeCount}
            initialCommentCount={item.commentCount}
            comments={item.comments}
            variant="gallery"
            shareUrl={`/${locale}#gallery`}
          />
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   LIGHTBOX
   ========================================================= */

function GalleryLightbox({
  locale,
  item,
  currentIndex,
  total,
  onClose,
  onPrevious,
  onNext,
}: {
  locale: "en" | "km";
  item: PublicActivity;
  currentIndex: number;
  total: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const khmer = locale === "km";

  const title = localized(locale, item.titleEn, item.titleKm);

  const caption = localized(locale, item.summaryEn, item.summaryKm);

  if (!item.coverImage) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[#03040b]/95 p-3 backdrop-blur-xl sm:p-5 md:p-7"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* CLOSE */}

      <button
        type="button"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();

          onClose();
        }}
        className="absolute right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-lg transition hover:bg-white/15 md:right-7 md:top-7"
        aria-label="Close image"
      >
        <X size={20} />
      </button>

      {/* PREVIOUS */}

      {total > 1 ? (
        <button
          type="button"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();

            onPrevious();
          }}
          className="absolute left-3 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white shadow-lg backdrop-blur-lg transition hover:scale-105 hover:bg-white/15 md:left-7 md:h-12 md:w-12"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} strokeWidth={1.8} />
        </button>
      ) : null}

      {/* NEXT */}

      {total > 1 ? (
        <button
          type="button"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();

            onNext();
          }}
          className="absolute right-3 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white shadow-lg backdrop-blur-lg transition hover:scale-105 hover:bg-white/15 md:right-7 md:h-12 md:w-12"
          aria-label="Next image"
        >
          <ChevronRight size={24} strokeWidth={1.8} />
        </button>
      ) : null}

      {/* IMAGE + INFORMATION */}

      <div
        className="relative flex h-full max-h-[94vh] w-full max-w-[1500px] flex-col items-center justify-center"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex min-h-0 flex-1 items-center justify-center px-10 sm:px-14 md:px-16">
          <img
            src={item.coverImage}
            alt={title}
            draggable={false}
            className="max-h-[82vh] max-w-full select-none rounded-[18px] object-contain shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
          />
        </div>

        <div className="mt-4 flex w-full max-w-[900px] items-end justify-between gap-5 px-2 pb-1">
          <div className="min-w-0">
            <h3
              className={cn(
                "text-white",

                khmer && item.titleKm
                  ? "khmer-input-value text-[15px] font-normal leading-7"
                  : "font-body text-[14px] font-semibold",
              )}
            >
              {title}
            </h3>

            {caption ? (
              <p
                className={cn(
                  "mt-1 max-w-2xl text-white/55",

                  khmer && item.summaryKm
                    ? "khmer-input-value text-[11px] font-normal leading-6"
                    : "font-body text-[10px] leading-5",
                )}
              >
                {caption}
              </p>
            ) : null}
          </div>

          <span className="font-number shrink-0 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[10px] text-white/60 backdrop-blur">
            {currentIndex + 1} / {total}
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY
   ========================================================= */

function GalleryEmpty({ locale }: { locale: "en" | "km" }) {
  const khmer = locale === "km";

  return (
    <div className="mt-10 flex min-h-[180px] items-center justify-center rounded-[24px] border border-dashed border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] p-6 text-center">
      <div>
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--portfolio-accent-soft)] text-[var(--portfolio-cyan)]">
          <Images size={19} />
        </div>

        <p
          className={cn(
            "mt-4 text-[12px] text-[var(--portfolio-muted)]",

            khmer ? "khmer-input-value font-normal leading-6" : "font-body",
          )}
        >
          {khmer
            ? "បន្ថែមរូបភាពពីផ្ទាំងគ្រប់គ្រង Gallery។"
            : "Add photos from the Gallery dashboard."}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function localized(
  locale: "en" | "km",
  english: string | null,
  khmer: string | null,
) {
  return locale === "km" ? khmer || english || "" : english || khmer || "";
}

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

function formatGalleryDate(value: string, locale: "en" | "km") {
  /*
   * PublicActivity.activityDate is an ISO string such as:
   * 2025-05-01T12:00:00.000Z
   *
   * Reading year/month directly from the string prevents:
   * - server/browser locale differences
   * - timezone differences
   * - hydration mismatch
   */
  const match = /^(\d{4})-(\d{2})/.exec(value);

  if (!match) {
    return "";
  }

  const year = match[1];

  const monthIndex = Number(match[2]) - 1;

  if (monthIndex < 0 || monthIndex > 11) {
    return year;
  }

  const month = locale === "km" ? KM_MONTHS[monthIndex] : EN_MONTHS[monthIndex];

  return `${month} ${year}`;
}
