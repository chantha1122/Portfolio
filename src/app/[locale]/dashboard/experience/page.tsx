import ActivityManager from "@/components/dashboard/ActivityManager";

import { prisma } from "@/lib/db";

import { serializeActivities } from "@/lib/serializeActivity";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;

  const items = await prisma.activity.findMany({
    where: {
      type: "WORK",
    },

    orderBy: {
      activityDate: "desc",
    },
  });

  return (
    <ActivityManager
      locale={locale === "km" ? "km" : "en"}
      items={serializeActivities(items)}
      lockedType="WORK"
      title={locale === "km" ? "បទពិសោធន៍" : "Experience"}
      description={
        locale === "km"
          ? "គ្រប់គ្រងបទពិសោធន៍ការងារ តួនាទី ស្ថាប័ន និងរយៈពេលការងារ។"
          : "Manage your work experience, roles, organizations and employment periods."
      }
    />
  );
}
