"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

import { prisma } from "@/lib/db";

import {
  deleteStorageFile,
  uploadPortfolioImage,
} from "@/lib/supabase-storage";

export type AchievementActionResult = {
  success: boolean;
  message: string;
};

/* =========================================================
   FORM HELPERS
   ========================================================= */

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

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);

  if (!value || typeof value === "string" || value.size === 0) {
    return null;
  }

  return value;
}

function toDate(value: string) {
  return new Date(`${value}T12:00:00`);
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "achievement";
}

/* =========================================================
   AUTH
   ========================================================= */

async function requireAdmin() {
  const session = await auth();

  return Boolean(session?.user);
}

/* =========================================================
   REVALIDATE
   ========================================================= */

function revalidateAchievements() {
  revalidatePath("/en");

  revalidatePath("/km");

  revalidatePath("/en/dashboard/achievements");

  revalidatePath("/km/dashboard/achievements");

  revalidatePath("/en/dashboard", "layout");

  revalidatePath("/km/dashboard", "layout");
}

/* =========================================================
   SAVE
   ========================================================= */

export async function saveAchievementAction(
  formData: FormData,
): Promise<AchievementActionResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  const id = Number(text(formData, "id")) || undefined;

  const titleEn = text(formData, "titleEn");

  const activityDateValue = text(formData, "activityDate");

  if (!titleEn) {
    return {
      success: false,

      message: "English achievement title is required.",
    };
  }

  if (!activityDateValue) {
    return {
      success: false,

      message: "Achievement date is required.",
    };
  }

  /* =====================================================
     EXISTING ACHIEVEMENT
     ===================================================== */

  const existing = id
    ? await prisma.activity.findUnique({
        where: {
          id,
        },

        select: {
          type: true,

          coverImage: true,
        },
      })
    : null;

  if (id && !existing) {
    return {
      success: false,
      message: "Achievement not found.",
    };
  }

  if (existing && existing.type !== "ACHIEVEMENT") {
    return {
      success: false,

      message: "This record is not an achievement.",
    };
  }

  /* =====================================================
     COVER IMAGE
     ===================================================== */

  let coverImage =
    text(formData, "currentCoverImage") || existing?.coverImage || "";

  let newCoverImage: string | null = null;

  if (text(formData, "removeCoverImage") === "1") {
    coverImage = "";
  }

  const coverFile = getFile(formData, "coverImageFile");

  try {
    /* ===================================================
       UPLOAD NEW IMAGE TO SUPABASE
       =================================================== */

    if (coverFile) {
      newCoverImage = await uploadPortfolioImage(coverFile, "achievements", {
        maxMb: 5,

        prefix: "achievement",
      });

      coverImage = newCoverImage;
    }

    /* ===================================================
       DATABASE DATA
       =================================================== */

    const data = {
      type: "ACHIEVEMENT" as const,

      titleEn,

      titleKm: nullable(text(formData, "titleKm")),

      summaryEn: nullable(text(formData, "summaryEn")),

      summaryKm: nullable(text(formData, "summaryKm")),

      descriptionEn: nullable(text(formData, "descriptionEn")),

      descriptionKm: nullable(text(formData, "descriptionKm")),

      activityDate: toDate(activityDateValue),

      endDate: null,

      datePrecision: "DAY" as const,

      isCurrent: false,

      coverImage: nullable(coverImage),

      organizationEn: nullable(text(formData, "organizationEn")),

      organizationKm: nullable(text(formData, "organizationKm")),

      locationEn: nullable(text(formData, "locationEn")),

      locationKm: nullable(text(formData, "locationKm")),

      externalUrl: nullable(text(formData, "externalUrl")),

      githubUrl: null,

      demoUrl: null,

      credentialId: null,

      technologies: null,

      featured: bool(formData, "featured"),

      published: bool(formData, "published"),

      sortOrder: numberValue(formData, "sortOrder"),
    };

    /* ===================================================
       UPDATE
       =================================================== */

    if (id) {
      await prisma.activity.update({
        where: {
          id,
        },

        data,
      });
    } else {
      /* =================================================
         CREATE
         ================================================= */

      await prisma.activity.create({
        data: {
          slug: `${slugify(titleEn)}-${Date.now().toString(36)}`,

          ...data,
        },
      });
    }

    /* ===================================================
       DELETE OLD SUPABASE IMAGE
       =================================================== */

    if (existing?.coverImage && existing.coverImage !== coverImage) {
      await deleteStorageFile(existing.coverImage);
    }

    revalidateAchievements();

    return {
      success: true,

      message: id
        ? "Achievement updated successfully."
        : "Achievement created successfully.",
    };
  } catch (error) {
    /* ===================================================
       CLEAN NEW IMAGE IF DATABASE SAVE FAILED
       =================================================== */

    if (newCoverImage) {
      await deleteStorageFile(newCoverImage);
    }

    console.error("Achievement save error:", error);

    return {
      success: false,

      message:
        error instanceof Error ? error.message : "Unable to save achievement.",
    };
  }
}

/* =========================================================
   DELETE
   ========================================================= */

export async function deleteAchievementAction(
  id: number,
): Promise<AchievementActionResult> {
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

        coverImage: true,
      },
    });

    if (!existing || existing.type !== "ACHIEVEMENT") {
      return {
        success: false,

        message: "Achievement not found.",
      };
    }

    await prisma.activity.delete({
      where: {
        id,
      },
    });

    /*
     * Delete image from Supabase.
     *
     * Existing /uploads/... local images
     * are ignored by deleteStorageFile()
     * until we migrate them later.
     */
    await deleteStorageFile(existing.coverImage);

    revalidateAchievements();

    return {
      success: true,

      message: "Achievement deleted successfully.",
    };
  } catch (error) {
    console.error("Achievement delete error:", error);

    return {
      success: false,

      message: "Unable to delete achievement.",
    };
  }
}
