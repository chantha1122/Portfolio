import type { Metadata } from "next";

import { cookies } from "next/headers";

import NotFoundView from "@/components/portfolio/NotFoundView";

import { anton, gupter, odorMeanChey } from "./fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "404 | Chantha Portfolio",

  description: "The requested page could not be found.",

  robots: {
    index: false,
    follow: false,
  },
};

export default async function GlobalNotFound() {
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
    <html lang="en" className={htmlClassName}>
      <body>
        <NotFoundView locale="en" homeHref="/en" projectsHref="/en/projects" />
      </body>
    </html>
  );
}
