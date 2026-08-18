"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BrainCircuit,
  FolderKanban,
  LayoutDashboard,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/cn";

type DashboardMobileNavProps = {
  locale: string;
  labels: {
    overview: string;
    profile: string;
    activities: string;
    projects: string;
    skillsTools: string;
  };
};

export default function DashboardMobileNav({
  locale,
  labels,
}: DashboardMobileNavProps) {
  const pathname = usePathname();

  const items = [
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
      label: labels.skillsTools,
      href: `/${locale}/dashboard/skills`,
      icon: BrainCircuit,
    },
  ];

  return (
    <div className="fixed inset-x-0 top-[68px] z-40 flex gap-2 overflow-x-auto border-b border-black/[0.07] bg-white/95 px-4 py-2.5 backdrop-blur-xl lg:hidden dark:border-white/[0.08] dark:bg-[#0b0d17]/95">
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === `/${locale}/dashboard`
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "font-body inline-flex h-9 shrink-0 items-center gap-2 rounded-xl px-3 text-[12px] transition",
              active
                ? "bg-violet-600 font-semibold text-white"
                : "text-[var(--foreground-muted)] hover:bg-black/[0.04] hover:text-[var(--foreground)] dark:hover:bg-white/[0.05]",
            )}
          >
            <Icon size={14} strokeWidth={1.8} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
