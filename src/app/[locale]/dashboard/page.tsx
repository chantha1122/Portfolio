import type { LucideIcon } from "lucide-react";

import {
  Activity,
  Award,
  ChevronRight,
  CircleCheck,
  FolderKanban,
  Image,
  MessageSquareText,
  Send,
  Sparkles,
  Wrench,
} from "lucide-react";

import { Link } from "@/i18n/navigation";

import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  const khmer = safeLocale === "km";

  const [
    totalActivities,
    publishedActivities,
    projectCount,
    certificateCount,
    achievementCount,
    galleryCount,
    skillsCount,
    toolsCount,
    newMessages,
    pendingComments,
    recentActivities,
  ] = await Promise.all([
    prisma.activity.count(),

    prisma.activity.count({
      where: {
        published: true,
      },
    }),

    prisma.activity.count({
      where: {
        type: "PROJECT",
      },
    }),

    prisma.activity.count({
      where: {
        type: "CERTIFICATE",
      },
    }),

    prisma.activity.count({
      where: {
        type: "ACHIEVEMENT",
      },
    }),

    prisma.activity.count({
      where: {
        type: "PHOTO",
      },
    }),

    prisma.skill.count(),

    prisma.tool.count(),

    prisma.contactMessage.count({
      where: {
        status: "NEW",
      },
    }),

    prisma.comment.count({
      where: {
        isApproved: false,
      },
    }),

    prisma.activity.findMany({
      take: 6,

      orderBy: [
        {
          activityDate: "desc",
        },
        {
          id: "desc",
        },
      ],

      select: {
        id: true,

        slug: true,

        type: true,

        titleEn: true,

        titleKm: true,

        activityDate: true,

        published: true,

        featured: true,
      },
    }),
  ]);

  const publishRate =
    totalActivities > 0
      ? Math.round((publishedActivities / totalActivities) * 100)
      : 0;

  const stats = [
    {
      titleEn: "Total Content",

      titleKm: "មាតិកាសរុប",

      value: totalActivities,

      detailEn: `${publishedActivities} published`,

      detailKm: `${publishedActivities} បានបង្ហាញ`,

      icon: Activity,

      tone: "violet",
    },

    {
      titleEn: "Projects",

      titleKm: "គម្រោង",

      value: projectCount,

      detailEn: "Portfolio projects",

      detailKm: "គម្រោង Portfolio",

      icon: FolderKanban,

      tone: "blue",
    },

    {
      titleEn: "Certificates",

      titleKm: "វិញ្ញាបនបត្រ",

      value: certificateCount,

      detailEn: "Learning credentials",

      detailKm: "វិញ្ញាបនបត្រសិក្សា",

      icon: Award,

      tone: "orange",
    },

    {
      titleEn: "Achievements",

      titleKm: "សមិទ្ធផល",

      value: achievementCount,

      detailEn: "Awards & recognition",

      detailKm: "ពាន និងការទទួលស្គាល់",

      icon: Sparkles,

      tone: "green",
    },
  ] as const;

  return (
    <div>
      {/* =================================================
          PAGE HEADER
         ================================================= */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--dash-violet)]">
            Portfolio CMS
          </p>

          <h1
            className={
              khmer
                ? "khmer-input-value mt-1 text-[25px] font-normal leading-10 text-[var(--dash-text)]"
                : "font-body mt-1 text-[27px] font-semibold tracking-[-0.02em] text-[var(--dash-text)]"
            }
          >
            {khmer ? "ស្វាគមន៍មកកាន់ Dashboard" : "Welcome back, Chantha"}
          </h1>

          <p
            className={
              khmer
                ? "khmer-input-value mt-1 text-[11px] font-normal leading-6 text-[var(--dash-muted)]"
                : "font-body mt-1 text-[12px] text-[var(--dash-muted)]"
            }
          >
            {khmer
              ? "គ្រប់គ្រងមាតិកា Portfolio និងពិនិត្យស្ថានភាពការបង្ហាញ។"
              : "Manage your portfolio content and publishing status."}
          </p>
        </div>

        <Link
          href="/dashboard/projects"
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-[10px] bg-[var(--dash-violet)] px-4 font-body text-[11px] font-semibold text-white transition hover:bg-[var(--dash-violet-hover)] sm:self-auto"
        >
          <FolderKanban size={14} />

          {khmer ? "គ្រប់គ្រងគម្រោង" : "Manage Projects"}
        </Link>
      </div>

      {/* =================================================
          STAT CARDS
         ================================================= */}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <DashboardStatCard key={item.titleEn} locale={safeLocale} {...item} />
        ))}
      </div>

      {/* =================================================
          CONTENT
         ================================================= */}

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(310px,0.55fr)]">
        {/* ===============================================
            CONTENT OVERVIEW
           =============================================== */}

        <section className="dashboard-surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--dash-border)] px-5 py-4">
            <div>
              <h2
                className={
                  khmer
                    ? "khmer-input-value text-[15px] font-normal leading-7"
                    : "font-body text-[15px] font-semibold"
                }
              >
                {khmer ? "ស្ថានភាពមាតិកា" : "Content Overview"}
              </h2>

              <p
                className={
                  khmer
                    ? "khmer-input-value mt-0.5 text-[10px] font-normal leading-5 text-[var(--dash-muted)]"
                    : "font-body mt-0.5 text-[10px] text-[var(--dash-muted)]"
                }
              >
                {khmer
                  ? "សេចក្តីសង្ខេបមាតិកា Portfolio របស់អ្នក"
                  : "A quick summary of your portfolio content"}
              </p>
            </div>

            <div className="rounded-[10px] border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] px-3 py-2 text-right">
              <p className="font-number text-[16px] font-semibold text-[var(--dash-text)]">
                {publishRate}%
              </p>

              <p className="font-body text-[8px] uppercase tracking-[0.08em] text-[var(--dash-muted)]">
                Published
              </p>
            </div>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2">
            <OverviewRow
              icon={Image}
              label={khmer ? "រូបក្នុង Gallery" : "Gallery Photos"}
              value={galleryCount}
              tone="violet"
            />

            <OverviewRow
              icon={Wrench}
              label={khmer ? "ជំនាញ" : "Skills"}
              value={skillsCount}
              tone="blue"
            />

            <OverviewRow
              icon={CircleCheck}
              label={khmer ? "ឧបករណ៍" : "Tools"}
              value={toolsCount}
              tone="green"
            />

            <OverviewRow
              icon={Award}
              label={khmer ? "វិញ្ញាបនបត្រ" : "Certificates"}
              value={certificateCount}
              tone="orange"
            />
          </div>

          <div className="border-t border-[var(--dash-border)] px-5 py-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="font-body text-[10px] font-medium text-[var(--dash-muted)]">
                {khmer ? "មាតិកាដែលបានបង្ហាញ" : "Publishing progress"}
              </p>

              <p className="font-number text-[10px] font-semibold text-[var(--dash-text)]">
                {publishedActivities} / {totalActivities}
              </p>
            </div>

            <div className="h-[7px] overflow-hidden rounded-full bg-[var(--dash-panel-soft)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500"
                style={{
                  width: `${publishRate}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* ===============================================
            INBOX
           =============================================== */}

        <section className="dashboard-surface p-5">
          <div className="flex items-center justify-between">
            <h2
              className={
                khmer
                  ? "khmer-input-value text-[15px] font-normal leading-7"
                  : "font-body text-[15px] font-semibold"
              }
            >
              {khmer ? "ត្រូវការការយកចិត្តទុកដាក់" : "Needs Attention"}
            </h2>

            <Sparkles size={16} className="text-[var(--dash-violet)]" />
          </div>

          <div className="mt-4 grid gap-2">
            <AttentionItem
              href="/dashboard/messages"
              icon={MessageSquareText}
              title={khmer ? "សារថ្មី" : "New Messages"}
              value={newMessages}
              tone="violet"
            />

            <AttentionItem
              href="/dashboard/comments"
              icon={MessageSquareText}
              title={khmer ? "មតិយោបល់រង់ចាំ" : "Pending Comments"}
              value={pendingComments}
              tone="orange"
            />

            <AttentionItem
              href="/dashboard/gallery"
              icon={Image}
              title={khmer ? "រូបភាព Gallery" : "Gallery Items"}
              value={galleryCount}
              tone="blue"
            />
          </div>

          <Link
            href="/dashboard/messages"
            className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-[10px] border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] font-body text-[10px] font-semibold text-[var(--dash-text)] transition hover:border-[var(--dash-border-strong)]"
          >
            {khmer ? "បើកប្រអប់សារ" : "Open Inbox"}

            <ChevronRight size={12} />
          </Link>
        </section>
      </div>

      {/* =================================================
          RECENT CONTENT
         ================================================= */}

      <section className="dashboard-surface mt-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--dash-border)] px-5 py-4">
          <div>
            <h2
              className={
                khmer
                  ? "khmer-input-value text-[15px] font-normal leading-7"
                  : "font-body text-[15px] font-semibold"
              }
            >
              {khmer ? "មាតិកាថ្មីៗ" : "Recent Content"}
            </h2>

            <p className="font-body mt-0.5 text-[10px] text-[var(--dash-muted)]">
              {khmer
                ? "សកម្មភាព និងមាតិកាថ្មីៗរបស់ Portfolio"
                : "Latest activities and portfolio content"}
            </p>
          </div>

          <Link
            href="/dashboard/activities"
            className="font-body text-[10px] font-semibold text-[var(--dash-violet)]"
          >
            {khmer ? "មើលទាំងអស់" : "View all"}
          </Link>
        </div>

        {recentActivities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="dashboard-table min-w-[680px]">
              <thead>
                <tr>
                  <th>{khmer ? "មាតិកា" : "Content"}</th>

                  <th>{khmer ? "ប្រភេទ" : "Type"}</th>

                  <th>{khmer ? "កាលបរិច្ឆេទ" : "Date"}</th>

                  <th>{khmer ? "ស្ថានភាព" : "Status"}</th>

                  <th />
                </tr>
              </thead>

              <tbody>
                {recentActivities.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="max-w-[340px]">
                        <p
                          className={
                            khmer && item.titleKm
                              ? "khmer-input-value truncate text-[11px] font-normal leading-5 text-[var(--dash-text)]"
                              : "font-body truncate text-[12px] font-semibold"
                          }
                        >
                          {khmer && item.titleKm ? item.titleKm : item.titleEn}
                        </p>

                        {item.featured ? (
                          <p className="font-body mt-0.5 text-[8px] font-medium text-[var(--dash-violet)]">
                            Featured
                          </p>
                        ) : null}
                      </div>
                    </td>

                    <td>
                      <span className="rounded-full bg-[var(--dash-panel-soft)] px-2 py-1 font-body text-[9px] font-medium text-[var(--dash-muted)]">
                        {formatType(item.type)}
                      </span>
                    </td>

                    <td className="font-number text-[10px] text-[var(--dash-muted)]">
                      {formatDate(item.activityDate)}
                    </td>

                    <td>
                      <span
                        className={
                          item.published
                            ? "rounded-full bg-emerald-500/10 px-2 py-1 font-body text-[9px] font-medium text-emerald-600 dark:text-emerald-300"
                            : "rounded-full bg-amber-500/10 px-2 py-1 font-body text-[9px] font-medium text-amber-600 dark:text-amber-300"
                        }
                      >
                        {item.published ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="text-right">
                      <Link
                        href="/dashboard/activities"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-[9px] text-[var(--dash-muted)] transition hover:bg-[var(--dash-panel-soft)] hover:text-[var(--dash-violet)]"
                      >
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex min-h-[180px] flex-col items-center justify-center p-6 text-center">
            <Activity size={20} className="text-[var(--dash-violet)]" />

            <p className="font-body mt-2 text-[12px] font-semibold">
              {khmer ? "មិនទាន់មានមាតិកា" : "No content yet"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function DashboardStatCard({
  locale,
  titleEn,
  titleKm,
  value,
  detailEn,
  detailKm,
  icon: Icon,
  tone,
}: {
  locale: "en" | "km";

  titleEn: string;

  titleKm: string;

  value: number;

  detailEn: string;

  detailKm: string;

  icon: LucideIcon;

  tone: "violet" | "blue" | "green" | "orange";
}) {
  const khmer = locale === "km";

  const toneClasses = {
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-300",

    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-300",

    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",

    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-300",
  };

  return (
    <article className="dashboard-surface dashboard-hover p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={
              khmer
                ? "khmer-input-value text-[10px] font-normal leading-5 text-[var(--dash-muted)]"
                : "font-body text-[10px] font-medium text-[var(--dash-muted)]"
            }
          >
            {khmer ? titleKm : titleEn}
          </p>

          <p className="font-number mt-2 text-[26px] font-semibold tracking-[-0.03em] text-[var(--dash-text)]">
            {String(value).padStart(2, "0")}
          </p>

          <p
            className={
              khmer
                ? "khmer-input-value mt-1 text-[9px] font-normal leading-5 text-[var(--dash-muted)]"
                : "font-body mt-1 text-[9px] text-[var(--dash-muted)]"
            }
          >
            {khmer ? detailKm : detailEn}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] ${toneClasses[tone]}`}
        >
          <Icon size={16} strokeWidth={1.8} />
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   OVERVIEW ROW
   ========================================================= */

function OverviewRow({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;

  label: string;

  value: number;

  tone: "violet" | "blue" | "green" | "orange";
}) {
  const classes = {
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-300",

    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-300",

    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",

    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-300",
  };

  return (
    <div className="flex items-center gap-3 rounded-[12px] border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] p-3">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-[10px] ${classes[tone]}`}
      >
        <Icon size={15} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-body truncate text-[10px] text-[var(--dash-muted)]">
          {label}
        </p>

        <p className="font-number mt-0.5 text-[17px] font-semibold text-[var(--dash-text)]">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   ATTENTION ITEM
   ========================================================= */

function AttentionItem({
  href,
  icon: Icon,
  title,
  value,
  tone,
}: {
  href: string;

  icon: LucideIcon;

  title: string;

  value: number;

  tone: "violet" | "blue" | "orange";
}) {
  const classes = {
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-300",

    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-300",

    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-300",
  };

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-[12px] border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] p-3 transition hover:border-[var(--dash-border-strong)]"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${classes[tone]}`}
      >
        <Icon size={15} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-body truncate text-[10px] text-[var(--dash-muted)]">
          {title}
        </p>

        <p className="font-number mt-0.5 text-[16px] font-semibold text-[var(--dash-text)]">
          {value}
        </p>
      </div>

      <ChevronRight size={14} className="text-[var(--dash-muted)]" />
    </Link>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function formatType(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",

    month: "short",

    year: "numeric",
  }).format(date);
}
