import NextAuth from "next-auth";

import Credentials from "next-auth/providers/credentials";

import { compare } from "bcryptjs";

import { z } from "zod";

import { prisma } from "@/lib/db";

import {
  clearLoginFailures,
  isLoginRateLimited,
  recordLoginFailure,
} from "@/lib/login-rate-limit";

const loginSchema = z.object({
  email: z.string().trim().email(),

  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  /* =====================================================
     SESSION
     ===================================================== */

  session: {
    strategy: "jwt",

    /*
     * Your existing session duration:
     * 8 hours.
     */
    maxAge: 60 * 60 * 8,
  },

  /* =====================================================
     PROVIDERS
     ===================================================== */

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",

          type: "email",
        },

        password: {
          label: "Password",

          type: "password",
        },
      },

      /* =================================================
         AUTHORIZE
         ================================================= */

      async authorize(credentials, request) {
        const result = loginSchema.safeParse(credentials);

        if (!result.success) {
          return null;
        }

        const email = result.data.email.trim().toLowerCase();

        /* ===============================================
           RATE LIMIT CHECK

           Important:
           This happens inside Auth.js itself.

           That means someone cannot simply bypass your
           LoginForm and directly attack the credentials
           endpoint without rate limiting.
           =============================================== */

        const blocked = await isLoginRateLimited(email, request.headers);

        if (blocked) {
          return null;
        }

        /* ===============================================
           FIND ADMIN
           =============================================== */

        const user = await prisma.adminUser.findUnique({
          where: {
            email,
          },
        });

        /* ===============================================
           INVALID / DISABLED USER
           =============================================== */

        if (!user || !user.isActive) {
          await recordLoginFailure(email, request.headers);

          return null;
        }

        /* ===============================================
           PASSWORD CHECK
           =============================================== */

        const passwordMatches = await compare(
          result.data.password,

          user.passwordHash,
        );

        if (!passwordMatches) {
          await recordLoginFailure(email, request.headers);

          return null;
        }

        /* ===============================================
           SUCCESS

           Clear old failed attempts for this
           email + IP combination.
           =============================================== */

        await clearLoginFailures(email, request.headers);

        return {
          id: String(user.id),

          name: user.name,

          email: user.email,
        };
      },
    }),
  ],
});
