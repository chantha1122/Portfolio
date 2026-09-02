"use client";

import { useEffect, useState } from "react";

import { Menu, Shapes, X } from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";

import { dashboardNavGroups } from "@/components/dashboard/DashboardSidebar";

import { cn } from "@/lib/cn";

type Props = {
  locale: "en" | "km";
};

export default function DashboardMobileNav({ locale }: Props) {
  const pathname = usePathname();

  const khmer = locale === "km";

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-[17px] z-[60] flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--dash-border)] bg-[var(--dash-panel)] text-[var(--dash-text)] lg:hidden"
        aria-label="Open dashboard menu"
      >
        <Menu size={17} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
            aria-label="Close navigation"
          />

          <aside className="dashboard-sidebar-scroll absolute bottom-0 left-0 top-0 w-[270px] overflow-y-auto border-r border-[var(--dash-border)] bg-[var(--dash-panel)] shadow-2xl">
            <div className="flex h-[70px] items-center justify-between border-b border-[var(--dash-border)] px-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-violet-600 text-white">
                  <Shapes size={17} />
                </span>

                <div>
                  <p className="font-body text-[13px] font-semibold">Chantha</p>

                  <p className="font-body text-[9px] text-[var(--dash-muted)]">
                    Portfolio CMS
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[var(--dash-muted)] hover:bg-[var(--dash-panel-soft)]"
              >
                <X size={17} />
              </button>
            </div>

            <div className="px-3 py-4">
              {dashboardNavGroups.map((group, index) => (
                <div key={group.labelEn} className={cn(index > 0 && "mt-5")}>
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

                      const active =
                        item.href === "/dashboard"
                          ? pathname === "/dashboard"
                          : pathname === item.href ||
                            pathname.startsWith(`${item.href}/`);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex h-10 items-center gap-3 rounded-[10px] px-3 font-body text-[12px] font-medium transition",
                            active
                              ? "bg-[var(--dash-violet-soft)] text-[var(--dash-violet)]"
                              : "text-[var(--dash-muted)] hover:bg-[var(--dash-panel-soft)] hover:text-[var(--dash-text)]",
                          )}
                        >
                          <Icon size={16} />

                          <span
                            className={
                              khmer
                                ? "khmer-input-value text-[11px] font-normal leading-6"
                                : ""
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
          </aside>
        </div>
      ) : null}
    </>
  );
}
