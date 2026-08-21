import { ExternalLink, Sparkles } from "lucide-react";

import type { PublicSkill, PublicTool } from "@/types/publicPortfolio";

type Props = {
  locale: "en" | "km";
  skills: PublicSkill[];
  tools: PublicTool[];
};

type ToolGroup = {
  key: string;
  labelEn: string;
  labelKm: string;
  dotClass: string;
  tools: PublicTool[];
};

const TOOL_GROUP_ORDER = [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "AI_ML",
  "DEVOPS",
  "DEVELOPMENT",
  "DESIGN",
  "PRODUCTIVITY",
  "OTHER",
];

export default function SkillsToolsSection({ locale, skills, tools }: Props) {
  const khmer = locale === "km";

  /*
   * Core Skill:
   *
   * If you selected Core Skill checkboxes,
   * those skills become the large cards.
   *
   * If no Core Skills have been selected yet,
   * first 4 skills temporarily remain large cards.
   */
  const selectedCoreSkills = skills.filter((skill) => skill.isCore);

  const usingFallbackCoreSkills = selectedCoreSkills.length === 0;

  const coreSkills = usingFallbackCoreSkills
    ? skills.slice(0, 4)
    : selectedCoreSkills;

  const coreIds = new Set(coreSkills.map((skill) => skill.id));

  const additionalSkills = skills.filter((skill) => !coreIds.has(skill.id));

  const toolGroups = buildToolGroups(tools);

  return (
    <section id="skills" className="portfolio-section scroll-mt-28">
      {/* ===================================================
          MAIN TITLE — LEFT ALIGNED
         =================================================== */}

      <div className="max-w-3xl">
        <p
          className={
            khmer
              ? "khmer-input-value text-[11px] font-normal leading-6 text-[var(--portfolio-cyan)]"
              : "font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--portfolio-cyan)]"
          }
        >
          {khmer ? "ជំនាញបច្ចេកទេស" : "CAPABILITIES"}
        </p>

        <h2
          className={
            khmer
              ? "khmer-input-value mt-3 text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.45] text-[var(--portfolio-text)]"
              : "font-display mt-3 text-[clamp(2.8rem,6vw,5.3rem)] leading-[0.92] text-[var(--portfolio-text)]"
          }
        >
          {khmer ? "ជំនាញ និងឧបករណ៍" : "Skills & Tools"}
        </h2>

        <p
          className={
            khmer
              ? "khmer-input-value mt-4 max-w-2xl text-[13px] font-normal leading-7 text-[var(--portfolio-muted)]"
              : "font-body mt-4 max-w-2xl text-[13px] leading-7 text-[var(--portfolio-muted)]"
          }
        >
          {khmer
            ? "ជំនាញ បច្ចេកវិទ្យា និងឧបករណ៍ដែលខ្ញុំប្រើសម្រាប់បង្កើតផលិតផលឌីជីថល និងគម្រោង AI ជាក់ស្តែង។"
            : "The skills, technologies and tools I use to build modern digital products and practical AI solutions."}
        </p>
      </div>

      {/* ===================================================
          TWO COLUMNS
         =================================================== */}

      <div className="mt-10 grid items-start gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        {/* =================================================
            LEFT — SKILLS
           ================================================= */}

        <div className="relative overflow-hidden rounded-[28px] border border-[var(--portfolio-border)] bg-[var(--portfolio-panel)] p-5 md:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 h-[240px] w-[240px] rounded-full bg-violet-500/[0.05] blur-[100px] dark:bg-violet-500/[0.08]"
          />

          <div className="relative">
            <div>
              <p className="font-body text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--portfolio-cyan)]">
                {khmer ? "ជំនាញសំខាន់ៗ" : "CORE SKILLS"}
              </p>

              <h3
                className={
                  khmer
                    ? "khmer-input-value mt-2 text-[22px] font-normal leading-9 text-[var(--portfolio-text)]"
                    : "font-display mt-2 text-[30px] leading-none text-[var(--portfolio-text)]"
                }
              >
                {khmer ? "អ្វីដែលខ្ញុំអាចធ្វើបាន" : "What I Can Do"}
              </h3>

              <p
                className={
                  khmer
                    ? "khmer-input-value mt-3 text-[10px] font-normal leading-6 text-[var(--portfolio-muted)]"
                    : "font-body mt-3 text-[11px] leading-5 text-[var(--portfolio-muted)]"
                }
              >
                {khmer
                  ? "ជំនាញបច្ចេកទេស និងផ្នែកជំនាញសំខាន់ៗរបស់ខ្ញុំ។"
                  : "My main technical skills and expertise areas."}
              </p>
            </div>

            {/* CORE CARDS */}

            {coreSkills.length > 0 ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {coreSkills.map((skill) => (
                  <CoreSkillCard key={skill.id} locale={locale} skill={skill} />
                ))}
              </div>
            ) : (
              <SkillsEmpty locale={locale} />
            )}

            {/* ADDITIONAL EXPERTISE */}

            {additionalSkills.length > 0 ? (
              <div className="mt-7">
                <div className="flex items-center gap-3">
                  <p className="font-body shrink-0 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--portfolio-cyan)]">
                    {khmer ? "ជំនាញបន្ថែម" : "ADDITIONAL EXPERTISE"}
                  </p>

                  <div className="h-px flex-1 bg-[var(--portfolio-border)]" />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {additionalSkills.map((skill) => (
                    <AdditionalSkill key={skill.id} skill={skill} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* =================================================
            RIGHT — TECH STACK
           ================================================= */}

        <div className="relative overflow-hidden rounded-[28px] border border-[var(--portfolio-border)] bg-[var(--portfolio-panel)] p-5 md:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -right-24 h-[260px] w-[260px] rounded-full bg-cyan-400/[0.04] blur-[100px] dark:bg-cyan-400/[0.07]"
          />

          <div className="relative">
            <div>
              <p className="font-body text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--portfolio-cyan)]">
                {khmer ? "បច្ចេកវិទ្យា" : "TECH STACK"}
              </p>

              <h3
                className={
                  khmer
                    ? "khmer-input-value mt-2 text-[22px] font-normal leading-9 text-[var(--portfolio-text)]"
                    : "font-display mt-2 text-[30px] leading-none text-[var(--portfolio-text)]"
                }
              >
                {khmer ? "ឧបករណ៍ដែលខ្ញុំប្រើ" : "Tools I Use"}
              </h3>

              <p
                className={
                  khmer
                    ? "khmer-input-value mt-3 text-[10px] font-normal leading-6 text-[var(--portfolio-muted)]"
                    : "font-body mt-3 text-[11px] leading-5 text-[var(--portfolio-muted)]"
                }
              >
                {khmer
                  ? "Framework, library, database និង software ដែលខ្ញុំប្រើសម្រាប់គម្រោងផ្សេងៗ។"
                  : "Technologies, frameworks and tools across different categories."}
              </p>
            </div>

            {toolGroups.length > 0 ? (
              <div className="mt-6 grid gap-5">
                {toolGroups.map((group) => (
                  <ToolCategoryGroup
                    key={group.key}
                    locale={locale}
                    group={group}
                  />
                ))}
              </div>
            ) : (
              <ToolsEmpty locale={locale} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CORE SKILL CARD
   ========================================================= */

function CoreSkillCard({
  locale,
  skill,
}: {
  locale: "en" | "km";
  skill: PublicSkill;
}) {
  const khmer = locale === "km";

  const category =
    khmer && skill.categoryKm
      ? skill.categoryKm
      : skill.categoryEn || (khmer ? "ជំនាញ" : "Skill");

  return (
    <article className="group relative overflow-hidden rounded-[22px] border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] p-4 transition duration-300 hover:-translate-y-1 hover:border-[var(--portfolio-cyan)]/30 hover:shadow-[0_14px_36px_rgba(80,70,180,0.09)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-violet-500/[0.04] blur-3xl dark:bg-violet-500/[0.06]"
      />

      <div className="relative">
        <SkillLogo skill={skill} />

        <div className="mt-4 min-w-0">
          <h4
            className={
              khmer
                ? "khmer-input-value text-[13px] font-normal leading-6 text-[var(--portfolio-text)]"
                : "font-body text-[13px] font-semibold leading-5 text-[var(--portfolio-text)]"
            }
          >
            {skill.name}
          </h4>

          <p
            className={
              khmer && skill.categoryKm
                ? "khmer-input-value mt-1 text-[9px] font-normal leading-5 text-[var(--portfolio-muted)]"
                : "font-body mt-1 text-[9px] text-[var(--portfolio-muted)]"
            }
          >
            {category}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <span className="font-body rounded-full border border-violet-500/15 bg-violet-500/[0.08] px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.1em] text-violet-600 dark:border-violet-400/15 dark:bg-violet-500/[0.12] dark:text-violet-300">
            {formatSkillLevel(skill.level)}
          </span>
        </div>

        <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-black/[0.05] dark:bg-white/[0.07]">
          <div
            className={`h-full rounded-full bg-gradient-to-r from-violet-500 via-violet-400 to-cyan-400 ${skillLevelWidth(
              skill.level,
            )}`}
          />
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   SKILL LOGO
   ========================================================= */

function SkillLogo({ skill }: { skill: PublicSkill }) {
  if (isImageSource(skill.icon)) {
    return (
      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[13px] border border-[var(--portfolio-border)] bg-white p-1.5 shadow-[0_5px_16px_rgba(15,23,42,0.05)] dark:bg-white/[0.96]">
        <img
          src={skill.icon!}
          alt={`${skill.name} icon`}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-[13px] border border-violet-500/15 bg-gradient-to-br from-violet-500/15 to-cyan-400/10 text-[var(--portfolio-cyan)]">
      <Sparkles size={17} strokeWidth={1.7} />
    </div>
  );
}

/* =========================================================
   ADDITIONAL SKILL
   ========================================================= */

function AdditionalSkill({ skill }: { skill: PublicSkill }) {
  return (
    <div className="group inline-flex min-h-8 items-center gap-2 rounded-[10px] border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] px-3 py-1.5 transition hover:border-[var(--portfolio-cyan)]/35">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--portfolio-cyan)] shadow-[0_0_8px_currentColor]" />

      {isImageSource(skill.icon) ? (
        <img
          src={skill.icon!}
          alt=""
          className="h-4 w-4 shrink-0 object-contain"
        />
      ) : null}

      <span className="font-body text-[9px] font-medium text-[var(--portfolio-text)]">
        {skill.name}
      </span>
    </div>
  );
}

/* =========================================================
   TOOL CATEGORY
   ========================================================= */

function ToolCategoryGroup({
  locale,
  group,
}: {
  locale: "en" | "km";
  group: ToolGroup;
}) {
  const label = locale === "km" ? group.labelKm : group.labelEn;

  return (
    <div>
      <div className="flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${group.dotClass}`}
        />

        <p className="font-body text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--portfolio-text)]">
          {label}
        </p>

        <div className="h-px flex-1 bg-[var(--portfolio-border)]" />
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-4">
        {group.tools.map((tool) => (
          <ToolItemCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   TOOL ITEM
   ========================================================= */

function ToolItemCard({ tool }: { tool: PublicTool }) {
  const content = (
    <>
      <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[13px] border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] transition duration-300 group-hover:-translate-y-1 group-hover:border-[var(--portfolio-cyan)]/35">
        {isImageSource(tool.icon) ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white p-1 dark:bg-white/[0.96]">
            <img
              src={tool.icon!}
              alt={`${tool.name} logo`}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <span className="font-display text-[15px] text-[var(--portfolio-cyan)]">
            {makeInitials(tool.name)}
          </span>
        )}

        {tool.url ? (
          <ExternalLink
            size={8}
            className="absolute right-1 top-1 text-[var(--portfolio-muted)] opacity-0 transition group-hover:opacity-100"
          />
        ) : null}
      </div>

      <p className="font-body mt-1.5 max-w-[70px] truncate text-center text-[8px] font-medium text-[var(--portfolio-muted)] transition group-hover:text-[var(--portfolio-text)]">
        {tool.name}
      </p>
    </>
  );

  if (tool.url) {
    return (
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex w-[70px] flex-col items-center"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="group flex w-[70px] flex-col items-center">{content}</div>
  );
}

/* =========================================================
   EMPTY STATES
   ========================================================= */

function SkillsEmpty({ locale }: { locale: "en" | "km" }) {
  return (
    <div className="mt-6 rounded-[20px] border border-dashed border-[var(--portfolio-border)] p-8 text-center">
      <p className="font-body text-[10px] text-[var(--portfolio-muted)]">
        {locale === "km" ? "មិនទាន់មានជំនាញ។" : "No skills added yet."}
      </p>
    </div>
  );
}

function ToolsEmpty({ locale }: { locale: "en" | "km" }) {
  return (
    <div className="mt-6 rounded-[20px] border border-dashed border-[var(--portfolio-border)] p-8 text-center">
      <p className="font-body text-[10px] text-[var(--portfolio-muted)]">
        {locale === "km" ? "មិនទាន់មានឧបករណ៍។" : "No tools added yet."}
      </p>
    </div>
  );
}

/* =========================================================
   BUILD TOOL GROUPS
   ========================================================= */

function buildToolGroups(tools: PublicTool[]): ToolGroup[] {
  return TOOL_GROUP_ORDER.map((category) => {
    const categoryTools = tools.filter((tool) => tool.category === category);

    if (categoryTools.length === 0) {
      return null;
    }

    const config = getToolGroupConfig(category);

    return {
      key: category,

      labelEn: config.labelEn,

      labelKm: config.labelKm,

      dotClass: config.dotClass,

      tools: categoryTools,
    };
  }).filter((group): group is ToolGroup => group !== null);
}

/* =========================================================
   TOOL GROUP CONFIG
   ========================================================= */

function getToolGroupConfig(category: string) {
  switch (category) {
    case "FRONTEND":
      return {
        labelEn: "Frontend",
        labelKm: "Frontend",
        dotClass: "bg-cyan-400",
      };

    case "BACKEND":
      return {
        labelEn: "Backend",
        labelKm: "Backend",
        dotClass: "bg-emerald-400",
      };

    case "DATABASE":
      return {
        labelEn: "Database",
        labelKm: "មូលដ្ឋានទិន្នន័យ",
        dotClass: "bg-amber-400",
      };

    case "AI_ML":
      return {
        labelEn: "AI / ML",
        labelKm: "AI / ML",
        dotClass: "bg-violet-400",
      };

    case "DEVOPS":
      return {
        labelEn: "DevOps & Tools",
        labelKm: "DevOps និង Tools",
        dotClass: "bg-blue-400",
      };

    case "DEVELOPMENT":
      return {
        labelEn: "Development",
        labelKm: "Development",
        dotClass: "bg-indigo-400",
      };

    case "DESIGN":
      return {
        labelEn: "Design",
        labelKm: "ការរចនា",
        dotClass: "bg-pink-400",
      };

    case "PRODUCTIVITY":
      return {
        labelEn: "Productivity",
        labelKm: "ផលិតភាព",
        dotClass: "bg-teal-400",
      };

    default:
      return {
        labelEn: "Other",
        labelKm: "ផ្សេងៗ",
        dotClass: "bg-slate-400",
      };
  }
}

/* =========================================================
   SKILL HELPERS
   ========================================================= */

function formatSkillLevel(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function skillLevelWidth(value: string) {
  switch (value) {
    case "EXPERT":
      return "w-full";

    case "ADVANCED":
      return "w-[82%]";

    case "INTERMEDIATE":
      return "w-[60%]";

    case "BEGINNER":
      return "w-[35%]";

    default:
      return "w-[50%]";
  }
}

/* =========================================================
   IMAGE HELPER
   ========================================================= */

function isImageSource(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  return (
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  );
}

/* =========================================================
   INITIALS
   ========================================================= */

function makeInitials(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "?";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}
