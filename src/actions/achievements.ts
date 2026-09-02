"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export type AchievementActionResult = {
  success: boolean;
  message: string;
};

const IMAGE_MAX_BYTES = 5 * 1024 * 1024;

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
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

async function requireAdmin() {
  const session = await auth();

  return Boolean(session?.user);
}

function achievementDirectory() {
  return path.join(
    process.cwd(),
    "public",
    "uploads",
    "content",
    "achievement",
  );
}

async function saveAchievementImage(file: File) {
  const extension = IMAGE_TYPES[file.type];

  if (!extension) {
    throw new Error("Please upload a JPG, PNG or WEBP image.");
  }

  if (file.size > IMAGE_MAX_BYTES) {
    throw new Error("Achievement image must be 5 MB or smaller.");
  }

  const directory = achievementDirectory();

  await mkdir(directory, {
    recursive: true,
  });

  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;

  const absolutePath = path.join(directory, filename);

  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(absolutePath, bytes);

  return `/uploads/content/achievement/${filename}`;
}

async function removeAchievementImage(filePath: string | null | undefined) {
  if (!filePath || !filePath.startsWith("/uploads/content/achievement/")) {
    return;
  }

  const relativePath = filePath.replace(/^\/+/, "");

  const absolutePath = path.join(process.cwd(), "public", relativePath);

  try {
    await unlink(absolutePath);
  } catch {
    // File may already be gone.
  }
}

function revalidateAchievements() {
  revalidatePath("/en");

  revalidatePath("/km");

  revalidatePath("/en/dashboard/achievements");

  revalidatePath("/km/dashboard/achievements");

  revalidatePath("/en/dashboard", "layout");

  revalidatePath("/km/dashboard", "layout");
}

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

  if (existing && existing.type !== "ACHIEVEMENT") {
    return {
      success: false,
      message: "This record is not an achievement.",
    };
  }

  let coverImage =
    text(formData, "currentCoverImage") || existing?.coverImage || "";

  let newCoverImage: string | null = null;

  if (text(formData, "removeCoverImage") === "1") {
    coverImage = "";
  }

  const coverFile = getFile(formData, "coverImageFile");

  try {
    if (coverFile) {
      newCoverImage = await saveAchievementImage(coverFile);

      coverImage = newCoverImage;
    }

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

    if (id) {
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

    if (existing?.coverImage && existing.coverImage !== coverImage) {
      await removeAchievementImage(existing.coverImage);
    }

    revalidateAchievements();

    return {
      success: true,

      message: id
        ? "Achievement updated successfully."
        : "Achievement created successfully.",
    };
  } catch (error) {
    if (newCoverImage) {
      await removeAchievementImage(newCoverImage);
    }

    console.error("Achievement save error:", error);

    return {
      success: false,

      message:
        error instanceof Error ? error.message : "Unable to save achievement.",
    };
  }
}

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

    await removeAchievementImage(existing.coverImage);

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
