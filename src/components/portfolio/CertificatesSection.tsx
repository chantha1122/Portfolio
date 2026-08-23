"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Maximize2,
  X,
} from "lucide-react";

import type { PublicActivity } from "@/types/publicPortfolio";

type Props = {
  locale: "en" | "km";
  items: PublicActivity[];
};

const INITIAL_VISIBLE = 6;
const LOAD_MORE_COUNT = 3;

export default function CertificatesSection({ locale, items }: Props) {
  const khmer = locale === "km";

  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const certificates = useMemo(() => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.activityDate).getTime();
      const dateB = new Date(b.activityDate).getTime();

      if (dateA !== dateB) {
        return dateB - dateA;
      }

      return b.id - a.id;
    });
  }, [items]);

  const visibleCertificates = certificates.slice(0, visibleCount);

  const hasMore = visibleCount < certificates.length;
  const canShowLess = visibleCount > INITIAL_VISIBLE;

  const previewItem =
    previewIndex !== null ? (certificates[previewIndex] ?? null) : null;

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
        setPreviewIndex((current) => {
          if (current === null) {
            return null;
          }

          return current === 0 ? certificates.length - 1 : current - 1;
        });
      }

      if (event.key === "ArrowRight") {
        setPreviewIndex((current) => {
          if (current === null) {
            return null;
          }

          return current === certificates.length - 1 ? 0 : current + 1;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewIndex, certificates.length]);

  function openPreview(item: PublicActivity) {
    if (!item.coverImage) {
      return;
    }

    const index = certificates.findIndex(
      (certificate) => certificate.id === item.id,
    );

    if (index >= 0) {
      setPreviewIndex(index);
    }
  }

  function previousImage() {
    setPreviewIndex((current) => {
      if (current === null) {
        return null;
      }

      return current === 0 ? certificates.length - 1 : current - 1;
    });
  }

  function nextImage() {
    setPreviewIndex((current) => {
      if (current === null) {
        return null;
      }

      return current === certificates.length - 1 ? 0 : current + 1;
    });
  }

  function showMore() {
    setVisibleCount((current) =>
      Math.min(current + LOAD_MORE_COUNT, certificates.length),
    );
  }

  function showLess() {
    setVisibleCount((current) =>
      Math.max(INITIAL_VISIBLE, current - LOAD_MORE_COUNT),
    );
  }

  return (
    <>
      <section id="certificates" className="portfolio-section scroll-mt-28">
        <PortfolioHeading
          locale={locale}
          eyebrow={khmer ? "ការរៀនសូត្រ" : "CREDENTIALS"}
          title={khmer ? "វិញ្ញាបនបត្រ" : "Certificates"}
          description={
            khmer
              ? "វិញ្ញាបនបត្រ និងការបណ្តុះបណ្តាលដែលខ្ញុំបានបញ្ចប់។"
              : "Certificates and training that document my continued learning."
          }
        />

        {certificates.length > 0 ? (
          <>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleCertificates.map((item) => (
                <CertificateCard
                  key={item.id}
                  item={item}
                  locale={locale}
                  onPreview={() => openPreview(item)}
                />
              ))}
            </div>

            {certificates.length > INITIAL_VISIBLE ? (
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
                {hasMore ? (
                  <button
                    type="button"
                    onClick={showMore}
                    className="portfolio-secondary-button"
                  >
                    <ChevronDown size={14} />

                    {khmer ? "បង្ហាញបន្ថែម" : "Show More"}
                  </button>
                ) : null}

                {canShowLess ? (
                  <button
                    type="button"
                    onClick={showLess}
                    className="portfolio-secondary-button"
                  >
                    <ChevronUp size={14} />

                    {khmer ? "បង្ហាញតិច" : "Show Less"}
                  </button>
                ) : null}
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-10">
            <EmptyPanel
              text={
                khmer
                  ? "បន្ថែមវិញ្ញាបនបត្រពីផ្ទាំងគ្រប់គ្រង។"
                  : "Add certificates from the dashboard."
              }
            />
          </div>
        )}
      </section>

      {previewItem?.coverImage ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activityTitle(previewItem, locale)}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPreviewIndex(null);
            }
          }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
        >
          <div className="relative flex h-full max-h-[92vh] w-full max-w-[1200px] flex-col">
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

                <p className="font-body mt-0.5 text-[10px] text-white/60">
                  {formatCertificateDate(previewItem.activityDate, locale)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewIndex(null)}
                aria-label="Close certificate preview"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/15"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/35">
              <img
                src={previewItem.coverImage}
                alt={activityTitle(previewItem, locale)}
                className="h-full w-full object-contain"
              />

              {certificates.filter((item) => item.coverImage).length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Previous certificate"
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-md transition hover:bg-black/65"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next certificate"
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-md transition hover:bg-black/65"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              ) : null}
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="font-number text-[10px] text-white/55">
                {previewIndex !== null
                  ? `${previewIndex + 1} / ${certificates.length}`
                  : ""}
              </p>

              {previewItem.externalUrl ? (
                <a
                  href={previewItem.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3.5 font-body text-[11px] font-semibold text-white transition hover:bg-white/15"
                >
                  <ExternalLink size={13} />

                  {khmer ? "មើល Credential" : "View Credential"}
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
   CERTIFICATE CARD
   ========================================================= */

function CertificateCard({
  item,
  locale,
  onPreview,
}: {
  item: PublicActivity;
  locale: "en" | "km";
  onPreview: () => void;
}) {
  const khmer = locale === "km";

  return (
    <article className="portfolio-panel group overflow-hidden p-4">
      <button
        type="button"
        onClick={onPreview}
        disabled={!item.coverImage}
        aria-label={
          item.coverImage
            ? `View ${activityTitle(item, locale)} certificate`
            : undefined
        }
        className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-2xl border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] text-left disabled:cursor-default"
      >
        {item.coverImage ? (
          <>
            <img
              src={item.coverImage}
              alt={activityTitle(item, locale)}
              className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.015]"
            />

            <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-black/45 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
              <Maximize2 size={15} />
            </span>
          </>
        ) : (
          <Award size={38} className="text-[var(--portfolio-cyan)]" />
        )}
      </button>

      <p
        className={
          khmer && item.titleKm
            ? "khmer-input-value mt-4 text-[14px] font-normal leading-6 text-[var(--portfolio-text)]"
            : "font-body mt-4 text-[14px] font-semibold text-[var(--portfolio-text)]"
        }
      >
        {activityTitle(item, locale)}
      </p>

      <p className="font-body mt-1 text-[10px] text-[var(--portfolio-muted)]">
        {activityOrganization(item, locale) ||
          formatCertificateDate(item.activityDate, locale)}
      </p>

      {activityOrganization(item, locale) ? (
        <p className="font-number mt-1 text-[9px] text-[var(--portfolio-muted)]">
          {formatCertificateDate(item.activityDate, locale)}
        </p>
      ) : null}

      {item.credentialId ? (
        <p className="font-number mt-2 text-[9px] text-[var(--portfolio-muted)]">
          ID: {item.credentialId}
        </p>
      ) : null}

      {item.externalUrl ? (
        <a
          href={item.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 font-body text-[11px] text-[var(--portfolio-cyan)] transition hover:opacity-75"
        >
          {khmer ? "មើលវិញ្ញាបនបត្រ" : "View credential"}

          <ExternalLink size={12} />
        </a>
      ) : null}
    </article>
  );
}

/* =========================================================
   PORTFOLIO HEADING
   ========================================================= */

function PortfolioHeading({
  locale,
  eyebrow,
  title,
  description,
}: {
  locale: "en" | "km";
  eyebrow: string;
  title: string;
  description: string;
}) {
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
        {eyebrow}
      </p>

      <h2
        className={
          khmer
            ? "khmer-input-value mt-3 text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.45] text-[var(--portfolio-text)]"
            : "font-display mt-3 text-[clamp(2.8rem,6vw,5.3rem)] leading-[0.92] text-[var(--portfolio-text)]"
        }
      >
        {title}
      </h2>

      <p
        className={
          khmer
            ? "khmer-input-value mt-4 text-[13px] font-normal leading-7 text-[var(--portfolio-muted)]"
            : "font-body mt-4 text-[13px] leading-7 text-[var(--portfolio-muted)]"
        }
      >
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY
   ========================================================= */

function EmptyPanel({ text }: { text: string }) {
  return (
    <div className="portfolio-panel flex min-h-[180px] items-center justify-center p-6 text-center">
      <p className="font-body text-[12px] text-[var(--portfolio-muted)]">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function localized(locale: "en" | "km", en: string | null, km: string | null) {
  return locale === "km" ? km || en || "" : en || km || "";
}

function activityTitle(item: PublicActivity, locale: "en" | "km") {
  return localized(locale, item.titleEn, item.titleKm);
}

function activityOrganization(item: PublicActivity, locale: "en" | "km") {
  return localized(locale, item.organizationEn, item.organizationKm);
}

function formatCertificateDate(value: string, locale: "en" | "km") {
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
