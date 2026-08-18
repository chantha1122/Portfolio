import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "km"],

  defaultLocale: "en",

  localePrefix: "always",
});
