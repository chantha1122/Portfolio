"use client";

import type { LucideIcon } from "lucide-react";

import {
  Activity,
  Award,
  BookOpen,
  BriefcaseBusiness,
  CircleUserRound,
  Code2,
  FolderKanban,
  GraduationCap,
  Image,
  LayoutDashboard,
  MessageCircle,
  MessageSquareText,
  Presentation,
  Settings,
  Shapes,
  Sparkles,
  Wrench,
} from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";

import { cn } from "@/lib/cn";

export type DashboardNavItem = {
  href: string;

  labelEn: string;

  labelKm: string;

  icon: LucideIcon;
};

export type DashboardNavGroup = {
  labelEn: string;

  labelKm: string;

  items: DashboardNavItem[];
};

export const dashboardNavGroups: DashboardNavGroup[] = [
  {
    labelEn: "Overview",

    labelKm: "ទិដ្ឋភាពទូទៅ",

    items: [
      {
        href: "/dashboard",

        labelEn: "Dashboard",

        labelKm: "ផ្ទាំងគ្រប់គ្រង",

        icon: LayoutDashboard,
      },
      {
        href: "/dashboard/profile",

        labelEn: "Profile",

        labelKm: "ប្រវត្តិរូប",

        icon: CircleUserRound,
      },
    ],
  },

  {
    labelEn: "Portfolio",

    labelKm: "Portfolio",

    items: [
      {
        href: "/dashboard/activities",

        labelEn: "Activities",

        labelKm: "សកម្មភាព",

        icon: Activity,
      },
      {
        href: "/dashboard/projects",

        labelEn: "Projects",

        labelKm: "គម្រោង",

        icon: FolderKanban,
      },
      {
        href: "/dashboard/certificates",

        labelEn: "Certificates",

        labelKm: "វិញ្ញាបនបត្រ",

        icon: Award,
      },
      {
        href: "/dashboard/gallery",

        labelEn: "Gallery",

        labelKm: "វិចិត្រសាល",

        icon: Image,
      },
      {
        href: "/dashboard/skills",
        labelEn: "Skills & Tools",
        labelKm: "ជំនាញ និងឧបករណ៍",
        icon: Wrench,
      },
    ],
  },

  {
    labelEn: "Journey",

    labelKm: "ដំណើរ",

    items: [
      {
        href: "/dashboard/experience",

        labelEn: "Experience",

        labelKm: "បទពិសោធន៍",

        icon: BriefcaseBusiness,
      },
      {
        href: "/dashboard/education",

        labelEn: "Education",

        labelKm: "ការអប់រំ",

        icon: GraduationCap,
      },
      {
        href: "/dashboard/achievements",

        labelEn: "Achievements",

        labelKm: "សមិទ្ធផល",

        icon: Sparkles,
      },
      {
        href: "/dashboard/teaching",

        labelEn: "Teaching",

        labelKm: "ការបង្រៀន",

        icon: Presentation,
      },
    ],
  },

  {
    labelEn: "Inbox",

    labelKm: "ប្រអប់សារ",

    items: [
      {
        href: "/dashboard/messages",

        labelEn: "Messages",

        labelKm: "សារ",

        icon: MessageSquareText,
      },
      {
        href: "/dashboard/comments",

        labelEn: "Comments",

        labelKm: "មតិយោបល់",

        icon: MessageCircle,
      },
    ],
  },

  {
    labelEn: "System",

    labelKm: "ប្រព័ន្ធ",

    items: [
      {
        href: "/dashboard/settings",

        labelEn: "Settings",

        labelKm: "ការកំណត់",

        icon: Settings,
      },
    ],
  },
];

type Props = {
  locale: "en" | "km";

  userName?: string;

  userEmail?: string;
};

export default function DashboardSidebar({
  locale,
  userName = "Chantha",
  userEmail = "",
}: Props) {
  const pathname = usePathname();

  const khmer = locale === "km";
  type Locale = "en" | "km";

  const sidebarText: Record<
    Locale,
    {
      management: string;
      overview: string;
      content: string;
      settings: string;
    }
  > = {
    en: {
      management: "Management",
      overview: "Overview",
      content: "Content",
      settings: "Settings",
    },

    km: {
      management: "ការគ្រប់គ្រង",
      overview: "ទិដ្ឋភាពទូទៅ",
      content: "មាតិកា",
      settings: "ការកំណត់",
    },
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[238px] border-r border-[var(--dash-border)] bg-[var(--dash-panel)] lg:flex lg:flex-col">
      {/* ===============================================
          BRAND
         =============================================== */}

      <div className="flex h-[76px] shrink-0 items-center border-b border-[var(--dash-border)] px-5">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-violet-600 text-white shadow-[0_7px_20px_rgba(109,69,232,0.25)]">
            <Shapes size={19} strokeWidth={2} />
          </span>

          <span className="min-w-0">
            <span className="font-body block truncate text-[15px] font-semibold text-[var(--dash-text)]">
              Chantha
            </span>

            <span className="font-body mt-0.5 block truncate text-[10px] text-[var(--dash-muted)]">
              Portfolio CMS
            </span>
          </span>
        </Link>
      </div>

      {/* ===============================================
          NAVIGATION
         =============================================== */}

      <div className="dashboard-sidebar-scroll min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {dashboardNavGroups.map((group, groupIndex) => (
          <div key={group.labelEn} className={cn(groupIndex > 0 && "mt-5")}>
            <p
              className={
                khmer
                  ? "khmer-input-value px-3 pb-1.5 text-[9px] font-normal leading-5 text-[var(--dash-muted)]"
                  : "font-body px-3 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-[var(--dash-muted)]"
              }
            >
              {khmer ? group.labelKm : group.labelEn}
            </p>

            <div className="grid gap-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                const active = isActiveRoute(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex h-10 items-center gap-3 rounded-[10px] px-3 font-body text-[12px] font-medium transition",
                      active
                        ? "bg-[var(--dash-violet-soft)] text-[var(--dash-violet)]"
                        : "text-[var(--dash-muted)] hover:bg-[var(--dash-panel-soft)] hover:text-[var(--dash-text)]",
                    )}
                  >
                    {active ? (
                      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[var(--dash-violet)]" />
                    ) : null}

                    <Icon size={16} strokeWidth={1.8} className="shrink-0" />

                    <span
                      className={
                        khmer
                          ? "khmer-input-value truncate text-[11px] font-normal leading-6"
                          : "truncate"
                      }
                    >
                      {khmer ? item.labelKm : item.labelEn}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ===============================================
          USER
         =============================================== */}

      <div className="shrink-0 border-t border-[var(--dash-border)] p-3">
        <div className="flex items-center gap-3 rounded-[12px] px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--dash-violet-soft)] text-[var(--dash-violet)]">
            <CircleUserRound size={17} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-body truncate text-[12px] font-semibold text-[var(--dash-text)]">
              {userName}
            </p>

            <p className="font-body mt-0.5 truncate text-[9px] text-[var(--dash-muted)]">
              {userEmail || "Administrator"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function isActiveRoute(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
