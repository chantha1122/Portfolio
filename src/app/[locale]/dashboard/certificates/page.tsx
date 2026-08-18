import ActivityManager from "@/components/dashboard/ActivityManager";

import { prisma } from "@/lib/db";

import { serializeActivities } from "@/lib/serializeActivity";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function CertificatesPage({ params }: Props) {
  const { locale } = await params;

  const items = await prisma.activity.findMany({
    where: {
      type: "CERTIFICATE",
    },

    orderBy: {
      activityDate: "desc",
    },
  });

  return (
    <ActivityManager
      locale={locale === "km" ? "km" : "en"}
      items={serializeActivities(items)}
      lockedType="CERTIFICATE"
      title={locale === "km" ? "វិញ្ញាបនបត្រ" : "Certificates"}
      description={
        locale === "km"
          ? "គ្រប់គ្រងវិញ្ញាបនបត្រ ស្ថាប័នចេញវិញ្ញាបនបត្រ និងព័ត៌មានសម្គាល់។"
          : "Manage certificates, issuers, dates and credential information."
      }
    />
  );
}
