import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

type Props = {
  children: ReactNode;

  params: Promise<{
    locale: string;
  }>;
};

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params;

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  const session = await auth();

  if (!session?.user) {
    redirect(`/${safeLocale}/login`);
  }

  const userName = session.user.name || "Chantha";

  const userEmail = session.user.email || "";

  return (
    <div className="dashboard-shell">
      <DashboardSidebar
        locale={safeLocale}
        userName={userName}
        userEmail={userEmail}
      />

      <DashboardMobileNav locale={safeLocale} />

      <DashboardTopbar locale={safeLocale} />

      <main className="dashboard-main">
        <div className="dashboard-content">{children}</div>
      </main>
    </div>
  );
}
