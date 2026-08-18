"use client";

import { useState, useTransition } from "react";

import {
  CalendarDays,
  Edit3,
  ExternalLink,
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { deleteActivityAction, saveActivityAction } from "@/actions/content";

import AppToast from "@/components/ui/AppToast";
import { cn } from "@/lib/cn";

type ActivityItem = {
  id: number;

  type: string;

  titleEn: string;
  titleKm: string | null;

  summaryEn: string | null;
  summaryKm: string | null;

  descriptionEn: string | null;
  descriptionKm: string | null;

  activityDate: string;
  endDate: string | null;

  datePrecision: string;

  isCurrent: boolean;

  coverImage: string | null;

  locationEn: string | null;
  locationKm: string | null;

  organizationEn: string | null;
  organizationKm: string | null;

  externalUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;

  credentialId: string | null;

  technologies: string | null;

  featured: boolean;
  published: boolean;

  sortOrder: number;
};

type Props = {
  locale: "en" | "km";

  items: ActivityItem[];

  lockedType?: string;

  title: string;

  description: string;
};

const TYPES = [
  "PROJECT",
  "CERTIFICATE",
  "EDUCATION",
  "WORK",
  "TEACHING",
  "COMPETITION",
  "ACHIEVEMENT",
  "EVENT",
  "PHOTO",
  "OTHER",
];

function toDateInput(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

export default function ActivityManager({
  locale,
  items,
  lockedType,
  title,
  description,
}: Props) {
  const router = useRouter();

  const [selected, setSelected] = useState<ActivityItem | null>(null);

  const [formOpen, setFormOpen] = useState(false);

  const [pending, startTransition] = useTransition();

  const [toast, setToast] = useState<{
    open: boolean;
    success: boolean;
    message: string;
  }>({
    open: false,
    success: true,
    message: "",
  });

  const khmer = locale === "km";

  const startCreate = () => {
    setSelected(null);
    setFormOpen(true);
  };

  const startEdit = (item: ActivityItem) => {
    setSelected(item);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelected(null);
  };

  const submit = (formData: FormData) => {
    startTransition(async () => {
      const result = await saveActivityAction(formData);

      setToast({
        open: true,
        success: result.success,
        message: result.message,
      });

      if (result.success) {
        closeForm();
        router.refresh();
      }
    });
  };

  const remove = (id: number) => {
    if (
      !window.confirm(
        khmer ? "តើអ្នកពិតជាចង់លុបមាតិកានេះមែនទេ?" : "Delete this content?",
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteActivityAction(id);

      setToast({
        open: true,
        success: result.success,
        message: result.message,
      });

      if (result.success) {
        router.refresh();
      }
    });
  };

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
            Portfolio CMS
          </p>

          <h1 className="font-body mt-1.5 text-[28px] font-semibold">
            {title}
          </h1>

          <p className="font-body mt-1.5 max-w-2xl text-[14px] leading-6 text-[var(--foreground-muted)]">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="font-body inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-violet-700"
        >
          <Plus size={16} />

          {khmer ? "បន្ថែមថ្មី" : "Add New"}
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-black/[0.065] bg-white shadow-sm dark:border-white/[0.075] dark:bg-[#0d0f19]">
        {items.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600">
              <CalendarDays size={21} />
            </div>

            <h2 className="font-body mt-4 text-[16px] font-semibold">
              {khmer ? "មិនទាន់មានទិន្នន័យ" : "No content yet"}
            </h2>

            <p className="font-body mt-1 max-w-md text-[12px] leading-5 text-[var(--foreground-muted)]">
              {khmer
                ? "ចុច បន្ថែមថ្មី ដើម្បីចាប់ផ្តើមបំពេញផលប័ត្ររបស់អ្នក។"
                : "Click Add New to start building your portfolio content."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.055] dark:divide-white/[0.065]">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 p-4 transition hover:bg-black/[0.012] sm:flex-row sm:items-center dark:hover:bg-white/[0.015]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-violet-500/10 text-violet-600">
                  {item.coverImage ? (
                    <img
                      src={item.coverImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={20} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-body truncate text-[14px] font-semibold">
                      {khmer && item.titleKm ? item.titleKm : item.titleEn}
                    </h3>

                    <span className="rounded-full bg-violet-500/10 px-2 py-0.5 font-body text-[9px] font-semibold text-violet-700 dark:text-violet-300">
                      {item.type}
                    </span>

                    {item.published ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-body text-[9px] text-emerald-700 dark:text-emerald-300">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-body text-[9px] text-amber-700 dark:text-amber-300">
                        Draft
                      </span>
                    )}
                  </div>

                  <p className="font-body mt-1 text-[11px] text-[var(--foreground-muted)]">
                    {toDateInput(item.activityDate)}

                    {item.organizationEn
                      ? ` • ${
                          khmer && item.organizationKm
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
                    >
                      <ExternalLink size={15} />
                    </a>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.07] text-[var(--foreground-muted)] transition hover:text-violet-600 dark:border-white/[0.08]"
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => remove(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/10 text-red-500 transition hover:bg-red-500/5"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-[900px] overflow-y-auto rounded-2xl border border-white/10 bg-white p-5 shadow-2xl dark:bg-[#0d0f19]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-body text-[18px] font-semibold">
                  {selected
                    ? khmer
                      ? "កែសម្រួល"
                      : "Edit Content"
                    : khmer
                      ? "បន្ថែមថ្មី"
                      : "Add Content"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
              >
                <X size={17} />
              </button>
            </div>

            <form
              key={selected?.id ?? "new"}
              action={submit}
              className="mt-5 grid gap-4 md:grid-cols-2"
            >
              <input
                type="hidden"
                name="id"
                defaultValue={selected?.id ?? ""}
              />

              <FieldLabel label="Type">
                <select
                  name="type"
                  defaultValue={lockedType ?? selected?.type ?? "PROJECT"}
                  disabled={Boolean(lockedType)}
                  className="h-10 w-full rounded-xl border border-black/[0.08] bg-white px-3 text-[13px] outline-none dark:border-white/[0.08] dark:bg-[#121520]"
                >
                  {TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                {lockedType ? (
                  <input type="hidden" name="type" value={lockedType} />
                ) : null}
              </FieldLabel>

              <FieldLabel label="Date precision">
                <select
                  name="datePrecision"
                  defaultValue={selected?.datePrecision ?? "DAY"}
                  className="h-10 w-full rounded-xl border border-black/[0.08] bg-white px-3 text-[13px] outline-none dark:border-white/[0.08] dark:bg-[#121520]"
                >
                  <option value="DAY">Day</option>

                  <option value="MONTH">Month</option>

                  <option value="YEAR">Year</option>
                </select>
              </FieldLabel>

              <FieldLabel label="Title — English">
                <input
                  name="titleEn"
                  required
                  defaultValue={selected?.titleEn ?? ""}
                  className="input"
                />
              </FieldLabel>

              <FieldLabel label="Title — Khmer">
                <input
                  name="titleKm"
                  lang="km"
                  defaultValue={selected?.titleKm ?? ""}
                  className="input khmer-input-value"
                />
              </FieldLabel>

              <FieldLabel label="Start date">
                <input
                  type="date"
                  name="activityDate"
                  required
                  defaultValue={toDateInput(selected?.activityDate ?? null)}
                  className="input"
                />
              </FieldLabel>

              <FieldLabel label="End date">
                <input
                  type="date"
                  name="endDate"
                  defaultValue={toDateInput(selected?.endDate ?? null)}
                  className="input"
                />
              </FieldLabel>

              <FieldLabel label="Organization — English">
                <input
                  name="organizationEn"
                  defaultValue={selected?.organizationEn ?? ""}
                  className="input"
                />
              </FieldLabel>

              <FieldLabel label="Organization — Khmer">
                <input
                  lang="km"
                  name="organizationKm"
                  defaultValue={selected?.organizationKm ?? ""}
                  className="input khmer-input-value"
                />
              </FieldLabel>

              <FieldLabel label="Location — English">
                <input
                  name="locationEn"
                  defaultValue={selected?.locationEn ?? ""}
                  className="input"
                />
              </FieldLabel>

              <FieldLabel label="Location — Khmer">
                <input
                  lang="km"
                  name="locationKm"
                  defaultValue={selected?.locationKm ?? ""}
                  className="input khmer-input-value"
                />
              </FieldLabel>

              <FieldLabel label="Cover image URL/path">
                <input
                  name="coverImage"
                  defaultValue={selected?.coverImage ?? ""}
                  className="input"
                  placeholder="/images/project.jpg"
                />
              </FieldLabel>

              <FieldLabel label="Technologies">
                <input
                  name="technologies"
                  defaultValue={selected?.technologies ?? ""}
                  className="input"
                  placeholder="Next.js, TypeScript, PostgreSQL"
                />
              </FieldLabel>

              <FieldLabel label="GitHub URL">
                <input
                  name="githubUrl"
                  defaultValue={selected?.githubUrl ?? ""}
                  className="input"
                />
              </FieldLabel>

              <FieldLabel label="Demo URL">
                <input
                  name="demoUrl"
                  defaultValue={selected?.demoUrl ?? ""}
                  className="input"
                />
              </FieldLabel>

              <FieldLabel label="External URL">
                <input
                  name="externalUrl"
                  defaultValue={selected?.externalUrl ?? ""}
                  className="input"
                />
              </FieldLabel>

              <FieldLabel label="Credential ID">
                <input
                  name="credentialId"
                  defaultValue={selected?.credentialId ?? ""}
                  className="input"
                />
              </FieldLabel>

              <div className="md:col-span-2">
                <FieldLabel label="Summary — English">
                  <textarea
                    name="summaryEn"
                    rows={3}
                    defaultValue={selected?.summaryEn ?? ""}
                    className="textarea"
                  />
                </FieldLabel>
              </div>

              <div className="md:col-span-2">
                <FieldLabel label="Summary — Khmer">
                  <textarea
                    name="summaryKm"
                    lang="km"
                    rows={3}
                    defaultValue={selected?.summaryKm ?? ""}
                    className="textarea khmer-input-value"
                  />
                </FieldLabel>
              </div>

              <div className="md:col-span-2">
                <FieldLabel label="Description — English">
                  <textarea
                    name="descriptionEn"
                    rows={5}
                    defaultValue={selected?.descriptionEn ?? ""}
                    className="textarea"
                  />
                </FieldLabel>
              </div>

              <div className="md:col-span-2">
                <FieldLabel label="Description — Khmer">
                  <textarea
                    name="descriptionKm"
                    lang="km"
                    rows={5}
                    defaultValue={selected?.descriptionKm ?? ""}
                    className="textarea khmer-input-value"
                  />
                </FieldLabel>
              </div>

              <FieldLabel label="Order">
                <input
                  type="number"
                  name="sortOrder"
                  defaultValue={selected?.sortOrder ?? 0}
                  className="input"
                />
              </FieldLabel>

              <div className="flex flex-wrap items-center gap-5 pt-6">
                <Checkbox
                  name="published"
                  label="Published"
                  defaultChecked={selected ? selected.published : true}
                />

                <Checkbox
                  name="featured"
                  label="Featured"
                  defaultChecked={selected?.featured ?? false}
                />

                <Checkbox
                  name="isCurrent"
                  label="Current"
                  defaultChecked={selected?.isCurrent ?? false}
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-black/[0.06] pt-4 md:col-span-2 dark:border-white/[0.07]">
                <button
                  type="button"
                  onClick={closeForm}
                  className="h-10 rounded-xl border border-black/[0.08] px-4 font-body text-[12px] font-semibold dark:border-white/[0.08]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-5 font-body text-[12px] font-semibold text-white"
                >
                  <Save size={15} />

                  {pending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-body mb-1.5 block text-[12px] font-semibold">
        {label}
      </span>

      {children}
    </label>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-2 font-body text-[12px]">
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
