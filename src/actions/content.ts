"use server";

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

  const data = {
    name,

    categoryEn: nullableText(text(formData, "categoryEn")),

    categoryKm: nullableText(text(formData, "categoryKm")),

    level: level as (typeof skillLevels)[number],

    icon: nullableText(text(formData, "icon")),

    sortOrder: Number(text(formData, "sortOrder")) || 0,

    published: formData.get("published") === "on",
  };

  try {
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

    revalidatePath("/en/dashboard", "layout");

    revalidatePath("/km/dashboard", "layout");

    revalidatePath("/en");

    revalidatePath("/km");

    return {
      success: true,
      message: id ? "Skill updated successfully." : "Skill added successfully.",
    };
  } catch (error) {
    console.error("Skill save error:", error);

    return {
      success: false,
      message: "Unable to save skill.",
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
    await prisma.skill.delete({
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
      message: "Skill deleted successfully.",
    };
  } catch {
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

  const data = {
    name,

    category: category as (typeof toolCategories)[number],

    icon: nullableText(text(formData, "icon")),

    url: nullableText(text(formData, "url")),

    sortOrder: Number(text(formData, "sortOrder")) || 0,

    published: formData.get("published") === "on",
  };

  try {
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

    revalidatePath("/en/dashboard", "layout");

    revalidatePath("/km/dashboard", "layout");

    revalidatePath("/en");
    revalidatePath("/km");

    return {
      success: true,
      message: id ? "Tool updated successfully." : "Tool added successfully.",
    };
  } catch (error) {
    console.error("Tool save error:", error);

    return {
      success: false,
      message: "Unable to save tool.",
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
    await prisma.tool.delete({
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
      message: "Tool deleted successfully.",
    };
  } catch {
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

  email: z.string().trim().email("Enter a valid email"),

  subject: z.string().trim().max(200),

  message: z.string().trim().min(5, "Message is required").max(5000),
});

export async function sendContactMessageAction(
  formData: FormData,
): Promise<ContentActionResult> {
  const parsed = contactSchema.safeParse({
    name: text(formData, "name"),

    email: text(formData, "email"),

    subject: text(formData, "subject"),

    message: text(formData, "message"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check your information.",
    };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,

        email: parsed.data.email,

        subject: nullableText(parsed.data.subject),

        message: parsed.data.message,
      },
    });

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

export async function updateContactMessageStatusAction(
  id: number,
  status: (typeof contactStatuses)[number],
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

  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/en/dashboard/messages");
    revalidatePath("/km/dashboard/messages");
    revalidatePath("/en/dashboard");
    revalidatePath("/km/dashboard");

    return {
      success: true,
      message: "Message status updated.",
    };
  } catch (error) {
    console.error("Contact message status error:", error);

    return {
      success: false,
      message: "Unable to update message status.",
    };
  }
}

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
      where: { id },
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
