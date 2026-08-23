import TeachingManager from "@/components/dashboard/TeachingManager";

import TeachingVisibilityToggle from "@/components/dashboard/TeachingVisibilityToggle";

import { prisma } from "@/lib/db";

import { serializeActivities } from "@/lib/serializeActivity";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function TeachingPage({ params }: Props) {
  const { locale } = await params;

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  const [items, profile] = await Promise.all([
    prisma.activity.findMany({
      where: {
        type: "TEACHING",
      },

      orderBy: [
        {
          isCurrent: "desc",
        },

        {
          activityDate: "desc",
        },

        {
          sortOrder: "asc",
        },
      ],
    }),

    prisma.profile.findUnique({
      where: {
        profileKey: "main",
      },

      select: {
        showTeachingSection: true,
      },
    }),
  ]);

  return (
    <div className="space-y-5">
      <TeachingVisibilityToggle
        locale={safeLocale}
        initialVisible={profile?.showTeachingSection ?? false}
      />

      <TeachingManager locale={safeLocale} items={serializeActivities(items)} />
    </div>
  );
}
