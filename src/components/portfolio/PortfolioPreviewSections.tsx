import type { ReactNode } from "react";

import {
  Award,
  BriefcaseBusiness,
  Code2,
  Download,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Presentation,
  Send,
  Trophy,
} from "lucide-react";

import GitHubContributionSection from "@/components/portfolio/GitHubContributionSection";
import JourneySection from "@/components/portfolio/JourneySection";
import PortfolioGallerySection from "@/components/portfolio/PortfolioGallerySection";
import PublicContactForm from "@/components/portfolio/PublicContactForm";
import PublicProjectCard from "@/components/portfolio/PublicProjectCard";
import SkillsToolsSection from "@/components/portfolio/SkillsToolsSection";

import type {
  PublicActivity,
  PublicProfile,
  PublicSkill,
  PublicTool,
} from "@/types/publicPortfolio";

/* =========================================================
   TYPES
   ========================================================= */

type Props = {
  locale: "en" | "km";

  profile: PublicProfile;

  skills: PublicSkill[];

  tools: PublicTool[];

  activities: PublicActivity[];
};

/* =========================================================
   MAIN
   ========================================================= */

export default function PortfolioPreviewSections({
  locale,
  profile,
  skills,
  tools,
  activities,
}: Props) {
  const khmer = locale === "km";

  /* =======================================================
     CONTENT GROUPS
     ======================================================= */

  const achievements = activities.filter((item) => item.type === "ACHIEVEMENT");

  const experience = activities.filter((item) => item.type === "WORK");

  const education = activities.filter((item) => item.type === "EDUCATION");

  const projects = activities.filter((item) => item.type === "PROJECT");

  const certificates = activities.filter((item) => item.type === "CERTIFICATE");

  const teaching = activities.filter((item) => item.type === "TEACHING");

  const gallery = activities.filter((item) => item.type === "PHOTO");

  /*
   * Newest activity at the top
   * of Year by Year.
   */
  const timeline = [...activities].sort(
    (a, b) =>
      new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime(),
  );

  /* =======================================================
     PROFILE CONTENT
     ======================================================= */

  const bio =
    localized(locale, profile.bioEn, profile.bioKm) ||
    localized(locale, profile.shortBioEn, profile.shortBioKm) ||
    (khmer
      ? "សូមបំពេញព័ត៌មានអំពីខ្ញុំពីផ្ទាំងគ្រប់គ្រង។"
      : "Add your About Me information from the private dashboard.");

  const badgeImage =
    profile.badgeImage || profile.profileImage || "/images/profile-badge.png";

  const currentRole = localized(
    locale,
    profile.currentRoleEn,
    profile.currentRoleKm,
  );

  const location = localized(locale, profile.locationEn, profile.locationKm);

  return (
    <>
      {/* =====================================================
          ABOUT ME
         ===================================================== */}

      <section id="about" className="portfolio-section scroll-mt-28">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          {/* LEFT */}

          <div>
            <SectionBar>{khmer ? "អំពីខ្ញុំ" : "ABOUT ME"}</SectionBar>

            <p
              className={
                khmer
                  ? "khmer-input-value mt-5 max-w-3xl text-[15px] font-normal leading-8 text-[var(--portfolio-muted)]"
                  : "font-body mt-5 max-w-3xl text-[15px] leading-8 text-[var(--portfolio-muted)]"
              }
            >
              {bio}
            </p>

            {/* ===============================================
                ACHIEVEMENTS
               =============================================== */}

            <div className="mt-8">
              <SectionBar small>
                {khmer ? "សមិទ្ធផល" : "ACHIEVEMENTS"}
              </SectionBar>

              <div className="mt-4 grid gap-2.5">
                {achievements.length > 0 ? (
                  achievements.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 font-body text-[13px] leading-6 text-[var(--portfolio-text)]"
                    >
                      <Trophy
                        size={15}
                        className="mt-1 shrink-0 text-[var(--portfolio-cyan)]"
                      />

                      <span>{activityTitle(item, locale)}</span>
                    </div>
                  ))
                ) : (
                  <EmptyLine
                    text={
                      khmer
                        ? "បន្ថែមសមិទ្ធផលពីផ្ទាំងគ្រប់គ្រង។"
                        : "Add achievements from the dashboard."
                    }
                  />
                )}
              </div>
            </div>

            {/* ===============================================
                TOOLS + EXPERIENCE PREVIEW
               =============================================== */}

            <div className="mt-8 grid gap-7 md:grid-cols-2">
              {/* TOOLS */}

              <div>
                <SectionBar small>{khmer ? "ឧបករណ៍" : "TOOLS"}</SectionBar>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  {tools.length > 0 ? (
                    tools
                      .slice(0, 8)
                      .map((tool) => <ToolPill key={tool.id} tool={tool} />)
                  ) : (
                    <EmptyLine text={khmer ? "បន្ថែមឧបករណ៍" : "Add tools"} />
                  )}
                </div>
              </div>

              {/* EXPERIENCE */}

              <div>
                <SectionBar small>
                  {khmer ? "បទពិសោធន៍" : "EXPERIENCE"}
                </SectionBar>

                <div className="mt-4 grid gap-3">
                  {experience.slice(0, 2).map((item) => {
                    const organization = activityOrganization(item, locale);

                    return (
                      <div key={item.id}>
                        <p
                          className={
                            khmer
                              ? "khmer-input-value text-[13px] font-normal leading-6 text-[var(--portfolio-text)]"
                              : "font-body text-[13px] font-semibold text-[var(--portfolio-text)]"
                          }
                        >
                          {activityTitle(item, locale)}
                        </p>

                        <p className="font-body mt-1 text-[11px] text-[var(--portfolio-cyan)]">
                          {organization || formatActivityPeriod(item, locale)}
                        </p>

                        {organization ? (
                          <p className="font-number mt-0.5 text-[10px] text-[var(--portfolio-muted)]">
                            {formatActivityPeriod(item, locale)}
                          </p>
                        ) : null}
                      </div>
                    );
                  })}

                  {experience.length === 0 ? (
                    <EmptyLine
                      text={khmer ? "បន្ថែមបទពិសោធន៍" : "Add experience"}
                    />
                  ) : null}
                </div>
              </div>
            </div>

            {/* ===============================================
                CONTACT PREVIEW
               =============================================== */}

            <div className="mt-8">
              <SectionBar small>{khmer ? "ទំនាក់ទំនង" : "CONTACT"}</SectionBar>

              <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {profile.phone ? (
                  <ContactLine
                    icon={Phone}
                    value={profile.phone}
                    href={`tel:${profile.phone}`}
                  />
                ) : null}

                {profile.email ? (
                  <ContactLine
                    icon={Mail}
                    value={profile.email}
                    href={`mailto:${profile.email}`}
                  />
                ) : null}

                {profile.telegram ? (
                  <ContactLine
                    icon={Send}
                    value={profile.telegram}
                    href={normalizeLink(profile.telegram, "https://t.me/")}
                  />
                ) : null}

                {profile.linkedin ? (
                  <ContactLine
                    icon={BriefcaseBusiness}
                    value={cleanDisplayLink(profile.linkedin)}
                    href={profile.linkedin}
                  />
                ) : null}

                {location ? (
                  <ContactLine icon={MapPin} value={location} />
                ) : null}
              </div>
            </div>
          </div>

          {/* =================================================
              PROFILE BADGE
             ================================================= */}

          <div className="relative mx-auto w-full max-w-[520px] lg:justify-self-end">
            <div className="portfolio-badge-halo" aria-hidden="true" />

            <div className="portfolio-badge-frame">
              <div className="portfolio-badge-clip" aria-hidden="true" />

              <div className="portfolio-badge-slot" aria-hidden="true" />

              <div className="portfolio-badge-image-wrap">
                <img
                  src={badgeImage}
                  alt={profile.fullName}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="portfolio-badge-meta">
                <span>{profile.fullName}</span>

                <span>{currentRole || (khmer ? "អ្នកបង្កើត" : "Creator")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
    SKILLS & TOOLS
   ===================================================== */}

      <SkillsToolsSection locale={locale} skills={skills} tools={tools} />

      {/* =====================================================
          GITHUB CONTRIBUTIONS
         ===================================================== */}

      <GitHubContributionSection
        locale={locale}
        image={profile.githubContributionImage}
        githubUrl={profile.github}
        username={profile.githubUsername}
      />

      {/* =====================================================
          EXPERIENCE & EDUCATION
         ===================================================== */}

      <section id="experience" className="portfolio-section scroll-mt-28">
        <PortfolioHeading
          locale={locale}
          eyebrow={khmer ? "ប្រវត្តិរបស់ខ្ញុំ" : "MY BACKGROUND"}
          title={khmer ? "បទពិសោធន៍ និងការអប់រំ" : "Experience & Education"}
          description={
            khmer
              ? "តួនាទី ការងារ ការសិក្សា និងបទពិសោធន៍ដែលបានបង្កើតដំណើររបស់ខ្ញុំ។"
              : "Roles, education and experiences that have shaped my professional journey."
          }
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <TimelinePanel
            icon={BriefcaseBusiness}
            title={khmer ? "បទពិសោធន៍" : "Experience"}
            items={experience}
            locale={locale}
          />

          <TimelinePanel
            icon={GraduationCap}
            title={khmer ? "ការអប់រំ" : "Education"}
            items={education}
            locale={locale}
          />
        </div>
      </section>

      {/* =====================================================
          PROJECTS
         ===================================================== */}

      <section id="projects" className="portfolio-section scroll-mt-28">
        <PortfolioHeading
          locale={locale}
          eyebrow={khmer ? "ស្នាដៃដែលបានជ្រើសរើស" : "SELECTED WORK"}
          title={khmer ? "គម្រោង" : "Featured Projects"}
          description={
            khmer
              ? "គម្រោងដែលបង្ហាញពីការអភិវឌ្ឍ ការរចនា និងការដោះស្រាយបញ្ហារបស់ខ្ញុំ។ ចុចលើគម្រោងដើម្បីមើលព័ត៌មានលម្អិត។"
              : "Projects that reflect my development, design and problem-solving work. Open a project to explore the complete case study."
          }
        />

        {projects.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <PublicProjectCard
                key={project.id}
                item={project}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyPanel
              text={
                khmer
                  ? "បន្ថែមគម្រោងពីផ្ទាំងគ្រប់គ្រង។"
                  : "Add projects from the dashboard."
              }
            />
          </div>
        )}
      </section>

      {/* =====================================================
          CERTIFICATES
         ===================================================== */}

      <section id="certificates" className="portfolio-section scroll-mt-28">
        <PortfolioHeading
          locale={locale}
          eyebrow={khmer ? "ការរៀនសូត្រ" : "CREDENTIALS"}
          title={khmer ? "វិញ្ញាបនបត្រ" : "Certificates"}
          description={
            khmer
              ? "វិញ្ញាបនបត្រ និងការបណ្តុះបណ្តាលដែលខ្ញុំបានបញ្ចប់។"
              : "Certificates and training that document my continued learning."
          }
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {certificates.length > 0 ? (
            certificates.map((item) => (
              <article
                key={item.id}
                className="portfolio-panel overflow-hidden p-4"
              >
                <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)]">
                  {item.coverImage ? (
                    <img
                      src={item.coverImage}
                      alt={activityTitle(item, locale)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Award size={38} className="text-[var(--portfolio-cyan)]" />
                  )}
                </div>

                <p
                  className={
                    khmer && item.titleKm
                      ? "khmer-input-value mt-4 text-[14px] font-normal leading-6 text-[var(--portfolio-text)]"
                      : "font-body mt-4 text-[14px] font-semibold text-[var(--portfolio-text)]"
                  }
                >
                  {activityTitle(item, locale)}
                </p>

                <p className="font-body mt-1 text-[10px] text-[var(--portfolio-muted)]">
                  {activityOrganization(item, locale) ||
                    formatActivityPeriod(item, locale)}
                </p>

                {item.credentialId ? (
                  <p className="font-number mt-2 text-[9px] text-[var(--portfolio-muted)]">
                    ID: {item.credentialId}
                  </p>
                ) : null}

                {item.externalUrl ? (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 font-body text-[11px] text-[var(--portfolio-cyan)]"
                  >
                    {khmer ? "មើលវិញ្ញាបនបត្រ" : "View credential"}

                    <ExternalLink size={12} />
                  </a>
                ) : null}
              </article>
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyPanel
                text={
                  khmer
                    ? "បន្ថែមវិញ្ញាបនបត្រពីផ្ទាំងគ្រប់គ្រង។"
                    : "Add certificates from the dashboard."
                }
              />
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          IMPROVED YEAR-BY-YEAR
         ===================================================== */}

      <JourneySection locale={locale} activities={timeline} />

      {/* =====================================================
          TEACHING
         ===================================================== */}

      <section id="teaching" className="portfolio-section scroll-mt-28">
        <PortfolioHeading
          locale={locale}
          eyebrow={khmer ? "ចែករំលែកចំណេះដឹង" : "SHARE KNOWLEDGE"}
          title={khmer ? "ការបង្រៀន និងណែនាំ" : "Teaching & Mentoring"}
          description={
            khmer
              ? "វគ្គបង្រៀន សិក្ខាសាលា និងប្រធានបទជាក់ស្តែងដែលខ្ញុំបានចែករំលែក។"
              : "Practical courses, workshops and topics I have taught or mentored."
          }
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teaching.length > 0 ? (
            teaching.map((item) => (
              <article key={item.id} className="portfolio-panel p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--portfolio-accent-soft)] text-[var(--portfolio-cyan)]">
                  <Presentation size={17} />
                </div>

                <p
                  className={
                    khmer && item.titleKm
                      ? "khmer-input-value mt-4 text-[14px] font-normal leading-6 text-[var(--portfolio-text)]"
                      : "font-body mt-4 text-[14px] font-semibold text-[var(--portfolio-text)]"
                  }
                >
                  {activityTitle(item, locale)}
                </p>

                <p className="font-body mt-1 text-[10px] text-[var(--portfolio-muted)]">
                  {activityOrganization(item, locale) ||
                    formatActivityPeriod(item, locale)}
                </p>

                {activitySummary(item, locale) ? (
                  <p
                    className={
                      khmer && item.summaryKm
                        ? "khmer-input-value mt-3 text-[11px] font-normal leading-6 text-[var(--portfolio-muted)]"
                        : "font-body mt-3 text-[11px] leading-6 text-[var(--portfolio-muted)]"
                    }
                  >
                    {activitySummary(item, locale)}
                  </p>
                ) : null}

                {item.technologies ? (
                  <p className="font-body mt-4 text-[10px] text-[var(--portfolio-cyan)]">
                    {item.technologies}
                  </p>
                ) : null}
              </article>
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyPanel
                text={
                  khmer
                    ? "បន្ថែមការបង្រៀនពីផ្ទាំងគ្រប់គ្រង។"
                    : "Add teaching and mentoring activities from the dashboard."
                }
              />
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          IMPROVED GALLERY
         ===================================================== */}

      <PortfolioGallerySection locale={locale} items={gallery} />

      {/* =====================================================
          CONTACT
         ===================================================== */}

      <section id="contact" className="portfolio-section scroll-mt-28 pb-28">
        <div className="portfolio-panel portfolio-glow overflow-hidden p-5 md:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            {/* LEFT */}

            <div>
              <SectionBar>{khmer ? "ទំនាក់ទំនង" : "GET IN TOUCH"}</SectionBar>

              <h2
                className={
                  khmer
                    ? "khmer-input-value mt-6 text-[clamp(2.4rem,6vw,5rem)] font-normal leading-[1.45] text-[var(--portfolio-text)]"
                    : "font-display mt-6 text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.95] text-[var(--portfolio-text)]"
                }
              >
                {khmer ? "ចាប់ផ្តើមការសន្ទនា" : "LET'S CREATE SOMETHING"}
              </h2>

              <p
                className={
                  khmer
                    ? "khmer-input-value mt-5 max-w-md text-[13px] font-normal leading-7 text-[var(--portfolio-muted)]"
                    : "font-body mt-5 max-w-md text-[13px] leading-7 text-[var(--portfolio-muted)]"
                }
              >
                {khmer
                  ? "មានគម្រោង សំណួរ ឬចង់សហការជាមួយខ្ញុំ? ផ្ញើសារមកខ្ញុំបានគ្រប់ពេល។"
                  : "Have a project, question or collaboration in mind? Send me a message and I’ll get back to you."}
              </p>

              <div className="mt-7 grid gap-3">
                {profile.email ? (
                  <ContactLine
                    icon={Mail}
                    value={profile.email}
                    href={`mailto:${profile.email}`}
                  />
                ) : null}

                {profile.phone ? (
                  <ContactLine
                    icon={Phone}
                    value={profile.phone}
                    href={`tel:${profile.phone}`}
                  />
                ) : null}

                {profile.telegram ? (
                  <ContactLine
                    icon={MessageCircle}
                    value={profile.telegram}
                    href={normalizeLink(profile.telegram, "https://t.me/")}
                  />
                ) : null}

                {profile.github ? (
                  <ContactLine
                    icon={Code2}
                    value={cleanDisplayLink(profile.github)}
                    href={profile.github}
                  />
                ) : null}

                {profile.linkedin ? (
                  <ContactLine
                    icon={BriefcaseBusiness}
                    value={cleanDisplayLink(profile.linkedin)}
                    href={profile.linkedin}
                  />
                ) : null}
              </div>

              {profile.cvFile ? (
                <a
                  href={profile.cvFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-secondary-button mt-7"
                >
                  <Download size={15} />

                  {khmer ? "ទាញយក CV" : "Download CV"}
                </a>
              ) : null}
            </div>

            {/* RIGHT */}

            <div className="rounded-[22px] border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] p-5 md:p-6">
              <PublicContactForm locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* =========================================================
   SECTION BAR
   ========================================================= */

function SectionBar({
  children,
  small = false,
}: {
  children: ReactNode;
  small?: boolean;
}) {
  return (
    <div
      className={`portfolio-section-label ${
        small ? "portfolio-section-label-small" : ""
      }`}
    >
      {children}
    </div>
  );
}

/* =========================================================
   PORTFOLIO HEADING
   ========================================================= */

function PortfolioHeading({
  locale,
  eyebrow,
  title,
  description,
}: {
  locale: "en" | "km";
  eyebrow: string;
  title: string;
  description: string;
}) {
  const khmer = locale === "km";

  return (
    <div className="max-w-3xl">
      <p
        className={
          khmer
            ? "khmer-input-value text-[11px] font-normal leading-6 text-[var(--portfolio-cyan)]"
            : "font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--portfolio-cyan)]"
        }
      >
        {eyebrow}
      </p>

      <h2
        className={
          khmer
            ? "khmer-input-value mt-3 text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.45] text-[var(--portfolio-text)]"
            : "font-display mt-3 text-[clamp(2.8rem,6vw,5.3rem)] leading-[0.92] text-[var(--portfolio-text)]"
        }
      >
        {title}
      </h2>

      <p
        className={
          khmer
            ? "khmer-input-value mt-4 text-[13px] font-normal leading-7 text-[var(--portfolio-muted)]"
            : "font-body mt-4 text-[13px] leading-7 text-[var(--portfolio-muted)]"
        }
      >
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY LINE
   ========================================================= */

function EmptyLine({ text }: { text: string }) {
  return (
    <p className="font-body text-[11px] text-[var(--portfolio-muted)]">
      {text}
    </p>
  );
}

/* =========================================================
   EMPTY PANEL
   ========================================================= */

function EmptyPanel({ text }: { text: string }) {
  return (
    <div className="portfolio-panel flex min-h-[180px] items-center justify-center p-6 text-center">
      <p className="font-body text-[12px] text-[var(--portfolio-muted)]">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   CONTACT LINE
   ========================================================= */

function ContactLine({
  icon: Icon,
  value,
  href,
}: {
  icon: typeof Mail;
  value: string;
  href?: string;
}) {
  const content = (
    <span className="flex min-w-0 items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--portfolio-accent-soft)] text-[var(--portfolio-cyan)]">
        <Icon size={14} />
      </span>

      <span className="font-body truncate text-[12px] text-[var(--portfolio-text)]">
        {value}
      </span>
    </span>
  );

  return href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="min-w-0 transition hover:opacity-80"
    >
      {content}
    </a>
  ) : (
    content
  );
}

/* =========================================================
   TOOL PILL
   ========================================================= */

function ToolPill({ tool }: { tool: PublicTool }) {
  return (
    <span className="flex h-10 items-center gap-2 rounded-xl border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] px-2.5">
      {isImageSource(tool.icon) ? (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white p-1 dark:bg-white/[0.95]">
          <img
            src={tool.icon!}
            alt=""
            className="h-full w-full object-contain"
          />
        </span>
      ) : (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--portfolio-accent-soft)] font-display text-[9px] text-[var(--portfolio-cyan)]">
          {makeInitials(tool.name)}
        </span>
      )}

      <span className="font-body max-w-[110px] truncate text-[10px] font-semibold text-[var(--portfolio-text)]">
        {tool.name}
      </span>
    </span>
  );
}

/* =========================================================
   SKILL ICON
   ========================================================= */

function SkillIcon({ skill }: { skill: PublicSkill }) {
  if (isImageSource(skill.icon)) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] border border-[var(--portfolio-border)] bg-white p-2 shadow-[0_5px_16px_rgba(15,23,42,0.04)] dark:bg-white/[0.04]">
        <img
          src={skill.icon!}
          alt={`${skill.name} icon`}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-violet-500/15 to-cyan-400/15 font-display text-[16px] text-[var(--portfolio-cyan)]">
      {makeInitials(skill.name)}
    </div>
  );
}

/* =========================================================
   TOOL LOGO
   ========================================================= */

function ToolLogo({ tool }: { tool: PublicTool }) {
  if (isImageSource(tool.icon)) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] border border-[var(--portfolio-border)] bg-white p-2 shadow-[0_5px_16px_rgba(15,23,42,0.04)] transition duration-300 group-hover:scale-105 dark:bg-white/[0.96]">
        <img
          src={tool.icon!}
          alt={`${tool.name} logo`}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-violet-500/15 to-cyan-400/15 font-display text-[17px] text-[var(--portfolio-cyan)]">
      {makeInitials(tool.name)}
    </div>
  );
}

/* =========================================================
   ICON HELPERS
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

/* =========================================================
   SKILL LEVEL
   ========================================================= */

function formatSkillLevel(level: string) {
  return level
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function skillLevelWidth(level: string) {
  switch (level) {
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
   TOOL CATEGORY
   ========================================================= */

function formatToolCategory(category: string) {
  return category
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/* =========================================================
   EXPERIENCE / EDUCATION TIMELINE
   ========================================================= */

function TimelinePanel({
  icon: Icon,
  title,
  items,
  locale,
}: {
  icon: typeof BriefcaseBusiness;

  title: string;

  items: PublicActivity[];

  locale: "en" | "km";
}) {
  const khmer = locale === "km";

  return (
    <div className="portfolio-panel p-5 md:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--portfolio-accent-soft)] text-[var(--portfolio-cyan)]">
          <Icon size={17} />
        </div>

        <p
          className={
            khmer
              ? "khmer-input-value text-[20px] font-normal leading-8 text-[var(--portfolio-text)]"
              : "font-display text-2xl text-[var(--portfolio-text)]"
          }
        >
          {title}
        </p>
      </div>

      <div className="relative mt-6 grid gap-5 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-[var(--portfolio-border)]">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="relative pl-6">
              <span className="absolute left-0 top-2 h-[11px] w-[11px] rounded-full border-2 border-[var(--portfolio-cyan)] bg-[var(--portfolio-bg)]" />

              <p
                className={
                  khmer && item.titleKm
                    ? "khmer-input-value text-[13px] font-normal leading-6 text-[var(--portfolio-text)]"
                    : "font-body text-[13px] font-semibold text-[var(--portfolio-text)]"
                }
              >
                {activityTitle(item, locale)}
              </p>

              {activityOrganization(item, locale) ? (
                <p
                  className={
                    khmer && item.organizationKm
                      ? "khmer-input-value mt-1 text-[10px] font-normal leading-5 text-[var(--portfolio-cyan)]"
                      : "font-body mt-1 text-[10px] text-[var(--portfolio-cyan)]"
                  }
                >
                  {activityOrganization(item, locale)}
                </p>
              ) : null}

              <p className="font-number mt-1 text-[9px] text-[var(--portfolio-muted)]">
                {formatActivityPeriod(item, locale)}
              </p>

              {activitySummary(item, locale) ? (
                <p
                  className={
                    khmer && item.summaryKm
                      ? "khmer-input-value mt-2 text-[10px] font-normal leading-6 text-[var(--portfolio-muted)]"
                      : "font-body mt-2 text-[10px] leading-5 text-[var(--portfolio-muted)]"
                  }
                >
                  {activitySummary(item, locale)}
                </p>
              ) : null}
            </div>
          ))
        ) : (
          <p
            className={
              khmer
                ? "khmer-input-value pl-6 text-[11px] font-normal leading-6 text-[var(--portfolio-muted)]"
                : "font-body pl-6 text-[11px] text-[var(--portfolio-muted)]"
            }
          >
            {khmer ? "មិនទាន់មានទិន្នន័យ។" : "No records yet."}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function localized(locale: "en" | "km", en: string | null, km: string | null) {
  return locale === "km" ? km || en || "" : en || km || "";
}

function activityTitle(item: PublicActivity, locale: "en" | "km") {
  return localized(locale, item.titleEn, item.titleKm);
}

function activitySummary(item: PublicActivity, locale: "en" | "km") {
  return localized(locale, item.summaryEn, item.summaryKm);
}

function activityOrganization(item: PublicActivity, locale: "en" | "km") {
  return localized(locale, item.organizationEn, item.organizationKm);
}

function formatActivityPeriod(item: PublicActivity, locale: "en" | "km") {
  const formatter = new Intl.DateTimeFormat(
    locale === "km" ? "km-KH" : "en-US",
    {
      year: "numeric",

      month: "short",
    },
  );

  const start = formatter.format(new Date(item.activityDate));

  if (item.isCurrent) {
    return `${start} — ${locale === "km" ? "បច្ចុប្បន្ន" : "Present"}`;
  }

  if (item.endDate) {
    return `${start} — ${formatter.format(new Date(item.endDate))}`;
  }

  return start;
}

function normalizeLink(value: string, prefix: string) {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${prefix}${value.replace(/^@/, "")}`;
}

function cleanDisplayLink(value: string) {
  return value.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}
