"use server";

import { AuthError } from "next-auth";

import { z } from "zod";

import { signIn } from "@/auth";

export type LoginState = {
  error: "invalid" | "missing" | null;
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

  try {
    await signIn("credentials", {
      email,
      password,

      redirectTo: `/${locale}/dashboard`,
    });

    return {
      error: null,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "invalid",
      };
    }

    throw error;
  }
}
