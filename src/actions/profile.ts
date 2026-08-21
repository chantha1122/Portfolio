"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => value ?? "");

const profileSchema = z.object({
  locale: z.enum(["en", "km"]),

  fullName: z.string().trim().min(1, "Full name is required").max(100),

  headlineEn: optionalText,
  headlineKm: optionalText,

  shortBioEn: optionalText,
  shortBioKm: optionalText,

  bioEn: optionalText,
  bioKm: optionalText,

  currentRoleEn: optionalText,
  currentRoleKm: optionalText,

  currentFocusEn: optionalText,
  currentFocusKm: optionalText,

  yearsExperience: z.coerce.number().int().min(0).max(100),

  email: z
    .union([z.literal(""), z.string().email("Invalid email address")])
    .optional()
    .transform((value) => value ?? ""),

  phone: optionalText,
  telegram: optionalText,

  github: optionalText,
  linkedin: optionalText,
  facebook: optionalText,
  instagram: optionalText,
  youtube: optionalText,

  locationEn: optionalText,
  locationKm: optionalText,
});

export type ProfileActionState = {
  success: boolean;
  message: string | null;
  fieldErrors?: Record<string, string[]>;
};

const IMAGE_MAX_BYTES = 5 * 1024 * 1024;

const CV_MAX_BYTES = 10 * 1024 * 1024;

const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

class UploadValidationError extends Error {
  constructor(
    public field: string,
    message: string,
  ) {
    super(message);
  }
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);

  if (!value || typeof value === "string" || value.size === 0) {
    return null;
  }

  return value;
}

function shouldRemove(formData: FormData, key: string) {
  return getString(formData, key) === "1";
}

function getUploadDirectory() {
  return path.join(process.cwd(), "public", "uploads", "profile");
}

async function saveImageUpload(file: File, kind: "profile" | "badge") {
  const extension = IMAGE_EXTENSIONS[file.type];

  if (!extension) {
    throw new UploadValidationError(
      kind === "profile" ? "profileImageFile" : "badgeImageFile",

      "Please upload a JPG, PNG or WEBP image.",
    );
  }

  if (file.size > IMAGE_MAX_BYTES) {
    throw new UploadValidationError(
      kind === "profile" ? "profileImageFile" : "badgeImageFile",

      "Image size must be 5 MB or smaller.",
    );
  }

  const directory = getUploadDirectory();

  await mkdir(directory, {
    recursive: true,
  });

  const filename = `${kind}-${Date.now()}-${randomUUID().slice(
    0,
    8,
  )}.${extension}`;

  const absolutePath = path.join(directory, filename);

  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(absolutePath, bytes);

  return `/uploads/profile/${filename}`;
}

async function saveCvUpload(file: File) {
  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    throw new UploadValidationError(
      "cvFileUpload",
      "Please upload a PDF file.",
    );
  }

  if (file.size > CV_MAX_BYTES) {
    throw new UploadValidationError(
      "cvFileUpload",
      "CV file size must be 10 MB or smaller.",
    );
  }

  const directory = getUploadDirectory();

  await mkdir(directory, {
    recursive: true,
  });

  const filename = `cv-${Date.now()}-${randomUUID().slice(0, 8)}.pdf`;

  const absolutePath = path.join(directory, filename);

  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(absolutePath, bytes);

  return `/uploads/profile/${filename}`;
}

async function removeLocalProfileFile(filePath: string | null | undefined) {
  if (!filePath || !filePath.startsWith("/uploads/profile/")) {
    return;
  }

  const fileName = path.basename(filePath);

  const absolutePath = path.join(getUploadDirectory(), fileName);

  try {
    await unlink(absolutePath);
  } catch {
    // Ignore if an old file was
    // already removed.
  }
}

function revalidateProfile(locale: "en" | "km") {
  revalidatePath(`/${locale}`);

  revalidatePath(`/${locale}/dashboard`);

  revalidatePath(`/${locale}/dashboard/profile`);

  const otherLocale = locale === "en" ? "km" : "en";

  revalidatePath(`/${otherLocale}`);

  revalidatePath(`/${otherLocale}/dashboard/profile`);
}

/* =========================================================
   QUICK PROFILE IMAGE UPDATE
   ========================================================= */

export async function updateProfileImageAction(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "unauthorized",
    };
  }

  const locale = getString(formData, "locale") === "km" ? "km" : "en";

  const file = getFile(formData, "profileImageFile");

  if (!file) {
    return {
      success: false,

      message: "validation_error",

      fieldErrors: {
        profileImageFile: ["Please choose an image first."],
      },
    };
  }

  let newPath: string | null = null;

  try {
    const existing = await prisma.profile.findUnique({
      where: {
        profileKey: "main",
      },

      select: {
        profileImage: true,
      },
    });

    newPath = await saveImageUpload(file, "profile");

    await prisma.profile.upsert({
      where: {
        profileKey: "main",
      },

      create: {
        profileKey: "main",

        fullName: session.user.name || "Chantha",

        profileImage: newPath,
      },

      update: {
        profileImage: newPath,
      },
    });

    if (existing?.profileImage && existing.profileImage !== newPath) {
      await removeLocalProfileFile(existing.profileImage);
    }

    revalidateProfile(locale);

    return {
      success: true,
      message: "image_saved",
    };
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return {
        success: false,

        message: "validation_error",

        fieldErrors: {
          [error.field]: [error.message],
        },
      };
    }

    if (newPath) {
      await removeLocalProfileFile(newPath);
    }

    console.error("Profile image save error:", error);

    return {
      success: false,
      message: "save_failed",
    };
  }
}

/* =========================================================
   FULL PROFILE SAVE
   ========================================================= */

export async function saveProfileAction(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "unauthorized",
    };
  }

  const result = profileSchema.safeParse({
    locale: getString(formData, "locale"),

    fullName: getString(formData, "fullName"),

    headlineEn: getString(formData, "headlineEn"),

    headlineKm: getString(formData, "headlineKm"),

    shortBioEn: getString(formData, "shortBioEn"),

    shortBioKm: getString(formData, "shortBioKm"),

    bioEn: getString(formData, "bioEn"),

    bioKm: getString(formData, "bioKm"),

    currentRoleEn: getString(formData, "currentRoleEn"),

    currentRoleKm: getString(formData, "currentRoleKm"),

    currentFocusEn: getString(formData, "currentFocusEn"),

    currentFocusKm: getString(formData, "currentFocusKm"),

    yearsExperience: getString(formData, "yearsExperience") || "0",

    email: getString(formData, "email"),

    phone: getString(formData, "phone"),

    telegram: getString(formData, "telegram"),

    github: getString(formData, "github"),

    linkedin: getString(formData, "linkedin"),

    facebook: getString(formData, "facebook"),

    instagram: getString(formData, "instagram"),

    youtube: getString(formData, "youtube"),

    locationEn: getString(formData, "locationEn"),

    locationKm: getString(formData, "locationKm"),
  });

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};

    const flattened = result.error.flatten();

    Object.entries(flattened.fieldErrors).forEach(([key, value]) => {
      if (value) {
        fieldErrors[key] = value;
      }
    });

    return {
      success: false,

      message: "validation_error",

      fieldErrors,
    };
  }

  const { locale, ...profileData } = result.data;

  let newProfileImage: string | null = null;

  let newBadgeImage: string | null = null;

  let newCvFile: string | null = null;

  try {
    const existing = await prisma.profile.findUnique({
      where: {
        profileKey: "main",
      },

      select: {
        profileImage: true,

        badgeImage: true,

        cvFile: true,
      },
    });

    let profileImage = existing?.profileImage ?? "";

    let badgeImage = existing?.badgeImage ?? "";

    let cvFile = existing?.cvFile ?? "";

    if (shouldRemove(formData, "removeProfileImage")) {
      profileImage = "";
    }

    if (shouldRemove(formData, "removeBadgeImage")) {
      badgeImage = "";
    }

    if (shouldRemove(formData, "removeCvFile")) {
      cvFile = "";
    }

    const profileImageFile = getFile(formData, "profileImageFile");

    const badgeImageFile = getFile(formData, "badgeImageFile");

    const cvFileUpload = getFile(formData, "cvFileUpload");

    if (profileImageFile) {
      newProfileImage = await saveImageUpload(profileImageFile, "profile");

      profileImage = newProfileImage;
    }

    if (badgeImageFile) {
      newBadgeImage = await saveImageUpload(badgeImageFile, "badge");

      badgeImage = newBadgeImage;
    }

    if (cvFileUpload) {
      newCvFile = await saveCvUpload(cvFileUpload);

      cvFile = newCvFile;
    }

    await prisma.profile.upsert({
      where: {
        profileKey: "main",
      },

      create: {
        profileKey: "main",

        ...profileData,

        profileImage,
        badgeImage,
        cvFile,
      },

      update: {
        ...profileData,

        profileImage,
        badgeImage,
        cvFile,
      },
    });

    if (existing?.profileImage && existing.profileImage !== profileImage) {
      await removeLocalProfileFile(existing.profileImage);
    }

    if (existing?.badgeImage && existing.badgeImage !== badgeImage) {
      await removeLocalProfileFile(existing.badgeImage);
    }

    if (existing?.cvFile && existing.cvFile !== cvFile) {
      await removeLocalProfileFile(existing.cvFile);
    }

    revalidateProfile(locale);

    return {
      success: true,
      message: "saved",
    };
  } catch (error) {
    if (error instanceof UploadValidationError) {
      if (newProfileImage) {
        await removeLocalProfileFile(newProfileImage);
      }

      if (newBadgeImage) {
        await removeLocalProfileFile(newBadgeImage);
      }

      if (newCvFile) {
        await removeLocalProfileFile(newCvFile);
      }

      return {
        success: false,

        message: "validation_error",

        fieldErrors: {
          [error.field]: [error.message],
        },
      };
    }

    if (newProfileImage) {
      await removeLocalProfileFile(newProfileImage);
    }

    if (newBadgeImage) {
      await removeLocalProfileFile(newBadgeImage);
    }

    if (newCvFile) {
      await removeLocalProfileFile(newCvFile);
    }

    console.error("Profile save error:", error);

    return {
      success: false,
      message: "save_failed",
    };
  }
}
