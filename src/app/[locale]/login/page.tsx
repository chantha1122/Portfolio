import { redirect } from "next/navigation";

import { auth } from "@/auth";

import GlassPanel from "@/components/ui/GlassPanel";

import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";

import LoginForm from "@/components/auth/LoginForm";

type LoginPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;

  const session = await auth();

  if (session?.user) {
    redirect(`/${locale}/dashboard`);
  }

  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-5 py-20 text-[var(--foreground)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-violet-500/15 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[10%] right-[10%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[120px]"
      />

      <div className="absolute right-5 top-5 flex gap-2">
        <LanguageSwitcher />

        <ThemeSwitcher />
      </div>

      <GlassPanel
        glow="primary"
        className="relative w-full max-w-md p-7 md:p-9"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 font-display text-2xl text-white">
            C
          </div>

          <p className="font-display text-4xl">CHANTHA</p>

          <p className="font-body mt-2 text-[var(--foreground-muted)]">
            Portfolio Dashboard
          </p>
        </div>

        <LoginForm locale={safeLocale} />

        <a
          href={`/${locale}`}
          className="font-body mt-6 block text-center text-sm text-[var(--foreground-muted)] transition hover:text-[var(--foreground)]"
        >
          ← Back to portfolio
        </a>
      </GlassPanel>
    </main>
  );
}
