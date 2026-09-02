import AchievementsManager from "@/components/dashboard/AchievementsManager";

import { prisma } from "@/lib/db";
import { serializeActivities } from "@/lib/serializeActivity";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function AchievementsPage({ params }: Props) {
  const { locale } = await params;

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  const items = await prisma.activity.findMany({
    where: {
      type: "ACHIEVEMENT",
    },

    orderBy: [
      {
        featured: "desc",
      },

      {
        activityDate: "desc",
      },

      {
        sortOrder: "asc",
      },
    ],
  });

  return (
    <AchievementsManager
      locale={safeLocale}
      items={serializeActivities(items)}
    />
  );
}
