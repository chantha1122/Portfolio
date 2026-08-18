import ActivityManager from "@/components/dashboard/ActivityManager";

import { prisma } from "@/lib/db";

import { serializeActivities } from "@/lib/serializeActivity";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ActivitiesPage({ params }: Props) {
  const { locale } = await params;

  const items = await prisma.activity.findMany({
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
    <ActivityManager
      locale={locale === "km" ? "km" : "en"}
      items={serializeActivities(items)}
      title={locale === "km" ? "គ្រប់គ្រងសកម្មភាព" : "Activity Management"}
      description={
        locale === "km"
          ? "គ្រប់គ្រងប្រវត្តិការងារ សកម្មភាព ព្រឹត្តិការណ៍ ការបង្រៀន និងមាតិកាផ្សេងៗរបស់អ្នក។"
          : "Manage your work history, activities, events, teaching and other portfolio content."
      }
    />
  );
}
