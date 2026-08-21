import SpecializedContentManager from "@/components/dashboard/SpecializedContentManager";

import { prisma } from "@/lib/db";

import { serializeActivities } from "@/lib/serializeActivity";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ActivitiesPage({ params }: Props) {
  const { locale } = await params;

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  const items = await prisma.activity.findMany({
    where: {
      type: {
        in: ["EVENT", "COMPETITION", "OTHER"],
      },
    },

    orderBy: [
      {
        activityDate: "desc",
      },

      {
        sortOrder: "asc",
      },
    ],
  });

  return (
    <SpecializedContentManager
      locale={safeLocale}
      kind="activity"
      items={serializeActivities(items)}
    />
  );
}
