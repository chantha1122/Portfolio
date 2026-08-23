"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export type EducationActionResult = {
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

  return slug || "education";
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

function revalidateEducation() {
  revalidatePath("/en/dashboard/education");
  revalidatePath("/km/dashboard/education");

  revalidatePath("/en/dashboard", "layout");
  revalidatePath("/km/dashboard", "layout");

  revalidatePath("/en");
  revalidatePath("/km");
}

/* =========================================================
   SAVE EDUCATION
   ========================================================= */

export async function saveEducationAction(
  formData: FormData,
): Promise<EducationActionResult> {
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
      message: "Degree / program in English is required.",
    };
  }

  if (!organizationEn) {
    return {
      success: false,
      message: "University / institution in English is required.",
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
    if (id) {
      const existing = await prisma.activity.findUnique({
        where: {
          id,
        },

        select: {
          type: true,
        },
      });

      if (!existing || existing.type !== "EDUCATION") {
        return {
          success: false,
          message: "Education record was not found.",
        };
      }

      await prisma.activity.update({
        where: {
          id,
        },

        data: {
          type: "EDUCATION",

          titleEn,

          titleKm: nullable(text(formData, "titleKm")),

          organizationEn,

          organizationKm: nullable(text(formData, "organizationKm")),

          activityDate,

          endDate,

          datePrecision: "MONTH",

          isCurrent,

          locationEn: nullable(text(formData, "locationEn")),

          locationKm: nullable(text(formData, "locationKm")),

          summaryEn: nullable(text(formData, "summaryEn")),

          summaryKm: nullable(text(formData, "summaryKm")),

          descriptionEn: nullable(text(formData, "descriptionEn")),

          descriptionKm: nullable(text(formData, "descriptionKm")),

          /*
           * Not used by Education.
           */
          coverImage: null,

          externalUrl: null,

          githubUrl: null,

          demoUrl: null,

          credentialId: null,

          technologies: null,

          featured: false,

          published: bool(formData, "published"),

          sortOrder: numberValue(formData, "sortOrder"),
        },
      });
    } else {
      await prisma.activity.create({
        data: {
          slug: `${slugify(titleEn)}-${Date.now().toString(36)}`,

          type: "EDUCATION",

          titleEn,

          titleKm: nullable(text(formData, "titleKm")),

          organizationEn,

          organizationKm: nullable(text(formData, "organizationKm")),

          activityDate,

          endDate,

          datePrecision: "MONTH",

          isCurrent,

          locationEn: nullable(text(formData, "locationEn")),

          locationKm: nullable(text(formData, "locationKm")),

          summaryEn: nullable(text(formData, "summaryEn")),

          summaryKm: nullable(text(formData, "summaryKm")),

          descriptionEn: nullable(text(formData, "descriptionEn")),

          descriptionKm: nullable(text(formData, "descriptionKm")),

          coverImage: null,

          externalUrl: null,

          githubUrl: null,

          demoUrl: null,

          credentialId: null,

          technologies: null,

          featured: false,

          published: bool(formData, "published"),

          sortOrder: numberValue(formData, "sortOrder"),
        },
      });
    }

    revalidateEducation();

    return {
      success: true,
      message: id
        ? "Education updated successfully."
        : "Education added successfully.",
    };
  } catch (error) {
    console.error("Education save error:", error);

    return {
      success: false,
      message: "Unable to save education.",
    };
  }
}

/* =========================================================
   DELETE EDUCATION
   ========================================================= */

export async function deleteEducationAction(
  id: number,
): Promise<EducationActionResult> {
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

    if (!existing || existing.type !== "EDUCATION") {
      return {
        success: false,
        message: "Education record was not found.",
      };
    }

    await prisma.activity.delete({
      where: {
        id,
      },
    });

    revalidateEducation();

    return {
      success: true,
      message: "Education deleted successfully.",
    };
  } catch (error) {
    console.error("Education delete error:", error);

    return {
      success: false,
      message: "Unable to delete education.",
    };
  }
}
