"use client";

import { ExternalLink, MessageSquareText } from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";

import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";

type Props = {
  locale: "en" | "km";
};

const titles: Record<
  string,
  {
    en: string;
    km: string;
  }
> = {
  "/dashboard": {
    en: "Dashboard",
    km: "ផ្ទាំងគ្រប់គ្រង",
  },

  "/dashboard/profile": {
    en: "Profile",
    km: "ប្រវត្តិរូប",
  },

  "/dashboard/activities": {
    en: "Activities",
    km: "សកម្មភាព",
  },

  "/dashboard/projects": {
    en: "Projects",
    km: "គម្រោង",
  },

  "/dashboard/certificates": {
    en: "Certificates",
    km: "វិញ្ញាបនបត្រ",
  },

  "/dashboard/gallery": {
    en: "Gallery",
    km: "វិចិត្រសាល",
  },

  "/dashboard/skills": {
    en: "Skills & Tools",
    km: "ជំនាញ និងឧបករណ៍",
  },

  "/dashboard/experience": {
    en: "Experience",
    km: "បទពិសោធន៍",
  },

  "/dashboard/education": {
    en: "Education",
    km: "ការអប់រំ",
  },

  "/dashboard/achievements": {
    en: "Achievements",
    km: "សមិទ្ធផល",
  },

  "/dashboard/teaching": {
    en: "Teaching",
    km: "ការបង្រៀន",
  },

  "/dashboard/messages": {
    en: "Messages",
    km: "សារ",
  },

  "/dashboard/comments": {
    en: "Comments",
    km: "មតិយោបល់",
  },

  "/dashboard/settings": {
    en: "Settings",
    km: "ការកំណត់",
  },
};

export default function DashboardTopbar({ locale }: Props) {
  const pathname = usePathname();

  const khmer = locale === "km";

  const title = getTitle(pathname);

  return (
    <header className="fixed left-0 right-0 top-0 z-40 h-[70px] border-b border-[var(--dash-border)] bg-[var(--dash-panel)]/95 backdrop-blur-xl lg:left-[238px]">
      <div className="mx-auto flex h-full max-w-[1480px] items-center justify-between gap-4 px-4 md:px-7 lg:px-8">
        <div className="min-w-0">
          <p
            className={
              khmer
                ? "khmer-input-value truncate text-[14px] font-normal leading-6 text-[var(--dash-text)]"
                : "font-body truncate text-[15px] font-semibold text-[var(--dash-text)]"
            }
          >
            {khmer ? title.km : title.en}
          </p>

          <p className="font-body mt-0.5 hidden text-[9px] text-[var(--dash-muted)] sm:block">
            {khmer
              ? "គ្រប់គ្រង Portfolio និងមាតិកាសាធារណៈ"
              : "Manage your portfolio and public content"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/messages"
            aria-label="Messages"
            className="hidden h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--dash-border)] bg-[var(--dash-panel)] text-[var(--dash-muted)] transition hover:bg-[var(--dash-panel-soft)] hover:text-[var(--dash-text)] sm:flex"
          >
            <MessageSquareText size={15} />
          </Link>

          <Link
            href="/"
            target="_blank"
            className="hidden h-9 items-center gap-2 rounded-[10px] border border-[var(--dash-border)] bg-[var(--dash-panel)] px-3 font-body text-[10px] font-medium text-[var(--dash-muted)] transition hover:bg-[var(--dash-panel-soft)] hover:text-[var(--dash-text)] md:inline-flex"
          >
            {khmer ? "មើល Portfolio" : "View Portfolio"}

            <ExternalLink size={12} />
          </Link>

          <LanguageSwitcher variant="dashboard" />

          <ThemeSwitcher variant="dashboard" />
        </div>
      </div>
    </header>
  );
}

function getTitle(pathname: string) {
  const exact = titles[pathname];

  if (exact) {
    return exact;
  }

  const matched = Object.entries(titles)
    .sort(([a], [b]) => b.length - a.length)
    .find(([path]) => pathname.startsWith(`${path}/`));

  return (
    matched?.[1] ?? {
      en: "Portfolio CMS",
      km: "Portfolio CMS",
    }
  );
}
