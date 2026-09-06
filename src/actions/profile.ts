"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import {
  deleteStorageFile,
  uploadPortfolioImage,
  uploadPortfolioPdf,
} from "@/lib/supabase-storage";

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

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

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

async function saveImageUpload(file: File, kind: "profile" | "badge") {
  const field = kind === "profile" ? "profileImageFile" : "badgeImageFile";

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new UploadValidationError(
      field,
      "Please upload a JPG, PNG or WEBP image.",
    );
  }

  if (file.size > IMAGE_MAX_BYTES) {
    throw new UploadValidationError(
      field,
      "Image size must be 5 MB or smaller.",
    );
  }

  return uploadPortfolioImage(file, "profile", {
    maxMb: 5,
    prefix: kind,
  });
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

  if (file.type !== "application/pdf") {
    throw new UploadValidationError(
      "cvFileUpload",
      "Please upload a valid PDF file.",
    );
  }

  return uploadPortfolioPdf(file, "cv");
}

async function removeStoredProfileFile(fileUrl: string | null | undefined) {
  await deleteStorageFile(fileUrl);
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
      await removeStoredProfileFile(existing.profileImage);
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
      await removeStoredProfileFile(newPath);
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
      await removeStoredProfileFile(existing.profileImage);
    }

    if (existing?.badgeImage && existing.badgeImage !== badgeImage) {
      await removeStoredProfileFile(existing.badgeImage);
    }

    if (existing?.cvFile && existing.cvFile !== cvFile) {
      await removeStoredProfileFile(existing.cvFile);
    }

    revalidateProfile(locale);

    return {
      success: true,
      message: "saved",
    };
  } catch (error) {
    if (error instanceof UploadValidationError) {
      if (newProfileImage) {
        await removeStoredProfileFile(newProfileImage);
      }

      if (newBadgeImage) {
        await removeStoredProfileFile(newBadgeImage);
      }

      if (newCvFile) {
        await removeStoredProfileFile(newCvFile);
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
      await removeStoredProfileFile(newProfileImage);
    }

    if (newBadgeImage) {
      await removeStoredProfileFile(newBadgeImage);
    }

    if (newCvFile) {
      await removeStoredProfileFile(newCvFile);
    }

    console.error("Profile save error:", error);

    return {
      success: false,
      message: "save_failed",
    };
  }
}
