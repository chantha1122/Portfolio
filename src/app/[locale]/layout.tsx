import type { Metadata } from "next";

import { hasLocale, NextIntlClientProvider } from "next-intl";

import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { routing } from "@/i18n/routing";

import { anton, gupter, odorMeanChey } from "../fonts";

import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Chantha Portfolio",
    template: "%s | Chantha Portfolio",
  },

  description:
    "Personal portfolio, projects, activities, achievements and journey of Chantha.",
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
