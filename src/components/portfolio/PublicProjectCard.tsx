import { ArrowUpRight, Code2, ExternalLink } from "lucide-react";

import { Link } from "@/i18n/navigation";

import ActivityEngagement from "@/components/portfolio/ActivityEngagement";

import type { PublicActivity } from "@/types/publicPortfolio";

import { cn } from "@/lib/cn";

type Props = {
  locale: "en" | "km";

  item: PublicActivity;
};

export default function PublicProjectCard({ locale, item }: Props) {
  const khmer = locale === "km";

  const title = localized(locale, item.titleEn, item.titleKm);

  const summary = localized(locale, item.summaryEn, item.summaryKm);

  return (
    <article className="portfolio-panel group overflow-hidden p-3 transition duration-300 hover:-translate-y-1.5 hover:border-[var(--portfolio-cyan)]/30">
      {/* CLICKABLE IMAGE */}

      <Link href={`/projects/${item.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)]">
          {item.coverImage ? (
            <img
              src={item.coverImage}
              alt={title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[var(--portfolio-gradient)] opacity-45">
              <Code2 size={42} />
            </div>
          )}

          {/* hover */}

          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/5 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="font-body inline-flex items-center gap-2 text-[11px] font-semibold text-white">
              {khmer ? "មើលព័ត៌មានគម្រោង" : "View Project"}

              <ArrowUpRight size={13} />
            </span>
          </div>

          {item.featured ? (
            <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 font-body text-[9px] uppercase tracking-[0.1em] text-white backdrop-blur-lg">
              {khmer ? "ពិសេស" : "Featured"}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="p-3 pb-2 pt-4">
        {/* CLICKABLE TITLE */}

        <Link href={`/projects/${item.slug}`} className="group/title block">
          <h3
            className={cn(
              "text-[15px] text-[var(--portfolio-text)] transition group-hover/title:text-[var(--portfolio-cyan)]",

              khmer && item.titleKm
                ? "khmer-input-value font-normal leading-7"
                : "font-body font-semibold",
            )}
          >
            {title}
          </h3>
        </Link>

        {summary ? (
          <p
            className={cn(
              "mt-2 line-clamp-2 text-[11px] text-[var(--portfolio-muted)]",

              khmer && item.summaryKm
                ? "khmer-input-value font-normal leading-6"
                : "font-body leading-5",
            )}
          >
            {summary}
          </p>
        ) : null}

        {/* TECHNOLOGIES */}

        {item.technologies ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.technologies
              .split(",")
              .slice(0, 4)
              .map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] px-2.5 py-1 font-body text-[9px] text-[var(--portfolio-cyan)]"
                >
                  {technology.trim()}
                </span>
              ))}
          </div>
        ) : null}

        {/* LINKS */}

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/projects/${item.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--portfolio-accent-soft)] px-3 py-1.5 font-body text-[10px] font-semibold text-[var(--portfolio-cyan)] transition hover:brightness-125"
          >
            {khmer ? "ព័ត៌មានលម្អិត" : "Case Study"}

            <ArrowUpRight size={11} />
          </Link>

          {item.demoUrl ? (
            <ExternalProjectLink href={item.demoUrl} label="Demo" />
          ) : null}

          {item.githubUrl ? (
            <ExternalProjectLink href={item.githubUrl} label="GitHub" />
          ) : null}
        </div>

        {/* ENGAGEMENT */}

        <div className="mt-4">
          <ActivityEngagement
            locale={locale}
            activityId={item.id}
            title={title}
            initialLikeCount={item.likeCount}
            initialCommentCount={item.commentCount}
            comments={item.comments}
            shareUrl={`/${locale}/projects/${item.slug}`}
          />
        </div>
      </div>
    </article>
  );
}

function ExternalProjectLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] px-2.5 py-1.5 font-body text-[10px] text-[var(--portfolio-muted)] transition hover:text-[var(--portfolio-cyan)]"
    >
      {label}

      <ExternalLink size={11} />
    </a>
  );
}

function localized(locale: "en" | "km", en: string | null, km: string | null) {
  return locale === "km" ? km || en || "" : en || km || "";
}
