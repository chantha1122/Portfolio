import ActivityManager from "@/components/dashboard/ActivityManager";
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
    where: { type: "PHOTO" },
    orderBy: [{ activityDate: "desc" }, { sortOrder: "asc" }],
  });

  return (
    <ActivityManager
      locale={safeLocale}
      items={serializeActivities(items)}
      lockedType="PHOTO"
      title={safeLocale === "km" ? "វិចិត្រសាល" : "Gallery"}
      description={
        safeLocale === "km"
          ? "គ្រប់គ្រងរូបភាព សកម្មភាព និងមេឌៀដែលអ្នកចង់បង្ហាញនៅលើគេហទំព័រ។"
          : "Manage photos, moments and media that you want to show on your public portfolio."
      }
    />
  );
}
