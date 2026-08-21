"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export type SpecializedContentResult = {
  success: boolean;
  message: string;
};

type ContentKind = "activity" | "project" | "certificate";

type ContentType =
  | "EVENT"
  | "COMPETITION"
  | "OTHER"
  | "PROJECT"
  | "CERTIFICATE";

const IMAGE_MAX_BYTES = 5 * 1024 * 1024;

const MAX_GALLERY_FILES = 4;

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

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);

  if (!value || typeof value === "string" || value.size === 0) {
    return null;
  }

  return value;
}

function getFiles(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter(
      (value): value is File => typeof value !== "string" && value.size > 0,
    );
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function numberValue(formData: FormData, key: string) {
  const value = Number(text(formData, key));

  return Number.isFinite(value) ? value : 0;
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

  return slug || "portfolio-item";
}

async function requireAdmin() {
  const session = await auth();

  return Boolean(session?.user);
}

function uploadDirectory(kind: string) {
  return path.join(process.cwd(), "public", "uploads", "content", kind);
}

async function saveImage(file: File, kind: string) {
  const extension = IMAGE_TYPES[file.type];

  if (!extension) {
    throw new Error("Please upload a JPG, PNG or WEBP image.");
  }

  if (file.size > IMAGE_MAX_BYTES) {
    throw new Error("Image size must be 5 MB or smaller.");
  }

  const directory = uploadDirectory(kind);

  await mkdir(directory, {
    recursive: true,
  });

  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;

  const absolutePath = path.join(directory, filename);

  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(absolutePath, bytes);

  return `/uploads/content/${kind}/${filename}`;
}

async function removeLocalFile(filePath: string | null | undefined) {
  if (!filePath || !filePath.startsWith("/uploads/content/")) {
    return;
  }

  const relativePath = filePath.replace(/^\/+/, "");

  const absolutePath = path.join(process.cwd(), "public", relativePath);

  try {
    await unlink(absolutePath);
  } catch {
    // Old file may already be removed.
  }
}

function revalidatePortfolio() {
  revalidatePath("/en/dashboard", "layout");

  revalidatePath("/km/dashboard", "layout");

  revalidatePath("/en");
  revalidatePath("/km");
}

function resolveContentType(
  kind: ContentKind,
  formData: FormData,
): ContentType | null {
  if (kind === "project") {
    return "PROJECT";
  }

  if (kind === "certificate") {
    return "CERTIFICATE";
  }

  const requested = text(formData, "type");

  if (
    requested === "EVENT" ||
    requested === "COMPETITION" ||
    requested === "OTHER"
  ) {
    return requested;
  }

  return null;
}

/* =========================================================
   ACTIVITIES / PROJECTS / CERTIFICATES
   ========================================================= */

export async function saveSpecializedContentAction(
  formData: FormData,
): Promise<SpecializedContentResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  const kind = text(formData, "kind") as ContentKind;

  if (!["activity", "project", "certificate"].includes(kind)) {
    return {
      success: false,
      message: "Invalid content type.",
    };
  }

  const contentType = resolveContentType(kind, formData);

  if (!contentType) {
    return {
      success: false,
      message: "Please choose a valid activity type.",
    };
  }

  const id = Number(text(formData, "id")) || undefined;

  const titleEn = text(formData, "titleEn");

  const activityDateValue = text(formData, "activityDate");

  if (!titleEn) {
    return {
      success: false,
      message: "English title is required.",
    };
  }

  if (!activityDateValue) {
    return {
      success: false,
      message: "Date is required.",
    };
  }

  const existing = id
    ? await prisma.activity.findUnique({
        where: {
          id,
        },

        select: {
          coverImage: true,
        },
      })
    : null;

  let coverImage =
    text(formData, "currentCoverImage") || existing?.coverImage || "";

  let newCoverImage: string | null = null;

  if (text(formData, "removeCoverImage") === "1") {
    coverImage = "";
  }

  const coverFile = getFile(formData, "coverImageFile");

  try {
    if (coverFile) {
      newCoverImage = await saveImage(coverFile, kind);

      coverImage = newCoverImage;
    }

    const endDateValue = text(formData, "endDate");

    const commonData = {
      type: contentType,

      titleEn,

      titleKm: nullable(text(formData, "titleKm")),

      summaryEn: nullable(text(formData, "summaryEn")),

      summaryKm: nullable(text(formData, "summaryKm")),

      descriptionEn: nullable(text(formData, "descriptionEn")),

      descriptionKm: nullable(text(formData, "descriptionKm")),

      activityDate: toDate(activityDateValue),

      endDate: endDateValue ? toDate(endDateValue) : null,

      datePrecision: "DAY" as const,

      coverImage: nullable(coverImage),

      featured: bool(formData, "featured"),

      published: bool(formData, "published"),

      isCurrent: bool(formData, "isCurrent"),

      sortOrder: numberValue(formData, "sortOrder"),
    };

    const contextualData =
      kind === "project"
        ? {
            organizationEn: nullable(text(formData, "organizationEn")),

            organizationKm: nullable(text(formData, "organizationKm")),

            locationEn: null,

            locationKm: null,

            technologies: nullable(text(formData, "technologies")),

            githubUrl: nullable(text(formData, "githubUrl")),

            demoUrl: nullable(text(formData, "demoUrl")),

            externalUrl: nullable(text(formData, "externalUrl")),

            credentialId: null,
          }
        : kind === "certificate"
          ? {
              organizationEn: nullable(text(formData, "organizationEn")),

              organizationKm: nullable(text(formData, "organizationKm")),

              locationEn: null,

              locationKm: null,

              technologies: null,

              githubUrl: null,

              demoUrl: null,

              externalUrl: nullable(text(formData, "externalUrl")),

              credentialId: nullable(text(formData, "credentialId")),
            }
          : {
              organizationEn: nullable(text(formData, "organizationEn")),

              organizationKm: nullable(text(formData, "organizationKm")),

              locationEn: nullable(text(formData, "locationEn")),

              locationKm: nullable(text(formData, "locationKm")),

              technologies: null,

              githubUrl: null,

              demoUrl: null,

              externalUrl: null,

              credentialId: null,
            };

    if (id) {
      await prisma.activity.update({
        where: {
          id,
        },

        data: {
          ...commonData,
          ...contextualData,
        },
      });
    } else {
      await prisma.activity.create({
        data: {
          slug: `${slugify(titleEn)}-${Date.now().toString(36)}`,

          ...commonData,
          ...contextualData,
        },
      });
    }

    if (existing?.coverImage && existing.coverImage !== coverImage) {
      await removeLocalFile(existing.coverImage);
    }

    revalidatePortfolio();

    return {
      success: true,

      message: id ? "Updated successfully." : "Created successfully.",
    };
  } catch (error) {
    if (newCoverImage) {
      await removeLocalFile(newCoverImage);
    }

    console.error("Specialized content save error:", error);

    return {
      success: false,

      message:
        error instanceof Error ? error.message : "Unable to save content.",
    };
  }
}

/* =========================================================
   GALLERY
   ========================================================= */

export async function saveGalleryItemAction(
  formData: FormData,
): Promise<SpecializedContentResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  const id = Number(text(formData, "id")) || undefined;

  const titleEn = text(formData, "titleEn");

  const titleKm = text(formData, "titleKm");

  const summaryEn = text(formData, "summaryEn");

  const summaryKm = text(formData, "summaryKm");

  const activityDateValue = text(formData, "activityDate");

  if (!activityDateValue) {
    return {
      success: false,
      message: "Date is required.",
    };
  }

  const files = getFiles(formData, "galleryFiles");

  if (files.length > MAX_GALLERY_FILES) {
    return {
      success: false,
      message: "Upload a maximum of 4 photos at one time.",
    };
  }

  if (!id && files.length === 0) {
    return {
      success: false,
      message: "Choose at least one image.",
    };
  }

  /* EDIT */

  if (id) {
    const existing = await prisma.activity.findUnique({
      where: {
        id,
      },

      select: {
        coverImage: true,
      },
    });

    if (!existing) {
      return {
        success: false,
        message: "Gallery item was not found.",
      };
    }

    let coverImage = existing.coverImage || "";

    let newImage: string | null = null;

    try {
      if (files[0]) {
        newImage = await saveImage(files[0], "gallery");

        coverImage = newImage;
      }

      await prisma.activity.update({
        where: {
          id,
        },

        data: {
          type: "PHOTO",

          titleEn: titleEn || "Gallery photo",

          titleKm: nullable(titleKm),

          summaryEn: nullable(summaryEn),

          summaryKm: nullable(summaryKm),

          descriptionEn: null,

          descriptionKm: null,

          activityDate: toDate(activityDateValue),

          endDate: null,

          datePrecision: "DAY",

          isCurrent: false,

          coverImage: nullable(coverImage),

          organizationEn: null,

          organizationKm: null,

          locationEn: null,

          locationKm: null,

          externalUrl: null,

          githubUrl: null,

          demoUrl: null,

          credentialId: null,

          technologies: null,

          featured: bool(formData, "featured"),

          published: bool(formData, "published"),

          sortOrder: numberValue(formData, "sortOrder"),
        },
      });

      if (existing.coverImage && existing.coverImage !== coverImage) {
        await removeLocalFile(existing.coverImage);
      }

      revalidatePortfolio();

      return {
        success: true,
        message: "Gallery item updated successfully.",
      };
    } catch (error) {
      if (newImage) {
        await removeLocalFile(newImage);
      }

      console.error("Gallery update error:", error);

      return {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to update gallery item.",
      };
    }
  }

  /* CREATE MULTIPLE */

  const savedFiles: string[] = [];

  try {
    for (const file of files) {
      const savedPath = await saveImage(file, "gallery");

      savedFiles.push(savedPath);
    }

    const batchToken = Date.now().toString(36);

    await prisma.$transaction(
      files.map((file, index) => {
        const fallbackTitle = file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ");

        const itemTitle = titleEn || fallbackTitle || "Gallery photo";

        const numberedTitle =
          files.length > 1 ? `${itemTitle} ${index + 1}` : itemTitle;

        return prisma.activity.create({
          data: {
            slug: `${slugify(numberedTitle)}-${batchToken}-${index}`,

            type: "PHOTO",

            titleEn: numberedTitle,

            titleKm: nullable(titleKm),

            summaryEn: nullable(summaryEn),

            summaryKm: nullable(summaryKm),

            descriptionEn: null,

            descriptionKm: null,

            activityDate: toDate(activityDateValue),

            endDate: null,

            datePrecision: "DAY",

            isCurrent: false,

            coverImage: savedFiles[index],

            organizationEn: null,

            organizationKm: null,

            locationEn: null,

            locationKm: null,

            externalUrl: null,

            githubUrl: null,

            demoUrl: null,

            credentialId: null,

            technologies: null,

            featured: bool(formData, "featured"),

            published: bool(formData, "published"),

            sortOrder: numberValue(formData, "sortOrder") + index,
          },
        });
      }),
    );

    revalidatePortfolio();

    return {
      success: true,

      message:
        files.length > 1
          ? `${files.length} photos added to the gallery.`
          : "Photo added to the gallery.",
    };
  } catch (error) {
    await Promise.all(savedFiles.map((filePath) => removeLocalFile(filePath)));

    console.error("Gallery create error:", error);

    return {
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Unable to add gallery photos.",
    };
  }
}

/* =========================================================
   DELETE
   ========================================================= */

export async function deleteSpecializedContentAction(
  id: number,
): Promise<SpecializedContentResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  try {
    const item = await prisma.activity.findUnique({
      where: {
        id,
      },

      select: {
        coverImage: true,

        media: {
          select: {
            fileUrl: true,
          },
        },
      },
    });

    if (!item) {
      return {
        success: false,
        message: "Content was not found.",
      };
    }

    await prisma.activity.delete({
      where: {
        id,
      },
    });

    await removeLocalFile(item.coverImage);

    await Promise.all(
      item.media.map((media) => removeLocalFile(media.fileUrl)),
    );

    revalidatePortfolio();

    return {
      success: true,
      message: "Deleted successfully.",
    };
  } catch (error) {
    console.error("Specialized content delete error:", error);

    return {
      success: false,
      message: "Unable to delete content.",
    };
  }
}
