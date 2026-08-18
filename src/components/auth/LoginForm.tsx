"use client";

import { useActionState } from "react";

import { useTranslations } from "next-intl";

import { loginAction, type LoginState } from "@/actions/auth";

type LoginFormProps = {
  locale: "en" | "km";
};

const initialState: LoginState = {
  error: null,
};

export default function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations("Login");

  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />

      <div>
        <label
          htmlFor="email"
          className="font-body mb-2 block text-sm font-bold"
        >
          {t("email")}
        </label>

        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          className="font-body w-full rounded-2xl border border-black/10 bg-black/[0.025] px-4 py-3.5 outline-none transition focus:border-violet-500 dark:border-white/10 dark:bg-white/[0.04]"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="font-body mb-2 block text-sm font-bold"
        >
          {t("password")}
        </label>

        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder={t("passwordPlaceholder")}
          className="font-body w-full rounded-2xl border border-black/10 bg-black/[0.025] px-4 py-3.5 outline-none transition focus:border-violet-500 dark:border-white/10 dark:bg-white/[0.04]"
        />
      </div>

      {state.error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="font-body text-sm text-red-600 dark:text-red-300">
            {state.error === "missing"
              ? t("missingFields")
              : t("invalidCredentials")}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="font-body w-full rounded-2xl bg-[var(--foreground)] px-5 py-3.5 font-bold text-[var(--background)] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? t("signingIn") : t("signIn")}
      </button>
    </form>
  );
}
