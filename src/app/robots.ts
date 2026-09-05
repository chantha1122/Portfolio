import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/en/dashboard/",
          "/km/dashboard/",
          "/en/login",
          "/km/login",
        ],
      },
    ],

    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
