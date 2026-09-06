"use server";

import { createHash } from "node:crypto";

import { headers } from "next/headers";

import { revalidatePath } from "next/cache";

import { z } from "zod";

import { prisma } from "@/lib/db";

import { sendContactNotificationEmail } from "@/lib/mail";

export type ContactActionResult = {
  success: boolean;
  message: string;
};

/* =========================================================
   HELPERS
   ========================================================= */

function text(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: string) {
  return value || null;
}

/* =========================================================
   VALIDATION
   ========================================================= */

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),

  email: z.string().trim().email("Enter a valid email").max(200),

  subject: z.string().trim().max(200),

  message: z.string().trim().min(5, "Message is required").max(5000),

  company: z.string().trim().max(200),
});

/* =========================================================
   RATE LIMIT
   ========================================================= */

const CONTACT_RATE_LIMIT_MINUTES = Number(
  process.env.CONTACT_RATE_LIMIT_MINUTES || "15",
);

const CONTACT_RATE_LIMIT_COUNT = Number(
  process.env.CONTACT_RATE_LIMIT_COUNT || "5",
);

function hashIp(value: string) {
  const secret =
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "chantha-contact";

  return createHash("sha256").update(`${secret}:${value}`).digest("hex");
}

async function getRequestIpHash() {
  const requestHeaders = await headers();

  const cloudflareIp = requestHeaders.get("cf-connecting-ip");

  const forwardedFor = requestHeaders.get("x-forwarded-for");

  const realIp = requestHeaders.get("x-real-ip");

  const ip =
    cloudflareIp?.trim() ||
    forwardedFor?.split(",")[0]?.trim() ||
    realIp?.trim() ||
    "unknown";

  return hashIp(ip);
}

/* =========================================================
   SEND CONTACT MESSAGE
   ========================================================= */

export async function sendContactMessageAction(
  formData: FormData,
): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse({
    name: text(formData, "name"),

    email: text(formData, "email"),

    subject: text(formData, "subject"),

    message: text(formData, "message"),

    company: text(formData, "company"),
  });

  if (!parsed.success) {
    return {
      success: false,

      message: "Please check your information.",
    };
  }

  /* =====================================================
     HONEYPOT
     ===================================================== */

  if (parsed.data.company) {
    return {
      success: true,

      message: "Your message was sent successfully.",
    };
  }

  try {
    const sourceIpHash = await getRequestIpHash();

    const rateLimitStart = new Date(
      Date.now() - CONTACT_RATE_LIMIT_MINUTES * 60 * 1000,
    );

    const recentCount = await prisma.contactMessage.count({
      where: {
        sourceIpHash,

        createdAt: {
          gte: rateLimitStart,
        },
      },
    });

    if (recentCount >= CONTACT_RATE_LIMIT_COUNT) {
      return {
        success: false,

        message:
          "Too many messages. Please wait a few minutes before trying again.",
      };
    }

    /* ===================================================
       SAVE MESSAGE
       =================================================== */

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,

        email: parsed.data.email,

        subject: nullableText(parsed.data.subject),

        message: parsed.data.message,

        status: "NEW",

        sourceIpHash,
      },
    });

    /* ===================================================
       SEND NOTIFICATION EMAIL

       Database save remains successful even if
       notification email fails.
       =================================================== */

    try {
      await sendContactNotificationEmail({
        name: contactMessage.name,

        email: contactMessage.email,

        subject: contactMessage.subject,

        message: contactMessage.message,
      });
    } catch (emailError) {
      console.error("Contact notification email error:", emailError);
    }

    revalidatePath("/en/dashboard/messages");

    revalidatePath("/km/dashboard/messages");

    return {
      success: true,

      message: "Your message was sent successfully.",
    };
  } catch (error) {
    console.error("Contact message error:", error);

    return {
      success: false,

      message: "Unable to send your message.",
    };
  }
}
