import HeroSection from "@/components/portfolio/HeroSection";

import PortfolioPreviewSections from "@/components/portfolio/PortfolioPreviewSections";

import PublicNavbar from "@/components/layout/PublicNavbar";

import { prisma } from "@/lib/db";

import PortfolioMotion from "@/components/animations/PortfolioMotion";

import type {
  PublicActivity,
  PublicProfile,
  PublicSkill,
  PublicTool,
} from "@/types/publicPortfolio";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  const [profileRecord, activityRecords, skillRecords, toolRecords] =
    await Promise.all([
      /* ===============================================
         PROFILE
         =============================================== */

      prisma.profile.findUnique({
        where: {
          profileKey: "main",
        },
      }),

      /* ===============================================
         ACTIVITIES
         =============================================== */

      prisma.activity.findMany({
        where: {
          published: true,
        },

        orderBy: [
          {
            featured: "desc",
          },

          {
            activityDate: "desc",
          },

          {
            sortOrder: "asc",
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
      }),

      /* ===============================================
         SKILLS
         =============================================== */

      prisma.skill.findMany({
        where: {
          published: true,
        },

        orderBy: [
          {
            sortOrder: "asc",
          },

          {
            name: "asc",
          },
        ],
      }),

      /* ===============================================
         TOOLS
         =============================================== */

      prisma.tool.findMany({
        where: {
          published: true,
        },

        orderBy: [
          {
            sortOrder: "asc",
          },

          {
            name: "asc",
          },
        ],
      }),
    ]);

  /* =====================================================
     PROFILE
     ===================================================== */

  const profile: PublicProfile = profileRecord
    ? {
        fullName: profileRecord.fullName,

        headlineEn: profileRecord.headlineEn,

        headlineKm: profileRecord.headlineKm,

        shortBioEn: profileRecord.shortBioEn,

        shortBioKm: profileRecord.shortBioKm,

        bioEn: profileRecord.bioEn,

        bioKm: profileRecord.bioKm,

        currentRoleEn: profileRecord.currentRoleEn,

        currentRoleKm: profileRecord.currentRoleKm,

        currentFocusEn: profileRecord.currentFocusEn,

        currentFocusKm: profileRecord.currentFocusKm,

        yearsExperience: profileRecord.yearsExperience,

        email: profileRecord.email,

        phone: profileRecord.phone,

        telegram: profileRecord.telegram,

        github: profileRecord.github,

        githubUsername: profileRecord.githubUsername,

        githubContributionImage: profileRecord.githubContributionImage,

        linkedin: profileRecord.linkedin,

        facebook: profileRecord.facebook,

        instagram: profileRecord.instagram,

        youtube: profileRecord.youtube,

        locationEn: profileRecord.locationEn,

        locationKm: profileRecord.locationKm,

        profileImage: profileRecord.profileImage,

        badgeImage: profileRecord.badgeImage,

        cvFile: profileRecord.cvFile,

        showTeachingSection: profileRecord.showTeachingSection,
      }
    : {
        fullName: "Chay Chantha",

        headlineEn: "Developer • Creator • Learner",

        headlineKm: null,

        shortBioEn:
          "A growing portfolio of projects, learning, teaching and practical technology work.",

        shortBioKm: null,

        bioEn: null,

        bioKm: null,

        currentRoleEn: "Software & AI Enthusiast",

        currentRoleKm: null,

        currentFocusEn:
          "Building useful digital products and practical AI experiences.",

        currentFocusKm: null,

        yearsExperience: 0,

        email: null,

        phone: null,

        telegram: null,

        github: null,

        githubUsername: null,

        githubContributionImage: null,

        linkedin: null,

        facebook: null,

        instagram: null,

        youtube: null,

        locationEn: null,

        locationKm: null,

        profileImage: null,

        badgeImage: "/images/profile-badge.png",

        cvFile: null,

        showTeachingSection: false,
      };

  /* =====================================================
     ACTIVITIES
     ===================================================== */

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

  /* =====================================================
     SKILLS
     ===================================================== */

  const skills: PublicSkill[] = skillRecords.map((skill) => ({
    id: skill.id,

    name: skill.name,

    categoryEn: skill.categoryEn,

    categoryKm: skill.categoryKm,

    level: skill.level,

    icon: skill.icon,

    /*
     * NEW
     */
    isCore: skill.isCore,
  }));

  /* =====================================================
     TOOLS
     ===================================================== */

  const tools: PublicTool[] = toolRecords.map((tool) => ({
    id: tool.id,

    name: tool.name,

    category: tool.category,

    icon: tool.icon,

    url: tool.url,
  }));

  /* =====================================================
     PROJECT COUNT
     ===================================================== */

  const projectCount = activities.filter(
    (activity) => activity.type === "PROJECT",
  ).length;

  return (
    <main className="portfolio-site relative min-h-screen overflow-x-clip">
      <PortfolioMotion />

      <PublicNavbar locale={safeLocale} />

      <HeroSection
        locale={safeLocale}
        profile={profile}
        projectCount={projectCount}
        activityCount={activities.length}
      />

      <PortfolioPreviewSections
        locale={safeLocale}
        profile={profile}
        skills={skills}
        tools={tools}
        activities={activities}
      />

      <footer className="border-t border-[var(--portfolio-border)] px-5 py-8">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="font-body text-[11px] text-[var(--portfolio-muted)]">
            © 2026 {profile.fullName}. All rights reserved.
          </p>

          <p className="font-body text-[10px] text-[var(--portfolio-muted)]">
            Next.js • TypeScript • PostgreSQL
          </p>
        </div>
      </footer>
    </main>
  );
}
