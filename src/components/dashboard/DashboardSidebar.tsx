"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Activity,
  Award,
  BrainCircuit,
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Images,
  LayoutDashboard,
  Mail,
  Medal,
  MessageCircle,
  Presentation,
  Settings,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/cn";

type DashboardSidebarProps = {
  locale: string;
  userName: string;

  labels: {
    management: string;
    content: string;
    aboutSection: string;
    engagement: string;
    system: string;

    overview: string;
    profile: string;

    activities: string;
    projects: string;
    certificates: string;
    gallery: string;

    skillsTools: string;
    experience: string;
    education: string;
    achievements: string;
    teaching: string;

    messages: string;
    comments: string;

    settings: string;

    soon: string;
    viewWebsite: string;
    administrator: string;
  };
};

type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

export default function DashboardSidebar({
  locale,
  userName,
  labels,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const githubLabel = locale === "km" ? "សកម្មភាព GitHub" : "GitHub Activity";

  const groups: MenuGroup[] = [
    /* =====================================================
       MANAGEMENT
       ===================================================== */

    {
      label: labels.management,

      items: [
        {
          label: labels.overview,
          href: `/${locale}/dashboard`,
          icon: LayoutDashboard,
        },

        {
          label: labels.profile,
          href: `/${locale}/dashboard/profile`,
          icon: UserRound,
        },
      ],
    },

    /* =====================================================
       CONTENT
       ===================================================== */

    {
      label: labels.content,

      items: [
        {
          label: labels.activities,
          href: `/${locale}/dashboard/activities`,
          icon: Activity,
        },

        {
          label: labels.projects,
          href: `/${locale}/dashboard/projects`,
          icon: FolderKanban,
        },

        {
          label: labels.certificates,
          href: `/${locale}/dashboard/certificates`,
          icon: Award,
        },

        {
          label: labels.gallery,
          href: `/${locale}/dashboard/gallery`,
          icon: Images,
        },
      ],
    },

    /* =====================================================
       ABOUT
       ===================================================== */

    {
      label: labels.aboutSection,

      items: [
        {
          label: labels.skillsTools,
          href: `/${locale}/dashboard/skills`,
          icon: BrainCircuit,
        },

        /* =================================================
           GITHUB ACTIVITY
           ================================================= */

        {
          label: githubLabel,
          href: `/${locale}/dashboard/github`,
          icon: Code2,
        },

        {
          label: labels.experience,
          href: `/${locale}/dashboard/experience`,
          icon: BriefcaseBusiness,
        },

        {
          label: labels.education,
          href: `/${locale}/dashboard/education`,
          icon: GraduationCap,
        },

        {
          label: labels.achievements,
          href: `/${locale}/dashboard/achievements`,
          icon: Medal,
        },

        {
          label: labels.teaching,
          href: `/${locale}/dashboard/teaching`,
          icon: Presentation,
        },
      ],
    },

    /* =====================================================
       ENGAGEMENT
       ===================================================== */

    {
      label: labels.engagement,

      items: [
        {
          label: labels.messages,
          href: `/${locale}/dashboard/messages`,
          icon: Mail,
        },

        {
          label: labels.comments,
          href: `/${locale}/dashboard/comments`,
          icon: MessageCircle,
        },
      ],
    },

    /* =====================================================
       SYSTEM
       ===================================================== */

    {
      label: labels.system,

      items: [
        {
          label: labels.settings,
          href: `/${locale}/dashboard/settings`,
          icon: Settings,
        },
      ],
    },
  ];

  /* =======================================================
     ACTIVE MENU
     ======================================================= */

  const isActive = (href: string) => {
    if (href === `/${locale}/dashboard`) {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed bottom-0 left-0 top-[68px] z-40 hidden w-[260px] border-r border-black/[0.07] bg-white dark:border-white/[0.08] dark:bg-[#0b0d17] lg:flex lg:flex-col">
      {/* ===================================================
          MENU AREA
         =================================================== */}

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group, groupIndex) => (
          <div
            key={group.label}
            className={cn(
              groupIndex > 0 &&
                "mt-5 border-t border-black/[0.055] pt-4 dark:border-white/[0.06]",
            )}
          >
            {/* GROUP TITLE */}

            <p className="font-body px-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-[var(--foreground-muted)]">
              {group.label}
            </p>

            {/* MENU */}

            <nav className="mt-2 grid gap-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                const active = !item.disabled && isActive(item.href);

                /* =======================================
                       DISABLED ITEM
                       ======================================= */

                if (item.disabled) {
                  return (
                    <div
                      key={item.href}
                      title={labels.soon}
                      className="flex h-[42px] cursor-not-allowed items-center gap-3 rounded-xl px-3 text-[var(--foreground-muted)] opacity-40"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center">
                        <Icon size={16} strokeWidth={1.8} />
                      </span>

                      <span className="font-body min-w-0 flex-1 truncate text-[13px] font-medium">
                        {item.label}
                      </span>

                      <span className="font-body rounded-full bg-black/[0.045] px-2 py-0.5 text-[9px] dark:bg-white/[0.06]">
                        {labels.soon}
                      </span>
                    </div>
                  );
                }

                /* =======================================
                       NORMAL ITEM
                       ======================================= */

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex h-[42px] items-center gap-3 rounded-xl px-3 transition",
                      active
                        ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-[0_8px_22px_rgba(124,58,237,0.16)]"
                        : "text-[var(--foreground-muted)] hover:bg-black/[0.04] hover:text-[var(--foreground)] dark:hover:bg-white/[0.05]",
                    )}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center">
                      <Icon size={16} strokeWidth={1.9} />
                    </span>

                    <span className="font-body truncate text-[13px] font-semibold">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* ===================================================
          BOTTOM AREA
         =================================================== */}

      <div className="shrink-0 border-t border-black/[0.07] bg-white p-3 dark:border-white/[0.08] dark:bg-[#0b0d17]">
        {/* VIEW WEBSITE */}

        <Link
          href={`/${locale}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[42px] items-center gap-3 rounded-xl px-3 text-[var(--foreground-muted)] transition hover:bg-black/[0.04] hover:text-[var(--foreground)] dark:hover:bg-white/[0.05]"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center">
            <ExternalLink size={16} strokeWidth={1.9} />
          </span>

          <span className="font-body text-[13px] font-semibold">
            {labels.viewWebsite}
          </span>
        </Link>

        {/* ADMIN */}

        <div className="mt-2 flex items-center gap-3 rounded-xl bg-black/[0.025] p-3 dark:bg-white/[0.035]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/15 to-cyan-400/15 text-violet-700 ring-1 ring-violet-500/10 dark:text-violet-300">
            <UserRound size={17} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <p className="font-body truncate text-[13px] font-semibold">
              {userName}
            </p>

            <p className="font-body mt-0.5 truncate text-[10px] text-[var(--foreground-muted)]">
              {labels.administrator}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
