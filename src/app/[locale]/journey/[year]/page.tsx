import { notFound } from "next/navigation";

import PublicNavbar from "@/components/layout/PublicNavbar";

import JourneySection from "@/components/portfolio/JourneySection";

import { prisma } from "@/lib/db";

import type { PublicActivity } from "@/types/publicPortfolio";

/* =========================================================
   TYPES
   ========================================================= */

type Props = {
  params: Promise<{
    locale: string;
    year: string;
  }>;

  searchParams: Promise<{
    type?: string | string[];
  }>;
};

/* =========================================================
   ALLOWED JOURNEY TYPES
   ========================================================= */

const ALLOWED_TYPES = [
  "PROJECT",
  "WORK",
  "CERTIFICATE",
  "EDUCATION",
  "TEACHING",
  "ACHIEVEMENT",
  "COMPETITION",
  "EVENT",
  "OTHER",
];

/* =========================================================
   PAGE
   ========================================================= */

export default async function JourneyYearPage({ params, searchParams }: Props) {
  const { locale, year } = await params;

  const query = await searchParams;

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  /* =======================================================
     VALIDATE YEAR
     ======================================================= */

  if (!/^\d{4}$/.test(year)) {
    notFound();
  }

  const yearNumber = Number(year);

  if (yearNumber < 1900 || yearNumber > 2200) {
    notFound();
  }

  /* =======================================================
     YEAR RANGE
     ======================================================= */

  /*
   * We use noon boundaries because your Activity form
   * already stores dates around the middle of the day.
   */
  const startDate = new Date(`${year}-01-01T00:00:00.000Z`);

  const nextYear = String(yearNumber + 1);

  const endDate = new Date(`${nextYear}-01-01T00:00:00.000Z`);

  /* =======================================================
     LOAD ACTIVITIES
     ======================================================= */

  const activityRecords = await prisma.activity.findMany({
    where: {
      published: true,

      activityDate: {
        gte: startDate,

        lt: endDate,
      },

      type: {
        not: "PHOTO",
      },
    },

    orderBy: [
      {
        activityDate: "desc",
      },

      {
        sortOrder: "asc",
      },

      {
        id: "desc",
      },
    ],

    include: {
      comments: {
        where: {
          isApproved: true,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 10,

        select: {
          id: true,

          name: true,

          message: true,

          createdAt: true,
        },
      },

      _count: {
        select: {
          likes: true,

          comments: {
            where: {
              isApproved: true,
            },
          },
        },
      },
    },
  });

  /* =======================================================
     SERIALIZE
     ======================================================= */

  const activities: PublicActivity[] = activityRecords.map((activity) => ({
    id: activity.id,

    slug: activity.slug,

    type: activity.type,

    titleEn: activity.titleEn,

    titleKm: activity.titleKm,

    summaryEn: activity.summaryEn,

    summaryKm: activity.summaryKm,

    descriptionEn: activity.descriptionEn,

    descriptionKm: activity.descriptionKm,

    activityDate: activity.activityDate.toISOString(),

    endDate: activity.endDate?.toISOString() ?? null,

    datePrecision: activity.datePrecision,

    isCurrent: activity.isCurrent,

    coverImage: activity.coverImage,

    locationEn: activity.locationEn,

    locationKm: activity.locationKm,

    organizationEn: activity.organizationEn,

    organizationKm: activity.organizationKm,

    externalUrl: activity.externalUrl,

    githubUrl: activity.githubUrl,

    demoUrl: activity.demoUrl,

    credentialId: activity.credentialId,

    technologies: activity.technologies,

    featured: activity.featured,

    likeCount: activity._count.likes,

    commentCount: activity._count.comments,

    comments: activity.comments.map((comment) => ({
      id: comment.id,

      name: comment.name,

      message: comment.message,

      createdAt: comment.createdAt.toISOString(),
    })),
  }));

  /* =======================================================
     INITIAL FILTER
     ======================================================= */

  const rawType = Array.isArray(query.type) ? query.type[0] : query.type;

  const initialCategory =
    rawType &&
    ALLOWED_TYPES.includes(rawType) &&
    activities.some((activity) => activity.type === rawType)
      ? rawType
      : "ALL";

  return (
    <main className="portfolio-site relative min-h-screen overflow-x-hidden">
      <PublicNavbar locale={safeLocale} />

      <JourneySection
        locale={safeLocale}
        activities={activities}
        fixedYear={year}
        initialCategory={initialCategory}
        maxVisible={null}
        archiveMode
      />

      <footer className="border-t border-[var(--portfolio-border)] px-5 py-8">
        <div className="mx-auto max-w-[1240px]">
          <p className="font-body text-center text-[10px] text-[var(--portfolio-muted)]">
            {safeLocale === "km"
              ? `បណ្ណសារដំណើរឆ្នាំ ${year}`
              : `${year} Journey Archive`}
          </p>
        </div>
      </footer>
    </main>
  );
}
