"use client";

import { useActionState, useEffect, useState } from "react";

import {
  Code2,
  ExternalLink,
  ImageUp,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
  removeGitHubContributionImageAction,
  saveGitHubActivityAction,
} from "@/actions/githubActivity";

type Props = {
  locale: "en" | "km";

  githubUsername: string | null;

  githubUrl: string | null;

  contributionImage: string | null;
};

const INITIAL_STATE = {
  success: false,
  message: "",
};

export default function GitHubActivityForm({
  locale,
  githubUsername,
  githubUrl,
  contributionImage,
}: Props) {
  const router = useRouter();

  const khmer = locale === "km";

  const [state, formAction, pending] = useActionState(
    saveGitHubActivityAction,
    INITIAL_STATE,
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [selectedFileName, setSelectedFileName] = useState("");

  useEffect(() => {
    if (!state.success) {
      return;
    }

    setPreviewUrl(null);

    setSelectedFileName("");

    router.refresh();
  }, [state.success, router]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setPreviewUrl(null);

      setSelectedFileName("");

      return;
    }

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));

    setSelectedFileName(file.name);
  }

  const imageToShow = previewUrl || contributionImage;

  return (
    <div className="grid gap-5">
      {/* ===============================================
          CURRENT PREVIEW
         =============================================== */}

      <section className="rounded-2xl border border-black/[0.065] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.035)] dark:border-white/[0.075] dark:bg-[#0d0f19] dark:shadow-none">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
            <Code2 size={18} />
          </span>

          <div className="min-w-0">
            <h2 className="font-body text-[16px] font-semibold text-slate-950 dark:text-white">
              {khmer ? "ការរួមចំណែក GitHub" : "GitHub Contributions"}
            </h2>

            <p
              className={
                khmer
                  ? "khmer-input-value mt-1 text-[11px] font-normal leading-6 text-slate-500 dark:text-white/45"
                  : "font-body mt-1 text-[11px] leading-5 text-slate-500 dark:text-white/45"
              }
            >
              {khmer
                ? "បង្ហោះរូប Screenshot នៃ GitHub contribution graph របស់អ្នក។"
                : "Upload a screenshot of your GitHub contribution graph."}
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/[0.08] dark:bg-white/[0.025]">
          {imageToShow ? (
            <img
              src={imageToShow}
              alt="GitHub contribution graph"
              className="mx-auto max-h-[420px] w-full rounded-xl object-contain"
            />
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
                <ImageUp size={20} />
              </span>

              <p className="font-body mt-3 text-[12px] font-semibold text-slate-800 dark:text-white">
                {khmer ? "មិនទាន់មាន Screenshot" : "No screenshot uploaded"}
              </p>

              <p className="font-body mt-1 text-[10px] text-slate-400 dark:text-white/35">
                PNG, JPG or WebP
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===============================================
          SAVE FORM
         =============================================== */}

      <form
        action={formAction}
        className="rounded-2xl border border-black/[0.065] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.035)] dark:border-white/[0.075] dark:bg-[#0d0f19] dark:shadow-none"
      >
        <input type="hidden" name="locale" value={locale} />

        {/* USERNAME */}

        <label className="block">
          <span
            className={
              khmer
                ? "khmer-input-value text-[12px] font-normal text-slate-800 dark:text-white"
                : "font-body text-[12px] font-semibold text-slate-800 dark:text-white"
            }
          >
            {khmer ? "ឈ្មោះអ្នកប្រើ GitHub" : "GitHub Username"}
          </span>

          <input
            name="githubUsername"
            defaultValue={githubUsername ?? ""}
            placeholder="your-github-username"
            className="font-body mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-white/[0.09] dark:bg-white/[0.03] dark:text-white dark:placeholder:text-white/25"
          />
        </label>

        {/* CURRENT PROFILE LINK */}

        {githubUrl ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.025]">
            <p className="font-body text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-white/35">
              {khmer ? "តំណ GitHub Profile" : "GitHub Profile"}
            </p>

            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body mt-1.5 inline-flex items-center gap-2 break-all text-[11px] text-violet-600 transition hover:underline dark:text-cyan-300"
            >
              {githubUrl}

              <ExternalLink size={12} className="shrink-0" />
            </a>

            <p className="font-body mt-2 text-[9px] text-slate-400 dark:text-white/30">
              {khmer
                ? "តំណនេះអាចកែប្រែពីទំព័រ Profile។"
                : "You can change this URL from the Profile page."}
            </p>
          </div>
        ) : null}

        {/* IMAGE UPLOAD */}

        <div className="mt-5">
          <p
            className={
              khmer
                ? "khmer-input-value text-[12px] font-normal text-slate-800 dark:text-white"
                : "font-body text-[12px] font-semibold text-slate-800 dark:text-white"
            }
          >
            {khmer
              ? "GitHub Contribution Screenshot"
              : "Contribution Screenshot"}
          </p>

          <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-violet-300 bg-violet-50/60 px-4 py-4 transition hover:border-violet-500 hover:bg-violet-50 dark:border-violet-400/25 dark:bg-violet-500/[0.05] dark:hover:border-violet-400/45">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-300">
              <UploadCloud size={18} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="font-body block text-[12px] font-semibold text-slate-800 dark:text-white">
                {contributionImage
                  ? khmer
                    ? "ជំនួស Screenshot"
                    : "Replace Screenshot"
                  : khmer
                    ? "ជ្រើសរើស Screenshot"
                    : "Choose Screenshot"}
              </span>

              <span className="font-body mt-1 block truncate text-[10px] text-slate-400 dark:text-white/35">
                {selectedFileName || "PNG, JPG, JPEG, WebP • Max 8 MB"}
              </span>
            </span>

            <input
              type="file"
              name="contributionImage"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        </div>

        {/* RESULT */}

        {state.message ? (
          <div
            className={
              state.success
                ? "mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-body text-[11px] text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                : "mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-body text-[11px] text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
            }
          >
            {state.message}
          </div>
        ) : null}

        {/* BUTTONS */}

        <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
          <button
            type="submit"
            disabled={pending}
            className="font-body inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-[11px] font-semibold text-white shadow-[0_8px_20px_rgba(124,58,237,0.20)] transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={14} />

            {pending
              ? khmer
                ? "កំពុងរក្សាទុក..."
                : "Saving..."
              : khmer
                ? "រក្សាទុក"
                : "Save GitHub Activity"}
          </button>
        </div>
      </form>

      {/* ===============================================
          REMOVE SCREENSHOT
         =============================================== */}

      {contributionImage ? (
        <form
          action={removeGitHubContributionImageAction}
          className="flex justify-end"
        >
          <input type="hidden" name="locale" value={locale} />

          <button
            type="submit"
            className="font-body inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 text-[10px] font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
          >
            <Trash2 size={13} />

            {khmer ? "លុប Screenshot" : "Remove Screenshot"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
