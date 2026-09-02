import { ArrowLeft } from "lucide-react";

import PublicProjectCard from "@/components/portfolio/PublicProjectCard";

import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";

import type { PublicActivity } from "@/types/publicPortfolio";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  const khmer = safeLocale === "km";

  /* =====================================================
     LOAD PROJECTS
     ===================================================== */

  const records = await prisma.activity.findMany({
    where: {
      type: "PROJECT",
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

    /*
     * Load real approved comments
     * and real like/comment counts.
     */
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

  /* =====================================================
     SERIALIZE PROJECTS
     ===================================================== */

  const projects = records.map((item) => ({
    id: item.id,

    slug: item.slug,

    type: item.type,

    titleEn: item.titleEn,

    titleKm: item.titleKm,

    summaryEn: item.summaryEn,

    summaryKm: item.summaryKm,

    descriptionEn: item.descriptionEn,

    descriptionKm: item.descriptionKm,

    activityDate: item.activityDate.toISOString(),

    endDate: item.endDate ? item.endDate.toISOString() : null,

    datePrecision: item.datePrecision,

    isCurrent: item.isCurrent,

    coverImage: item.coverImage,

    locationEn: item.locationEn,

    locationKm: item.locationKm,

    organizationEn: item.organizationEn,

    organizationKm: item.organizationKm,

    externalUrl: item.externalUrl,

    githubUrl: item.githubUrl,

    demoUrl: item.demoUrl,

    credentialId: item.credentialId,

    technologies: item.technologies,

    featured: item.featured,

    published: item.published,

    sortOrder: item.sortOrder,

    /* =================================================
         REAL ENGAGEMENT DATA
         ================================================= */

    likeCount: item._count.likes,

    commentCount: item._count.comments,

    comments: item.comments.map((comment) => ({
      id: comment.id,

      name: comment.name,

      message: comment.message,

      createdAt: comment.createdAt.toISOString(),
    })),
  })) satisfies PublicActivity[];

  /* =====================================================
     PAGE
     ===================================================== */

  return (
    <main className="portfolio-site min-h-screen overflow-x-clip">
      <section className="portfolio-section pt-28">
        {/* ===============================================
            BACK
           =============================================== */}

        <Link
          href="/#projects"
          className="font-body inline-flex items-center gap-2 text-[11px] font-semibold text-[var(--portfolio-muted)] transition duration-200 hover:text-[var(--portfolio-cyan)]"
        >
          <ArrowLeft size={14} />

          {khmer ? "ត្រឡប់ទៅ Portfolio" : "Back to Portfolio"}
        </Link>

        {/* ===============================================
            HEADER
           =============================================== */}

        <div className="mt-8">
          <p className="font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--portfolio-cyan)]">
            {khmer ? "ស្នាដៃរបស់ខ្ញុំ" : "MY WORK"}
          </p>

          <h1
            className={
              khmer
                ? "khmer-input-value mt-3 text-[36px] font-normal leading-[1.35] text-[var(--portfolio-text)] md:text-[48px]"
                : "font-display mt-3 text-[48px] leading-none text-[var(--portfolio-text)] md:text-[64px]"
            }
          >
            {khmer ? "គម្រោងទាំងអស់" : "All Projects"}
          </h1>

          <p
            className={
              khmer
                ? "khmer-input-value mt-4 max-w-2xl text-[12px] font-normal leading-7 text-[var(--portfolio-muted)]"
                : "font-body mt-4 max-w-2xl text-[12px] leading-6 text-[var(--portfolio-muted)]"
            }
          >
            {khmer
              ? "មើលគម្រោងដែលខ្ញុំបានអភិវឌ្ឍ និងចូលរួម រួមមានគម្រោងលេចធ្លោ និងគម្រោងផ្សេងៗទៀត។"
              : "Explore all of my published projects, including featured work and additional case studies."}
          </p>
        </div>

        {/* ===============================================
            PROJECT GRID
           =============================================== */}

        {projects.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <PublicProjectCard
                key={project.id}
                item={project}
                locale={safeLocale}
              />
            ))}
          </div>
        ) : (
          <div className="portfolio-panel mt-10 p-6">
            <p
              className={
                khmer
                  ? "khmer-input-value text-[12px] font-normal leading-6 text-[var(--portfolio-muted)]"
                  : "font-body text-[12px] text-[var(--portfolio-muted)]"
              }
            >
              {khmer
                ? "មិនទាន់មានគម្រោងសាធារណៈ។"
                : "No published projects yet."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
