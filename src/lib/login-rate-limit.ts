import { createHash } from "node:crypto";

import { prisma } from "@/lib/db";

type HeadersLike = {
  get(name: string): string | null;
};

const LOGIN_RATE_LIMIT_COUNT = Number(
  process.env.LOGIN_RATE_LIMIT_COUNT || "5",
);

const LOGIN_RATE_LIMIT_MINUTES = Number(
  process.env.LOGIN_RATE_LIMIT_MINUTES || "15",
);

const LOGIN_RATE_LIMIT_WINDOW_MS = LOGIN_RATE_LIMIT_MINUTES * 60 * 1000;

/* =========================================================
   NORMALIZE EMAIL
   ========================================================= */

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/* =========================================================
   CLIENT IP
   ========================================================= */

function getClientIp(requestHeaders: HeadersLike) {
  /*
   * Cloudflare, if used later.
   */
  const cloudflareIp = requestHeaders.get("cf-connecting-ip");

  if (cloudflareIp) {
    return cloudflareIp.trim();
  }

  /*
   * Vercel / reverse proxy.
   */
  const forwardedFor = requestHeaders.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = requestHeaders.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  /*
   * Localhost usually reaches this.
   */
  return "unknown";
}

/* =========================================================
   HASH LOGIN IDENTITY
   ========================================================= */

function createLoginKeyHash(email: string, requestHeaders: HeadersLike) {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  const normalizedEmail = normalizeEmail(email);

  const clientIp = getClientIp(requestHeaders);

  return createHash("sha256")
    .update(`${secret}:${normalizedEmail}:${clientIp}`)
    .digest("hex");
}

/* =========================================================
   WINDOW START
   ========================================================= */

function getWindowStart() {
  return new Date(Date.now() - LOGIN_RATE_LIMIT_WINDOW_MS);
}

/* =========================================================
   CHECK RATE LIMIT
   ========================================================= */

export async function isLoginRateLimited(
  email: string,
  requestHeaders: HeadersLike,
) {
  const keyHash = createLoginKeyHash(email, requestHeaders);

  const count = await prisma.loginAttempt.count({
    where: {
      keyHash,

      createdAt: {
        gte: getWindowStart(),
      },
    },
  });

  return count >= LOGIN_RATE_LIMIT_COUNT;
}

/* =========================================================
   RECORD FAILED LOGIN
   ========================================================= */

export async function recordLoginFailure(
  email: string,
  requestHeaders: HeadersLike,
) {
  const keyHash = createLoginKeyHash(email, requestHeaders);

  await prisma.loginAttempt.create({
    data: {
      keyHash,
    },
  });
}

/* =========================================================
   CLEAR AFTER SUCCESSFUL LOGIN
   ========================================================= */

export async function clearLoginFailures(
  email: string,
  requestHeaders: HeadersLike,
) {
  const keyHash = createLoginKeyHash(email, requestHeaders);

  await prisma.loginAttempt.deleteMany({
    where: {
      keyHash,
    },
  });
}
