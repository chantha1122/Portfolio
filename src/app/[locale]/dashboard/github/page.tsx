import { Code2 } from "lucide-react";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

import GitHubActivityForm from "@/components/dashboard/GitHubActivityForm";

import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function GitHubActivityPage({ params }: Props) {
  const { locale } = await params;

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  const khmer = safeLocale === "km";

  const session = await auth();

  if (!session?.user) {
    redirect(`/${safeLocale}/login`);
  }

  const profile = await prisma.profile.findUnique({
    where: {
      profileKey: "main",
    },

    select: {
      github: true,

      githubUsername: true,

      githubContributionImage: true,
    },
  });

  return (
    <div className="mx-auto w-full max-w-[1240px] pb-8">
      {/* HEADER */}

      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
            <Code2 size={15} />
          </span>

          <p
            className={
              khmer
                ? "khmer-input-value text-[12px] font-normal text-violet-600 dark:text-violet-300"
                : "font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-300"
            }
          >
            GitHub
          </p>
        </div>

        <h1
          className={
            khmer
              ? "khmer-input-value mt-3 text-[26px] font-normal leading-10 text-slate-950 dark:text-white"
              : "font-body mt-3 text-[28px] font-semibold text-slate-950 dark:text-white"
          }
        >
          {khmer ? "សកម្មភាព GitHub" : "GitHub Activity"}
        </h1>

        <p
          className={
            khmer
              ? "khmer-input-value mt-1 text-[12px] font-normal leading-6 text-slate-500 dark:text-white/45"
              : "font-body mt-1 text-[13px] text-slate-500 dark:text-white/45"
          }
        >
          {khmer
            ? "បង្ហោះ និងជំនួស Screenshot នៃ GitHub contribution graph ដែលបង្ហាញនៅលើ Portfolio របស់អ្នក។"
            : "Upload or replace the GitHub contribution screenshot displayed on your public portfolio."}
        </p>
      </div>

      <GitHubActivityForm
        locale={safeLocale}
        githubUsername={profile?.githubUsername ?? null}
        githubUrl={profile?.github ?? null}
        contributionImage={profile?.githubContributionImage ?? null}
      />
    </div>
  );
}
