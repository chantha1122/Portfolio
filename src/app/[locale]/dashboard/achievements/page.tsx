import ActivityManager from "@/components/dashboard/ActivityManager";

import { prisma } from "@/lib/db";

import { serializeActivities } from "@/lib/serializeActivity";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function AchievementsPage({ params }: Props) {
  const { locale } = await params;

  const items = await prisma.activity.findMany({
    where: {
      type: "ACHIEVEMENT",
    },

    orderBy: {
      activityDate: "desc",
    },
  });

  return (
    <ActivityManager
      locale={locale === "km" ? "km" : "en"}
      items={serializeActivities(items)}
      lockedType="ACHIEVEMENT"
      title={locale === "km" ? "សមិទ្ធផល" : "Achievements"}
      description={
        locale === "km"
          ? "បន្ថែមពានរង្វាន់ ជ័យលាភី និងសមិទ្ធផលសំខាន់ៗរបស់អ្នក។"
          : "Add awards, competition results and important achievements."
      }
    />
  );
}
