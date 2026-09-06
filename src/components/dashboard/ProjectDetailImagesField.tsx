"use client";

import { type ChangeEvent, useEffect, useState } from "react";

import { Image as ImageIcon, Plus, Upload, X } from "lucide-react";

import { cn } from "@/lib/cn";

export type ProjectDetailMedia = {
  id: number;
  fileUrl: string;
  type: string;
  captionEn: string | null;
  captionKm: string | null;
  sortOrder: number;
};

type Props = {
  locale: "en" | "km";
  current: ProjectDetailMedia[];
};

export default function ProjectDetailImagesField({ locale, current }: Props) {
  const khmer = locale === "km";

  const [removedIds, setRemovedIds] = useState<number[]>([]);

  const [files, setFiles] = useState<File[]>([]);

  const [previews, setPreviews] = useState<string[]>([]);

  /* =====================================================
     CLEAN OBJECT URLS
     ===================================================== */

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  /* =====================================================
     SELECT NEW IMAGES
     ===================================================== */

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []).slice(0, 3);

    previews.forEach((url) => URL.revokeObjectURL(url));

    setFiles(selected);

    setPreviews(selected.map((file) => URL.createObjectURL(file)));
  }

  /* =====================================================
     REMOVE / RESTORE EXISTING IMAGE
     ===================================================== */

  function toggleRemove(id: number) {
    setRemovedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((value) => value !== id)
        : [...currentIds, id],
    );
  }

  const visibleCurrentCount = current.filter(
    (media) => !removedIds.includes(media.id),
  ).length;

  const totalAfterSave = visibleCurrentCount + files.length;

  return (
    <section className="mt-6 rounded-[20px] border border-black/[0.07] bg-white p-5 dark:border-white/[0.08] dark:bg-white/[0.02]">
      {/* =================================================
          HEADER
         ================================================= */}

      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-300">
          <ImageIcon size={18} />
        </div>

        <div>
          <h3
            className={
              khmer
                ? "khmer-input-value text-[15px] font-normal leading-7 text-[var(--foreground)]"
                : "font-body text-[15px] font-semibold text-[var(--foreground)]"
            }
          >
            {khmer
              ? "រូបភាពបន្ថែមសម្រាប់ Project Detail"
              : "Project Detail Images"}
          </h3>

          <p
            className={
              khmer
                ? "khmer-input-value mt-1 text-[10px] font-normal leading-6 text-[var(--foreground-muted)]"
                : "font-body mt-1 text-[10px] leading-5 text-[var(--foreground-muted)]"
            }
          >
            {khmer
              ? "បន្ថែម Screenshot ឬរូបភាពសំខាន់ៗដែលនឹងបង្ហាញនៅទំព័រលម្អិតគម្រោង។"
              : "Add screenshots or supporting images that will appear on the public project detail page."}
          </p>
        </div>
      </div>

      {/* =================================================
          HIDDEN REMOVE IDS
         ================================================= */}

      {removedIds.map((id) => (
        <input key={id} type="hidden" name="removeMediaIds" value={id} />
      ))}

      {/* =================================================
          CURRENT IMAGES
         ================================================= */}

      {current.length > 0 ? (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-body text-[10px] font-semibold text-[var(--foreground-muted)]">
              {khmer ? "រូបភាពបច្ចុប្បន្ន" : "Current Images"}
            </p>

            <p className="font-number text-[9px] text-[var(--foreground-muted)]">
              {visibleCurrentCount} existing
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {current.map((media) => {
              const removed = removedIds.includes(media.id);

              return (
                <div
                  key={media.id}
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden rounded-xl border bg-black/[0.025] transition dark:bg-white/[0.025]",
                    removed
                      ? "border-red-500/25 opacity-40"
                      : "border-black/[0.08] dark:border-white/[0.08]",
                  )}
                >
                  <img
                    src={media.fileUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => toggleRemove(media.id)}
                    className={cn(
                      "absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-lg backdrop-blur-md transition",
                      removed
                        ? "bg-emerald-600 hover:bg-emerald-500"
                        : "bg-black/65 hover:bg-black/80",
                    )}
                    title={removed ? "Restore image" : "Remove image"}
                  >
                    {removed ? <Plus size={14} /> : <X size={14} />}
                  </button>

                  {removed ? (
                    <div className="absolute inset-x-2 bottom-2 rounded-lg bg-red-500/90 px-2 py-1.5 text-center font-body text-[8px] font-semibold text-white">
                      {khmer ? "នឹងលុបពេល Save" : "Will remove on Save"}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* =================================================
          ADD NEW IMAGES
         ================================================= */}

      <div className="mt-5">
        <p className="font-body text-[10px] font-semibold text-[var(--foreground-muted)]">
          {khmer ? "បន្ថែមរូបភាពថ្មី" : "Add New Images"}
        </p>

        <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-violet-500/25 bg-violet-500/[0.035] px-4 py-5 text-violet-600 transition hover:border-violet-500/40 hover:bg-violet-500/[0.065] dark:text-violet-300">
          <Upload size={16} />

          <span className="font-body text-[11px] font-semibold">
            {khmer ? "ជ្រើសរើសរូបភាព" : "Choose Images"}
          </span>

          <input
            type="file"
            name="projectMediaFiles"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
        </label>

        <p className="font-body mt-2 text-[9px] text-[var(--foreground-muted)]">
          {khmer
            ? "JPG, PNG ឬ WEBP • អតិបរមា 5 MB ក្នុងមួយរូប • អាចបន្ថែម 3 រូបក្នុងមួយ Save"
            : "JPG, PNG or WEBP • Max 5 MB each • Add up to 3 images per save"}
        </p>

        {/* ===============================================
            NEW PREVIEWS
           =============================================== */}

        {previews.length > 0 ? (
          <div className="mt-4">
            <p className="font-body mb-3 text-[10px] font-semibold text-[var(--foreground-muted)]">
              {khmer ? "រូបភាពថ្មី" : "New Images"}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {previews.map((src, index) => (
                <div
                  key={src}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-violet-500/20 bg-violet-500/[0.03]"
                >
                  <img
                    src={src}
                    alt={`New project screenshot ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  <span className="absolute bottom-2 left-2 rounded-lg bg-violet-600 px-2 py-1 font-number text-[8px] text-white">
                    NEW
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* ===============================================
            LIMIT
           =============================================== */}

        <div className="mt-4 flex items-center justify-between rounded-xl bg-black/[0.025] px-3 py-2.5 dark:bg-white/[0.025]">
          <span className="font-body text-[9px] text-[var(--foreground-muted)]">
            {khmer ? "ចំនួនរូបភាពបន្ទាប់ពី Save" : "Images after save"}
          </span>

          <span
            className={cn(
              "font-number text-[10px] font-semibold",
              totalAfterSave > 8 ? "text-red-500" : "text-[var(--foreground)]",
            )}
          >
            {totalAfterSave} / 8
          </span>
        </div>
      </div>
    </section>
  );
}
