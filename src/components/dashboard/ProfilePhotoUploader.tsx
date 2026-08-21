"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import { useRouter } from "next/navigation";

import {
  Camera,
  Check,
  ImagePlus,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";

import {
  updateProfileImageAction,
  type ProfileActionState,
} from "@/actions/profile";

import AppToast from "@/components/ui/AppToast";

import { cn } from "@/lib/cn";

type ProfilePhotoUploaderProps = {
  locale: "en" | "km";

  fullName: string;

  image: string;
};

/* =========================================================
   INITIAL STATE

   Keep this in the CLIENT component.
   Do NOT export this from profile.ts because profile.ts
   is a "use server" file.
   ========================================================= */

const initialProfileActionState: ProfileActionState = {
  success: false,
  message: null,
};

export default function ProfilePhotoUploader({
  locale,
  fullName,
  image,
}: ProfilePhotoUploaderProps) {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, pending] = useActionState(
    updateProfileImageAction,
    initialProfileActionState,
  );

  const [preview, setPreview] = useState(image);

  const [selected, setSelected] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);

  const isKhmer = locale === "km";

  useEffect(() => {
    setPreview(image);
  }, [image]);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    setToastOpen(true);

    if (state.success) {
      setSelected(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      router.refresh();
    }
  }, [state, router]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);

    setPreview(url);

    setSelected(true);
  }

  function cancelSelection() {
    setPreview(image);

    setSelected(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <>
      <AppToast
        open={toastOpen}
        locale={locale}
        variant={state.success ? "success" : "error"}
        message={
          state.success
            ? isKhmer
              ? "បានប្ដូររូបប្រវត្តិរូបដោយជោគជ័យ។"
              : "Profile photo updated successfully."
            : state.fieldErrors?.profileImageFile?.[0] ||
              (isKhmer
                ? "មិនអាចប្ដូររូបបានទេ។ សូមព្យាយាមម្ដងទៀត។"
                : "Unable to update the profile photo. Please try again.")
        }
        onClose={() => setToastOpen(false)}
      />

      <form action={formAction} className="flex flex-col items-center">
        <input type="hidden" name="locale" value={locale} />

        <div className="group relative h-[96px] w-[96px] overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-400/12 ring-1 ring-violet-500/10">
          <img
            src={preview || "/images/profile-badge.png"}
            alt={fullName}
            className="h-full w-full object-cover"
          />

          <label
            htmlFor="quickProfileImage"
            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/45 group-hover:opacity-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
              <Camera size={17} />
            </div>
          </label>
        </div>

        <input
          ref={inputRef}
          id="quickProfileImage"
          name="profileImageFile"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="sr-only"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "font-body mt-2 inline-flex items-center gap-1.5 text-violet-700 transition hover:text-violet-800 dark:text-violet-300",

            isKhmer ? "text-[11px] font-normal" : "text-[11px] font-semibold",
          )}
        >
          <ImagePlus size={13} />

          {isKhmer ? "ប្ដូររូប" : "Change photo"}
        </button>

        {selected ? (
          <div className="mt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={pending}
              className="font-body inline-flex h-8 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-[11px] font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {pending ? (
                <LoaderCircle size={13} className="animate-spin" />
              ) : (
                <Check size={13} />
              )}

              {pending
                ? isKhmer
                  ? "កំពុងរក្សាទុក..."
                  : "Saving..."
                : isKhmer
                  ? "រក្សាទុក"
                  : "Save photo"}
            </button>

            <button
              type="button"
              disabled={pending}
              onClick={cancelSelection}
              className="font-body inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/[0.08] px-3 text-[11px] font-semibold text-[var(--foreground-muted)] dark:border-white/[0.08]"
            >
              <RotateCcw size={12} />

              {isKhmer ? "បោះបង់" : "Cancel"}
            </button>
          </div>
        ) : null}
      </form>
    </>
  );
}
