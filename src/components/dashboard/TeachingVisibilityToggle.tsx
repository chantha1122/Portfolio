"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { Eye, EyeOff, Globe2 } from "lucide-react";

import { setTeachingSectionVisibilityAction } from "@/actions/teaching";

import AppToast from "@/components/ui/AppToast";

type Props = {
  locale: "en" | "km";

  initialVisible: boolean;
};

export default function TeachingVisibilityToggle({
  locale,
  initialVisible,
}: Props) {
  const router = useRouter();

  const khmer = locale === "km";

  const [visible, setVisible] = useState(initialVisible);

  const [pending, startTransition] = useTransition();

  const [toast, setToast] = useState({
    open: false,
    success: true,
    message: "",
  });

  function toggleVisibility() {
    const nextValue = !visible;

    startTransition(async () => {
      const result = await setTeachingSectionVisibilityAction(nextValue);

      setToast({
        open: true,
        success: result.success,
        message: result.message,
      });

      if (!result.success) {
        return;
      }

      setVisible(nextValue);

      router.refresh();
    });
  }

  return (
    <>
      <AppToast
        open={toast.open}
        locale={locale}
        variant={toast.success ? "success" : "error"}
        message={toast.message}
        onClose={() =>
          setToast((current) => ({
            ...current,
            open: false,
          }))
        }
      />

      <div className="rounded-2xl border border-black/[0.065] bg-white p-4 shadow-sm dark:border-white/[0.075] dark:bg-[#0d0f19]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          {/* LEFT */}

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-300">
              <Globe2 size={17} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-body text-[13px] font-semibold text-[var(--foreground)]">
                  {khmer
                    ? "ការបង្ហាញនៅលើ Website"
                    : "Public Website Visibility"}
                </h2>

                <span
                  className={
                    visible
                      ? "rounded-full bg-emerald-500/10 px-2 py-0.5 font-body text-[9px] font-medium text-emerald-700 dark:text-emerald-300"
                      : "rounded-full bg-slate-500/10 px-2 py-0.5 font-body text-[9px] font-medium text-slate-600 dark:text-slate-300"
                  }
                >
                  {visible
                    ? khmer
                      ? "កំពុងបង្ហាញ"
                      : "Visible"
                    : khmer
                      ? "បានលាក់"
                      : "Hidden"}
                </span>
              </div>

              <p className="font-body mt-1 max-w-xl text-[11px] leading-5 text-[var(--foreground-muted)]">
                {khmer
                  ? "បើកនៅពេលអ្នកចង់បង្ហាញ Teaching & Mentoring នៅលើ Portfolio។ បិទវា ប្រសិនបើអ្នកមិនទាន់មានបទពិសោធន៍បង្រៀន ឬណែនាំ។"
                  : "Turn this on when you want Teaching & Mentoring to appear on your portfolio. Keep it off if you do not have teaching or mentoring experience yet."}
              </p>
            </div>
          </div>

          {/* SWITCH */}

          <button
            type="button"
            onClick={toggleVisibility}
            disabled={pending}
            aria-pressed={visible}
            className="group inline-flex shrink-0 items-center gap-3 rounded-xl border border-black/[0.07] px-3 py-2.5 transition hover:border-violet-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/[0.08] dark:hover:border-violet-400/25"
          >
            {visible ? (
              <Eye
                size={15}
                className="text-emerald-600 dark:text-emerald-300"
              />
            ) : (
              <EyeOff size={15} className="text-[var(--foreground-muted)]" />
            )}

            <span className="font-body text-[11px] font-medium text-[var(--foreground)]">
              {pending
                ? khmer
                  ? "កំពុងរក្សាទុក..."
                  : "Saving..."
                : visible
                  ? khmer
                    ? "បង្ហាញនៅ Website"
                    : "Show on website"
                  : khmer
                    ? "លាក់ពី Website"
                    : "Hidden from website"}
            </span>

            <span
              className={
                visible
                  ? "relative h-6 w-11 rounded-full bg-violet-600 transition-colors"
                  : "relative h-6 w-11 rounded-full bg-slate-300 transition-colors dark:bg-slate-700"
              }
            >
              <span
                className={
                  visible
                    ? "absolute left-[22px] top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform"
                    : "absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform"
                }
              />
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
