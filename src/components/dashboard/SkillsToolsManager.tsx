"use client";

import {
  type ChangeEvent,
  type ReactNode,
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";

import {
  BrainCircuit,
  Code2,
  Edit3,
  ImageOff,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  Upload,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";

import {
  deleteSkillAction,
  deleteToolAction,
  saveSkillAction,
  saveToolAction,
} from "@/actions/content";

import AppToast from "@/components/ui/AppToast";

import { cn } from "@/lib/cn";

type SkillItem = {
  id: number;
  name: string;
  categoryEn: string | null;
  categoryKm: string | null;
  level: string;
  icon: string | null;
  isCore: boolean;
  published: boolean;
  sortOrder: number;
};

type ToolItem = {
  id: number;
  name: string;
  category: string;
  icon: string | null;
  url: string | null;
  published: boolean;
  sortOrder: number;
};

type Props = {
  locale: "en" | "km";
  skills: SkillItem[];
  tools: ToolItem[];
};

const skillLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

const toolCategories = [
  "DEVELOPMENT",
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "AI_ML",
  "DESIGN",
  "DEVOPS",
  "PRODUCTIVITY",
  "OTHER",
];

export default function SkillsToolsManager({ locale, skills, tools }: Props) {
  const router = useRouter();

  const khmer = locale === "km";

  const [tab, setTab] = useState<"skills" | "tools">("skills");

  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);

  const [editingTool, setEditingTool] = useState<ToolItem | null>(null);

  const [modal, setModal] = useState<"skill" | "tool" | null>(null);

  const [pending, startTransition] = useTransition();

  const [skillIconPreview, setSkillIconPreview] = useState<string | null>(null);

  const [toolIconPreview, setToolIconPreview] = useState<string | null>(null);

  const [removeSkillIcon, setRemoveSkillIcon] = useState(false);

  const [removeToolIcon, setRemoveToolIcon] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    success: true,
    message: "",
  });

  const notify = (success: boolean, message: string) => {
    setToast({
      open: true,
      success,
      message,
    });
  };

  const openSkill = (skill?: SkillItem) => {
    revokeBlobUrl(skillIconPreview);

    setEditingSkill(skill ?? null);

    setSkillIconPreview(skill?.icon ?? null);

    setRemoveSkillIcon(false);

    setModal("skill");
  };

  const openTool = (tool?: ToolItem) => {
    revokeBlobUrl(toolIconPreview);

    setEditingTool(tool ?? null);

    setToolIconPreview(tool?.icon ?? null);

    setRemoveToolIcon(false);

    setModal("tool");
  };

  const closeModal = () => {
    revokeBlobUrl(skillIconPreview);

    revokeBlobUrl(toolIconPreview);

    setModal(null);

    setEditingSkill(null);

    setEditingTool(null);

    setSkillIconPreview(null);

    setToolIconPreview(null);

    setRemoveSkillIcon(false);

    setRemoveToolIcon(false);
  };

  const handleSkillIconChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    revokeBlobUrl(skillIconPreview);

    setSkillIconPreview(URL.createObjectURL(file));

    setRemoveSkillIcon(false);
  };

  const handleToolIconChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    revokeBlobUrl(toolIconPreview);

    setToolIconPreview(URL.createObjectURL(file));

    setRemoveToolIcon(false);
  };

  const clearSkillIcon = () => {
    revokeBlobUrl(skillIconPreview);

    setSkillIconPreview(null);

    setRemoveSkillIcon(true);
  };

  const clearToolIcon = () => {
    revokeBlobUrl(toolIconPreview);

    setToolIconPreview(null);

    setRemoveToolIcon(true);
  };

  const submitSkill = (formData: FormData) => {
    formData.set("removeIcon", removeSkillIcon ? "1" : "0");

    startTransition(async () => {
      const result = await saveSkillAction(formData);

      notify(result.success, result.message);

      if (result.success) {
        closeModal();

        router.refresh();
      }
    });
  };

  const submitTool = (formData: FormData) => {
    formData.set("removeIcon", removeToolIcon ? "1" : "0");

    startTransition(async () => {
      const result = await saveToolAction(formData);

      notify(result.success, result.message);

      if (result.success) {
        closeModal();

        router.refresh();
      }
    });
  };

  const removeSkill = (skill: SkillItem) => {
    if (
      !window.confirm(
        khmer ? "តើអ្នកចង់លុបជំនាញនេះមែនទេ?" : "Delete this skill?",
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteSkillAction(skill.id);

      notify(result.success, result.message);

      if (result.success) {
        router.refresh();
      }
    });
  };

  const removeTool = (tool: ToolItem) => {
    if (
      !window.confirm(
        khmer ? "តើអ្នកចង់លុបឧបករណ៍នេះមែនទេ?" : "Delete this tool?",
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteToolAction(tool.id);

      notify(result.success, result.message);

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

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-600 dark:text-cyan-300">
            Portfolio CMS
          </p>

          <h1 className="font-body mt-1.5 text-[28px] font-semibold">
            {khmer ? "ជំនាញ និងឧបករណ៍" : "Skills & Tools"}
          </h1>

          <p className="font-body mt-1.5 max-w-2xl text-[14px] leading-6 text-[var(--foreground-muted)]">
            {khmer
              ? "គ្រប់គ្រងជំនាញ កម្រិតជំនាញ រូប Logo និងបច្ចេកវិទ្យាដែលបង្ហាញនៅលើ Portfolio របស់អ្នក។"
              : "Manage your skills, expertise levels, logo images and technologies displayed on your portfolio."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => (tab === "skills" ? openSkill() : openTool())}
          className="font-body inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-violet-700"
        >
          <Plus size={16} />

          {khmer ? "បន្ថែមថ្មី" : "Add New"}
        </button>
      </div>

      {/* TABS */}

      <div className="mt-5 flex w-fit rounded-xl border border-black/[0.07] bg-white p-1 dark:border-white/[0.08] dark:bg-[#0d0f19]">
        <button
          type="button"
          onClick={() => setTab("skills")}
          className={cn(
            "font-body inline-flex h-9 items-center gap-2 rounded-lg px-4 text-[12px] font-semibold transition",
            tab === "skills"
              ? "bg-violet-600 text-white"
              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
          )}
        >
          <BrainCircuit size={14} />

          {khmer ? "ជំនាញ" : "Skills"}

          <span className="rounded-full bg-current/10 px-1.5 text-[9px]">
            {skills.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab("tools")}
          className={cn(
            "font-body inline-flex h-9 items-center gap-2 rounded-lg px-4 text-[12px] font-semibold transition",
            tab === "tools"
              ? "bg-violet-600 text-white"
              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
          )}
        >
          <Wrench size={14} />

          {khmer ? "ឧបករណ៍" : "Tools"}

          <span className="rounded-full bg-current/10 px-1.5 text-[9px]">
            {tools.length}
          </span>
        </button>
      </div>

      {/* LIST */}

      <section className="mt-4 overflow-hidden rounded-2xl border border-black/[0.065] bg-white shadow-sm dark:border-white/[0.075] dark:bg-[#0d0f19]">
        {tab === "skills" ? (
          skills.length === 0 ? (
            <EmptyState
              icon={BrainCircuit}
              title={khmer ? "មិនទាន់មានជំនាញ" : "No skills yet"}
            />
          ) : (
            <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-3">
              {skills.map((skill) => (
                <article
                  key={skill.id}
                  className="border-b border-black/[0.055] p-4 last:border-b-0 md:border-r dark:border-white/[0.06]"
                >
                  <div className="flex items-start gap-3">
                    <DashboardItemIcon
                      icon={skill.icon}
                      name={skill.name}
                      fallbackIcon={BrainCircuit}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            <h3 className="font-body truncate text-[14px] font-semibold">
                              {skill.name}
                            </h3>

                            {skill.isCore ? (
                              <CoreBadge locale={locale} />
                            ) : null}
                          </div>

                          <p className="font-body mt-0.5 truncate text-[10px] text-[var(--foreground-muted)]">
                            {khmer && skill.categoryKm
                              ? skill.categoryKm
                              : skill.categoryEn || "General"}
                          </p>
                        </div>

                        <StatusBadge published={skill.published} />
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="rounded-lg bg-cyan-500/10 px-2.5 py-1 font-body text-[10px] font-semibold text-cyan-700 dark:text-cyan-300">
                          {skill.level}
                        </span>

                        <div className="flex gap-1.5">
                          <IconButton
                            label="Edit"
                            onClick={() => openSkill(skill)}
                            icon={Edit3}
                          />

                          <IconButton
                            label="Delete"
                            onClick={() => removeSkill(skill)}
                            icon={Trash2}
                            danger
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : tools.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title={khmer ? "មិនទាន់មានឧបករណ៍" : "No tools yet"}
          />
        ) : (
          <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => (
              <article
                key={tool.id}
                className="border-b border-black/[0.055] p-4 last:border-b-0 md:border-r dark:border-white/[0.06]"
              >
                <div className="flex items-start gap-3">
                  <DashboardItemIcon
                    icon={tool.icon}
                    name={tool.name}
                    fallbackIcon={Code2}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-body truncate text-[14px] font-semibold">
                          {tool.name}
                        </h3>

                        <p className="font-body mt-0.5 truncate text-[10px] text-[var(--foreground-muted)]">
                          {tool.category.replaceAll("_", " ")}
                        </p>
                      </div>

                      <StatusBadge published={tool.published} />
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-1.5">
                      <IconButton
                        label="Edit"
                        onClick={() => openTool(tool)}
                        icon={Edit3}
                      />

                      <IconButton
                        label="Delete"
                        onClick={() => removeTool(tool)}
                        icon={Trash2}
                        danger
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* SKILL MODAL */}

      {modal === "skill" ? (
        <Modal
          title={
            editingSkill
              ? khmer
                ? "កែសម្រួលជំនាញ"
                : "Edit Skill"
              : khmer
                ? "បន្ថែមជំនាញ"
                : "Add Skill"
          }
          onClose={closeModal}
        >
          <form action={submitSkill} className="grid gap-4 md:grid-cols-2">
            <input
              type="hidden"
              name="id"
              defaultValue={editingSkill?.id ?? ""}
            />

            <input
              type="hidden"
              name="icon"
              defaultValue={editingSkill?.icon ?? ""}
            />

            <FormField label={khmer ? "ឈ្មោះជំនាញ" : "Skill Name"}>
              <input
                className="input"
                name="name"
                required
                defaultValue={editingSkill?.name ?? ""}
              />
            </FormField>

            <FormField label={khmer ? "កម្រិត" : "Level"}>
              <select
                className="input"
                name="level"
                defaultValue={editingSkill?.level ?? "INTERMEDIATE"}
              >
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Category — English">
              <input
                className="input"
                name="categoryEn"
                defaultValue={editingSkill?.categoryEn ?? ""}
              />
            </FormField>

            <FormField label="Category — Khmer">
              <input
                className="input khmer-input-value"
                lang="km"
                name="categoryKm"
                defaultValue={editingSkill?.categoryKm ?? ""}
              />
            </FormField>

            <div className="md:col-span-2">
              <IconUploadField
                locale={locale}
                label={khmer ? "រូប Logo / Icon ជំនាញ" : "Skill Logo / Icon"}
                preview={skillIconPreview}
                onChange={handleSkillIconChange}
                onRemove={clearSkillIcon}
              />
            </div>

            <FormField label={khmer ? "លំដាប់" : "Order"}>
              <input
                className="input"
                type="number"
                name="sortOrder"
                defaultValue={editingSkill?.sortOrder ?? 0}
              />
            </FormField>

            <div className="flex items-end">
              <Checkbox
                label={khmer ? "បង្ហាញសាធារណៈ" : "Published"}
                name="published"
                defaultChecked={editingSkill?.published ?? true}
              />
            </div>

            {/* CORE SKILL */}

            <div className="md:col-span-2 rounded-xl border border-violet-200 bg-violet-50/60 p-3.5 dark:border-violet-400/15 dark:bg-violet-500/[0.05]">
              <Checkbox
                label={
                  khmer
                    ? "ជំនាញស្នូល — បង្ហាញជាកាតធំនៅលើ Portfolio"
                    : "Core Skill — show as a large main skill card"
                }
                name="isCore"
                defaultChecked={editingSkill?.isCore ?? false}
              />

              <p className="font-body mt-2 text-[10px] leading-5 text-[var(--foreground-muted)]">
                {khmer
                  ? "អ្នកអាចជ្រើសបានអតិបរមា 4 Core Skills។ Order គ្រប់គ្រងតែលំដាប់បង្ហាញ។"
                  : "Choose up to 4 Core Skills. Order only controls display position; it no longer decides whether a skill is Core."}
              </p>
            </div>

            <ModalActions
              pending={pending}
              onCancel={closeModal}
              locale={locale}
            />
          </form>
        </Modal>
      ) : null}

      {/* TOOL MODAL */}

      {modal === "tool" ? (
        <Modal
          title={
            editingTool
              ? khmer
                ? "កែសម្រួលឧបករណ៍"
                : "Edit Tool"
              : khmer
                ? "បន្ថែមឧបករណ៍"
                : "Add Tool"
          }
          onClose={closeModal}
        >
          <form action={submitTool} className="grid gap-4 md:grid-cols-2">
            <input
              type="hidden"
              name="id"
              defaultValue={editingTool?.id ?? ""}
            />

            <input
              type="hidden"
              name="icon"
              defaultValue={editingTool?.icon ?? ""}
            />

            <FormField label={khmer ? "ឈ្មោះឧបករណ៍" : "Tool Name"}>
              <input
                className="input"
                name="name"
                required
                defaultValue={editingTool?.name ?? ""}
              />
            </FormField>

            <FormField label={khmer ? "ប្រភេទ" : "Category"}>
              <select
                className="input"
                name="category"
                defaultValue={editingTool?.category ?? "OTHER"}
              >
                {toolCategories.map((category) => (
                  <option key={category} value={category}>
                    {category.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="md:col-span-2">
              <IconUploadField
                locale={locale}
                label={khmer ? "Logo / រូបតំណាងឧបករណ៍" : "Tool Logo / Icon"}
                preview={toolIconPreview}
                onChange={handleToolIconChange}
                onRemove={clearToolIcon}
              />
            </div>

            <FormField label="Website URL">
              <input
                className="input"
                name="url"
                defaultValue={editingTool?.url ?? ""}
                placeholder="https://..."
              />
            </FormField>

            <FormField label={khmer ? "លំដាប់" : "Order"}>
              <input
                className="input"
                type="number"
                name="sortOrder"
                defaultValue={editingTool?.sortOrder ?? 0}
              />
            </FormField>

            <div className="md:col-span-2">
              <Checkbox
                label={khmer ? "បង្ហាញសាធារណៈ" : "Published"}
                name="published"
                defaultChecked={editingTool?.published ?? true}
              />
            </div>

            <ModalActions
              pending={pending}
              onCancel={closeModal}
              locale={locale}
            />
          </form>
        </Modal>
      ) : null}
    </>
  );
}

/* =========================================================
   ICON UPLOAD FIELD
   ========================================================= */

function IconUploadField({
  locale,
  label,
  preview,
  onChange,
  onRemove,
}: {
  locale: "en" | "km";
  label: string;
  preview: string | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  const khmer = locale === "km";

  return (
    <div>
      <p className="font-body mb-1.5 text-[12px] font-semibold">{label}</p>

      <div className="rounded-2xl border border-dashed border-violet-300 bg-violet-50/40 p-4 dark:border-violet-400/20 dark:bg-violet-500/[0.04]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-2 shadow-sm dark:border-white/[0.09] dark:bg-white/[0.96]">
            {preview && isImageSource(preview) ? (
              <img
                src={preview}
                alt=""
                className="h-full w-full object-contain"
              />
            ) : (
              <ImagePlus size={24} className="text-violet-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-body text-[12px] font-semibold text-[var(--foreground)]">
              {preview
                ? khmer
                  ? "រូបតំណាងបច្ចុប្បន្ន"
                  : "Current logo"
                : khmer
                  ? "មិនទាន់មានរូបតំណាង"
                  : "No logo selected"}
            </p>

            <p className="font-body mt-1 text-[10px] leading-5 text-[var(--foreground-muted)]">
              {khmer
                ? "ប្រើ PNG, JPG ឬ WebP។ Logo ផ្ទៃថ្លាគឺល្អបំផុត។ ទំហំអតិបរមា 3 MB។"
                : "Use PNG, JPG or WebP. A transparent logo works best. Maximum size is 3 MB."}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <label className="font-body inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 px-3.5 text-[11px] font-semibold text-white transition hover:bg-violet-700">
                <Upload size={14} />

                {preview
                  ? khmer
                    ? "ជំនួសរូបភាព"
                    : "Replace Image"
                  : khmer
                    ? "ជ្រើសរើសរូបភាព"
                    : "Choose Image"}

                <input
                  type="file"
                  name="iconFile"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={onChange}
                  className="sr-only"
                />
              </label>

              {preview ? (
                <button
                  type="button"
                  onClick={onRemove}
                  className="font-body inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 text-[11px] font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                >
                  <ImageOff size={14} />

                  {khmer ? "លុបរូបភាព" : "Remove"}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD ITEM ICON
   ========================================================= */

function DashboardItemIcon({
  icon,
  name,
  fallbackIcon: FallbackIcon,
}: {
  icon: string | null;
  name: string;
  fallbackIcon: LucideIcon;
}) {
  if (icon && isImageSource(icon)) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/[0.07] bg-white p-1.5 shadow-sm dark:border-white/[0.09] dark:bg-white/[0.96]">
        <img
          src={icon}
          alt={`${name} logo`}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-700 dark:text-violet-300">
      <FallbackIcon size={17} strokeWidth={1.8} />
    </div>
  );
}

/* =========================================================
   CORE BADGE
   ========================================================= */

function CoreBadge({ locale }: { locale: "en" | "km" }) {
  return (
    <span className="shrink-0 rounded-full border border-violet-500/15 bg-violet-500/10 px-2 py-0.5 font-body text-[8px] font-semibold uppercase tracking-[0.08em] text-violet-700 dark:text-violet-300">
      {locale === "km" ? "ស្នូល" : "Core"}
    </span>
  );
}

/* =========================================================
   STATUS
   ========================================================= */

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 font-body text-[9px]",
        published
          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "bg-amber-500/10 text-amber-700 dark:text-amber-300",
      )}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

/* =========================================================
   EMPTY
   ========================================================= */

function EmptyState({
  icon: Icon,
  title,
}: {
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-700 dark:text-violet-300">
        <Icon size={20} strokeWidth={1.8} />
      </div>

      <p className="font-body mt-3 text-[15px] font-semibold">{title}</p>
    </div>
  );
}

/* =========================================================
   ICON BUTTON
   ========================================================= */

function IconButton({
  label,
  icon: Icon,
  onClick,
  danger = false,
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg border transition",
        danger
          ? "border-red-500/10 text-red-500 hover:bg-red-500/5"
          : "border-black/[0.07] text-[var(--foreground-muted)] hover:text-violet-600 dark:border-white/[0.08]",
      )}
    >
      <Icon size={14} strokeWidth={1.8} />
    </button>
  );
}

/* =========================================================
   MODAL
   ========================================================= */

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-[680px] overflow-y-auto rounded-2xl border border-black/[0.07] bg-white p-5 shadow-2xl dark:border-white/[0.08] dark:bg-[#0d0f19]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-body text-[18px] font-semibold">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

/* =========================================================
   FORM FIELD
   ========================================================= */

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
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

/* =========================================================
   CHECKBOX
   ========================================================= */

function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="font-body inline-flex items-center gap-2 text-[12px]">
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

/* =========================================================
   MODAL ACTIONS
   ========================================================= */

function ModalActions({
  pending,
  onCancel,
  locale,
}: {
  pending: boolean;
  onCancel: () => void;
  locale: "en" | "km";
}) {
  const khmer = locale === "km";

  return (
    <div className="flex justify-end gap-2 border-t border-black/[0.06] pt-4 md:col-span-2 dark:border-white/[0.07]">
      <button
        type="button"
        onClick={onCancel}
        disabled={pending}
        className="h-10 rounded-xl border border-black/[0.08] px-4 font-body text-[12px] font-semibold disabled:opacity-50 dark:border-white/[0.08]"
      >
        {khmer ? "បោះបង់" : "Cancel"}
      </button>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-5 font-body text-[12px] font-semibold text-white disabled:opacity-60"
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
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function isImageSource(value: string) {
  return (
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:") ||
    value.startsWith("data:")
  );
}

function revokeBlobUrl(value: string | null) {
  if (value?.startsWith("blob:")) {
    URL.revokeObjectURL(value);
  }
}
