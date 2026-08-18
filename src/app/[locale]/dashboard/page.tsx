import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Activity,
  Award,
  BrainCircuit,
  Check,
  Eye,
  ExternalLink,
  FilePenLine,
  FolderKanban,
  Images,
  Mail,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { cn } from "@/lib/cn";
import { prisma } from "@/lib/db";

type DashboardPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";
  const isKhmer = safeLocale === "km";
  const t = await getTranslations("Dashboard");

  const [
    totalActivities,
    publishedActivities,
    totalProfiles,
    totalProjects,
    totalCertificates,
    totalSkills,
    totalTools,
    newMessages,
    recentActivities,
  ] = await Promise.all([
    prisma.activity.count(),
    prisma.activity.count({ where: { published: true } }),
    prisma.profile.count(),
    prisma.activity.count({ where: { type: "PROJECT" } }),
    prisma.activity.count({ where: { type: "CERTIFICATE" } }),
    prisma.skill.count(),
    prisma.tool.count(),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.activity.findMany({
      take: 5,
      orderBy: [{ activityDate: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  const draftActivities = totalActivities - publishedActivities;

  return (
    <div className="w-full max-w-[1240px]">
      <DashboardPageHeader
        locale={safeLocale}
        eyebrow={t("cms")}
        title={t("overview")}
        description={t("overviewDescription")}
        action={
          <Link
            href={`/${safeLocale}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "font-body inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-black/[0.07] bg-white px-4 text-[var(--foreground)] shadow-sm transition hover:-translate-y-0.5 hover:bg-black/[0.025] dark:border-white/[0.08] dark:bg-[#0d0f19] dark:hover:bg-white/[0.04]",
              isKhmer ? "text-[12px] font-normal" : "text-[12px] font-medium",
            )}
          >
            <ExternalLink size={15} strokeWidth={1.8} />
            {t("viewPortfolio")}
          </Link>
        }
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          locale={safeLocale}
          label={t("totalActivities")}
          value={totalActivities}
          icon={Activity}
          detail={t("allPortfolioRecords")}
        />

        <DashboardStatCard
          locale={safeLocale}
          label={t("published")}
          value={publishedActivities}
          icon={Eye}
          detail={t("visibleOnWebsite")}
        />

        <DashboardStatCard
          locale={safeLocale}
          label={t("draftActivities")}
          value={draftActivities}
          icon={FilePenLine}
          detail={t("notPublishedYet")}
        />

        <DashboardStatCard
          locale={safeLocale}
          label={t("newMessages")}
          value={newMessages}
          icon={Mail}
          detail={t("waitingForReview")}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.78fr)]">
        <DashboardCard className="p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2
                className={cn(
                  "font-body text-[var(--foreground)]",
                  isKhmer
                    ? "text-[16px] font-normal leading-7"
                    : "text-[16px] font-semibold leading-6",
                )}
              >
                {t("recentActivities")}
              </h2>
              <p className="font-body mt-1 text-[12px] leading-5 text-[var(--foreground-muted)]">
                {t("recentActivitiesDescription")}
              </p>
            </div>

            <Link
              href={`/${safeLocale}/dashboard/activities`}
              className="font-body inline-flex h-9 items-center rounded-xl border border-black/[0.07] px-4 text-[12px] font-medium text-[var(--foreground-muted)] transition hover:text-[var(--foreground)] dark:border-white/[0.08]"
            >
              {t("viewAll")}
            </Link>
          </div>

          {recentActivities.length === 0 ? (
            <div className="mt-4 flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-dashed border-black/[0.085] bg-black/[0.008] px-6 text-center dark:border-white/[0.085] dark:bg-white/[0.012]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-700 dark:text-violet-300">
                <Activity size={19} strokeWidth={1.8} />
              </div>
              <h3 className="font-body mt-4 text-[15px] font-semibold">
                {t("noActivitiesTitle")}
              </h3>
              <p className="font-body mt-1.5 max-w-md text-[12px] leading-5 text-[var(--foreground-muted)]">
                {t("noActivitiesDescription")}
              </p>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-black/[0.055] overflow-hidden rounded-xl border border-black/[0.06] dark:divide-white/[0.06] dark:border-white/[0.07]">
              {recentActivities.map((activity) => {
                const title =
                  isKhmer && activity.titleKm ? activity.titleKm : activity.titleEn;
                const organization =
                  isKhmer && activity.organizationKm
                    ? activity.organizationKm
                    : activity.organizationEn;

                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-3.5 transition hover:bg-black/[0.015] dark:hover:bg-white/[0.02]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-700 dark:text-violet-300">
                      <Activity size={15} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-body truncate text-[13px] font-semibold">
                        {title}
                      </p>
                      <p className="font-body mt-0.5 truncate text-[10px] text-[var(--foreground-muted)]">
                        {activity.type}
                        {organization ? ` • ${organization}` : ""}
                        {` • ${activity.activityDate.toLocaleDateString(
                          safeLocale === "km" ? "km-KH" : "en-US",
                        )}`}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "rounded-full px-2 py-1 font-body text-[9px]",
                        activity.published
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                      )}
                    >
                      {activity.published ? t("publishedShort") : t("draftShort")}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </DashboardCard>

        <DashboardCard className="p-5 md:p-6">
          <h2
            className={cn(
              "font-body text-[var(--foreground)]",
              isKhmer
                ? "text-[16px] font-normal leading-7"
                : "text-[16px] font-semibold leading-6",
            )}
          >
            {t("portfolioSetup")}
          </h2>
          <p className="font-body mt-1 text-[12px] leading-5 text-[var(--foreground-muted)]">
            {t("portfolioSetupDescription")}
          </p>

          <div className="mt-4 grid gap-3">
            <SetupItem
              icon={UserRound}
              title={t("profile")}
              description={t("profileSetupDescription")}
              completed={totalProfiles > 0}
            />
            <SetupItem
              icon={FolderKanban}
              title={t("projects")}
              description={`${totalProjects} ${t("records")}`}
              completed={totalProjects > 0}
            />
            <SetupItem
              icon={Award}
              title={t("certificates")}
              description={`${totalCertificates} ${t("records")}`}
              completed={totalCertificates > 0}
            />
            <SetupItem
              icon={BrainCircuit}
              title={t("skillsTools")}
              description={`${totalSkills + totalTools} ${t("records")}`}
              completed={totalSkills + totalTools > 0}
            />
            <SetupItem
              icon={Images}
              title={t("gallery")}
              description={t("gallerySetupDescription")}
            />
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

type DashboardStatCardProps = {
  locale: string;
  label: string;
  value: number;
  icon: LucideIcon;
  detail: string;
};

function DashboardStatCard({
  locale,
  label,
  value,
  icon: Icon,
  detail,
}: DashboardStatCardProps) {
  const isKhmer = locale === "km";

  return (
    <DashboardCard className="p-4 md:p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-700 dark:text-violet-300">
        <Icon size={18} strokeWidth={1.8} />
      </div>
      <p className="font-number mt-4 text-[30px] font-bold leading-none">{value}</p>
      <p
        className={cn(
          "font-body mt-2 text-[var(--foreground)]",
          isKhmer ? "text-[13px] font-normal leading-6" : "text-[13px] font-semibold leading-5",
        )}
      >
        {label}
      </p>
      <p className="font-body mt-1 text-[11px] leading-4 text-[var(--foreground-muted)]">
        {detail}
      </p>
    </DashboardCard>
  );
}

type SetupItemProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  completed?: boolean;
};

function SetupItem({
  icon: Icon,
  title,
  description,
  completed = false,
}: SetupItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-black/[0.055] bg-black/[0.008] p-3 transition hover:bg-black/[0.018] dark:border-white/[0.07] dark:bg-white/[0.012] dark:hover:bg-white/[0.025]">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          completed
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
            : "bg-violet-500/10 text-violet-700 dark:text-violet-300",
        )}
      >
        {completed ? <Check size={16} strokeWidth={2} /> : <Icon size={16} strokeWidth={1.8} />}
      </div>

      <div className="min-w-0">
        <p className="font-body text-[13px] font-semibold">{title}</p>
        <p className="font-body mt-0.5 text-[11px] leading-4 text-[var(--foreground-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}
