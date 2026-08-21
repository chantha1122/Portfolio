import GalleryManager from "@/components/dashboard/GalleryManager";

import { prisma } from "@/lib/db";

import { serializeActivities } from "@/lib/serializeActivity";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  const items = await prisma.activity.findMany({
    where: {
      type: "PHOTO",
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
    <GalleryManager locale={safeLocale} items={serializeActivities(items)} />
  );
}
