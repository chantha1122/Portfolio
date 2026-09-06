import "dotenv/config";

import path from "node:path";

import { access, readFile } from "node:fs/promises";

import { createClient } from "@supabase/supabase-js";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

/* =========================================================
   ENVIRONMENT
   ========================================================= */

const DATABASE_URL = process.env.DATABASE_URL;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "portfolio";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured.");
}

if (!SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
}

if (!SUPABASE_SECRET_KEY) {
  throw new Error("SUPABASE_SECRET_KEY is not configured.");
}

/* =========================================================
   CLIENTS
   ========================================================= */

const adapter = new PrismaPg({
  connectionString: DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: {
    persistSession: false,

    autoRefreshToken: false,
  },
});

/* =========================================================
   CONSTANTS
   ========================================================= */

const LOCAL_UPLOAD_PREFIX = "/uploads/";

const migratedCache = new Map<string, string>();

const failures: Array<{
  oldUrl: string;

  reason: string;
}> = [];

/* =========================================================
   MIME TYPE
   ========================================================= */

function getMimeType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";

    case ".png":
      return "image/png";

    case ".webp":
      return "image/webp";

    case ".pdf":
      return "application/pdf";

    default:
      return "application/octet-stream";
  }
}

/* =========================================================
   SUPABASE FOLDER
   ========================================================= */

function getStorageFolder(localUrl: string) {
  /*
   * Existing paths:
   *
   * /uploads/content/project/...
   * /uploads/content/project-media/...
   * /uploads/content/gallery/...
   * /uploads/content/certificate/...
   * /uploads/content/achievement/...
   * /uploads/content/activity/...
   * /uploads/profile/...
   * /uploads/github/...
   * /uploads/skills-tools/...
   */

  if (localUrl.startsWith("/uploads/content/project-media/")) {
    return "project-media";
  }

  if (localUrl.startsWith("/uploads/content/project/")) {
    return "projects";
  }

  if (localUrl.startsWith("/uploads/content/gallery/")) {
    return "gallery";
  }

  if (localUrl.startsWith("/uploads/content/certificate/")) {
    return "certificates";
  }

  if (localUrl.startsWith("/uploads/content/achievement/")) {
    return "achievements";
  }

  if (localUrl.startsWith("/uploads/content/activity/")) {
    return "activities";
  }

  if (localUrl.startsWith("/uploads/github/")) {
    return "github";
  }

  if (localUrl.startsWith("/uploads/skills-tools/")) {
    return "skills-tools";
  }

  if (localUrl.startsWith("/uploads/profile/")) {
    /*
     * Old CV files were also stored
     * inside /uploads/profile/.
     */
    if (localUrl.toLowerCase().endsWith(".pdf")) {
      return "cv";
    }

    return "profile";
  }

  return "legacy";
}

/* =========================================================
   LOCAL FILE PATH
   ========================================================= */

function getAbsoluteLocalPath(localUrl: string) {
  const relativePath = localUrl.replace(/^\/+/, "");

  return path.join(process.cwd(), "public", relativePath);
}

/* =========================================================
   CHECK FILE EXISTS
   ========================================================= */

async function fileExists(filePath: string) {
  try {
    await access(filePath);

    return true;
  } catch {
    return false;
  }
}

/* =========================================================
   MIGRATE ONE FILE
   ========================================================= */

async function migrateFile(oldUrl: string | null | undefined) {
  if (!oldUrl) {
    return oldUrl;
  }

  /*
   * Already Supabase / external.
   */
  if (!oldUrl.startsWith(LOCAL_UPLOAD_PREFIX)) {
    return oldUrl;
  }

  /*
   * Avoid uploading the same old URL twice.
   */
  const cached = migratedCache.get(oldUrl);

  if (cached) {
    return cached;
  }

  const absolutePath = getAbsoluteLocalPath(oldUrl);

  const exists = await fileExists(absolutePath);

  if (!exists) {
    const message = `Local file does not exist: ${absolutePath}`;

    failures.push({
      oldUrl,

      reason: message,
    });

    console.error(`❌ ${message}`);

    return oldUrl;
  }

  const folder = getStorageFolder(oldUrl);

  const filename = path.basename(absolutePath);

  /*
   * migration/ is intentionally not used.
   *
   * Old and new files should end up in
   * the same final folders.
   */
  const storagePath = `${folder}/${filename}`;

  const bytes = await readFile(absolutePath);

  const contentType = getMimeType(absolutePath);

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, bytes, {
      contentType,

      cacheControl: "31536000",

      /*
       * Makes the migration safe to run again
       * after a partial failure.
       */
      upsert: true,
    });

  if (uploadError) {
    const message = uploadError.message;

    failures.push({
      oldUrl,

      reason: message,
    });

    console.error(`❌ Upload failed: ${oldUrl}`);

    console.error(message);

    return oldUrl;
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  if (!data.publicUrl) {
    const message = "Supabase did not return a public URL.";

    failures.push({
      oldUrl,

      reason: message,
    });

    console.error(`❌ ${message}`, oldUrl);

    return oldUrl;
  }

  migratedCache.set(oldUrl, data.publicUrl);

  console.log(`✅ ${oldUrl}`);

  console.log(`   → ${data.publicUrl}`);

  return data.publicUrl;
}

/* =========================================================
   PROFILE
   ========================================================= */

async function migrateProfiles() {
  console.log("\n========== PROFILE ==========");

  const profiles = await prisma.profile.findMany({
    select: {
      id: true,

      profileImage: true,

      badgeImage: true,

      cvFile: true,

      githubContributionImage: true,
    },
  });

  for (const profile of profiles) {
    const profileImage = await migrateFile(profile.profileImage);

    const badgeImage = await migrateFile(profile.badgeImage);

    const cvFile = await migrateFile(profile.cvFile);

    const githubContributionImage = await migrateFile(
      profile.githubContributionImage,
    );

    await prisma.profile.update({
      where: {
        id: profile.id,
      },

      data: {
        profileImage: profileImage || null,

        badgeImage: badgeImage || null,

        cvFile: cvFile || null,

        githubContributionImage: githubContributionImage || null,
      },
    });
  }
}

/* =========================================================
   ACTIVITY COVER IMAGES
   ========================================================= */

async function migrateActivities() {
  console.log("\n========== ACTIVITIES ==========");

  const activities = await prisma.activity.findMany({
    select: {
      id: true,

      coverImage: true,
    },
  });

  for (const activity of activities) {
    if (!activity.coverImage?.startsWith(LOCAL_UPLOAD_PREFIX)) {
      continue;
    }

    const coverImage = await migrateFile(activity.coverImage);

    if (coverImage === activity.coverImage) {
      continue;
    }

    await prisma.activity.update({
      where: {
        id: activity.id,
      },

      data: {
        coverImage: coverImage || null,
      },
    });
  }
}

/* =========================================================
   ACTIVITY MEDIA
   ========================================================= */

async function migrateActivityMedia() {
  console.log("\n========== ACTIVITY MEDIA ==========");

  const mediaItems = await prisma.activityMedia.findMany({
    select: {
      id: true,

      fileUrl: true,
    },
  });

  for (const media of mediaItems) {
    if (!media.fileUrl.startsWith(LOCAL_UPLOAD_PREFIX)) {
      continue;
    }

    const fileUrl = await migrateFile(media.fileUrl);

    if (!fileUrl || fileUrl === media.fileUrl) {
      continue;
    }

    await prisma.activityMedia.update({
      where: {
        id: media.id,
      },

      data: {
        fileUrl,
      },
    });
  }
}

/* =========================================================
   SKILLS
   ========================================================= */

async function migrateSkills() {
  console.log("\n========== SKILLS ==========");

  const skills = await prisma.skill.findMany({
    select: {
      id: true,

      icon: true,
    },
  });

  for (const skill of skills) {
    if (!skill.icon?.startsWith(LOCAL_UPLOAD_PREFIX)) {
      continue;
    }

    const icon = await migrateFile(skill.icon);

    if (icon === skill.icon) {
      continue;
    }

    await prisma.skill.update({
      where: {
        id: skill.id,
      },

      data: {
        icon: icon || null,
      },
    });
  }
}

/* =========================================================
   TOOLS
   ========================================================= */

async function migrateTools() {
  console.log("\n========== TOOLS ==========");

  const tools = await prisma.tool.findMany({
    select: {
      id: true,

      icon: true,
    },
  });

  for (const tool of tools) {
    if (!tool.icon?.startsWith(LOCAL_UPLOAD_PREFIX)) {
      continue;
    }

    const icon = await migrateFile(tool.icon);

    if (icon === tool.icon) {
      continue;
    }

    await prisma.tool.update({
      where: {
        id: tool.id,
      },

      data: {
        icon: icon || null,
      },
    });
  }
}

/* =========================================================
   COUNT REMAINING LOCAL DATABASE REFERENCES
   ========================================================= */

async function countRemainingLocalReferences() {
  let count = 0;

  const profiles = await prisma.profile.findMany({
    select: {
      profileImage: true,

      badgeImage: true,

      cvFile: true,

      githubContributionImage: true,
    },
  });

  for (const profile of profiles) {
    const values = [
      profile.profileImage,

      profile.badgeImage,

      profile.cvFile,

      profile.githubContributionImage,
    ];

    count += values.filter((value) =>
      value?.startsWith(LOCAL_UPLOAD_PREFIX),
    ).length;
  }

  const activities = await prisma.activity.findMany({
    select: {
      coverImage: true,
    },
  });

  count += activities.filter((activity) =>
    activity.coverImage?.startsWith(LOCAL_UPLOAD_PREFIX),
  ).length;

  const mediaItems = await prisma.activityMedia.findMany({
    select: {
      fileUrl: true,
    },
  });

  count += mediaItems.filter((media) =>
    media.fileUrl.startsWith(LOCAL_UPLOAD_PREFIX),
  ).length;

  const skills = await prisma.skill.findMany({
    select: {
      icon: true,
    },
  });

  count += skills.filter((skill) =>
    skill.icon?.startsWith(LOCAL_UPLOAD_PREFIX),
  ).length;

  const tools = await prisma.tool.findMany({
    select: {
      icon: true,
    },
  });

  count += tools.filter((tool) =>
    tool.icon?.startsWith(LOCAL_UPLOAD_PREFIX),
  ).length;

  return count;
}

/* =========================================================
   MAIN
   ========================================================= */

async function main() {
  console.log("\n==========================================");

  console.log("Chantha Portfolio");

  console.log("Local Upload → Supabase Migration");

  console.log("==========================================\n");

  console.log(`Bucket: ${STORAGE_BUCKET}`);

  console.log("Local files will NOT be deleted.\n");

  const before = await countRemainingLocalReferences();

  console.log(`Local DB references before migration: ${before}`);

  if (before === 0) {
    console.log("\n✅ Nothing to migrate.");

    return;
  }

  await migrateProfiles();

  await migrateActivities();

  await migrateActivityMedia();

  await migrateSkills();

  await migrateTools();

  const after = await countRemainingLocalReferences();

  console.log("\n==========================================");

  console.log("Migration finished");

  console.log("==========================================");

  console.log(`Files uploaded this run: ${migratedCache.size}`);

  console.log(`Failures: ${failures.length}`);

  console.log(`Remaining local DB references: ${after}`);

  if (failures.length > 0) {
    console.log("\nFailed files:");

    for (const failure of failures) {
      console.log(`- ${failure.oldUrl}`);

      console.log(`  ${failure.reason}`);
    }
  }

  if (after === 0) {
    console.log("\n✅ All database file references now use Supabase.");

    console.log(
      "✅ Keep public/uploads as a backup until you test the website.",
    );
  } else {
    console.log("\n⚠️ Some local references remain.");

    console.log("Do NOT delete public/uploads yet.");
  }
}

/* =========================================================
   RUN
   ========================================================= */

main()
  .catch((error) => {
    console.error("\n❌ Migration crashed:", error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
