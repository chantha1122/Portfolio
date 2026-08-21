"use client";

import { useState, useTransition, type ChangeEvent } from "react";

import { useRouter } from "next/navigation";

import {
  CalendarDays,
  Images,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  deleteSpecializedContentAction,
  saveGalleryItemAction,
} from "@/actions/content-specialized";

import AppToast from "@/components/ui/AppToast";

import type { SerializedActivity } from "@/lib/serializeActivity";

import { cn } from "@/lib/cn";

type Props = {
  locale: "en" | "km";

  items: SerializedActivity[];
};

function dateInput(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

export default function GalleryManager({ locale, items }: Props) {
  const router = useRouter();

  const km = locale === "km";

  const [selected, setSelected] = useState<SerializedActivity | null>(null);

  const [open, setOpen] = useState(false);

  const [pending, startTransition] = useTransition();

  const [toast, setToast] = useState({
    open: false,
    success: true,
    message: "",
  });

  function createItem() {
    setSelected(null);

    setOpen(true);
  }

  function editItem(item: SerializedActivity) {
    setSelected(item);

    setOpen(true);
  }

  function close() {
    setSelected(null);

    setOpen(false);
  }

  function submit(formData: FormData) {
    startTransition(async () => {
      const result = await saveGalleryItemAction(formData);

      setToast({
        open: true,
        success: result.success,
        message: result.message,
      });

      if (result.success) {
        close();
        router.refresh();
      }
    });
  }

  function remove(id: number) {
    const accepted = window.confirm(
      km ? "តើអ្នកពិតជាចង់លុបរូបភាពនេះមែនទេ?" : "Delete this gallery item?",
    );

    if (!accepted) {
      return;
    }

    startTransition(async () => {
      const result = await deleteSpecializedContentAction(id);

      setToast({
        open: true,
        success: result.success,
        message: result.message,
      });

      if (result.success) {
        router.refresh();
      }
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

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-600 dark:text-cyan-300">
            {km ? "មេឌៀផលប័ត្រ" : "Portfolio Media"}
          </p>

          <h1
            className={cn(
              "font-body mt-1.5 text-[28px] text-[var(--foreground)]",

              km ? "font-normal leading-[1.5]" : "font-semibold",
            )}
          >
            {km ? "វិចិត្រសាល" : "Gallery"}
          </h1>

          <p
            className={cn(
              "font-body mt-1.5 max-w-2xl text-[14px] text-[var(--foreground-muted)]",

              km ? "font-normal leading-7" : "leading-6",
            )}
          >
            {km
              ? "Upload រូបភាពជាច្រើនក្នុងពេលតែមួយ ហើយគ្រប់គ្រង Caption, Date និងការផ្សព្វផ្សាយ។"
              : "Upload multiple portfolio photos at once and manage captions, dates and publishing."}
          </p>
        </div>

        <button
          type="button"
          onClick={createItem}
          className={cn(
            "font-body inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-white transition hover:bg-violet-700",

            km ? "text-[13px] font-normal" : "text-[13px] font-semibold",
          )}
        >
          <Plus size={15} />

          {km ? "បន្ថែមរូបភាព" : "Upload Photos"}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="mt-5 flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-black/[0.065] bg-white px-6 text-center shadow-sm dark:border-white/[0.075] dark:bg-[#0d0f19]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-300">
            <Images size={21} />
          </div>

          <h2
            className={cn(
              "font-body mt-4 text-[16px]",

              km ? "font-normal" : "font-semibold",
            )}
          >
            {km ? "មិនទាន់មានរូបភាព" : "No gallery photos yet"}
          </h2>

          <p
            className={cn(
              "font-body mt-1 max-w-md text-[12px] text-[var(--foreground-muted)]",

              km ? "font-normal leading-6" : "leading-5",
            )}
          >
            {km
              ? "Upload រូបភាពដែលអ្នកចង់បង្ហាញនៅលើ Portfolio សាធារណៈ។"
              : "Upload the photos you want to show on your public portfolio."}
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-black/[0.065] bg-white shadow-sm dark:border-white/[0.075] dark:bg-[#0d0f19]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-violet-500/[0.05]">
                {item.coverImage ? (
                  <img
                    src={item.coverImage}
                    alt={km && item.titleKm ? item.titleKm : item.titleEn}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-violet-400">
                    <Images size={28} />
                  </div>
                )}

                <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => editItem(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/65 text-white backdrop-blur"
                  >
                    <Pencil size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    disabled={pending}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/85 text-white backdrop-blur disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <span
                  className={cn(
                    "absolute bottom-2 left-2 rounded-full px-2 py-1 font-body text-[9px] text-white backdrop-blur",

                    item.published ? "bg-emerald-500/85" : "bg-amber-500/85",
                  )}
                >
                  {item.published
                    ? km
                      ? "បានផ្សព្វផ្សាយ"
                      : "Published"
                    : km
                      ? "ព្រាង"
                      : "Draft"}
                </span>
              </div>

              <div className="p-3.5">
                <h3
                  className={cn(
                    km && item.titleKm ? "khmer-input-value" : "font-body",

                    "truncate text-[13px] font-semibold text-[var(--foreground)]",
                  )}
                >
                  {km && item.titleKm ? item.titleKm : item.titleEn}
                </h3>

                <div className="mt-1.5 flex items-center gap-1.5 font-body text-[10px] text-[var(--foreground-muted)]">
                  <CalendarDays size={11} />

                  {dateInput(item.activityDate)}
                </div>

                {item.summaryEn || item.summaryKm ? (
                  <p
                    className={cn(
                      km && item.summaryKm ? "khmer-input-value" : "font-body",

                      "mt-2 line-clamp-2 text-[10px] leading-5 text-[var(--foreground-muted)]",
                    )}
                  >
                    {km && item.summaryKm ? item.summaryKm : item.summaryEn}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      {open ? (
        <GalleryModal
          locale={locale}
          selected={selected}
          pending={pending}
          onClose={close}
          action={submit}
        />
      ) : null}
    </>
  );
}

function GalleryModal({
  locale,
  selected,
  pending,
  onClose,
  action,
}: {
  locale: "en" | "km";

  selected: SerializedActivity | null;

  pending: boolean;

  onClose: () => void;

  action: (formData: FormData) => void;
}) {
  const km = locale === "km";

  const [previews, setPreviews] = useState<string[]>(
    selected?.coverImage ? [selected.coverImage] : [],
  );

  function changed(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-[820px] flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#0d0f19]">
        <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4 dark:border-white/[0.07]">
          <div>
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-cyan-300">
              Gallery
            </p>

            <h2
              className={cn(
                "font-body mt-1 text-[18px]",

                km ? "font-normal" : "font-semibold",
              )}
            >
              {selected
                ? km
                  ? "កែសម្រួលរូបភាព"
                  : "Edit Gallery Photo"
                : km
                  ? "Upload រូបភាព"
                  : "Upload Photos"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--foreground-muted)] hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
          >
            <X size={17} />
          </button>
        </div>

        <form
          action={action}
          className="min-h-0 flex-1 overflow-y-auto px-5 py-5"
        >
          <input type="hidden" name="id" defaultValue={selected?.id ?? ""} />

          <input
            type="hidden"
            name="sortOrder"
            defaultValue={selected?.sortOrder ?? 0}
          />

          <section className="rounded-2xl border border-black/[0.055] bg-black/[0.01] p-4 dark:border-white/[0.07] dark:bg-white/[0.015]">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-700 dark:text-violet-300">
                <Upload size={16} />
              </div>

              <div>
                <h3
                  className={cn(
                    "font-body text-[16px]",

                    km ? "font-normal" : "font-semibold",
                  )}
                >
                  {km ? "ជ្រើសរើសរូបភាព" : "Choose Photos"}
                </h3>

                <p
                  className={cn(
                    "font-body mt-0.5 text-[11px] text-[var(--foreground-muted)]",

                    km ? "font-normal leading-6" : "leading-5",
                  )}
                >
                  {selected
                    ? km
                      ? "ជ្រើសរើសរូបថ្មី ប្រសិនបើអ្នកចង់ជំនួសរូបបច្ចុប្បន្ន។"
                      : "Choose a new image only if you want to replace the current photo."
                    : km
                      ? "អាចជ្រើសរើសរូបភាពរហូតដល់ 4 រូបក្នុងពេលតែមួយ។ JPG, PNG, WEBP • អតិបរមា 5 MB ក្នុងមួយរូប។"
                      : "Choose up to 4 images at one time. JPG, PNG, WEBP • Maximum 5 MB each."}
                </p>
              </div>
            </div>

            <input
              type="file"
              name="galleryFiles"
              multiple={!selected}
              required={!selected}
              accept="image/jpeg,image/png,image/webp"
              onChange={changed}
              className="font-body mt-4 block w-full text-[11px] text-[var(--foreground-muted)] file:mr-3 file:rounded-xl file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-[11px] file:font-semibold file:text-white"
            />

            {previews.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {previews.slice(0, 4).map((preview, index) => (
                  <div
                    key={`${preview}-${index}`}
                    className="aspect-square overflow-hidden rounded-xl bg-black/[0.03] dark:bg-white/[0.03]"
                  >
                    <img
                      src={preview}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          <section className="mt-4 rounded-2xl border border-black/[0.055] bg-black/[0.01] p-4 dark:border-white/[0.07] dark:bg-white/[0.015]">
            <div className="grid gap-4 md:grid-cols-2">
              <GalleryInput
                label={km ? "ចំណងជើង — អង់គ្លេស" : "Title — English"}
                name="titleEn"
                value={selected?.titleEn ?? ""}
                placeholder={selected ? "" : "Optional for batch upload"}
              />

              <GalleryInput
                label={km ? "ចំណងជើង — ខ្មែរ" : "Title — Khmer"}
                name="titleKm"
                value={selected?.titleKm ?? ""}
                khmer
              />

              <GalleryInput
                label={km ? "កាលបរិច្ឆេទ" : "Date"}
                name="activityDate"
                type="date"
                value={dateInput(selected?.activityDate ?? null)}
                required
              />

              <div />

              <GalleryArea
                label={km ? "Caption — អង់គ្លេស" : "Caption — English"}
                name="summaryEn"
                value={selected?.summaryEn ?? ""}
              />

              <GalleryArea
                label={km ? "Caption — ខ្មែរ" : "Caption — Khmer"}
                name="summaryKm"
                value={selected?.summaryKm ?? ""}
                khmer
              />
            </div>
          </section>

          <div className="mt-4 flex flex-wrap items-center gap-5 rounded-2xl border border-black/[0.055] bg-black/[0.012] p-4 dark:border-white/[0.07] dark:bg-white/[0.015]">
            <GalleryCheck
              name="published"
              label={km ? "ផ្សព្វផ្សាយ" : "Published"}
              defaultChecked={selected ? selected.published : true}
            />

            <GalleryCheck
              name="featured"
              label={km ? "សម្គាល់ជាពិសេស" : "Featured"}
              defaultChecked={selected?.featured ?? false}
            />
          </div>

          <div className="sticky bottom-0 mt-5 flex justify-end gap-2 border-t border-black/[0.06] bg-white/95 pt-4 backdrop-blur dark:border-white/[0.07] dark:bg-[#0d0f19]/95">
            <button
              type="button"
              onClick={onClose}
              className="font-body h-10 rounded-xl border border-black/[0.08] px-4 text-[12px] font-semibold dark:border-white/[0.08]"
            >
              {km ? "បោះបង់" : "Cancel"}
            </button>

            <button
              type="submit"
              disabled={pending}
              className="font-body inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-5 text-[12px] font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              <Save size={14} />

              {pending
                ? km
                  ? "កំពុងរក្សាទុក..."
                  : "Saving..."
                : selected
                  ? km
                    ? "រក្សាទុក"
                    : "Save Changes"
                  : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GalleryInput({
  label,
  name,
  value,
  type = "text",
  required = false,
  khmer = false,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  required?: boolean;
  khmer?: boolean;
  placeholder?: string;
}) {
  const khmerLabel = /[\u1780-\u17ff]/.test(label);

  return (
    <label className="block">
      <span
        className={cn(
          "font-body mb-1.5 block text-[12px]",

          khmerLabel ? "font-normal leading-6" : "font-semibold",
        )}
      >
        {label}
      </span>

      <input
        name={name}
        type={type}
        defaultValue={value}
        required={required}
        placeholder={placeholder}
        lang={khmer ? "km" : undefined}
        className={cn(
          "input",

          khmer && "khmer-input-value",
        )}
      />
    </label>
  );
}

function GalleryArea({
  label,
  name,
  value,
  khmer = false,
}: {
  label: string;
  name: string;
  value: string;
  khmer?: boolean;
}) {
  const khmerLabel = /[\u1780-\u17ff]/.test(label);

  return (
    <label className="block">
      <span
        className={cn(
          "font-body mb-1.5 block text-[12px]",

          khmerLabel ? "font-normal leading-6" : "font-semibold",
        )}
      >
        {label}
      </span>

      <textarea
        name={name}
        rows={4}
        defaultValue={value}
        lang={khmer ? "km" : undefined}
        className={cn(
          "textarea",

          khmer && "khmer-input-value",
        )}
      />
    </label>
  );
}

function GalleryCheck({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="font-body flex items-center gap-2 text-[12px]">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-violet-600"
      />

      {label}
    </label>
  );
}
