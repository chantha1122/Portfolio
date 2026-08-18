import { ArrowDown, ArrowUpRight, Download, Sparkles } from "lucide-react";

import type { PublicProfile } from "@/types/publicPortfolio";

type Props = {
  locale: "en" | "km";
  profile: PublicProfile;
  projectCount: number;
  activityCount: number;
};

export default function HeroSection({
  locale,
  profile,
  projectCount,
  activityCount,
}: Props) {
  const khmer = locale === "km";
  const headline = khmer
    ? profile.headlineKm || profile.headlineEn
    : profile.headlineEn || profile.headlineKm;
  const shortBio = khmer
    ? profile.shortBioKm || profile.shortBioEn || profile.bioKm || profile.bioEn
    : profile.shortBioEn || profile.shortBioKm || profile.bioEn || profile.bioKm;
  const focus = khmer
    ? profile.currentFocusKm || profile.currentFocusEn
    : profile.currentFocusEn || profile.currentFocusKm;

  return (
    <section id="home" className="portfolio-hero relative overflow-hidden pt-28">
      <div className="portfolio-orb portfolio-orb-one" aria-hidden="true" />
      <div className="portfolio-orb portfolio-orb-two" aria-hidden="true" />

      <div className="portfolio-section grid min-h-[calc(100vh-40px)] items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] px-3 py-1.5 font-body text-[11px] font-medium text-[var(--portfolio-muted)] backdrop-blur-xl">
            <Sparkles size={13} className="text-[var(--portfolio-cyan)]" />
            {khmer ? "ផលប័ត្រផ្ទាល់ខ្លួន • 2026" : "Personal Portfolio • 2026"}
          </div>

          <h1 className="mt-6 max-w-4xl font-display text-[clamp(4.6rem,11vw,9.4rem)] leading-[0.8] tracking-[0.01em]">
            <span className="block text-[var(--portfolio-text)]">CHANTHA</span>
            <span className="portfolio-gradient-text block">PORTFOLIO</span>
          </h1>

          <p className="font-body mt-7 max-w-xl text-[clamp(1rem,2vw,1.35rem)] leading-8 text-[var(--portfolio-muted)]">
            {headline || (khmer ? "អ្នកអភិវឌ្ឍ • អ្នកបង្កើត • អ្នកសិក្សា" : "Developer • Creator • Learner")}
          </p>

          {shortBio ? (
            <p className="font-body mt-4 max-w-2xl text-[14px] leading-7 text-[var(--portfolio-muted)]/90">
              {shortBio}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="portfolio-primary-button">
              {khmer ? "មើលគម្រោង" : "View Projects"}
              <ArrowUpRight size={16} />
            </a>

            <a href="#about" className="portfolio-secondary-button">
              {khmer ? "អំពីខ្ញុំ" : "About Me"}
              <ArrowDown size={15} />
            </a>

            {profile.cvFile ? (
              <a href={profile.cvFile} target="_blank" rel="noopener noreferrer" className="portfolio-secondary-button">
                <Download size={15} />
                {khmer ? "ទាញយក CV" : "Download CV"}
              </a>
            ) : null}
          </div>
        </div>

        <div className="relative z-10">
          <div className="portfolio-panel portfolio-glow overflow-hidden p-5 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[var(--portfolio-muted)]">
                  {khmer ? "ជំពូកបច្ចុប្បន្ន" : "Current Chapter"}
                </p>
                <p className="font-display mt-2 text-[clamp(5rem,13vw,8rem)] leading-none text-[var(--portfolio-text)]">2026</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] text-[var(--portfolio-cyan)]">
                <Sparkles size={20} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <HeroStat value={projectCount} label={khmer ? "គម្រោង" : "Projects"} />
              <HeroStat value={activityCount} label={khmer ? "សកម្មភាព" : "Activities"} />
              <HeroStat value={profile.yearsExperience} label={khmer ? "ឆ្នាំបទពិសោធន៍" : "Years Experience"} />
              <HeroStat value={2} label={khmer ? "ភាសា" : "Languages"} />
            </div>

            {focus ? (
              <div className="mt-4 rounded-2xl border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] p-4">
                <p className="font-body text-[10px] uppercase tracking-[0.16em] text-[var(--portfolio-muted)]">
                  {khmer ? "កំពុងផ្តោតលើ" : "Currently focused on"}
                </p>
                <p className="font-body mt-2 text-[13px] leading-6 text-[var(--portfolio-text)]">{focus}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] p-4">
      <p className="font-number text-[30px] font-bold text-[var(--portfolio-text)]">{String(value).padStart(2, "0")}</p>
      <p className="font-body mt-1 text-[10px] uppercase tracking-[0.12em] text-[var(--portfolio-muted)]">{label}</p>
    </div>
  );
}
