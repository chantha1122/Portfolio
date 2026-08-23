"use server";

import { createHash } from "node:crypto";

import { headers } from "next/headers";

import {
  sendContactNotificationEmail,
  sendContactReplyEmail,
} from "@/lib/mail";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { revalidatePath } from "next/cache";

import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export type ContentActionResult = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

function text(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: string) {
  return value || null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function requireAdmin() {
  const session = await auth();

  return Boolean(session?.user);
}

/* =========================================================
   ACTIVITY
   ========================================================= */

const activityTypes = [
  "PROJECT",
  "CERTIFICATE",
  "EDUCATION",
  "WORK",
  "TEACHING",
  "COMPETITION",
  "ACHIEVEMENT",
  "EVENT",
  "PHOTO",
  "OTHER",
] as const;

const datePrecisions = ["YEAR", "MONTH", "DAY"] as const;

const activitySchema = z.object({
  id: z.coerce.number().int().positive().optional(),

  type: z.enum(activityTypes),

  titleEn: z.string().trim().min(1, "English title is required"),

  titleKm: z.string().trim().optional(),

  summaryEn: z.string().optional(),

  summaryKm: z.string().optional(),

  descriptionEn: z.string().optional(),

  descriptionKm: z.string().optional(),

  activityDate: z.string().min(1, "Date is required"),

  endDate: z.string().optional(),

  datePrecision: z.enum(datePrecisions),

  coverImage: z.string().optional(),

  locationEn: z.string().optional(),

  locationKm: z.string().optional(),

  organizationEn: z.string().optional(),

  organizationKm: z.string().optional(),

  externalUrl: z.string().optional(),

  githubUrl: z.string().optional(),

  demoUrl: z.string().optional(),

  credentialId: z.string().optional(),

  technologies: z.string().optional(),

  sortOrder: z.coerce.number().int().default(0),

  featured: z.boolean(),

  published: z.boolean(),

  isCurrent: z.boolean(),
});

export async function saveActivityAction(
  formData: FormData,
): Promise<ContentActionResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const rawId = text(formData, "id");

  const parsed = activitySchema.safeParse({
    id: rawId === "" ? undefined : rawId,

    type: text(formData, "type"),

    titleEn: text(formData, "titleEn"),

    titleKm: text(formData, "titleKm"),

    summaryEn: text(formData, "summaryEn"),

    summaryKm: text(formData, "summaryKm"),

    descriptionEn: text(formData, "descriptionEn"),

    descriptionKm: text(formData, "descriptionKm"),

    activityDate: text(formData, "activityDate"),

    endDate: text(formData, "endDate"),

    datePrecision: text(formData, "datePrecision") || "DAY",

    coverImage: text(formData, "coverImage"),

    locationEn: text(formData, "locationEn"),

    locationKm: text(formData, "locationKm"),

    organizationEn: text(formData, "organizationEn"),

    organizationKm: text(formData, "organizationKm"),

    externalUrl: text(formData, "externalUrl"),

    githubUrl: text(formData, "githubUrl"),

    demoUrl: text(formData, "demoUrl"),

    credentialId: text(formData, "credentialId"),

    technologies: text(formData, "technologies"),

    sortOrder: text(formData, "sortOrder") || "0",

    featured: formData.get("featured") === "on",

    published: formData.get("published") === "on",

    isCurrent: formData.get("isCurrent") === "on",
  });

  if (!parsed.success) {
    return {
      success: false,

      message: "Please check the form.",

      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const data = parsed.data;

  const activityDate = new Date(`${data.activityDate}T12:00:00`);

  const endDate = data.endDate ? new Date(`${data.endDate}T12:00:00`) : null;

  try {
    if (data.id) {
      await prisma.activity.update({
        where: {
          id: data.id,
        },

        data: {
          type: data.type,

          titleEn: data.titleEn,

          titleKm: nullableText(data.titleKm ?? ""),

          summaryEn: nullableText(data.summaryEn ?? ""),

          summaryKm: nullableText(data.summaryKm ?? ""),

          descriptionEn: nullableText(data.descriptionEn ?? ""),

          descriptionKm: nullableText(data.descriptionKm ?? ""),

          activityDate,
          endDate,

          datePrecision: data.datePrecision,

          coverImage: nullableText(data.coverImage ?? ""),

          locationEn: nullableText(data.locationEn ?? ""),

          locationKm: nullableText(data.locationKm ?? ""),

          organizationEn: nullableText(data.organizationEn ?? ""),

          organizationKm: nullableText(data.organizationKm ?? ""),

          externalUrl: nullableText(data.externalUrl ?? ""),

          githubUrl: nullableText(data.githubUrl ?? ""),

          demoUrl: nullableText(data.demoUrl ?? ""),

          credentialId: nullableText(data.credentialId ?? ""),

          technologies: nullableText(data.technologies ?? ""),

          featured: data.featured,

          published: data.published,

          isCurrent: data.isCurrent,

          sortOrder: data.sortOrder,
        },
      });
    } else {
      const baseSlug = slugify(data.titleEn) || "activity";

      await prisma.activity.create({
        data: {
          slug: `${baseSlug}-${Date.now().toString(36)}`,

          type: data.type,

          titleEn: data.titleEn,

          titleKm: nullableText(data.titleKm ?? ""),

          summaryEn: nullableText(data.summaryEn ?? ""),

          summaryKm: nullableText(data.summaryKm ?? ""),

          descriptionEn: nullableText(data.descriptionEn ?? ""),

          descriptionKm: nullableText(data.descriptionKm ?? ""),

          activityDate,
          endDate,

          datePrecision: data.datePrecision,

          coverImage: nullableText(data.coverImage ?? ""),

          locationEn: nullableText(data.locationEn ?? ""),

          locationKm: nullableText(data.locationKm ?? ""),

          organizationEn: nullableText(data.organizationEn ?? ""),

          organizationKm: nullableText(data.organizationKm ?? ""),

          externalUrl: nullableText(data.externalUrl ?? ""),

          githubUrl: nullableText(data.githubUrl ?? ""),

          demoUrl: nullableText(data.demoUrl ?? ""),

          credentialId: nullableText(data.credentialId ?? ""),

          technologies: nullableText(data.technologies ?? ""),

          featured: data.featured,

          published: data.published,

          isCurrent: data.isCurrent,

          sortOrder: data.sortOrder,
        },
      });
    }

    revalidatePath("/en/dashboard", "layout");

    revalidatePath("/km/dashboard", "layout");

    revalidatePath("/en");

    revalidatePath("/km");

    return {
      success: true,
      message: data.id
        ? "Content updated successfully."
        : "Content created successfully.",
    };
  } catch (error) {
    console.error("Activity save error:", error);

    return {
      success: false,
      message: "Unable to save content.",
    };
  }
}

export async function deleteActivityAction(
  id: number,
): Promise<ContentActionResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    await prisma.activity.delete({
      where: {
        id,
      },
    });

    revalidatePath("/en/dashboard", "layout");

    revalidatePath("/km/dashboard", "layout");

    revalidatePath("/en");

    revalidatePath("/km");

    return {
      success: true,
      message: "Content deleted successfully.",
    };
  } catch (error) {
    console.error("Activity delete error:", error);

    return {
      success: false,
      message: "Unable to delete content.",
    };
  }
}

/* =========================================================
   SKILL / TOOL ICON UPLOAD HELPERS
   ========================================================= */

const SKILL_TOOL_ICON_MAX_BYTES = 3 * 1024 * 1024;

const SKILL_TOOL_ICON_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function getFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);

  if (!value || typeof value === "string" || value.size === 0) {
    return null;
  }

  return value;
}

function shouldRemoveFile(formData: FormData, key: string) {
  return text(formData, key) === "1";
}

function skillToolIconDirectory() {
  return path.join(process.cwd(), "public", "uploads", "skills-tools");
}

async function saveSkillToolIcon(file: File, prefix: "skill" | "tool") {
  const extension = SKILL_TOOL_ICON_TYPES[file.type];

  if (!extension) {
    throw new Error("Please upload a JPG, PNG or WEBP image.");
  }

  if (file.size > SKILL_TOOL_ICON_MAX_BYTES) {
    throw new Error("Icon image size must be 3 MB or smaller.");
  }

  const directory = skillToolIconDirectory();

  await mkdir(directory, {
    recursive: true,
  });

  const fileName = `${prefix}-${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;

  const absolutePath = path.join(directory, fileName);

  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(absolutePath, bytes);

  return `/uploads/skills-tools/${fileName}`;
}

async function removeSkillToolIcon(filePath: string | null | undefined) {
  if (!filePath || !filePath.startsWith("/uploads/skills-tools/")) {
    return;
  }

  const fileName = path.basename(filePath);

  const absolutePath = path.join(skillToolIconDirectory(), fileName);

  try {
    await unlink(absolutePath);
  } catch {
    // The old icon may already be deleted.
  }
}

function revalidateSkillsTools() {
  revalidatePath("/en/dashboard", "layout");

  revalidatePath("/km/dashboard", "layout");

  revalidatePath("/en/dashboard/skills");

  revalidatePath("/km/dashboard/skills");

  revalidatePath("/en");
  revalidatePath("/km");
}

/* =========================================================
   SKILLS
   ========================================================= */

const skillLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"] as const;

export async function saveSkillAction(
  formData: FormData,
): Promise<ContentActionResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const id = Number(text(formData, "id")) || undefined;

  const name = text(formData, "name");

  const level = text(formData, "level");

  const iconFile = getFile(formData, "iconFile");

  const removeIcon = shouldRemoveFile(formData, "removeIcon");

  if (!name) {
    return {
      success: false,
      message: "Skill name is required.",
    };
  }

  if (!skillLevels.includes(level as (typeof skillLevels)[number])) {
    return {
      success: false,
      message: "Invalid skill level.",
    };
  }

  const existing = id
    ? await prisma.skill.findUnique({
        where: {
          id,
        },
        select: {
          icon: true,
        },
      })
    : null;

  const isCore = formData.get("isCore") === "on";

  /*
   * Maximum 4 Core Skills.
   */
  if (isCore) {
    const otherCoreSkills = await prisma.skill.count({
      where: {
        isCore: true,

        ...(id
          ? {
              id: {
                not: id,
              },
            }
          : {}),
      },
    });

    if (otherCoreSkills >= 4) {
      return {
        success: false,
        message:
          "You can select up to 4 Core Skills. Uncheck another Core Skill first.",
      };
    }
  }

  let nextIcon = existing?.icon ?? nullableText(text(formData, "icon"));

  let uploadedIcon: string | null = null;

  try {
    if (removeIcon) {
      nextIcon = null;
    } else if (iconFile) {
      uploadedIcon = await saveSkillToolIcon(iconFile, "skill");

      nextIcon = uploadedIcon;
    }

    const data = {
      name,

      categoryEn: nullableText(text(formData, "categoryEn")),

      categoryKm: nullableText(text(formData, "categoryKm")),

      level: level as (typeof skillLevels)[number],

      icon: nextIcon,

      isCore,

      sortOrder: Number(text(formData, "sortOrder")) || 0,

      published: formData.get("published") === "on",
    };

    if (id) {
      await prisma.skill.update({
        where: {
          id,
        },
        data,
      });
    } else {
      await prisma.skill.create({
        data,
      });
    }

    if (existing?.icon && existing.icon !== nextIcon) {
      await removeSkillToolIcon(existing.icon);
    }

    revalidateSkillsTools();

    return {
      success: true,
      message: id ? "Skill updated successfully." : "Skill added successfully.",
    };
  } catch (error) {
    if (uploadedIcon) {
      await removeSkillToolIcon(uploadedIcon);
    }

    console.error("Skill save error:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Unable to save skill.",
    };
  }
}

export async function deleteSkillAction(
  id: number,
): Promise<ContentActionResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const skill = await prisma.skill.findUnique({
      where: {
        id,
      },
      select: {
        icon: true,
      },
    });

    await prisma.skill.delete({
      where: {
        id,
      },
    });

    await removeSkillToolIcon(skill?.icon);

    revalidateSkillsTools();

    return {
      success: true,
      message: "Skill deleted successfully.",
    };
  } catch (error) {
    console.error("Skill delete error:", error);

    return {
      success: false,
      message: "Unable to delete skill.",
    };
  }
}

/* =========================================================
   TOOLS
   ========================================================= */

const toolCategories = [
  "DEVELOPMENT",
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "AI_ML",
  "DESIGN",
  "DEVOPS",
  "PRODUCTIVITY",
  "OTHER",
] as const;

export async function saveToolAction(
  formData: FormData,
): Promise<ContentActionResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const id = Number(text(formData, "id")) || undefined;

  const name = text(formData, "name");

  const category = text(formData, "category");

  const iconFile = getFile(formData, "iconFile");

  const removeIcon = shouldRemoveFile(formData, "removeIcon");

  if (!name) {
    return {
      success: false,
      message: "Tool name is required.",
    };
  }

  if (!toolCategories.includes(category as (typeof toolCategories)[number])) {
    return {
      success: false,
      message: "Invalid tool category.",
    };
  }

  const existing = id
    ? await prisma.tool.findUnique({
        where: {
          id,
        },
        select: {
          icon: true,
        },
      })
    : null;

  let nextIcon = existing?.icon ?? nullableText(text(formData, "icon"));

  let uploadedIcon: string | null = null;

  try {
    if (removeIcon) {
      nextIcon = null;
    } else if (iconFile) {
      uploadedIcon = await saveSkillToolIcon(iconFile, "tool");

      nextIcon = uploadedIcon;
    }

    const data = {
      name,

      category: category as (typeof toolCategories)[number],

      icon: nextIcon,

      url: nullableText(text(formData, "url")),

      sortOrder: Number(text(formData, "sortOrder")) || 0,

      published: formData.get("published") === "on",
    };

    if (id) {
      await prisma.tool.update({
        where: {
          id,
        },
        data,
      });
    } else {
      await prisma.tool.create({
        data,
      });
    }

    if (existing?.icon && existing.icon !== nextIcon) {
      await removeSkillToolIcon(existing.icon);
    }

    revalidateSkillsTools();

    return {
      success: true,
      message: id ? "Tool updated successfully." : "Tool added successfully.",
    };
  } catch (error) {
    if (uploadedIcon) {
      await removeSkillToolIcon(uploadedIcon);
    }

    console.error("Tool save error:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Unable to save tool.",
    };
  }
}

export async function deleteToolAction(
  id: number,
): Promise<ContentActionResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const tool = await prisma.tool.findUnique({
      where: {
        id,
      },
      select: {
        icon: true,
      },
    });

    await prisma.tool.delete({
      where: {
        id,
      },
    });

    await removeSkillToolIcon(tool?.icon);

    revalidateSkillsTools();

    return {
      success: true,
      message: "Tool deleted successfully.",
    };
  } catch (error) {
    console.error("Tool delete error:", error);

    return {
      success: false,
      message: "Unable to delete tool.",
    };
  }
}

/* =========================================================
   CONTACT
   ========================================================= */

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),

  email: z.string().trim().email("Enter a valid email").max(200),

  subject: z.string().trim().max(200),

  message: z.string().trim().min(5, "Message is required").max(5000),

  company: z.string().trim().max(200),
});

/* =========================================================
   CONTACT RATE LIMIT
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

  const forwardedFor = requestHeaders.get("x-forwarded-for");

  const realIp = requestHeaders.get("x-real-ip");

  const ip = forwardedFor?.split(",")[0]?.trim() || realIp?.trim() || "unknown";

  return hashIp(ip);
}

/* =========================================================
   SEND CONTACT MESSAGE
   ========================================================= */

export async function sendContactMessageAction(
  formData: FormData,
): Promise<ContentActionResult> {
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

  /*
   * Honeypot field.
   *
   * Real users never see this field.
   * Basic spam bots often fill it.
   */
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

    /*
     * Save to DB first.
     *
     * If email notification fails,
     * the visitor's message is still safely stored.
     */
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

/* =========================================================
   CONTACT MESSAGE MANAGEMENT
   ========================================================= */

const contactStatuses = ["NEW", "READ", "REPLIED", "ARCHIVED"] as const;

type ContactStatus = (typeof contactStatuses)[number];

/* =========================================================
   STATUS
   ========================================================= */

export async function updateContactMessageStatusAction(
  id: number,
  status: ContactStatus,
): Promise<ContentActionResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!contactStatuses.includes(status)) {
    return {
      success: false,
      message: "Invalid message status.",
    };
  }

  /*
   * REPLIED should only be set by the real
   * reply action below.
   */
  if (status === "REPLIED") {
    return {
      success: false,
      message:
        "Use Reply to send an email before marking this message as replied.",
    };
  }

  try {
    await prisma.contactMessage.update({
      where: {
        id,
      },

      data: {
        status,
      },
    });

    revalidatePath("/en/dashboard/messages");

    revalidatePath("/km/dashboard/messages");

    revalidatePath("/en/dashboard");

    revalidatePath("/km/dashboard");

    return {
      success: true,

      message:
        status === "READ"
          ? "Message marked as read."
          : status === "ARCHIVED"
            ? "Message archived."
            : "Message status updated.",
    };
  } catch (error) {
    console.error("Contact message status error:", error);

    return {
      success: false,
      message: "Unable to update message status.",
    };
  }
}

/* =========================================================
   REPLY
   ========================================================= */

const contactReplySchema = z.object({
  reply: z.string().trim().min(2, "Reply is required").max(5000),
});

export async function replyToContactMessageAction(
  id: number,
  reply: string,
): Promise<ContentActionResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const parsed = contactReplySchema.safeParse({
    reply,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter a reply.",
    };
  }

  try {
    const contactMessage = await prisma.contactMessage.findUnique({
      where: {
        id,
      },
    });

    if (!contactMessage) {
      return {
        success: false,
        message: "Contact message was not found.",
      };
    }

    /*
     * Send the email FIRST.
     *
     * Only mark REPLIED if email delivery succeeds.
     */
    await sendContactReplyEmail({
      to: contactMessage.email,

      visitorName: contactMessage.name,

      originalSubject: contactMessage.subject,

      reply: parsed.data.reply,
    });

    await prisma.contactMessage.update({
      where: {
        id,
      },

      data: {
        status: "REPLIED",

        replyMessage: parsed.data.reply,

        repliedAt: new Date(),
      },
    });

    revalidatePath("/en/dashboard/messages");

    revalidatePath("/km/dashboard/messages");

    revalidatePath("/en/dashboard");

    revalidatePath("/km/dashboard");

    return {
      success: true,
      message: "Reply email sent successfully.",
    };
  } catch (error) {
    console.error("Contact reply error:", error);

    return {
      success: false,
      message: "Unable to send the reply email.",
    };
  }
}

/* =========================================================
   DELETE
   ========================================================= */

export async function deleteContactMessageAction(
  id: number,
): Promise<ContentActionResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    await prisma.contactMessage.delete({
      where: {
        id,
      },
    });

    revalidatePath("/en/dashboard/messages");

    revalidatePath("/km/dashboard/messages");

    revalidatePath("/en/dashboard");

    revalidatePath("/km/dashboard");

    return {
      success: true,
      message: "Message deleted successfully.",
    };
  } catch (error) {
    console.error("Contact message delete error:", error);

    return {
      success: false,
      message: "Unable to delete message.",
    };
  }
}
