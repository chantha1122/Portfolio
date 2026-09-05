export const SITE_NAME = "Chantha Portfolio";

export const SITE_DESCRIPTION =
  "Personal portfolio of Chay Chantha featuring software development, AI, projects, achievements, certificates and professional journey.";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}
