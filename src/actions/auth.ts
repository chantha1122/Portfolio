"use server";

import { headers } from "next/headers";

import { AuthError } from "next-auth";

import { z } from "zod";

import { signIn } from "@/auth";

import { isLoginRateLimited } from "@/lib/login-rate-limit";

export type LoginState = {
  error: "invalid" | "missing" | "rate_limited" | null;
};

const loginSchema = z.object({
  email: z.string().trim().email(),

  password: z.string().min(1),

  locale: z.enum(["en", "km"]),
});

export async function loginAction(
  _previousState: LoginState,

  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),

    password: formData.get("password"),

    locale: formData.get("locale"),
  });

  if (!parsed.success) {
    return {
      error: "missing",
    };
  }

  const { email, password, locale } = parsed.data;

  const normalizedEmail = email.trim().toLowerCase();

  const requestHeaders = await headers();

  /* =====================================================
     FRIENDLY PRE-CHECK
     ===================================================== */

  const blockedBeforeLogin = await isLoginRateLimited(
    normalizedEmail,
    requestHeaders,
  );

  if (blockedBeforeLogin) {
    return {
      error: "rate_limited",
    };
  }

  try {
    await signIn("credentials", {
      email: normalizedEmail,

      password,

      redirectTo: `/${locale}/dashboard`,
    });

    return {
      error: null,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      /*
       * authorize() may just have recorded the
       * attempt that reached the limit.
       *
       * Check one more time so attempt #5 can
       * immediately show the rate-limit message.
       */
      const blockedAfterLogin = await isLoginRateLimited(
        normalizedEmail,
        requestHeaders,
      );

      return {
        error: blockedAfterLogin ? "rate_limited" : "invalid",
      };
    }

    /*
     * Auth.js redirects successful login
     * using a framework redirect exception.
     *
     * We must allow that exception through.
     */
    throw error;
  }
}
