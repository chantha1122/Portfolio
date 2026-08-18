import type { ReactNode } from "react";

import { LogOut } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";
import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";
import { cn } from "@/lib/cn";

type DashboardLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;

  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations("Dashboard");
  const userName = session.user.name ?? "Chantha";
  const isKhmer = locale === "km";

  const sidebarLabels = {
    management: t("management"),
    content: t("content"),
    aboutSection: t("aboutSection"),
    engagement: t("engagement"),
    system: t("system"),
    overview: t("overview"),
    profile: t("profile"),
    activities: t("activities"),
    projects: t("projects"),
    certificates: t("certificates"),
    gallery: t("gallery"),
    skillsTools: t("skillsTools"),
    experience: t("experience"),
    education: t("education"),
    achievements: t("achievements"),
    teaching: t("teaching"),
    messages: t("messages"),
    comments: t("comments"),
    settings: t("settings"),
    soon: t("soon"),
    viewWebsite: t("viewWebsite"),
    administrator: t("administrator"),
  };

  return (
    <div className="min-h-screen bg-[var(--dashboard-background)] text-[var(--foreground)]">
      <header className="fixed inset-x-0 top-0 z-50 h-[68px] border-b border-black/[0.07] bg-white/95 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#0b0d17]/95">
        <div className="flex h-full items-center">
          <div className="hidden h-full w-[260px] shrink-0 items-center gap-3 border-r border-black/[0.07] px-5 lg:flex dark:border-white/[0.08]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-purple-500 to-cyan-400 font-display text-lg text-white shadow-[0_8px_20px_rgba(124,58,237,0.18)]">
              C
            </div>

            <div className="min-w-0">
              <p className="font-display truncate text-xl leading-none tracking-wide">
                CHANTHA
              </p>
              <p className="font-body mt-1 text-[10px] text-[var(--foreground-muted)]">
                Portfolio CMS
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-between gap-4 px-4 sm:px-5 lg:px-7">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-purple-500 to-cyan-400 font-display text-base text-white">
                C
              </div>
              <span className="font-display text-lg">CHANTHA</span>
            </div>

            <p
              className={cn(
                "font-body hidden truncate text-[var(--foreground-muted)] md:block",
                isKhmer
                  ? "text-[13px] font-normal leading-6"
                  : "text-[13px] font-medium",
              )}
            >
              {t("privateDashboard")}
            </p>

            <div className="ml-auto flex items-center gap-2">
              <LanguageSwitcher variant="dashboard" />
              <ThemeSwitcher variant="dashboard" />

              <div className="mx-1 hidden h-7 w-px bg-black/[0.08] md:block dark:bg-white/[0.08]" />

              <div className="hidden items-center gap-2.5 md:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/15 to-cyan-400/15 font-body text-[12px] font-semibold text-violet-700 ring-1 ring-violet-500/10 dark:text-violet-300">
                  {userName.charAt(0).toUpperCase()}
                </div>

                <div className="hidden xl:block">
                  <p className="font-body max-w-[140px] truncate text-[12px] font-semibold">
                    {userName}
                  </p>
                  <p className="font-body mt-0.5 max-w-[170px] truncate text-[10px] text-[var(--foreground-muted)]">
                    {session.user.email}
                  </p>
                </div>
              </div>

              <form
                action={async () => {
                  "use server";
                  await signOut({
                    redirectTo: `/${locale}`,
                  });
                }}
              >
                <button
                  type="submit"
                  className={cn(
                    "font-body inline-flex h-9 items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-3 text-[var(--foreground)] transition hover:bg-black/[0.03] dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:bg-white/[0.055]",
                    isKhmer
                      ? "text-[12px] font-normal"
                      : "text-[12px] font-medium",
                  )}
                >
                  <LogOut size={14} strokeWidth={1.8} className="hidden sm:block" />
                  {t("signOut")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <DashboardSidebar locale={locale} userName={userName} labels={sidebarLabels} />

      <DashboardMobileNav
        locale={locale}
        labels={{
          overview: t("overview"),
          profile: t("profile"),
          activities: t("activities"),
          projects: t("projects"),
          skillsTools: t("skillsTools"),
        }}
      />

      <main className="min-h-screen pt-[119px] lg:ml-[260px] lg:pt-[68px]">
        <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
