import ExperienceManager from "@/components/dashboard/ExperienceManager";

import { prisma } from "@/lib/db";

import { serializeActivities } from "@/lib/serializeActivity";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  const items = await prisma.activity.findMany({
    where: {
      /*
       * Experience only.
       */
      type: "WORK",
    },

    orderBy: [
      /*
       * Current job first.
       */
      {
        isCurrent: "desc",
      },

      /*
       * Then newest experience.
       */
      {
        activityDate: "desc",
      },

      {
        sortOrder: "asc",
      },
    ],
  });

  return (
    <ExperienceManager locale={safeLocale} items={serializeActivities(items)} />
  );
}
