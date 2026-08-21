"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

type ActionState = {
  success: boolean;
  message: string;
};

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

function safeLocale(value: FormDataEntryValue | null) {
  return value === "km" ? "km" : "en";
}

function extensionFromMimeType(type: string) {
  if (type === "image/png") {
    return "png";
  }

  if (type === "image/webp") {
    return "webp";
  }

  return "jpg";
}

async function removeLocalGitHubImage(storedPath: string | null | undefined) {
  if (!storedPath) {
    return;
  }

  if (!storedPath.startsWith("/uploads/github/")) {
    return;
  }

  const uploadRoot = path.resolve(process.cwd(), "public", "uploads", "github");

  const target = path.resolve(
    process.cwd(),
    "public",
    storedPath.replace(/^\/+/, ""),
  );

  /*
   * Security:
   * delete files only from our GitHub upload directory.
   */
  if (!target.startsWith(uploadRoot)) {
    return;
  }

  try {
    await unlink(target);
  } catch {
    /*
     * Ignore missing old file.
     *
     * Database state is more important than an already
     * deleted local image.
     */
  }
}

function revalidateGitHubPages(locale: "en" | "km") {
  revalidatePath(`/${locale}`);

  revalidatePath(`/${locale}/dashboard`);

  revalidatePath(`/${locale}/dashboard/github`);
}

export async function saveGitHubActivityAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "You must be signed in.",
    };
  }

  const locale = safeLocale(formData.get("locale"));

  const username = String(formData.get("githubUsername") ?? "")
    .trim()
    .replace(/^@+/, "");

  const fileValue = formData.get("contributionImage");

  const file =
    fileValue instanceof File && fileValue.size > 0 ? fileValue : null;

  if (file) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return {
        success: false,
        message: "Please upload a PNG, JPG, JPEG or WebP image.",
      };
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return {
        success: false,
        message: "The screenshot must be 8 MB or smaller.",
      };
    }
  }

  const profile = await prisma.profile.findUnique({
    where: {
      profileKey: "main",
    },

    select: {
      githubContributionImage: true,
    },
  });

  if (!profile) {
    return {
      success: false,
      message: "Profile record was not found.",
    };
  }

  let newImagePath: string | null = null;

  let newAbsolutePath: string | null = null;

  try {
    if (file) {
      const uploadDirectory = path.join(
        process.cwd(),
        "public",
        "uploads",
        "github",
      );

      await mkdir(uploadDirectory, {
        recursive: true,
      });

      const extension = extensionFromMimeType(file.type);

      const fileName = `github-contributions-${Date.now()}-${randomUUID()}.${extension}`;

      newAbsolutePath = path.join(uploadDirectory, fileName);

      newImagePath = `/uploads/github/${fileName}`;

      const bytes = await file.arrayBuffer();

      await writeFile(newAbsolutePath, Buffer.from(bytes));
    }

    await prisma.profile.update({
      where: {
        profileKey: "main",
      },

      data: {
        githubUsername: username || null,

        githubContributionImage:
          newImagePath ?? profile.githubContributionImage,
      },
    });

    /*
     * New screenshot is already saved successfully,
     * so remove the old local screenshot.
     */
    if (
      newImagePath &&
      profile.githubContributionImage &&
      profile.githubContributionImage !== newImagePath
    ) {
      await removeLocalGitHubImage(profile.githubContributionImage);
    }

    revalidateGitHubPages(locale);

    return {
      success: true,
      message: file
        ? "GitHub contribution screenshot updated successfully."
        : "GitHub information updated successfully.",
    };
  } catch (error) {
    /*
     * If database update failed after a new file was written,
     * remove the unused new file.
     */
    if (newAbsolutePath) {
      try {
        await unlink(newAbsolutePath);
      } catch {
        // Ignore cleanup failure.
      }
    }

    console.error("GitHub activity save error:", error);

    return {
      success: false,
      message: "Unable to save GitHub activity.",
    };
  }
}

export async function removeGitHubContributionImageAction(
  formData: FormData,
): Promise<void> {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const locale = safeLocale(formData.get("locale"));

  const profile = await prisma.profile.findUnique({
    where: {
      profileKey: "main",
    },

    select: {
      githubContributionImage: true,
    },
  });

  if (!profile) {
    return;
  }

  await prisma.profile.update({
    where: {
      profileKey: "main",
    },

    data: {
      githubContributionImage: null,
    },
  });

  await removeLocalGitHubImage(profile.githubContributionImage);

  revalidateGitHubPages(locale);
}
