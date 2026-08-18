import ActivityManager from "@/components/dashboard/ActivityManager";

import { prisma } from "@/lib/db";

import { serializeActivities } from "@/lib/serializeActivity";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;

  const items = await prisma.activity.findMany({
    where: {
      type: "PROJECT",
    },

    orderBy: [
      {
        featured: "desc",
      },
      {
        activityDate: "desc",
      },
    ],
  });

  return (
    <ActivityManager
      locale={locale === "km" ? "km" : "en"}
      items={serializeActivities(items)}
      lockedType="PROJECT"
      title={locale === "km" ? "គម្រោង" : "Projects"}
      description={
        locale === "km"
          ? "បន្ថែម និងគ្រប់គ្រងគម្រោងដែលអ្នកចង់បង្ហាញនៅក្នុងផលប័ត្រ។"
          : "Add and manage the projects you want to showcase in your portfolio."
      }
    />
  );
}
