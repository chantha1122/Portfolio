import ActivityManager from "@/components/dashboard/ActivityManager";

import { prisma } from "@/lib/db";

import { serializeActivities } from "@/lib/serializeActivity";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function TeachingPage({ params }: Props) {
  const { locale } = await params;

  const items = await prisma.activity.findMany({
    where: {
      type: "TEACHING",
    },

    orderBy: {
      activityDate: "desc",
    },
  });

  return (
    <ActivityManager
      locale={locale === "km" ? "km" : "en"}
      items={serializeActivities(items)}
      lockedType="TEACHING"
      title={locale === "km" ? "ការបង្រៀន និងណែនាំ" : "Teaching & Mentoring"}
      description={
        locale === "km"
          ? "បង្ហាញវគ្គបង្រៀន ការបណ្តុះបណ្តាល សិស្ស និងប្រធានបទដែលអ្នកបានបង្រៀន។"
          : "Show your courses, workshops, mentoring and topics you have taught."
      }
    />
  );
}
