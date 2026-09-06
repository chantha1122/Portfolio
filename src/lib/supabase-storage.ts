import "server-only";

import { randomUUID } from "node:crypto";

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "portfolio";

if (!SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
}

if (!SUPABASE_SECRET_KEY) {
  throw new Error("SUPABASE_SECRET_KEY is not configured.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

type UploadStorageFileOptions = {
  folder: string;

  maxBytes: number;

  allowedTypes: string[];

  filePrefix?: string;
};

/* =========================================================
   UPLOAD
   ========================================================= */

export async function uploadStorageFile(
  file: File,
  options: UploadStorageFileOptions,
) {
  const { folder, maxBytes, allowedTypes, filePrefix = "file" } = options;

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Unsupported file type.");
  }

  if (file.size > maxBytes) {
    const maxMb = Math.round(maxBytes / 1024 / 1024);

    throw new Error(`File must be ${maxMb} MB or smaller.`);
  }

  const extension = MIME_EXTENSIONS[file.type];

  if (!extension) {
    throw new Error("Unable to determine file extension.");
  }

  const safeFolder = folder.replace(/^\/+|\/+$/g, "");

  const filename = `${filePrefix}-${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;

  const storagePath = `${safeFolder}/${filename}`;

  const bytes = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, bytes, {
      contentType: file.type,

      cacheControl: "31536000",

      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);

    throw new Error("Unable to upload file.");
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  if (!data.publicUrl) {
    /*
     * Extremely unlikely, but clean the uploaded
     * object if URL generation failed.
     */
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);

    throw new Error("Unable to create public file URL.");
  }

  return data.publicUrl;
}

/* =========================================================
   DELETE
   ========================================================= */

export async function deleteStorageFile(fileUrl: string | null | undefined) {
  if (!fileUrl) {
    return;
  }

  /*
   * Existing local uploads are intentionally ignored.
   *
   * We will migrate those separately later.
   */
  if (fileUrl.startsWith("/uploads/")) {
    return;
  }

  const storagePath = getStoragePathFromUrl(fileUrl);

  if (!storagePath) {
    /*
     * Don't delete arbitrary external URLs.
     */
    return;
  }

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([storagePath]);

  if (error) {
    console.error("Supabase delete error:", error);

    /*
     * DB updates should not fail only because
     * an old file could not be cleaned up.
     */
  }
}

/* =========================================================
   URL → STORAGE PATH
   ========================================================= */

function getStoragePathFromUrl(fileUrl: string) {
  try {
    const url = new URL(fileUrl);

    const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;

    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    const storagePath = url.pathname.slice(markerIndex + marker.length);

    if (!storagePath) {
      return null;
    }

    return decodeURIComponent(storagePath);
  } catch {
    return null;
  }
}

/* =========================================================
   SPECIALIZED HELPERS
   ========================================================= */

export function uploadPortfolioImage(
  file: File,
  folder: string,
  options?: {
    maxMb?: number;
    prefix?: string;
  },
) {
  const maxMb = options?.maxMb ?? 5;

  return uploadStorageFile(file, {
    folder,

    maxBytes: maxMb * 1024 * 1024,

    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],

    filePrefix: options?.prefix ?? "image",
  });
}

export function uploadPortfolioPdf(file: File, folder: string) {
  return uploadStorageFile(file, {
    folder,

    maxBytes: 10 * 1024 * 1024,

    allowedTypes: ["application/pdf"],

    filePrefix: "cv",
  });
}
