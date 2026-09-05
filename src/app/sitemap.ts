import type { MetadataRoute } from "next";

import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const projects = await prisma.activity.findMany({
    where: {
      type: "PROJECT",
      published: true,
    },

    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: `${siteUrl}/km`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: `${siteUrl}/en/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${siteUrl}/km/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.flatMap((project) => [
    {
      url: `${siteUrl}/en/projects/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },

    {
      url: `${siteUrl}/km/projects/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ]);

  return [...staticPages, ...projectPages];
}
