"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export type TeachingActionResult = {
  success: boolean;
  message: string;
};

function text(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function nullable(value: string) {
  return value || null;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function numberValue(formData: FormData, key: string) {
  const value = Number(text(formData, key));

  return Number.isFinite(value) ? value : 0;
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "teaching";
}

function isMonthValue(value: string) {
  return /^(\d{4})-(0[1-9]|1[0-2])$/.test(value);
}

function monthToDate(value: string) {
  return new Date(`${value}-01T12:00:00`);
}

async function requireAdmin() {
  const session = await auth();

  return Boolean(session?.user);
}

function revalidateTeaching() {
  revalidatePath("/en/dashboard/teaching");
  revalidatePath("/km/dashboard/teaching");

  revalidatePath("/en/dashboard", "layout");
  revalidatePath("/km/dashboard", "layout");

  revalidatePath("/en");
  revalidatePath("/km");
}

/* =========================================================
   SAVE TEACHING
   ========================================================= */

export async function saveTeachingAction(
  formData: FormData,
): Promise<TeachingActionResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  const id = Number(text(formData, "id")) || undefined;

  const titleEn = text(formData, "titleEn");

  const organizationEn = text(formData, "organizationEn");

  const startMonth = text(formData, "activityDate");

  const endMonth = text(formData, "endDate");

  const isCurrent = bool(formData, "isCurrent");

  if (!titleEn) {
    return {
      success: false,
      message: "Teaching / mentoring title in English is required.",
    };
  }

  if (!isMonthValue(startMonth)) {
    return {
      success: false,
      message: "Please choose a valid start month.",
    };
  }

  if (!isCurrent && endMonth && !isMonthValue(endMonth)) {
    return {
      success: false,
      message: "Please choose a valid end month.",
    };
  }

  const activityDate = monthToDate(startMonth);

  const endDate = !isCurrent && endMonth ? monthToDate(endMonth) : null;

  if (endDate && endDate < activityDate) {
    return {
      success: false,
      message: "End month cannot be earlier than the start month.",
    };
  }

  const data = {
    type: "TEACHING" as const,

    titleEn,

    titleKm: nullable(text(formData, "titleKm")),

    organizationEn: nullable(organizationEn),

    organizationKm: nullable(text(formData, "organizationKm")),

    activityDate,

    endDate,

    datePrecision: "MONTH" as const,

    isCurrent,

    locationEn: nullable(text(formData, "locationEn")),

    locationKm: nullable(text(formData, "locationKm")),

    summaryEn: nullable(text(formData, "summaryEn")),

    summaryKm: nullable(text(formData, "summaryKm")),

    descriptionEn: nullable(text(formData, "descriptionEn")),

    descriptionKm: nullable(text(formData, "descriptionKm")),

    technologies: nullable(text(formData, "technologies")),

    externalUrl: nullable(text(formData, "externalUrl")),

    /*
     * Not used by Teaching & Mentoring.
     */
    coverImage: null,

    githubUrl: null,

    demoUrl: null,

    credentialId: null,

    featured: false,

    published: bool(formData, "published"),

    sortOrder: numberValue(formData, "sortOrder"),
  };

  try {
    if (id) {
      const existing = await prisma.activity.findUnique({
        where: {
          id,
        },

        select: {
          type: true,
        },
      });

      if (!existing || existing.type !== "TEACHING") {
        return {
          success: false,
          message: "Teaching record was not found.",
        };
      }

      await prisma.activity.update({
        where: {
          id,
        },

        data,
      });
    } else {
      await prisma.activity.create({
        data: {
          slug: `${slugify(titleEn)}-${Date.now().toString(36)}`,

          ...data,
        },
      });
    }

    revalidateTeaching();

    return {
      success: true,
      message: id
        ? "Teaching activity updated successfully."
        : "Teaching activity added successfully.",
    };
  } catch (error) {
    console.error("Teaching save error:", error);

    return {
      success: false,
      message: "Unable to save teaching activity.",
    };
  }
}

/* =========================================================
   DELETE TEACHING
   ========================================================= */

export async function deleteTeachingAction(
  id: number,
): Promise<TeachingActionResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  try {
    const existing = await prisma.activity.findUnique({
      where: {
        id,
      },

      select: {
        type: true,
      },
    });

    if (!existing || existing.type !== "TEACHING") {
      return {
        success: false,
        message: "Teaching record was not found.",
      };
    }

    await prisma.activity.delete({
      where: {
        id,
      },
    });

    revalidateTeaching();

    return {
      success: true,
      message: "Teaching activity deleted successfully.",
    };
  } catch (error) {
    console.error("Teaching delete error:", error);

    return {
      success: false,
      message: "Unable to delete teaching activity.",
    };
  }
}

/* =========================================================
   TEACHING PUBLIC VISIBILITY
   ========================================================= */

export async function setTeachingSectionVisibilityAction(
  visible: boolean,
): Promise<TeachingActionResult> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        profileKey: "main",
      },

      select: {
        id: true,
      },
    });

    if (!profile) {
      return {
        success: false,
        message: "Profile was not found.",
      };
    }

    await prisma.profile.update({
      where: {
        profileKey: "main",
      },

      data: {
        showTeachingSection: visible,
      },
    });

    revalidatePath("/en");
    revalidatePath("/km");

    revalidatePath("/en/dashboard/teaching");
    revalidatePath("/km/dashboard/teaching");

    return {
      success: true,
      message: visible
        ? "Teaching & Mentoring is now visible on your website."
        : "Teaching & Mentoring is now hidden from your website.",
    };
  } catch (error) {
    console.error("Teaching visibility error:", error);

    return {
      success: false,
      message: "Unable to update Teaching & Mentoring visibility.",
    };
  }
}
