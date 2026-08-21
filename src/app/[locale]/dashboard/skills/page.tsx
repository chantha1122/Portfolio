import SkillsToolsManager from "@/components/dashboard/SkillsToolsManager";

import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function SkillsPage({ params }: Props) {
  const { locale } = await params;

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  const [skills, tools] = await Promise.all([
    prisma.skill.findMany({
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          name: "asc",
        },
      ],

      select: {
        id: true,

        name: true,

        categoryEn: true,

        categoryKm: true,

        level: true,

        icon: true,

        /*
         * NEW
         */
        isCore: true,

        published: true,

        sortOrder: true,
      },
    }),

    prisma.tool.findMany({
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          name: "asc",
        },
      ],

      select: {
        id: true,

        name: true,

        category: true,

        icon: true,

        url: true,

        published: true,

        sortOrder: true,
      },
    }),
  ]);

  return (
    <SkillsToolsManager locale={safeLocale} skills={skills} tools={tools} />
  );
}
