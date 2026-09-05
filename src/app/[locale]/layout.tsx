import type { Metadata } from "next";

import { hasLocale, NextIntlClientProvider } from "next-intl";

import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { routing } from "@/i18n/routing";

import { anton, gupter, odorMeanChey } from "../fonts";

import "../globals.css";

import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),

  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,

  applicationName: SITE_NAME,

  authors: [
    {
      name: "Chay Chantha",
    },
  ],

  creator: "Chay Chantha",

  openGraph: {
    type: "website",

    title: SITE_NAME,

    description: SITE_DESCRIPTION,

    siteName: SITE_NAME,
  },

  twitter: {
    card: "summary_large_image",

    title: SITE_NAME,

    description: SITE_DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
  },
};

type Props = {
  children: React.ReactNode;

  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const cookieStore = await cookies();

  const savedTheme = cookieStore.get("chantha-theme")?.value;

  const theme = savedTheme === "light" ? "light" : "dark";

  const fontVariables = [
    anton.variable,
    gupter.variable,
    odorMeanChey.variable,
  ].join(" ");

  const htmlClassName =
    theme === "dark" ? `dark ${fontVariables}` : fontVariables;

  return (
    <html lang={locale} className={htmlClassName}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
