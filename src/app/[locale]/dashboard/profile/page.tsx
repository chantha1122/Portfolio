import { getTranslations } from "next-intl/server";

import { redirect } from "next/navigation";

import {
  BriefcaseBusiness,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";

import { auth } from "@/auth";

import DashboardCard from "@/components/dashboard/DashboardCard";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";

import ProfileForm from "@/components/dashboard/ProfileForm";

import ProfilePhotoUploader from "@/components/dashboard/ProfilePhotoUploader";

import { cn } from "@/lib/cn";

import { prisma } from "@/lib/db";

type ProfilePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;

  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations("Profile");

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  const isKhmer = safeLocale === "km";

  const profile = await prisma.profile.findUnique({
    where: {
      profileKey: "main",
    },
  });

  const fullName = profile?.fullName || session.user.name || "Chantha";

  const headline = isKhmer
    ? profile?.headlineKm || profile?.headlineEn || ""
    : profile?.headlineEn || profile?.headlineKm || "";

  const currentRole = isKhmer
    ? profile?.currentRoleKm || profile?.currentRoleEn || ""
    : profile?.currentRoleEn || profile?.currentRoleKm || "";

  const location = isKhmer
    ? profile?.locationKm || profile?.locationEn || ""
    : profile?.locationEn || profile?.locationKm || "";

  const previewImage = profile?.profileImage || "/images/profile-badge.png";

  return (
    <div className="w-full max-w-[1240px]">
      <DashboardPageHeader
        locale={safeLocale}
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[265px_minmax(0,1fr)]">
        <DashboardCard className="p-5 xl:sticky xl:top-[96px]">
          <div className="flex flex-col items-center text-center">
            <ProfilePhotoUploader
              locale={safeLocale}
              fullName={fullName}
              image={previewImage}
            />

            <h2
              className={cn(
                "font-body mt-3 text-[17px] text-[var(--foreground)]",

                isKhmer ? "font-normal leading-7" : "font-semibold leading-6",
              )}
            >
              {fullName}
            </h2>

            {headline ? (
              <p
                className={cn(
                  isKhmer ? "khmer-input-value" : "font-body",

                  "mt-1 line-clamp-2 text-[13px] font-normal text-[var(--foreground-muted)]",

                  isKhmer ? "leading-6" : "leading-5",
                )}
              >
                {headline}
              </p>
            ) : null}

            <span className="font-body mt-3 rounded-full bg-violet-500/10 px-3 py-1 text-[11px] font-medium text-violet-700 dark:text-violet-300">
              {t("administrator")}
            </span>
          </div>

          <div className="my-5 h-px bg-black/[0.06] dark:bg-white/[0.07]" />

          <div className="grid gap-4">
            {currentRole ? (
              <SummaryItem
                locale={safeLocale}
                icon={BriefcaseBusiness}
                label={t("currentRole")}
                value={currentRole}
                khmerValue={isKhmer}
              />
            ) : null}

            {profile?.email ? (
              <SummaryItem
                locale={safeLocale}
                icon={Mail}
                label={t("email")}
                value={profile.email}
              />
            ) : null}

            {profile?.phone ? (
              <SummaryItem
                locale={safeLocale}
                icon={Phone}
                label={t("phone")}
                value={profile.phone}
                numeric
              />
            ) : null}

            {location ? (
              <SummaryItem
                locale={safeLocale}
                icon={MapPin}
                label={t("location")}
                value={location}
                khmerValue={isKhmer}
              />
            ) : null}
          </div>
        </DashboardCard>

        <DashboardCard className="min-w-0 p-4 md:p-5">
          <ProfileForm
            locale={safeLocale}
            profile={{
              fullName: profile?.fullName ?? "",

              headlineEn: profile?.headlineEn ?? "",

              headlineKm: profile?.headlineKm ?? "",

              shortBioEn: profile?.shortBioEn ?? "",

              shortBioKm: profile?.shortBioKm ?? "",

              bioEn: profile?.bioEn ?? "",

              bioKm: profile?.bioKm ?? "",

              currentRoleEn: profile?.currentRoleEn ?? "",

              currentRoleKm: profile?.currentRoleKm ?? "",

              currentFocusEn: profile?.currentFocusEn ?? "",

              currentFocusKm: profile?.currentFocusKm ?? "",

              yearsExperience: profile?.yearsExperience ?? 0,

              email: profile?.email ?? "",

              phone: profile?.phone ?? "",

              telegram: profile?.telegram ?? "",

              github: profile?.github ?? "",

              linkedin: profile?.linkedin ?? "",

              facebook: profile?.facebook ?? "",

              instagram: profile?.instagram ?? "",

              youtube: profile?.youtube ?? "",

              locationEn: profile?.locationEn ?? "",

              locationKm: profile?.locationKm ?? "",

              profileImage: profile?.profileImage ?? "",

              badgeImage: profile?.badgeImage ?? "",

              cvFile: profile?.cvFile ?? "",
            }}
          />
        </DashboardCard>
      </div>
    </div>
  );
}

type SummaryItemProps = {
  locale: string;

  icon: LucideIcon;

  label: string;

  value: string;

  numeric?: boolean;

  khmerValue?: boolean;
};

function SummaryItem({
  locale,
  icon: Icon,
  label,
  value,
  numeric = false,
  khmerValue = false,
}: SummaryItemProps) {
  const isKhmer = locale === "km";

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-700 dark:text-violet-300">
        <Icon size={15} strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <p
          className={cn(
            "font-body text-[var(--foreground-muted)]",

            isKhmer
              ? "text-[11px] font-normal leading-5"
              : "text-[10px] font-medium uppercase tracking-[0.08em]",
          )}
        >
          {label}
        </p>

        <p
          className={cn(
            numeric
              ? "font-number"
              : khmerValue
                ? "khmer-input-value"
                : "font-body",

            "mt-0.5 truncate text-[13px] font-normal text-[var(--foreground)]",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
