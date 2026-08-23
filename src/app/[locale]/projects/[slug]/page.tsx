import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Code2,
  ExternalLink,
  Layers3,
  Sparkles,
} from "lucide-react";

import { notFound } from "next/navigation";

import PublicNavbar from "@/components/layout/PublicNavbar";

import ActivityEngagement from "@/components/portfolio/ActivityEngagement";

import { Link } from "@/i18n/navigation";

import { prisma } from "@/lib/db";

import { cn } from "@/lib/cn";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  const khmer = safeLocale === "km";

  const project = await prisma.activity.findFirst({
    where: {
      slug,
      type: "PROJECT",
      published: true,
    },

    include: {
      comments: {
        where: {
          isApproved: true,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 20,

        select: {
          id: true,
          name: true,
          message: true,
          createdAt: true,
        },
      },

      _count: {
        select: {
          likes: true,

          comments: {
            where: {
              isApproved: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const title = localized(safeLocale, project.titleEn, project.titleKm);

  const summary = localized(safeLocale, project.summaryEn, project.summaryKm);

  const description = localized(
    safeLocale,
    project.descriptionEn,
    project.descriptionKm,
  );

  const organization = localized(
    safeLocale,
    project.organizationEn,
    project.organizationKm,
  );

  const technologies =
    project.technologies
      ?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? [];

  return (
    <main className="portfolio-site min-h-screen overflow-x-clip">
      <PublicNavbar locale={safeLocale} />

      {/* =====================================================
          MAIN CONTAINER
         ===================================================== */}

      <div className="mx-auto w-full max-w-[1180px] px-4 pb-24 pt-[120px] sm:px-6 lg:px-8 lg:pt-[128px]">
        {/* BACK */}

        <Link
          href="/#projects"
          className="font-body inline-flex items-center gap-2 text-[11px] text-[var(--portfolio-muted)] transition hover:text-[var(--portfolio-cyan)]"
        >
          <ArrowLeft size={14} />

          {khmer ? "ត្រឡប់ទៅគម្រោង" : "Back to Projects"}
        </Link>

        {/* ===================================================
            HERO PROJECT CARD
           =================================================== */}

        <section className="portfolio-panel portfolio-glow mt-6 overflow-hidden">
          <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
            {/* LEFT */}

            <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
              {/* BADGES */}

              <div className="flex flex-wrap gap-2">
                <Badge
                  label="Project"
                  className="bg-violet-500/12 text-violet-300"
                />

                {project.featured ? (
                  <Badge
                    label={khmer ? "គម្រោងពិសេស" : "Featured"}
                    className="bg-cyan-500/10 text-cyan-300"
                  />
                ) : null}

                {project.isCurrent ? (
                  <Badge
                    label={khmer ? "កំពុងអភិវឌ្ឍ" : "In Progress"}
                    className="bg-emerald-500/10 text-emerald-300"
                  />
                ) : null}
              </div>

              {/* TITLE */}

              <h1
                className={cn(
                  "mt-5 max-w-[640px] text-[var(--portfolio-text)]",

                  khmer && project.titleKm
                    ? "khmer-input-value text-[clamp(2.1rem,5vw,4.2rem)] font-normal leading-[1.45]"
                    : "font-display text-[clamp(2.4rem,5vw,4.7rem)] leading-[0.98]",
                )}
              >
                {title}
              </h1>

              {/* SUMMARY */}

              {summary ? (
                <p
                  className={cn(
                    "mt-5 max-w-[650px] text-[13px] text-[var(--portfolio-muted)]",

                    khmer && project.summaryKm
                      ? "khmer-input-value font-normal leading-7"
                      : "font-body leading-7",
                  )}
                >
                  {summary}
                </p>
              ) : null}

              {/* LINKS */}

              <div className="mt-7 flex flex-wrap gap-2.5">
                {project.demoUrl ? (
                  <HeroLink
                    href={project.demoUrl}
                    label={khmer ? "មើល Demo" : "Live Demo"}
                    primary
                  />
                ) : null}

                {project.githubUrl ? (
                  <HeroLink href={project.githubUrl} label="GitHub" />
                ) : null}

                {project.externalUrl ? (
                  <HeroLink
                    href={project.externalUrl}
                    label={khmer ? "មើលគេហទំព័រ" : "Website"}
                  />
                ) : null}
              </div>

              {/* SMALL INFO */}

              <div className="mt-8 grid gap-3 border-t border-[var(--portfolio-border)] pt-5 sm:grid-cols-3">
                <MiniInfo
                  icon={CalendarDays}
                  label={khmer ? "រយៈពេល" : "Timeline"}
                  value={formatPeriod(
                    project.activityDate,
                    project.endDate,
                    project.isCurrent,
                    safeLocale,
                  )}
                />

                {organization ? (
                  <MiniInfo
                    icon={BriefcaseBusiness}
                    label={khmer ? "ស្ថាប័ន" : "Organization"}
                    value={organization}
                  />
                ) : null}

                <MiniInfo
                  icon={Layers3}
                  label={khmer ? "បច្ចេកវិទ្យា" : "Technologies"}
                  value={
                    technologies.length > 0
                      ? `${technologies.length} ${khmer ? "មុខ" : "tools"}`
                      : "—"
                  }
                />
              </div>
            </div>

            {/* RIGHT PROJECT IMAGE */}

            <div className="relative min-h-[320px] overflow-hidden border-t border-[var(--portfolio-border)] lg:min-h-[480px] lg:border-l lg:border-t-0">
              {project.coverImage ? (
                <img
                  src={project.coverImage}
                  alt={title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-700/30 via-indigo-500/15 to-cyan-500/25">
                  <Code2 size={70} className="text-cyan-200/70" />
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070a18]/85 via-transparent to-transparent lg:bg-gradient-to-l" />

              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-body text-[9px] font-semibold uppercase tracking-[0.16em] text-white/55">
                  {khmer ? "ការបង្ហាញគម្រោង" : "PROJECT PREVIEW"}
                </p>

                <p className="font-body mt-1 line-clamp-2 text-[12px] font-semibold text-white">
                  {title}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            CONTENT BELOW
           =================================================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          {/* =================================================
              PROJECT OVERVIEW
             ================================================= */}

          <article className="portfolio-panel p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--portfolio-accent-soft)] text-[var(--portfolio-cyan)]">
                <Sparkles size={17} />
              </div>

              <div>
                <p className="font-body text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--portfolio-cyan)]">
                  {khmer ? "អំពីគម្រោង" : "CASE STUDY"}
                </p>

                <h2
                  className={cn(
                    "mt-1 text-[var(--portfolio-text)]",

                    khmer
                      ? "khmer-input-value text-[23px] font-normal leading-9"
                      : "font-display text-[30px] leading-none",
                  )}
                >
                  {khmer ? "ព័ត៌មានលម្អិត" : "Project Overview"}
                </h2>
              </div>
            </div>

            <div className="mt-6 h-px bg-[var(--portfolio-border)]" />

            {description ? (
              <div
                className={cn(
                  "mt-6 whitespace-pre-line text-[13px] text-[var(--portfolio-muted)]",

                  khmer && project.descriptionKm
                    ? "khmer-input-value font-normal leading-8"
                    : "font-body leading-7",
                )}
              >
                {description}
              </div>
            ) : summary ? (
              <p
                className={cn(
                  "mt-6 text-[13px] text-[var(--portfolio-muted)]",

                  khmer
                    ? "khmer-input-value font-normal leading-8"
                    : "font-body leading-7",
                )}
              >
                {summary}
              </p>
            ) : (
              <p className="font-body mt-6 text-[12px] text-[var(--portfolio-muted)]">
                {khmer
                  ? "មិនទាន់មានព័ត៌មានលម្អិតអំពីគម្រោង។"
                  : "No detailed project description yet."}
              </p>
            )}

            {/* ENGAGEMENT */}

            <div className="mt-8 border-t border-[var(--portfolio-border)] pt-5">
              <ActivityEngagement
                locale={safeLocale}
                activityId={project.id}
                title={title}
                initialLikeCount={project._count.likes}
                initialCommentCount={project._count.comments}
                comments={project.comments.map((comment) => ({
                  ...comment,

                  createdAt: comment.createdAt.toISOString(),
                }))}
                shareUrl={`/${safeLocale}/projects/${project.slug}`}
              />
            </div>
          </article>

          {/* =================================================
              RIGHT SIDE
             ================================================= */}

          <aside className="grid content-start gap-5">
            {/* TECHNOLOGY */}

            <div className="portfolio-panel p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--portfolio-accent-soft)] text-[var(--portfolio-cyan)]">
                  <Code2 size={16} />
                </div>

                <div>
                  <p className="font-body text-[9px] uppercase tracking-[0.14em] text-[var(--portfolio-muted)]">
                    {khmer ? "បង្កើតដោយ" : "BUILT WITH"}
                  </p>

                  <h3 className="font-body mt-0.5 text-[14px] font-semibold text-[var(--portfolio-text)]">
                    {khmer ? "បច្ចេកវិទ្យា" : "Technology Stack"}
                  </h3>
                </div>
              </div>

              {technologies.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-xl border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] px-3 py-2 font-body text-[10px] text-[var(--portfolio-text)] transition hover:border-[var(--portfolio-cyan)]/35"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-body mt-4 text-[10px] text-[var(--portfolio-muted)]">
                  —
                </p>
              )}
            </div>

            {/* LINKS */}

            {project.demoUrl || project.githubUrl || project.externalUrl ? (
              <div className="portfolio-panel p-5">
                <p className="font-body text-[9px] uppercase tracking-[0.14em] text-[var(--portfolio-muted)]">
                  {khmer ? "តំណ" : "PROJECT LINKS"}
                </p>

                <div className="mt-4 grid gap-2.5">
                  {project.demoUrl ? (
                    <SideLink
                      href={project.demoUrl}
                      label={khmer ? "មើល Live Demo" : "Live Demo"}
                      primary
                    />
                  ) : null}

                  {project.githubUrl ? (
                    <SideLink href={project.githubUrl} label="GitHub" />
                  ) : null}

                  {project.externalUrl ? (
                    <SideLink
                      href={project.externalUrl}
                      label={khmer ? "គេហទំព័រ" : "Website"}
                    />
                  ) : null}
                </div>
              </div>
            ) : null}
          </aside>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   BADGE
   ========================================================= */

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1.5 font-body text-[9px] font-semibold uppercase tracking-[0.12em]",
        className,
      )}
    >
      {label}
    </span>
  );
}

/* =========================================================
   HERO LINK
   ========================================================= */

function HeroLink({
  href,
  label,
  primary = false,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "font-body inline-flex h-9 items-center gap-2 rounded-xl px-4 text-[10px] font-semibold transition",

        primary
          ? "bg-[var(--portfolio-gradient)] text-white hover:brightness-110"
          : "border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] text-[var(--portfolio-text)] hover:border-[var(--portfolio-cyan)]/40",
      )}
    >
      {label}

      {primary ? <ArrowUpRight size={12} /> : <ExternalLink size={12} />}
    </a>
  );
}

/* =========================================================
   MINI INFO
   ========================================================= */

function MiniInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;

  label: string;

  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2 text-[var(--portfolio-cyan)]">
        <Icon size={13} />

        <span className="font-body text-[8px] font-semibold uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>

      <p className="font-body mt-2 line-clamp-2 text-[10px] leading-5 text-[var(--portfolio-muted)]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   SIDE LINK
   ========================================================= */

function SideLink({
  href,
  label,
  primary = false,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "font-body flex h-10 items-center justify-between rounded-xl px-3.5 text-[10px] font-semibold transition",

        primary
          ? "bg-[var(--portfolio-gradient)] text-white hover:brightness-110"
          : "border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] text-[var(--portfolio-text)] hover:border-[var(--portfolio-cyan)]/40",
      )}
    >
      {label}

      {primary ? <ArrowUpRight size={13} /> : <ExternalLink size={13} />}
    </a>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function localized(locale: "en" | "km", en: string | null, km: string | null) {
  return locale === "km" ? km || en || "" : en || km || "";
}

function formatPeriod(
  start: Date,
  end: Date | null,
  current: boolean,
  locale: "en" | "km",
) {
  const formatter = new Intl.DateTimeFormat(
    locale === "km" ? "km-KH" : "en-US",
    {
      month: "short",
      year: "numeric",
    },
  );

  const startText = formatter.format(start);

  if (current) {
    return `${startText} — ${locale === "km" ? "បច្ចុប្បន្ន" : "Present"}`;
  }

  if (end) {
    return `${startText} — ${formatter.format(end)}`;
  }

  return startText;
}
