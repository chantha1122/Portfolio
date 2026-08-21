"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export type ExperienceActionResult = {
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

  return slug || "experience";
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

function revalidateExperience() {
  revalidatePath("/en/dashboard/experience");

  revalidatePath("/km/dashboard/experience");

  revalidatePath("/en/dashboard", "layout");

  revalidatePath("/km/dashboard", "layout");

  revalidatePath("/en");
  revalidatePath("/km");
}

/* =========================================================
   SAVE EXPERIENCE
   ========================================================= */

export async function saveExperienceAction(
  formData: FormData,
): Promise<ExperienceActionResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  const id = Number(text(formData, "id")) || undefined;

  const titleEn = text(formData, "titleEn");

  const startMonth = text(formData, "activityDate");

  const endMonth = text(formData, "endDate");

  const isCurrent = bool(formData, "isCurrent");

  if (!titleEn) {
    return {
      success: false,

      message: "Position / role in English is required.",
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

  try {
    /*
     * Editing
     */
    if (id) {
      const existing = await prisma.activity.findUnique({
        where: {
          id,
        },

        select: {
          type: true,
        },
      });

      if (!existing || existing.type !== "WORK") {
        return {
          success: false,

          message: "Experience record was not found.",
        };
      }

      await prisma.activity.update({
        where: {
          id,
        },

        data: {
          /*
           * Experience is always WORK.
           */
          type: "WORK",

          titleEn,

          titleKm: nullable(text(formData, "titleKm")),

          summaryEn: nullable(text(formData, "summaryEn")),

          summaryKm: nullable(text(formData, "summaryKm")),

          descriptionEn: nullable(text(formData, "descriptionEn")),

          descriptionKm: nullable(text(formData, "descriptionKm")),

          activityDate,

          endDate,

          /*
           * Experience uses
           * month/year.
           */
          datePrecision: "MONTH",

          isCurrent,

          organizationEn: nullable(text(formData, "organizationEn")),

          organizationKm: nullable(text(formData, "organizationKm")),

          locationEn: nullable(text(formData, "locationEn")),

          locationKm: nullable(text(formData, "locationKm")),

          /*
           * These fields do not
           * belong to Experience.
           */
          coverImage: null,

          technologies: null,

          githubUrl: null,

          demoUrl: null,

          externalUrl: null,

          credentialId: null,

          featured: false,

          published: bool(formData, "published"),

          sortOrder: numberValue(formData, "sortOrder"),
        },
      });
    } else {
      /*
       * Creating
       */

      await prisma.activity.create({
        data: {
          slug: `${slugify(titleEn)}-${Date.now().toString(36)}`,

          type: "WORK",

          titleEn,

          titleKm: nullable(text(formData, "titleKm")),

          summaryEn: nullable(text(formData, "summaryEn")),

          summaryKm: nullable(text(formData, "summaryKm")),

          descriptionEn: nullable(text(formData, "descriptionEn")),

          descriptionKm: nullable(text(formData, "descriptionKm")),

          activityDate,

          endDate,

          datePrecision: "MONTH",

          isCurrent,

          organizationEn: nullable(text(formData, "organizationEn")),

          organizationKm: nullable(text(formData, "organizationKm")),

          locationEn: nullable(text(formData, "locationEn")),

          locationKm: nullable(text(formData, "locationKm")),

          coverImage: null,

          technologies: null,

          githubUrl: null,

          demoUrl: null,

          externalUrl: null,

          credentialId: null,

          featured: false,

          published: bool(formData, "published"),

          sortOrder: numberValue(formData, "sortOrder"),
        },
      });
    }

    revalidateExperience();

    return {
      success: true,

      message: id
        ? "Experience updated successfully."
        : "Experience added successfully.",
    };
  } catch (error) {
    console.error("Experience save error:", error);

    return {
      success: false,

      message: "Unable to save experience.",
    };
  }
}

/* =========================================================
   DELETE EXPERIENCE
   ========================================================= */

export async function deleteExperienceAction(
  id: number,
): Promise<ExperienceActionResult> {
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

    if (!existing || existing.type !== "WORK") {
      return {
        success: false,

        message: "Experience record was not found.",
      };
    }

    await prisma.activity.delete({
      where: {
        id,
      },
    });

    revalidateExperience();

    return {
      success: true,

      message: "Experience deleted successfully.",
    };
  } catch (error) {
    console.error("Experience delete error:", error);

    return {
      success: false,

      message: "Unable to delete experience.",
    };
  }
}
