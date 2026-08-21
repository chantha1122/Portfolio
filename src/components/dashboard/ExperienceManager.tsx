"use client";

import { useState, useTransition, type ReactNode } from "react";

import { useRouter } from "next/navigation";

import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Edit3,
  MapPin,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  deleteExperienceAction,
  saveExperienceAction,
} from "@/actions/experience";

import AppToast from "@/components/ui/AppToast";

import type { SerializedActivity } from "@/lib/serializeActivity";

import { cn } from "@/lib/cn";

type Props = {
  locale: "en" | "km";
  items: SerializedActivity[];
};

/* =========================================================
   DATE
   ========================================================= */

function toMonthInput(value: string | null) {
  return value ? value.slice(0, 7) : "";
}

function localized(locale: "en" | "km", en: string | null, km: string | null) {
  return locale === "km" ? km || en || "" : en || km || "";
}

const EN_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const KM_MONTHS = [
  "មករា",
  "កុម្ភៈ",
  "មីនា",
  "មេសា",
  "ឧសភា",
  "មិថុនា",
  "កក្កដា",
  "សីហា",
  "កញ្ញា",
  "តុលា",
  "វិច្ឆិកា",
  "ធ្នូ",
];

function formatMonthYear(value: string, locale: "en" | "km") {
  const match = /^(\d{4})-(\d{2})/.exec(value);

  if (!match) {
    return "";
  }

  const year = match[1];

  const monthIndex = Number(match[2]) - 1;

  if (monthIndex < 0 || monthIndex > 11) {
    return year;
  }

  const month = locale === "km" ? KM_MONTHS[monthIndex] : EN_MONTHS[monthIndex];

  return `${month} ${year}`;
}

function formatPeriod(item: SerializedActivity, locale: "en" | "km") {
  const start = formatMonthYear(item.activityDate, locale);

  if (item.isCurrent) {
    return `${start} — ${locale === "km" ? "បច្ចុប្បន្ន" : "Present"}`;
  }

  if (item.endDate) {
    return `${start} — ${formatMonthYear(item.endDate, locale)}`;
  }

  return start;
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function ExperienceManager({ locale, items }: Props) {
  const router = useRouter();

  const khmer = locale === "km";

  const [selected, setSelected] = useState<SerializedActivity | null>(null);

  const [open, setOpen] = useState(false);

  const [currentRole, setCurrentRole] = useState(false);

  const [pending, startTransition] = useTransition();

  const [toast, setToast] = useState({
    open: false,
    success: true,
    message: "",
  });

  /* =======================================================
     CREATE
     ======================================================= */

  function createItem() {
    setSelected(null);

    setCurrentRole(false);

    setOpen(true);
  }

  /* =======================================================
     EDIT
     ======================================================= */

  function editItem(item: SerializedActivity) {
    setSelected(item);

    setCurrentRole(item.isCurrent);

    setOpen(true);
  }

  /* =======================================================
     CLOSE
     ======================================================= */

  function close() {
    setSelected(null);

    setCurrentRole(false);

    setOpen(false);
  }

  /* =======================================================
     SAVE
     ======================================================= */

  function submit(formData: FormData) {
    startTransition(async () => {
      const result = await saveExperienceAction(formData);

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

  /* =======================================================
     DELETE
     ======================================================= */

  function remove(id: number) {
    const accepted = window.confirm(
      khmer ? "តើអ្នកពិតជាចង់លុបបទពិសោធន៍នេះមែនទេ?" : "Delete this experience?",
    );

    if (!accepted) {
      return;
    }

    startTransition(async () => {
      const result = await deleteExperienceAction(id);

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
      {/* ===================================================
          TOAST
         =================================================== */}

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

      {/* ===================================================
          PAGE HEADER
         =================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-600 dark:text-cyan-300">
            {khmer ? "ប្រវត្តិការងារ" : "PROFESSIONAL BACKGROUND"}
          </p>

          <h1
            className={cn(
              "font-body mt-1.5 text-[28px] text-[var(--foreground)]",

              khmer ? "font-normal leading-[1.5]" : "font-semibold",
            )}
          >
            {khmer ? "បទពិសោធន៍" : "Experience"}
          </h1>

          <p
            className={cn(
              "font-body mt-1.5 max-w-2xl text-[14px] text-[var(--foreground-muted)]",

              khmer ? "font-normal leading-7" : "leading-6",
            )}
          >
            {khmer
              ? "គ្រប់គ្រងតួនាទីការងារ ស្ថាប័ន ទីតាំង និងរយៈពេលនៃបទពិសោធន៍វិជ្ជាជីវៈរបស់អ្នក។"
              : "Manage your professional roles, organizations, locations and employment periods."}
          </p>
        </div>

        <button
          type="button"
          onClick={createItem}
          className={cn(
            "font-body inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-white shadow-sm transition hover:bg-violet-700",

            khmer ? "text-[13px] font-normal" : "text-[13px] font-semibold",
          )}
        >
          <Plus size={16} />

          {khmer ? "បន្ថែមបទពិសោធន៍" : "Add Experience"}
        </button>
      </div>

      {/* ===================================================
          EXPERIENCE LIST
         =================================================== */}

      <section className="mt-5 overflow-hidden rounded-2xl border border-black/[0.065] bg-white shadow-sm dark:border-white/[0.075] dark:bg-[#0d0f19]">
        {items.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-300">
              <BriefcaseBusiness size={21} />
            </div>

            <h2
              className={cn(
                "font-body mt-4 text-[16px]",

                khmer ? "font-normal" : "font-semibold",
              )}
            >
              {khmer ? "មិនទាន់មានបទពិសោធន៍" : "No experience yet"}
            </h2>

            <p
              className={cn(
                "font-body mt-1 max-w-md text-[12px] text-[var(--foreground-muted)]",

                khmer ? "font-normal leading-6" : "leading-5",
              )}
            >
              {khmer
                ? "បន្ថែមតួនាទី ការងារ ឬបទពិសោធន៍វិជ្ជាជីវៈដែលអ្នកចង់បង្ហាញនៅលើ Portfolio។"
                : "Add roles, jobs or professional experience you want to show on your portfolio."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.055] dark:divide-white/[0.065]">
            {items.map((item) => {
              const title = localized(
                locale,

                item.titleEn,

                item.titleKm,
              );

              const organization = localized(
                locale,

                item.organizationEn,

                item.organizationKm,
              );

              const location = localized(
                locale,

                item.locationEn,

                item.locationKm,
              );

              const summary = localized(
                locale,

                item.summaryEn,

                item.summaryKm,
              );

              return (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 p-4 transition hover:bg-black/[0.012] sm:flex-row sm:items-start dark:hover:bg-white/[0.015]"
                >
                  {/* ICON */}

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-300">
                    <BriefcaseBusiness size={19} />
                  </div>

                  {/* INFO */}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={cn(
                          "font-body min-w-0 text-[14px] text-[var(--foreground)]",

                          khmer && item.titleKm
                            ? "font-normal leading-6"
                            : "font-semibold",
                        )}
                      >
                        {title}
                      </h3>

                      {item.isCurrent ? (
                        <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 font-body text-[9px] font-semibold text-cyan-700 dark:text-cyan-300">
                          {khmer ? "បច្ចុប្បន្ន" : "Current"}
                        </span>
                      ) : null}

                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-body text-[9px]",

                          item.published
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                        )}
                      >
                        {item.published
                          ? khmer
                            ? "បានបង្ហាញ"
                            : "Published"
                          : khmer
                            ? "ព្រាង"
                            : "Draft"}
                      </span>
                    </div>

                    {/* META */}

                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[var(--foreground-muted)]">
                      {organization ? (
                        <span className="font-body inline-flex items-center gap-1.5">
                          <Building2 size={12} />

                          {organization}
                        </span>
                      ) : null}

                      <span className="font-number inline-flex items-center gap-1.5">
                        <CalendarDays size={12} />

                        {formatPeriod(item, locale)}
                      </span>

                      {location ? (
                        <span className="font-body inline-flex items-center gap-1.5">
                          <MapPin size={12} />

                          {location}
                        </span>
                      ) : null}
                    </div>

                    {/* SUMMARY */}

                    {summary ? (
                      <p
                        className={cn(
                          "font-body mt-2 max-w-3xl text-[11px] text-[var(--foreground-muted)]",

                          khmer && item.summaryKm
                            ? "font-normal leading-6"
                            : "leading-5",
                        )}
                      >
                        {summary}
                      </p>
                    ) : null}
                  </div>

                  {/* ACTIONS */}

                  <div className="flex shrink-0 gap-2 sm:pt-0.5">
                    <button
                      type="button"
                      onClick={() => editItem(item)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.07] text-[var(--foreground-muted)] transition hover:text-violet-600 dark:border-white/[0.08]"
                      aria-label="Edit experience"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => remove(item.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/10 text-red-500 transition hover:bg-red-500/5 disabled:opacity-50"
                      aria-label="Delete experience"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ===================================================
          ADD / EDIT MODAL
         =================================================== */}

      {open ? (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-[820px] overflow-y-auto rounded-2xl border border-black/[0.07] bg-white p-5 shadow-2xl dark:border-white/[0.08] dark:bg-[#0d0f19] md:p-6">
            {/* MODAL HEADER */}

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-cyan-300">
                  {khmer ? "បទពិសោធន៍ការងារ" : "WORK EXPERIENCE"}
                </p>

                <h2
                  className={cn(
                    "font-body mt-1 text-[19px] text-[var(--foreground)]",

                    khmer ? "font-normal leading-8" : "font-semibold",
                  )}
                >
                  {selected
                    ? khmer
                      ? "កែសម្រួលបទពិសោធន៍"
                      : "Edit Experience"
                    : khmer
                      ? "បន្ថែមបទពិសោធន៍"
                      : "Add Experience"}
                </h2>

                <p
                  className={cn(
                    "font-body mt-1 text-[11px] text-[var(--foreground-muted)]",

                    khmer ? "font-normal leading-6" : "leading-5",
                  )}
                >
                  {khmer
                    ? "បញ្ចូលព័ត៌មានសំខាន់ៗសម្រាប់តួនាទី និងរយៈពេលការងារ។"
                    : "Add the essential details for this role and employment period."}
                </p>
              </div>

              <button
                type="button"
                onClick={close}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--foreground-muted)] transition hover:bg-black/[0.04] hover:text-[var(--foreground)] dark:hover:bg-white/[0.05]"
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>

            {/* FORM */}

            <form
              key={selected?.id ?? "new-experience"}
              action={submit}
              className="mt-5 grid gap-4 md:grid-cols-2"
            >
              <input
                type="hidden"
                name="id"
                defaultValue={selected?.id ?? ""}
              />

              {/* ROLE */}

              <Field
                label={
                  khmer ? "តួនាទី — អង់គ្លេស" : "Position / Role — English"
                }
                required
              >
                <input
                  name="titleEn"
                  required
                  defaultValue={selected?.titleEn ?? ""}
                  className="input"
                  placeholder="Full-Stack Developer"
                />
              </Field>

              <Field
                label={khmer ? "តួនាទី — ខ្មែរ" : "Position / Role — Khmer"}
              >
                <input
                  name="titleKm"
                  lang="km"
                  defaultValue={selected?.titleKm ?? ""}
                  className="input khmer-input-value"
                />
              </Field>

              {/* ORGANIZATION */}

              <Field
                label={khmer ? "ស្ថាប័ន — អង់គ្លេស" : "Organization — English"}
              >
                <input
                  name="organizationEn"
                  defaultValue={selected?.organizationEn ?? ""}
                  className="input"
                  placeholder="Company or organization"
                />
              </Field>

              <Field label={khmer ? "ស្ថាប័ន — ខ្មែរ" : "Organization — Khmer"}>
                <input
                  name="organizationKm"
                  lang="km"
                  defaultValue={selected?.organizationKm ?? ""}
                  className="input khmer-input-value"
                />
              </Field>

              {/* DATES */}

              <Field label={khmer ? "ខែចាប់ផ្តើម" : "Start Month"} required>
                <input
                  type="month"
                  name="activityDate"
                  required
                  defaultValue={toMonthInput(selected?.activityDate ?? null)}
                  className="input"
                />
              </Field>

              <Field
                label={khmer ? "ខែបញ្ចប់" : "End Month"}
                hint={
                  currentRole
                    ? khmer
                      ? "កំពុងធ្វើការនៅទីនេះ"
                      : "Current role"
                    : undefined
                }
              >
                <input
                  type="month"
                  name="endDate"
                  disabled={currentRole}
                  defaultValue={toMonthInput(selected?.endDate ?? null)}
                  className="input disabled:cursor-not-allowed disabled:bg-black/[0.025] disabled:text-[var(--foreground-muted)] dark:disabled:bg-white/[0.03]"
                />
              </Field>

              {/* CURRENT */}

              <div className="md:col-span-2 rounded-xl border border-violet-200 bg-violet-50/60 p-3.5 dark:border-violet-400/15 dark:bg-violet-500/[0.05]">
                <label className="font-body flex cursor-pointer items-start gap-3 text-[12px] text-[var(--foreground)]">
                  <input
                    type="checkbox"
                    name="isCurrent"
                    checked={currentRole}
                    onChange={(event) => setCurrentRole(event.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-violet-600"
                  />

                  <span>
                    <span
                      className={
                        khmer
                          ? "khmer-input-value font-normal leading-6"
                          : "font-semibold"
                      }
                    >
                      {khmer
                        ? "ខ្ញុំកំពុងធ្វើការនៅទីនេះ"
                        : "I currently work here"}
                    </span>

                    <span
                      className={cn(
                        "mt-0.5 block text-[10px] text-[var(--foreground-muted)]",

                        khmer
                          ? "khmer-input-value font-normal leading-5"
                          : "leading-4",
                      )}
                    >
                      {khmer
                        ? "នៅពេលជ្រើសរើស វានឹងបង្ហាញជា “បច្ចុប្បន្ន” ហើយមិនចាំបាច់បញ្ចូលខែបញ្ចប់ទេ។"
                        : "When selected, the portfolio shows “Present” and the end month is not required."}
                    </span>
                  </span>
                </label>
              </div>

              {/* LOCATION */}

              <Field label={khmer ? "ទីតាំង — អង់គ្លេស" : "Location — English"}>
                <input
                  name="locationEn"
                  defaultValue={selected?.locationEn ?? ""}
                  className="input"
                  placeholder="Phnom Penh, Cambodia"
                />
              </Field>

              <Field label={khmer ? "ទីតាំង — ខ្មែរ" : "Location — Khmer"}>
                <input
                  name="locationKm"
                  lang="km"
                  defaultValue={selected?.locationKm ?? ""}
                  className="input khmer-input-value"
                />
              </Field>

              {/* SUMMARY */}

              <Field
                label={khmer ? "សេចក្តីសង្ខេប — អង់គ្លេស" : "Summary — English"}
                className="md:col-span-2"
              >
                <textarea
                  name="summaryEn"
                  rows={2}
                  defaultValue={selected?.summaryEn ?? ""}
                  className="input min-h-[72px] resize-y py-2.5"
                  placeholder="A short overview of your role and contribution."
                />
              </Field>

              <Field
                label={khmer ? "សេចក្តីសង្ខេប — ខ្មែរ" : "Summary — Khmer"}
                className="md:col-span-2"
              >
                <textarea
                  name="summaryKm"
                  lang="km"
                  rows={2}
                  defaultValue={selected?.summaryKm ?? ""}
                  className="input khmer-input-value min-h-[72px] resize-y py-2.5"
                />
              </Field>

              {/* DESCRIPTION */}

              <Field
                label={
                  khmer
                    ? "ការទទួលខុសត្រូវ / ព័ត៌មានលម្អិត — អង់គ្លេស"
                    : "Responsibilities / Description — English"
                }
                className="md:col-span-2"
              >
                <textarea
                  name="descriptionEn"
                  rows={3}
                  defaultValue={selected?.descriptionEn ?? ""}
                  className="input min-h-[96px] resize-y py-2.5"
                  placeholder="Describe your responsibilities, achievements or the work you handled."
                />
              </Field>

              <Field
                label={
                  khmer
                    ? "ការទទួលខុសត្រូវ / ព័ត៌មានលម្អិត — ខ្មែរ"
                    : "Responsibilities / Description — Khmer"
                }
                className="md:col-span-2"
              >
                <textarea
                  name="descriptionKm"
                  lang="km"
                  rows={3}
                  defaultValue={selected?.descriptionKm ?? ""}
                  className="input khmer-input-value min-h-[96px] resize-y py-2.5"
                />
              </Field>

              {/* ORDER */}

              <Field label={khmer ? "លំដាប់" : "Order"}>
                <input
                  type="number"
                  name="sortOrder"
                  defaultValue={selected?.sortOrder ?? 0}
                  className="input"
                />
              </Field>

              {/* PUBLISHED */}

              <div className="flex items-end">
                <label className="font-body inline-flex items-center gap-2 text-[12px] text-[var(--foreground)]">
                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked={selected ? selected.published : true}
                    className="h-4 w-4 accent-violet-600"
                  />

                  <span
                    className={
                      khmer ? "khmer-input-value font-normal" : "font-medium"
                    }
                  >
                    {khmer ? "បង្ហាញជាសាធារណៈ" : "Published"}
                  </span>
                </label>
              </div>

              {/* ACTIONS */}

              <div className="flex justify-end gap-2 border-t border-black/[0.06] pt-4 md:col-span-2 dark:border-white/[0.07]">
                <button
                  type="button"
                  onClick={close}
                  disabled={pending}
                  className="h-10 rounded-xl border border-black/[0.08] px-4 font-body text-[12px] font-semibold text-[var(--foreground)] transition hover:bg-black/[0.025] disabled:opacity-50 dark:border-white/[0.08] dark:hover:bg-white/[0.04]"
                >
                  {khmer ? "បោះបង់" : "Cancel"}
                </button>

                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-5 font-body text-[12px] font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
                >
                  <Save size={15} />

                  {pending
                    ? khmer
                      ? "កំពុងរក្សាទុក..."
                      : "Saving..."
                    : khmer
                      ? "រក្សាទុក"
                      : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

/* =========================================================
   FIELD
   ========================================================= */

function Field({
  label,
  required = false,
  hint,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  const isKhmer = /[\u1780-\u17ff]/.test(label);

  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-center justify-between gap-3">
        <span
          className={cn(
            "font-body text-[12px] text-[var(--foreground)]",

            isKhmer
              ? "khmer-input-value font-normal leading-6"
              : "font-semibold",
          )}
        >
          {label}

          {required ? <span className="ml-1 text-red-500">*</span> : null}
        </span>

        {hint ? (
          <span className="font-body text-[9px] text-violet-600 dark:text-cyan-300">
            {hint}
          </span>
        ) : null}
      </span>

      {children}
    </label>
  );
}
