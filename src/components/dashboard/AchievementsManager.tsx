"use client";

import {
  useState,
  useTransition,
  type ChangeEvent,
  type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import {
  Award,
  ExternalLink,
  Image as ImageIcon,
  MapPin,
  Pencil,
  Plus,
  Save,
  Star,
  Trash2,
  Trophy,
  Upload,
  X,
} from "lucide-react";

import {
  deleteAchievementAction,
  saveAchievementAction,
} from "@/actions/achievements";

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

export default function AchievementsManager({ locale, items }: Props) {
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

  function closeForm() {
    if (pending) {
      return;
    }

    setOpen(false);

    setSelected(null);
  }

  function submit(formData: FormData) {
    startTransition(async () => {
      const result = await saveAchievementAction(formData);

      setToast({
        open: true,
        success: result.success,
        message: result.message,
      });

      if (result.success) {
        setOpen(false);

        setSelected(null);

        router.refresh();
      }
    });
  }

  function remove(id: number) {
    const confirmed = window.confirm(
      km ? "តើអ្នកចង់លុបសមិទ្ធផលនេះមែនទេ?" : "Delete this achievement?",
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result = await deleteAchievementAction(id);

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

      {/* ================================================
          HEADER
         ================================================ */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-600 dark:text-cyan-300">
            Portfolio CMS
          </p>

          <h1
            className={
              km
                ? "khmer-input-value mt-1.5 text-[26px] font-normal leading-10"
                : "font-body mt-1.5 text-[28px] font-semibold"
            }
          >
            {km ? "សមិទ្ធផល" : "Achievements"}
          </h1>

          <p
            className={
              km
                ? "khmer-input-value mt-1.5 max-w-2xl text-[13px] font-normal leading-7 text-[var(--foreground-muted)]"
                : "font-body mt-1.5 max-w-2xl text-[14px] leading-6 text-[var(--foreground-muted)]"
            }
          >
            {km
              ? "គ្រប់គ្រងពានរង្វាន់ ការទទួលស្គាល់ លទ្ធផលការប្រកួត និងសមិទ្ធផលសំខាន់ៗ។"
              : "Manage awards, recognitions, competition results and important accomplishments."}
          </p>
        </div>

        <button
          type="button"
          onClick={createItem}
          className="font-body inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-violet-700"
        >
          <Plus size={16} />

          {km ? "បន្ថែមសមិទ្ធផល" : "Add Achievement"}
        </button>
      </div>

      {/* ================================================
          LIST
         ================================================ */}

      <div className="mt-5 overflow-hidden rounded-2xl border border-black/[0.065] bg-white shadow-sm dark:border-white/[0.075] dark:bg-[#0d0f19]">
        {items.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600">
              <Trophy size={21} />
            </div>

            <h2
              className={
                km
                  ? "khmer-input-value mt-4 text-[15px] font-normal leading-7"
                  : "font-body mt-4 text-[16px] font-semibold"
              }
            >
              {km ? "មិនទាន់មានសមិទ្ធផល" : "No achievements yet"}
            </h2>

            <p
              className={
                km
                  ? "khmer-input-value mt-1 max-w-md text-[11px] font-normal leading-6 text-[var(--foreground-muted)]"
                  : "font-body mt-1 max-w-md text-[12px] leading-5 text-[var(--foreground-muted)]"
              }
            >
              {km
                ? "បន្ថែមសមិទ្ធផលដំបូងរបស់អ្នក ហើយជ្រើសថាតើត្រូវបង្ហាញលើគេហទំព័រឬអត់។"
                : "Add your first achievement and choose whether it should appear on the public website."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.055] dark:divide-white/[0.065]">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 p-4 transition hover:bg-black/[0.012] sm:flex-row sm:items-center dark:hover:bg-white/[0.015]"
              >
                <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-violet-500/10 text-violet-600">
                  {item.coverImage ? (
                    <img
                      src={item.coverImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Award size={22} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={
                        km && item.titleKm
                          ? "khmer-input-value truncate text-[13px] font-normal leading-6"
                          : "font-body truncate text-[14px] font-semibold"
                      }
                    >
                      {km && item.titleKm ? item.titleKm : item.titleEn}
                    </h3>

                    {item.featured ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 font-body text-[9px] font-semibold text-violet-700 dark:text-violet-300">
                        <Star size={9} fill="currentColor" />
                        Featured
                      </span>
                    ) : null}

                    {item.published ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-body text-[9px] text-emerald-700 dark:text-emerald-300">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-body text-[9px] text-amber-700 dark:text-amber-300">
                        Hidden
                      </span>
                    )}
                  </div>

                  <p className="font-number mt-1 text-[10px] text-[var(--foreground-muted)]">
                    {dateInput(item.activityDate)}

                    {item.organizationEn
                      ? ` • ${
                          km && item.organizationKm
                            ? item.organizationKm
                            : item.organizationEn
                        }`
                      : ""}
                  </p>
                </div>

                <div className="flex gap-2">
                  {item.externalUrl ? (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.07] text-[var(--foreground-muted)] transition hover:text-violet-600 dark:border-white/[0.08]"
                      aria-label="Open proof"
                    >
                      <ExternalLink size={15} />
                    </a>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => editItem(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.07] text-[var(--foreground-muted)] transition hover:text-violet-600 dark:border-white/[0.08]"
                    aria-label="Edit achievement"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => remove(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/10 text-red-500 transition hover:bg-red-500/5 disabled:opacity-50"
                    aria-label="Delete achievement"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ================================================
          ADD / EDIT MODAL
         ================================================ */}

      {open ? (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 p-3 backdrop-blur-sm sm:p-5">
          <div className="flex max-h-[92vh] w-full max-w-[980px] flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#0d0f19]">
            <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] px-5 py-4 dark:border-white/[0.07]">
              <div>
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-cyan-300">
                  Portfolio CMS
                </p>

                <h2
                  className={
                    km
                      ? "khmer-input-value mt-1 text-[17px] font-normal leading-8"
                      : "font-body mt-1 text-[18px] font-semibold"
                  }
                >
                  {selected
                    ? km
                      ? "កែសម្រួលសមិទ្ធផល"
                      : "Edit Achievement"
                    : km
                      ? "បន្ថែមសមិទ្ធផល"
                      : "Add Achievement"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={pending}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--foreground-muted)] hover:bg-black/[0.04] disabled:opacity-50 dark:hover:bg-white/[0.05]"
              >
                <X size={17} />
              </button>
            </div>

            <form
              key={selected?.id ?? "new"}
              action={submit}
              className="min-h-0 flex-1 overflow-y-auto px-5 py-5"
            >
              <input
                type="hidden"
                name="id"
                defaultValue={selected?.id ?? ""}
              />

              <input
                type="hidden"
                name="currentCoverImage"
                value={selected?.coverImage ?? ""}
              />

              <div className="space-y-4">
                <Panel
                  icon={Trophy}
                  title={km ? "ព័ត៌មានសមិទ្ធផល" : "Achievement Information"}
                  description={
                    km
                      ? "បំពេញព័ត៌មានសំខាន់ៗសម្រាប់សមិទ្ធផលនេះ។"
                      : "Add the key information for this award or recognition."
                  }
                  km={km}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label={
                        km
                          ? "ចំណងជើង — អង់គ្លេស"
                          : "Achievement Title — English"
                      }
                      name="titleEn"
                      value={selected?.titleEn ?? ""}
                      required
                    />

                    <Input
                      label={
                        km ? "ចំណងជើង — ខ្មែរ" : "Achievement Title — Khmer"
                      }
                      name="titleKm"
                      value={selected?.titleKm ?? ""}
                      khmer
                    />

                    <Input
                      label={km ? "កាលបរិច្ឆេទ" : "Achievement Date"}
                      name="activityDate"
                      type="date"
                      value={dateInput(selected?.activityDate ?? null)}
                      required
                    />

                    <Input
                      label={km ? "លំដាប់" : "Sort Order"}
                      name="sortOrder"
                      type="number"
                      value={String(selected?.sortOrder ?? 0)}
                    />

                    <Input
                      label={
                        km ? "ស្ថាប័ន — អង់គ្លេស" : "Organization — English"
                      }
                      name="organizationEn"
                      value={selected?.organizationEn ?? ""}
                    />

                    <Input
                      label={km ? "ស្ថាប័ន — ខ្មែរ" : "Organization — Khmer"}
                      name="organizationKm"
                      value={selected?.organizationKm ?? ""}
                      khmer
                    />

                    <Input
                      label={km ? "ទីតាំង — អង់គ្លេស" : "Location — English"}
                      name="locationEn"
                      value={selected?.locationEn ?? ""}
                      icon={MapPin}
                    />

                    <Input
                      label={km ? "ទីតាំង — ខ្មែរ" : "Location — Khmer"}
                      name="locationKm"
                      value={selected?.locationKm ?? ""}
                      icon={MapPin}
                      khmer
                    />

                    <div className="md:col-span-2">
                      <Input
                        label={
                          km ? "តំណភស្តុតាង / ខាងក្រៅ" : "Proof / External URL"
                        }
                        name="externalUrl"
                        type="url"
                        value={selected?.externalUrl ?? ""}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </Panel>

                <Panel
                  icon={Award}
                  title={km ? "អត្ថបទបង្ហាញ" : "Public Content"}
                  description={
                    km
                      ? "សរសេរសេចក្តីសង្ខេប និងពិពណ៌នាសម្រាប់បង្ហាញជាសាធារណៈ។"
                      : "Write the short summary and full description shown to visitors."
                  }
                  km={km}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <Area
                      label={
                        km
                          ? "សេចក្តីសង្ខេប — អង់គ្លេស"
                          : "Short Summary — English"
                      }
                      name="summaryEn"
                      value={selected?.summaryEn ?? ""}
                      rows={3}
                    />

                    <Area
                      label={
                        km ? "សេចក្តីសង្ខេប — ខ្មែរ" : "Short Summary — Khmer"
                      }
                      name="summaryKm"
                      value={selected?.summaryKm ?? ""}
                      rows={3}
                      khmer
                    />

                    <Area
                      label={
                        km
                          ? "ពិពណ៌នាលម្អិត — អង់គ្លេស"
                          : "Full Description — English"
                      }
                      name="descriptionEn"
                      value={selected?.descriptionEn ?? ""}
                      rows={5}
                    />

                    <Area
                      label={
                        km
                          ? "ពិពណ៌នាលម្អិត — ខ្មែរ"
                          : "Full Description — Khmer"
                      }
                      name="descriptionKm"
                      value={selected?.descriptionKm ?? ""}
                      rows={5}
                      khmer
                    />
                  </div>
                </Panel>

                <AchievementImageField
                  locale={locale}
                  current={selected?.coverImage ?? ""}
                />

                <Panel
                  icon={Star}
                  title={km ? "ការបង្ហាញ" : "Website Visibility"}
                  description={
                    km
                      ? "ជ្រើសថាតើសមិទ្ធផលនេះត្រូវបង្ហាញលើគេហទំព័រ និងកំណត់ជាសមិទ្ធផលពិសេសឬអត់។"
                      : "Choose whether this achievement appears publicly and whether it should receive featured priority."
                  }
                  km={km}
                >
                  <div className="flex flex-wrap gap-5">
                    <Check
                      name="published"
                      label={km ? "បង្ហាញលើគេហទំព័រ" : "Published on Website"}
                      defaultChecked={selected?.published ?? false}
                    />

                    <Check
                      name="featured"
                      label={km ? "សមិទ្ធផលពិសេស" : "Featured Achievement"}
                      defaultChecked={selected?.featured ?? false}
                    />
                  </div>

                  <p
                    className={
                      km
                        ? "khmer-input-value mt-3 text-[10px] font-normal leading-6 text-[var(--foreground-muted)]"
                        : "font-body mt-3 text-[10px] leading-5 text-[var(--foreground-muted)]"
                    }
                  >
                    {km
                      ? "បើបិទ Published សមិទ្ធផលនេះនឹងនៅតែមានក្នុង Dashboard ប៉ុន្តែមិនបង្ហាញក្នុង Achievements ឬ Journey ទេ។"
                      : "When Published is off, the achievement stays in the dashboard but is hidden from both the Achievements section and Journey."}
                  </p>
                </Panel>
              </div>

              <div className="sticky bottom-0 mt-5 flex justify-end gap-2 border-t border-black/[0.06] bg-white/95 pt-4 backdrop-blur dark:border-white/[0.07] dark:bg-[#0d0f19]/95">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={pending}
                  className="font-body h-10 rounded-xl border border-black/[0.08] px-4 text-[12px] font-semibold disabled:opacity-50 dark:border-white/[0.08]"
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
                    : km
                      ? "រក្សាទុក"
                      : "Save Achievement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function AchievementImageField({
  locale,
  current,
}: {
  locale: "en" | "km";

  current: string;
}) {
  const km = locale === "km";

  const [preview, setPreview] = useState(current);

  const [remove, setRemove] = useState(false);

  function changed(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPreview(URL.createObjectURL(file));

    setRemove(false);
  }

  return (
    <Panel
      icon={Upload}
      title={km ? "រូបភាពសមិទ្ធផល" : "Achievement Image"}
      description={
        km
          ? "ជ្រើសរើស JPG, PNG ឬ WEBP។ អតិបរមា 5 MB។ រូបនេះអាចចុចមើលពេញទំហំនៅលើគេហទំព័រ។"
          : "Choose a JPG, PNG or WEBP image up to 5 MB. Visitors can open this image full-size."
      }
      km={km}
    >
      <input type="hidden" name="removeCoverImage" value={remove ? "1" : "0"} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-[150px] w-full max-w-[230px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-violet-500/20 bg-violet-500/[0.04]">
          {preview && !remove ? (
            <img
              src={preview}
              alt=""
              className="h-full w-full object-contain"
            />
          ) : (
            <ImageIcon size={30} className="text-violet-400" />
          )}
        </div>

        <div>
          <input
            type="file"
            name="coverImageFile"
            accept="image/jpeg,image/png,image/webp"
            onChange={changed}
            className="font-body block max-w-full text-[11px] text-[var(--foreground-muted)] file:mr-3 file:rounded-xl file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-[11px] file:font-semibold file:text-white"
          />

          {current && !remove ? (
            <button
              type="button"
              onClick={() => {
                setRemove(true);

                setPreview("");
              }}
              className="font-body mt-2 text-[10px] text-red-500 hover:underline"
            >
              {km ? "លុបរូបបច្ចុប្បន្ន" : "Remove current image"}
            </button>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}

function Panel({
  icon: Icon,
  title,
  description,
  km,
  children,
}: {
  icon: typeof Trophy;

  title: string;

  description: string;

  km: boolean;

  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/[0.055] bg-black/[0.01] p-4 dark:border-white/[0.07] dark:bg-white/[0.015] md:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-700 dark:text-violet-300">
          <Icon size={16} />
        </div>

        <div>
          <h3
            className={
              km
                ? "khmer-input-value text-[15px] font-normal leading-7 text-[var(--foreground)]"
                : "font-body text-[16px] font-semibold text-[var(--foreground)]"
            }
          >
            {title}
          </h3>

          <p
            className={
              km
                ? "khmer-input-value mt-0.5 text-[10px] font-normal leading-6 text-[var(--foreground-muted)]"
                : "font-body mt-0.5 text-[11px] leading-5 text-[var(--foreground-muted)]"
            }
          >
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;

  children: ReactNode;
}) {
  const khmerLabel = /[\u1780-\u17ff]/.test(label);

  return (
    <label className="block">
      <span
        className={
          khmerLabel
            ? "khmer-input-value mb-1.5 block text-[11px] font-normal leading-6 text-[var(--foreground)]"
            : "font-body mb-1.5 block text-[12px] font-semibold text-[var(--foreground)]"
        }
      >
        {label}
      </span>

      {children}
    </label>
  );
}

function Input({
  label,
  name,
  value,
  type = "text",
  required = false,
  khmer = false,
  icon: Icon,
  placeholder,
}: {
  label: string;

  name: string;

  value: string;

  type?: string;

  required?: boolean;

  khmer?: boolean;

  icon?: typeof MapPin;

  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <div className="relative">
        {Icon ? (
          <Icon
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
          />
        ) : null}

        <input
          name={name}
          type={type}
          required={required}
          defaultValue={value}
          placeholder={placeholder}
          lang={khmer ? "km" : undefined}
          className={cn("input", khmer && "khmer-input-value", Icon && "!pl-9")}
        />
      </div>
    </Field>
  );
}

function Area({
  label,
  name,
  value,
  rows,
  khmer = false,
}: {
  label: string;

  name: string;

  value: string;

  rows: number;

  khmer?: boolean;
}) {
  return (
    <Field label={label}>
      <textarea
        name={name}
        rows={rows}
        defaultValue={value}
        lang={khmer ? "km" : undefined}
        className={cn("textarea", khmer && "khmer-input-value")}
      />
    </Field>
  );
}

function Check({
  name,
  label,
  defaultChecked,
}: {
  name: string;

  label: string;

  defaultChecked: boolean;
}) {
  return (
    <label className="font-body flex items-center gap-2 text-[12px] text-[var(--foreground)]">
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
