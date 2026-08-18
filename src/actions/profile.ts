"use server";

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

  profileImage: optionalText,
  badgeImage: optionalText,
  cvFile: optionalText,
});

export type ProfileActionState = {
  success: boolean;

  message: string | null;

  fieldErrors?: Record<string, string[]>;
};

export const initialProfileActionState: ProfileActionState = {
  success: false,
  message: null,
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

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

    profileImage: getString(formData, "profileImage"),

    badgeImage: getString(formData, "badgeImage"),

    cvFile: getString(formData, "cvFile"),
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

  try {
    await prisma.profile.upsert({
      where: {
        profileKey: "main",
      },

      create: {
        profileKey: "main",
        ...profileData,
      },

      update: profileData,
    });

    revalidatePath(`/${locale}/dashboard`);

    revalidatePath(`/${locale}/dashboard/profile`);

    revalidatePath(`/${locale}`);

    return {
      success: true,
      message: "saved",
    };
  } catch (error) {
    console.error("Profile save error:", error);

    return {
      success: false,
      message: "save_failed",
    };
  }
}
