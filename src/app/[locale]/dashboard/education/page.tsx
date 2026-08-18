import ActivityManager from "@/components/dashboard/ActivityManager";

import { prisma } from "@/lib/db";

import { serializeActivities } from "@/lib/serializeActivity";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function EducationPage({ params }: Props) {
  const { locale } = await params;

  const items = await prisma.activity.findMany({
    where: {
      type: "EDUCATION",
    },

    orderBy: {
      activityDate: "desc",
    },
  });

  return (
    <ActivityManager
      locale={locale === "km" ? "km" : "en"}
      items={serializeActivities(items)}
      lockedType="EDUCATION"
      title={locale === "km" ? "ការអប់រំ" : "Education"}
      description={
        locale === "km"
          ? "គ្រប់គ្រងសញ្ញាបត្រ កម្មវិធីសិក្សា សាកលវិទ្យាល័យ និងរយៈពេលសិក្សា។"
          : "Manage degrees, programs, universities and education history."
      }
    />
  );
}
