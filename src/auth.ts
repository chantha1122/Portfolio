import NextAuth from "next-auth";

import Credentials from "next-auth/providers/credentials";

import { compare } from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/db";

const loginSchema = z.object({
  email: z.string().trim().email(),

  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",

    maxAge: 60 * 60 * 8,
  },

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

      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials);

        if (!result.success) {
          return null;
        }

        const email = result.data.email.trim().toLowerCase();

        const user = await prisma.adminUser.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const passwordMatches = await compare(
          result.data.password,
          user.passwordHash,
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
});
