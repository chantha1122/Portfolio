"use client";

import { useLocale } from "next-intl";

import NotFoundView from "@/components/portfolio/NotFoundView";

export default function LocaleNotFound() {
  const locale = useLocale();

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  return (
    <NotFoundView
      locale={safeLocale}
      homeHref={`/${safeLocale}`}
      projectsHref={`/${safeLocale}/projects`}
    />
  );
}
