"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

import { prisma } from "@/lib/db";

import {
  deleteStorageFile,
  uploadPortfolioImage,
} from "@/lib/supabase-storage";

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

const MAX_GALLERY_FILES = 4;

/*
 * Project detail gallery:
 *
 * - maximum 3 new images per Save
 * - maximum 8 total images per project
 */
const MAX_PROJECT_MEDIA_PER_UPLOAD = 3;

const MAX_PROJECT_MEDIA_TOTAL = 8;

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

function numberList(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);
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

/* =========================================================
   AUTH
   ========================================================= */

async function requireAdmin() {
  const session = await auth();

  return Boolean(session?.user);
}

/* =========================================================
   SUPABASE STORAGE
   ========================================================= */

function getContentFolder(kind: ContentKind) {
  if (kind === "project") {
    return "projects";
  }

  if (kind === "certificate") {
    return "certificates";
  }

  return "activities";
}

async function saveContentImage(file: File, kind: ContentKind) {
  const folder = getContentFolder(kind);

  return uploadPortfolioImage(file, folder, {
    maxMb: 5,

    prefix: kind,
  });
}

async function saveProjectMediaImage(file: File) {
  return uploadPortfolioImage(file, "project-media", {
    maxMb: 5,

    prefix: "project-detail",
  });
}

async function saveGalleryImage(file: File) {
  return uploadPortfolioImage(file, "gallery", {
    maxMb: 5,

    prefix: "gallery",
  });
}

/*
 * deleteStorageFile() only removes files that
 * belong to our Supabase portfolio bucket.
 *
 * Existing old local URLs such as:
 *
 * /uploads/content/project/...
 *
 * are intentionally ignored for now.
 *
 * We will migrate those old files in a later step.
 */
async function removeStoredFile(fileUrl: string | null | undefined) {
  await deleteStorageFile(fileUrl);
}

/* =========================================================
   REVALIDATION
   ========================================================= */

function revalidatePortfolio(projectSlug?: string | null) {
  revalidatePath("/en/dashboard", "layout");

  revalidatePath("/km/dashboard", "layout");

  revalidatePath("/en/dashboard/projects");

  revalidatePath("/km/dashboard/projects");

  revalidatePath("/en/projects");

  revalidatePath("/km/projects");

  revalidatePath("/en");

  revalidatePath("/km");

  if (projectSlug) {
    revalidatePath(`/en/projects/${projectSlug}`);

    revalidatePath(`/km/projects/${projectSlug}`);
  }
}

/* =========================================================
   CONTENT TYPE
   ========================================================= */

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

  /* =====================================================
     LOAD CURRENT RECORD
     ===================================================== */

  const existing = id
    ? await prisma.activity.findUnique({
        where: {
          id,
        },

        select: {
          id: true,

          slug: true,

          type: true,

          coverImage: true,

          media: {
            where: {
              type: "IMAGE",
            },

            select: {
              id: true,

              fileUrl: true,

              sortOrder: true,
            },
          },
        },
      })
    : null;

  if (id && !existing) {
    return {
      success: false,

      message: "Content was not found.",
    };
  }

  /* =====================================================
     TYPE SAFETY
     ===================================================== */

  if (existing && kind === "project" && existing.type !== "PROJECT") {
    return {
      success: false,

      message: "This record is not a project.",
    };
  }

  if (existing && kind === "certificate" && existing.type !== "CERTIFICATE") {
    return {
      success: false,

      message: "This record is not a certificate.",
    };
  }

  if (
    existing &&
    kind === "activity" &&
    !["EVENT", "COMPETITION", "OTHER"].includes(existing.type)
  ) {
    return {
      success: false,

      message: "This record cannot be edited from Activities.",
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

  /* =====================================================
     PROJECT DETAIL MEDIA
     ===================================================== */

  const projectMediaFiles =
    kind === "project" ? getFiles(formData, "projectMediaFiles") : [];

  const requestedRemoveMediaIds =
    kind === "project" ? numberList(formData, "removeMediaIds") : [];

  if (projectMediaFiles.length > MAX_PROJECT_MEDIA_PER_UPLOAD) {
    return {
      success: false,

      message: `Upload at most ${MAX_PROJECT_MEDIA_PER_UPLOAD} project detail images at one time.`,
    };
  }

  const existingProjectMedia = existing?.media ?? [];

  /*
   * Only IDs that actually belong to
   * the current project are accepted.
   */
  const existingMediaIdSet = new Set(
    existingProjectMedia.map((media) => media.id),
  );

  const removeMediaIds = requestedRemoveMediaIds.filter((mediaId) =>
    existingMediaIdSet.has(mediaId),
  );

  const removableIds = new Set(removeMediaIds);

  const remainingProjectMedia = existingProjectMedia.filter(
    (media) => !removableIds.has(media.id),
  );

  if (
    remainingProjectMedia.length + projectMediaFiles.length >
    MAX_PROJECT_MEDIA_TOTAL
  ) {
    return {
      success: false,

      message: `A project can have up to ${MAX_PROJECT_MEDIA_TOTAL} detail images.`,
    };
  }

  /*
   * New Supabase URLs are tracked so
   * we can clean them if Prisma fails.
   */
  const newProjectMediaUrls: string[] = [];

  let savedSlug = existing?.slug ?? null;

  try {
    /* ===================================================
       UPLOAD NEW COVER TO SUPABASE
       =================================================== */

    if (coverFile) {
      newCoverImage = await saveContentImage(coverFile, kind);

      coverImage = newCoverImage;
    }

    /* ===================================================
       UPLOAD PROJECT DETAIL IMAGES TO SUPABASE
       =================================================== */

    if (kind === "project") {
      for (const file of projectMediaFiles) {
        const url = await saveProjectMediaImage(file);

        newProjectMediaUrls.push(url);
      }
    }

    /* ===================================================
       COMMON DATA
       =================================================== */

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

    /* ===================================================
       TYPE-SPECIFIC DATA
       =================================================== */

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

    /* ===================================================
       UPDATE
       =================================================== */

    if (id) {
      const highestRemainingOrder = remainingProjectMedia.reduce(
        (highest, media) => Math.max(highest, media.sortOrder),
        -1,
      );

      await prisma.$transaction(async (tx) => {
        await tx.activity.update({
          where: {
            id,
          },

          data: {
            ...commonData,

            ...contextualData,
          },
        });

        /* =============================================
             REMOVE PROJECT DETAIL RECORDS
             ============================================= */

        if (kind === "project" && removeMediaIds.length > 0) {
          await tx.activityMedia.deleteMany({
            where: {
              activityId: id,

              type: "IMAGE",

              id: {
                in: removeMediaIds,
              },
            },
          });
        }

        /* =============================================
             CREATE NEW PROJECT DETAIL RECORDS
             ============================================= */

        if (kind === "project" && newProjectMediaUrls.length > 0) {
          await tx.activityMedia.createMany({
            data: newProjectMediaUrls.map((fileUrl, index) => ({
              activityId: id,

              fileUrl,

              type: "IMAGE",

              sortOrder: highestRemainingOrder + index + 1,
            })),
          });
        }
      });

      savedSlug = existing?.slug ?? null;
    } else {
      /* =================================================
         CREATE
         ================================================= */

      const generatedSlug = `${slugify(titleEn)}-${Date.now().toString(36)}`;

      const created = await prisma.$transaction(async (tx) => {
        const activity = await tx.activity.create({
          data: {
            slug: generatedSlug,

            ...commonData,

            ...contextualData,
          },
        });

        if (kind === "project" && newProjectMediaUrls.length > 0) {
          await tx.activityMedia.createMany({
            data: newProjectMediaUrls.map((fileUrl, index) => ({
              activityId: activity.id,

              fileUrl,

              type: "IMAGE",

              sortOrder: index,
            })),
          });
        }

        return activity;
      });

      savedSlug = created.slug;
    }

    /* ===================================================
       DELETE OLD COVER FROM SUPABASE
       =================================================== */

    if (existing?.coverImage && existing.coverImage !== coverImage) {
      await removeStoredFile(existing.coverImage);
    }

    /* ===================================================
       DELETE REMOVED PROJECT MEDIA FROM SUPABASE
       =================================================== */

    if (kind === "project" && removeMediaIds.length > 0) {
      const removedMedia = existingProjectMedia.filter((media) =>
        removableIds.has(media.id),
      );

      await Promise.all(
        removedMedia.map((media) => removeStoredFile(media.fileUrl)),
      );
    }

    revalidatePortfolio(kind === "project" ? savedSlug : undefined);

    return {
      success: true,

      message: id ? "Updated successfully." : "Created successfully.",
    };
  } catch (error) {
    /* ===================================================
       CLEAN NEW COVER IF PRISMA SAVE FAILED
       =================================================== */

    if (newCoverImage) {
      await removeStoredFile(newCoverImage);
    }

    /* ===================================================
       CLEAN NEW PROJECT IMAGES IF PRISMA SAVE FAILED
       =================================================== */

    await Promise.all(
      newProjectMediaUrls.map((fileUrl) => removeStoredFile(fileUrl)),
    );

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

  /* =====================================================
     EDIT GALLERY ITEM
     ===================================================== */

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
        newImage = await saveGalleryImage(files[0]);

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
        await removeStoredFile(existing.coverImage);
      }

      revalidatePortfolio();

      return {
        success: true,

        message: "Gallery item updated successfully.",
      };
    } catch (error) {
      if (newImage) {
        await removeStoredFile(newImage);
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

  /* =====================================================
     CREATE MULTIPLE GALLERY ITEMS
     ===================================================== */

  const savedFiles: string[] = [];

  try {
    for (const file of files) {
      const url = await saveGalleryImage(file);

      savedFiles.push(url);
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
    await Promise.all(savedFiles.map((fileUrl) => removeStoredFile(fileUrl)));

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
        slug: true,

        type: true,

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

    /* ===================================================
       DELETE COVER FROM SUPABASE
       =================================================== */

    await removeStoredFile(item.coverImage);

    /* ===================================================
       DELETE PROJECT MEDIA FROM SUPABASE
       =================================================== */

    await Promise.all(
      item.media.map((media) => removeStoredFile(media.fileUrl)),
    );

    revalidatePortfolio(item.type === "PROJECT" ? item.slug : undefined);

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
