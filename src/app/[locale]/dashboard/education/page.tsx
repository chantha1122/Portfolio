import EducationManager from "@/components/dashboard/EducationManager";

import { prisma } from "@/lib/db";

import { serializeActivities } from "@/lib/serializeActivity";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function EducationPage({ params }: Props) {
  const { locale } = await params;

  const safeLocale = locale === "km" ? "km" : "en";

  const items = await prisma.activity.findMany({
    where: {
      type: "EDUCATION",
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
  });

  return (
    <EducationManager locale={safeLocale} items={serializeActivities(items)} />
  );
}
