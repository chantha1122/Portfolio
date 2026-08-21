"use client";

import {
  useMemo,
  useState,
  useTransition,
  type ChangeEvent,
  type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import {
  Award,
  BriefcaseBusiness,
  CalendarDays,
  Code2,
  ExternalLink,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  MapPin,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";

import {
  deleteSpecializedContentAction,
  saveSpecializedContentAction,
} from "@/actions/content-specialized";

import AppToast from "@/components/ui/AppToast";

import type { SerializedActivity } from "@/lib/serializeActivity";

import { cn } from "@/lib/cn";

type Kind = "activity" | "project" | "certificate";

type Props = {
  locale: "en" | "km";

  kind: Kind;

  items: SerializedActivity[];
};

type Copy = {
  eyebrow: string;
  title: string;
  description: string;
  add: string;
  emptyTitle: string;
  emptyDescription: string;
};

const COPY: Record<
  Kind,
  {
    en: Copy;
    km: Copy;
  }
> = {
  activity: {
    en: {
      eyebrow: "Journey Content",

      title: "Activities",

      description:
        "Manage events, competitions and other important moments in your personal journey.",

      add: "Add Activity",

      emptyTitle: "No activities yet",

      emptyDescription:
        "Add events, competitions or other important moments that should appear in your journey.",
    },

    km: {
      eyebrow: "មាតិកាដំណើរ",

      title: "សកម្មភាព",

      description:
        "គ្រប់គ្រងព្រឹត្តិការណ៍ ការប្រកួត និងសកម្មភាពសំខាន់ៗក្នុងដំណើរផ្ទាល់ខ្លួនរបស់អ្នក។",

      add: "បន្ថែមសកម្មភាព",

      emptyTitle: "មិនទាន់មានសកម្មភាព",

      emptyDescription:
        "បន្ថែមព្រឹត្តិការណ៍ ការប្រកួត ឬសកម្មភាពសំខាន់ៗដែលអ្នកចង់បង្ហាញក្នុងដំណើររបស់អ្នក។",
    },
  },

  project: {
    en: {
      eyebrow: "Portfolio Content",

      title: "Projects",

      description:
        "Manage project case studies, technologies, source links, demos and project images.",

      add: "Add Project",

      emptyTitle: "No projects yet",

      emptyDescription:
        "Add the projects you want to showcase on your public portfolio.",
    },

    km: {
      eyebrow: "មាតិកាផលប័ត្រ",

      title: "គម្រោង",

      description:
        "គ្រប់គ្រងព័ត៌មានគម្រោង បច្ចេកវិទ្យា GitHub Demo និងរូបភាពគម្រោង។",

      add: "បន្ថែមគម្រោង",

      emptyTitle: "មិនទាន់មានគម្រោង",

      emptyDescription: "បន្ថែមគម្រោងដែលអ្នកចង់បង្ហាញនៅលើផលប័ត្រសាធារណៈ។",
    },
  },

  certificate: {
    en: {
      eyebrow: "Credentials",

      title: "Certificates",

      description:
        "Manage certificates, issuing organizations, credential IDs and certificate images.",

      add: "Add Certificate",

      emptyTitle: "No certificates yet",

      emptyDescription:
        "Add certificates and training credentials you want to display publicly.",
    },

    km: {
      eyebrow: "វិញ្ញាបនបត្រ",

      title: "វិញ្ញាបនបត្រ",

      description:
        "គ្រប់គ្រងវិញ្ញាបនបត្រ ស្ថាប័នចេញ លេខសម្គាល់ និងរូបភាពវិញ្ញាបនបត្រ។",

      add: "បន្ថែមវិញ្ញាបនបត្រ",

      emptyTitle: "មិនទាន់មានវិញ្ញាបនបត្រ",

      emptyDescription:
        "បន្ថែមវិញ្ញាបនបត្រ និងការបណ្តុះបណ្តាលដែលអ្នកចង់បង្ហាញជាសាធារណៈ។",
    },
  },
};

function dateInput(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

function readableType(value: string) {
  return value.replaceAll("_", " ");
}

export default function SpecializedContentManager({
  locale,
  kind,
  items,
}: Props) {
  const router = useRouter();

  const km = locale === "km";

  const copy = COPY[kind][locale];

  const [selected, setSelected] = useState<SerializedActivity | null>(null);

  const [open, setOpen] = useState(false);

  const [pending, startTransition] = useTransition();

  const [toast, setToast] = useState({
    open: false,
    success: true,
    message: "",
  });

  const Icon = useMemo<LucideIcon>(() => {
    if (kind === "project") {
      return FolderKanban;
    }

    if (kind === "certificate") {
      return Award;
    }

    return CalendarDays;
  }, [kind]);

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
      const result = await saveSpecializedContentAction(formData);

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
      km ? "តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?" : "Delete this item?",
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
            {copy.eyebrow}
          </p>

          <h1
            className={cn(
              "font-body mt-1.5 text-[28px] text-[var(--foreground)]",

              km ? "font-normal leading-[1.5]" : "font-semibold",
            )}
          >
            {copy.title}
          </h1>

          <p
            className={cn(
              "font-body mt-1.5 max-w-2xl text-[14px] text-[var(--foreground-muted)]",

              km ? "font-normal leading-7" : "leading-6",
            )}
          >
            {copy.description}
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

          {copy.add}
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-black/[0.065] bg-white shadow-sm dark:border-white/[0.075] dark:bg-[#0d0f19]">
        {items.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-300">
              <Icon size={21} />
            </div>

            <h2
              className={cn(
                "font-body mt-4 text-[16px]",

                km ? "font-normal" : "font-semibold",
              )}
            >
              {copy.emptyTitle}
            </h2>

            <p
              className={cn(
                "font-body mt-1 max-w-md text-[12px] text-[var(--foreground-muted)]",

                km ? "font-normal leading-6" : "leading-5",
              )}
            >
              {copy.emptyDescription}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.055] dark:divide-white/[0.065]">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 p-4 transition hover:bg-black/[0.012] sm:flex-row sm:items-center dark:hover:bg-white/[0.015]"
              >
                <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/[0.05] bg-violet-500/[0.06] text-violet-600 dark:border-white/[0.06]">
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
                    <h3
                      className={cn(
                        km && item.titleKm ? "khmer-input-value" : "font-body",

                        "truncate text-[14px] font-semibold text-[var(--foreground)]",
                      )}
                    >
                      {km && item.titleKm ? item.titleKm : item.titleEn}
                    </h3>

                    <span className="rounded-full bg-violet-500/10 px-2 py-0.5 font-body text-[9px] font-semibold text-violet-700 dark:text-violet-300">
                      {readableType(item.type)}
                    </span>

                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 font-body text-[9px]",

                        item.published
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-300",
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

                  <p className="font-body mt-1 text-[11px] text-[var(--foreground-muted)]">
                    {dateInput(item.activityDate)}

                    {item.organizationEn
                      ? ` • ${
                          km && item.organizationKm
                            ? item.organizationKm
                            : item.organizationEn
                        }`
                      : ""}
                  </p>

                  {item.summaryEn || item.summaryKm ? (
                    <p
                      className={cn(
                        km && item.summaryKm
                          ? "khmer-input-value"
                          : "font-body",

                        "mt-1 line-clamp-1 text-[11px] text-[var(--foreground-muted)]",
                      )}
                    >
                      {km && item.summaryKm ? item.summaryKm : item.summaryEn}
                    </p>
                  ) : null}
                </div>

                <div className="flex gap-2">
                  {item.externalUrl ? (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.07] text-[var(--foreground-muted)] transition hover:text-violet-600 dark:border-white/[0.08]"
                    >
                      <ExternalLink size={14} />
                    </a>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => editItem(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.07] text-[var(--foreground-muted)] transition hover:text-violet-600 dark:border-white/[0.08]"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => remove(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/10 text-red-500 transition hover:bg-red-500/[0.05] disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {open ? (
        <EditorModal
          locale={locale}
          kind={kind}
          selected={selected}
          pending={pending}
          onClose={close}
          action={submit}
        />
      ) : null}
    </>
  );
}

/* =========================================================
   MODAL
   ========================================================= */

function EditorModal({
  locale,
  kind,
  selected,
  pending,
  onClose,
  action,
}: {
  locale: "en" | "km";

  kind: Kind;

  selected: SerializedActivity | null;

  pending: boolean;

  onClose: () => void;

  action: (formData: FormData) => void;
}) {
  const km = locale === "km";

  let title = km ? "បន្ថែមសកម្មភាព" : "Add Activity";

  if (kind === "project") {
    title = selected
      ? km
        ? "កែសម្រួលគម្រោង"
        : "Edit Project"
      : km
        ? "បន្ថែមគម្រោង"
        : "Add Project";
  } else if (kind === "certificate") {
    title = selected
      ? km
        ? "កែសម្រួលវិញ្ញាបនបត្រ"
        : "Edit Certificate"
      : km
        ? "បន្ថែមវិញ្ញាបនបត្រ"
        : "Add Certificate";
  } else if (selected) {
    title = km ? "កែសម្រួលសកម្មភាព" : "Edit Activity";
  }

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-[980px] flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#0d0f19]">
        <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] px-5 py-4 dark:border-white/[0.07]">
          <div>
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-cyan-300">
              Portfolio CMS
            </p>

            <h2
              className={cn(
                "font-body mt-1 text-[18px]",

                km ? "font-normal" : "font-semibold",
              )}
            >
              {title}
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

          <input type="hidden" name="kind" value={kind} />

          <input
            type="hidden"
            name="currentCoverImage"
            value={selected?.coverImage ?? ""}
          />

          <input
            type="hidden"
            name="sortOrder"
            defaultValue={selected?.sortOrder ?? 0}
          />

          {kind === "activity" ? (
            <ActivityFields locale={locale} selected={selected} />
          ) : null}

          {kind === "project" ? (
            <ProjectFields locale={locale} selected={selected} />
          ) : null}

          {kind === "certificate" ? (
            <CertificateFields locale={locale} selected={selected} />
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-5 rounded-2xl border border-black/[0.055] bg-black/[0.012] p-4 dark:border-white/[0.07] dark:bg-white/[0.015]">
            <Check
              name="published"
              label={km ? "ផ្សព្វផ្សាយ" : "Published"}
              defaultChecked={selected ? selected.published : true}
            />

            <Check
              name="featured"
              label={km ? "សម្គាល់ជាពិសេស" : "Featured"}
              defaultChecked={selected?.featured ?? false}
            />

            {kind === "project" ? (
              <Check
                name="isCurrent"
                label={km ? "កំពុងអភិវឌ្ឍ" : "Currently working on"}
                defaultChecked={selected?.isCurrent ?? false}
              />
            ) : null}
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
                : km
                  ? "រក្សាទុក"
                  : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   ACTIVITY FORM
   ========================================================= */

function ActivityFields({
  locale,
  selected,
}: {
  locale: "en" | "km";

  selected: SerializedActivity | null;
}) {
  const km = locale === "km";

  return (
    <div className="space-y-4">
      <Section
        icon={CalendarDays}
        title={km ? "ព័ត៌មានសកម្មភាព" : "Activity Information"}
        description={
          km
            ? "សម្រាប់ព្រឹត្តិការណ៍ ការប្រកួត និងសកម្មភាពសំខាន់ៗ។"
            : "Use this for events, competitions and other important journey moments."
        }
        km={km}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={km ? "ប្រភេទសកម្មភាព" : "Activity Type"}>
            <select
              name="type"
              defaultValue={
                selected?.type === "COMPETITION" || selected?.type === "OTHER"
                  ? selected.type
                  : "EVENT"
              }
              className="input"
            >
              <option value="EVENT">{km ? "ព្រឹត្តិការណ៍" : "Event"}</option>

              <option value="COMPETITION">
                {km ? "ការប្រកួត" : "Competition"}
              </option>

              <option value="OTHER">
                {km
                  ? "ផ្សេងៗ / Workshop / Training"
                  : "Other / Workshop / Training"}
              </option>
            </select>
          </Field>

          <div />

          <Input
            label={km ? "ចំណងជើង — អង់គ្លេស" : "Title — English"}
            name="titleEn"
            value={selected?.titleEn ?? ""}
            required
          />

          <Input
            label={km ? "ចំណងជើង — ខ្មែរ" : "Title — Khmer"}
            name="titleKm"
            value={selected?.titleKm ?? ""}
            khmer
          />

          <Input
            label={km ? "ថ្ងៃចាប់ផ្តើម" : "Start Date"}
            name="activityDate"
            type="date"
            value={dateInput(selected?.activityDate ?? null)}
            required
          />

          <Input
            label={km ? "ថ្ងៃបញ្ចប់" : "End Date"}
            name="endDate"
            type="date"
            value={dateInput(selected?.endDate ?? null)}
          />

          <Input
            label={km ? "ស្ថាប័ន — អង់គ្លេស" : "Organization — English"}
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
        </div>
      </Section>

      <BilingualText selected={selected} locale={locale} />

      <CoverUpload
        locale={locale}
        current={selected?.coverImage ?? ""}
        title={km ? "រូបភាពសកម្មភាព" : "Activity Cover"}
      />
    </div>
  );
}

/* =========================================================
   PROJECT FORM
   ========================================================= */

function ProjectFields({
  locale,
  selected,
}: {
  locale: "en" | "km";

  selected: SerializedActivity | null;
}) {
  const km = locale === "km";

  return (
    <div className="space-y-4">
      <Section
        icon={FolderKanban}
        title={km ? "ព័ត៌មានគម្រោង" : "Project Information"}
        description={
          km
            ? "ព័ត៌មានសម្រាប់បង្ហាញគម្រោងជាករណីសិក្សានៅលើ Portfolio។"
            : "Project-specific information for your public case study."
        }
        km={km}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={km ? "ឈ្មោះគម្រោង — អង់គ្លេស" : "Project Title — English"}
            name="titleEn"
            value={selected?.titleEn ?? ""}
            required
          />

          <Input
            label={km ? "ឈ្មោះគម្រោង — ខ្មែរ" : "Project Title — Khmer"}
            name="titleKm"
            value={selected?.titleKm ?? ""}
            khmer
          />

          <Input
            label={km ? "ថ្ងៃចាប់ផ្តើម" : "Start Date"}
            name="activityDate"
            type="date"
            value={dateInput(selected?.activityDate ?? null)}
            required
          />

          <Input
            label={km ? "ថ្ងៃបញ្ចប់" : "End Date"}
            name="endDate"
            type="date"
            value={dateInput(selected?.endDate ?? null)}
          />

          <Input
            label={
              km
                ? "អតិថិជន / ស្ថាប័ន — អង់គ្លេស"
                : "Client / Organization — English"
            }
            name="organizationEn"
            value={selected?.organizationEn ?? ""}
            icon={BriefcaseBusiness}
          />

          <Input
            label={
              km ? "អតិថិជន / ស្ថាប័ន — ខ្មែរ" : "Client / Organization — Khmer"
            }
            name="organizationKm"
            value={selected?.organizationKm ?? ""}
            icon={BriefcaseBusiness}
            khmer
          />
        </div>
      </Section>

      <BilingualText selected={selected} locale={locale} />

      <Section
        icon={Code2}
        title={km ? "បច្ចេកវិទ្យា និងតំណ" : "Technology & Links"}
        description={
          km
            ? "បន្ថែម Tech Stack និងតំណដែលពាក់ព័ន្ធនឹងគម្រោង។"
            : "Add the project tech stack and only the links that belong to this project."
        }
        km={km}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label={km ? "បច្ចេកវិទ្យា" : "Technologies"}
              name="technologies"
              value={selected?.technologies ?? ""}
              placeholder="Next.js, TypeScript, Spring Boot, PostgreSQL"
            />
          </div>

          <Input
            label="GitHub URL"
            name="githubUrl"
            type="url"
            value={selected?.githubUrl ?? ""}
          />

          <Input
            label="Demo URL"
            name="demoUrl"
            type="url"
            value={selected?.demoUrl ?? ""}
          />

          <div className="md:col-span-2">
            <Input
              label="Website / External URL"
              name="externalUrl"
              type="url"
              value={selected?.externalUrl ?? ""}
            />
          </div>
        </div>
      </Section>

      <CoverUpload
        locale={locale}
        current={selected?.coverImage ?? ""}
        title={km ? "រូបភាពគម្រោង" : "Project Cover"}
      />
    </div>
  );
}

/* =========================================================
   CERTIFICATE FORM
   ========================================================= */

function CertificateFields({
  locale,
  selected,
}: {
  locale: "en" | "km";

  selected: SerializedActivity | null;
}) {
  const km = locale === "km";

  return (
    <div className="space-y-4">
      <Section
        icon={Award}
        title={km ? "ព័ត៌មានវិញ្ញាបនបត្រ" : "Certificate Information"}
        description={
          km
            ? "ព័ត៌មានដែលពាក់ព័ន្ធតែវិញ្ញាបនបត្រ និង Credential ប៉ុណ្ណោះ។"
            : "Only the fields that belong to a certificate or credential."
        }
        km={km}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={
              km ? "ឈ្មោះវិញ្ញាបនបត្រ — អង់គ្លេស" : "Certificate Name — English"
            }
            name="titleEn"
            value={selected?.titleEn ?? ""}
            required
          />

          <Input
            label={
              km ? "ឈ្មោះវិញ្ញាបនបត្រ — ខ្មែរ" : "Certificate Name — Khmer"
            }
            name="titleKm"
            value={selected?.titleKm ?? ""}
            khmer
          />

          <Input
            label={km ? "ថ្ងៃចេញ" : "Issue Date"}
            name="activityDate"
            type="date"
            value={dateInput(selected?.activityDate ?? null)}
            required
          />

          <Input
            label={km ? "ថ្ងៃផុតកំណត់" : "Expiration Date"}
            name="endDate"
            type="date"
            value={dateInput(selected?.endDate ?? null)}
          />

          <Input
            label={km ? "ស្ថាប័នចេញ — អង់គ្លេស" : "Issuer — English"}
            name="organizationEn"
            value={selected?.organizationEn ?? ""}
          />

          <Input
            label={km ? "ស្ថាប័នចេញ — ខ្មែរ" : "Issuer — Khmer"}
            name="organizationKm"
            value={selected?.organizationKm ?? ""}
            khmer
          />

          <Input
            label="Credential ID"
            name="credentialId"
            value={selected?.credentialId ?? ""}
          />

          <Input
            label="Credential URL"
            name="externalUrl"
            type="url"
            value={selected?.externalUrl ?? ""}
          />
        </div>
      </Section>

      <BilingualText selected={selected} locale={locale} summaryOnly />

      <CoverUpload
        locale={locale}
        current={selected?.coverImage ?? ""}
        title={km ? "រូបភាពវិញ្ញាបនបត្រ" : "Certificate Image"}
      />
    </div>
  );
}

/* =========================================================
   SHARED FORM PARTS
   ========================================================= */

function BilingualText({
  selected,
  locale,
  summaryOnly = false,
}: {
  selected: SerializedActivity | null;

  locale: "en" | "km";

  summaryOnly?: boolean;
}) {
  const km = locale === "km";

  return (
    <Section
      icon={FileText}
      title={km ? "អត្ថបទបង្ហាញ" : "Content"}
      description={
        km
          ? "បំពេញអត្ថបទអង់គ្លេស និងខ្មែរសម្រាប់គេហទំព័រសាធារណៈ។"
          : "Write the English and Khmer text that should appear on the public website."
      }
      km={km}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Area
          label={km ? "សេចក្តីសង្ខេប — អង់គ្លេស" : "Short Summary — English"}
          name="summaryEn"
          value={selected?.summaryEn ?? ""}
          rows={3}
        />

        <Area
          label={km ? "សេចក្តីសង្ខេប — ខ្មែរ" : "Short Summary — Khmer"}
          name="summaryKm"
          value={selected?.summaryKm ?? ""}
          rows={3}
          khmer
        />

        {!summaryOnly ? (
          <>
            <Area
              label={
                km ? "ពិពណ៌នាលម្អិត — អង់គ្លេស" : "Full Description — English"
              }
              name="descriptionEn"
              value={selected?.descriptionEn ?? ""}
              rows={5}
            />

            <Area
              label={km ? "ពិពណ៌នាលម្អិត — ខ្មែរ" : "Full Description — Khmer"}
              name="descriptionKm"
              value={selected?.descriptionKm ?? ""}
              rows={5}
              khmer
            />
          </>
        ) : null}
      </div>
    </Section>
  );
}

function CoverUpload({
  locale,
  current,
  title,
}: {
  locale: "en" | "km";

  current: string;

  title: string;
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
    <Section
      icon={Upload}
      title={title}
      description={
        km
          ? "ជ្រើសរើស JPG, PNG ឬ WEBP។ អតិបរមា 5 MB។"
          : "Choose a JPG, PNG or WEBP image. Maximum 5 MB."
      }
      km={km}
    >
      <input type="hidden" name="removeCoverImage" value={remove ? "1" : "0"} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-[120px] w-full max-w-[190px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-violet-500/20 bg-violet-500/[0.04]">
          {preview && !remove ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon size={28} className="text-violet-400" />
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
    </Section>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  km,
  children,
}: {
  icon: LucideIcon;
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
            className={cn(
              "font-body text-[16px] text-[var(--foreground)]",

              km ? "font-normal leading-7" : "font-semibold",
            )}
          >
            {title}
          </h3>

          <p
            className={cn(
              "font-body mt-0.5 text-[11px] text-[var(--foreground-muted)]",

              km ? "font-normal leading-6" : "leading-5",
            )}
          >
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  const khmerLabel = /[\u1780-\u17ff]/.test(label);

  return (
    <label className="block">
      <span
        className={cn(
          "font-body mb-1.5 block text-[12px] text-[var(--foreground)]",

          khmerLabel ? "font-normal leading-6" : "font-semibold",
        )}
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
  icon?: LucideIcon;
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
          className={cn(
            "input",

            khmer && "khmer-input-value",

            Icon && "!pl-9",
          )}
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
        className={cn(
          "textarea",

          khmer && "khmer-input-value",
        )}
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
