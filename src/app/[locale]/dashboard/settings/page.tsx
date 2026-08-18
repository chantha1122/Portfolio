import { KeyRound, ShieldCheck } from "lucide-react";

import ChangePasswordForm from "@/components/dashboard/ChangePasswordForm";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function SettingsPage({ params }: Props) {
  const { locale } = await params;
  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";
  const khmer = safeLocale === "km";

  return (
    <div className="w-full max-w-[920px]">
      <DashboardPageHeader
        locale={safeLocale}
        eyebrow="Portfolio CMS"
        title={khmer ? "ការកំណត់ និងសុវត្ថិភាព" : "Settings & Security"}
        description={
          khmer
            ? "គ្រប់គ្រងសុវត្ថិភាពគណនីអ្នកគ្រប់គ្រង និងការកំណត់ប្រព័ន្ធ។"
            : "Manage administrator account security and portfolio CMS settings."
        }
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_270px]">
        <DashboardCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-700 dark:text-violet-300">
              <KeyRound size={17} />
            </div>
            <div>
              <h2 className="font-body text-[16px] font-semibold">
                {khmer ? "ផ្លាស់ប្តូរពាក្យសម្ងាត់" : "Change Password"}
              </h2>
              <p className="font-body mt-0.5 text-[11px] text-[var(--foreground-muted)]">
                {khmer ? "ផ្លាស់ប្តូរពាក្យសម្ងាត់សម្រាប់គណនី CMS។" : "Update the password used to access your private CMS."}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <ChangePasswordForm locale={safeLocale} />
          </div>
        </DashboardCard>

        <DashboardCard className="p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
            <ShieldCheck size={17} />
          </div>
          <h3 className="font-body mt-3 text-[14px] font-semibold">
            {khmer ? "គណនីឯកជន" : "Private Account"}
          </h3>
          <p className="font-body mt-2 text-[11px] leading-5 text-[var(--foreground-muted)]">
            {khmer
              ? "ផ្ទាំងគ្រប់គ្រងនេះសម្រាប់អ្នកគ្រប់គ្រងតែម្នាក់ ហើយត្រូវបានការពារដោយការចូលប្រើ។"
              : "This dashboard is private and protected by your administrator sign-in."}
          </p>
        </DashboardCard>
      </div>
    </div>
  );
}
