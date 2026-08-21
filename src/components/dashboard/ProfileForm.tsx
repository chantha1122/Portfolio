"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import {
  BriefcaseBusiness,
  Camera,
  Code2,
  Contact,
  FileText,
  Image,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Save,
  Send,
  UserRound,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";

import { saveProfileAction, type ProfileActionState } from "@/actions/profile";

import AppToast from "@/components/ui/AppToast";

import { cn } from "@/lib/cn";

type ProfileFormData = {
  fullName: string;
  headlineEn: string;
  headlineKm: string;

  shortBioEn: string;
  shortBioKm: string;

  bioEn: string;
  bioKm: string;

  currentRoleEn: string;
  currentRoleKm: string;

  currentFocusEn: string;
  currentFocusKm: string;

  yearsExperience: number;

  email: string;
  phone: string;
  telegram: string;

  github: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  youtube: string;

  locationEn: string;
  locationKm: string;

  profileImage: string;
  badgeImage: string;
  cvFile: string;
};

type Props = {
  locale: "en" | "km";

  profile: ProfileFormData;
};

const initialProfileActionState: ProfileActionState = {
  success: false,
  message: null,
};

type Tab = "personal" | "about" | "contact" | "media";

const TAB_ERRORS: Record<Tab, string[]> = {
  personal: [
    "fullName",
    "yearsExperience",
    "headlineEn",
    "headlineKm",
    "currentRoleEn",
    "currentRoleKm",
  ],

  about: [
    "shortBioEn",
    "shortBioKm",
    "bioEn",
    "bioKm",
    "currentFocusEn",
    "currentFocusKm",
  ],

  contact: [
    "email",
    "phone",
    "telegram",
    "github",
    "linkedin",
    "facebook",
    "instagram",
    "youtube",
    "locationEn",
    "locationKm",
  ],

  media: ["profileImageFile", "badgeImageFile", "cvFileUpload"],
};

export default function ProfileForm({ locale, profile }: Props) {
  const t = useTranslations("Profile");

  const router = useRouter();

  const km = locale === "km";

  const [state, formAction, pending] = useActionState(
    saveProfileAction,
    initialProfileActionState,
  );

  const [active, setActive] = useState<Tab>("personal");

  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    setToast(true);

    if (state.success) {
      router.refresh();
      return;
    }

    const errors = state.fieldErrors ?? {};

    const failedTab = (Object.keys(TAB_ERRORS) as Tab[]).find((tab) =>
      TAB_ERRORS[tab].some((name) => errors[name]?.length),
    );

    if (failedTab) {
      setActive(failedTab);
    }
  }, [state, router]);

  const tabs: Array<[Tab, string, LucideIcon]> = [
    ["personal", t("tabPersonal"), UserRound],

    ["about", t("tabAbout"), FileText],

    ["contact", t("tabContact"), Contact],

    ["media", t("tabMedia"), Image],
  ];

  return (
    <>
      <AppToast
        open={toast}
        locale={locale}
        variant={state.success ? "success" : "error"}
        message={state.success ? t("saveSuccess") : t("saveError")}
        onClose={() => setToast(false)}
      />

      {/* Tabs */}

      <div className="mb-5 overflow-x-auto border-b border-black/[0.06] dark:border-white/[0.07]">
        <div className="flex min-w-max gap-1">
          {tabs.map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              onClick={() => setActive(value)}
              className={cn(
                "font-body relative inline-flex h-11 items-center gap-2 rounded-t-xl px-4 transition",

                km ? "text-[12px] font-normal" : "text-[12px] font-semibold",

                active === value
                  ? "bg-violet-500/[0.07] text-violet-700 dark:text-violet-300"
                  : "text-[var(--foreground-muted)] hover:bg-black/[0.025] dark:hover:bg-white/[0.035]",
              )}
            >
              <Icon size={14} />

              {label}

              {active === value ? (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-violet-600" />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="locale" value={locale} />

        {/* PERSONAL */}

        <Panel active={active === "personal"}>
          <Section
            icon={UserRound}
            title={t("basicInformation")}
            description={t("personalTabDescription")}
            km={km}
          >
            <Info
              km={km}
              text={`${t("currentRoleHelpTitle")}: ${t("currentRoleHelp")}`}
            />

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field
                label={t("fullName")}
                name="fullName"
                value={profile.fullName}
                required
                km={km}
                error={state.fieldErrors?.fullName?.[0]}
              />

              <Field
                label={t("yearsExperience")}
                name="yearsExperience"
                value={String(profile.yearsExperience)}
                type="number"
                min="0"
                max="100"
                numeric
                km={km}
                hint={t("yearsExperienceHelp")}
                error={state.fieldErrors?.yearsExperience?.[0]}
              />

              <Field
                label={t("headlineEn")}
                name="headlineEn"
                value={profile.headlineEn}
                km={km}
                error={state.fieldErrors?.headlineEn?.[0]}
              />

              <Field
                label={t("headlineKm")}
                name="headlineKm"
                value={profile.headlineKm}
                khmer
                km={km}
                error={state.fieldErrors?.headlineKm?.[0]}
              />

              <Field
                label={t("currentRoleEn")}
                name="currentRoleEn"
                value={profile.currentRoleEn}
                icon={BriefcaseBusiness}
                placeholder="Full-Stack Developer & AI Instructor"
                km={km}
                error={state.fieldErrors?.currentRoleEn?.[0]}
              />

              <Field
                label={t("currentRoleKm")}
                name="currentRoleKm"
                value={profile.currentRoleKm}
                icon={BriefcaseBusiness}
                khmer
                km={km}
                error={state.fieldErrors?.currentRoleKm?.[0]}
              />
            </div>
          </Section>
        </Panel>

        {/* ABOUT */}

        <Panel active={active === "about"}>
          <Section
            icon={FileText}
            title={t("aboutMe")}
            description={t("aboutTabDescription")}
            km={km}
          >
            <Info
              km={km}
              cyan
              text={`${t("currentFocusHelpTitle")}: ${t("currentFocusHelp")}`}
            />

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Area
                label={t("shortBioEn")}
                name="shortBioEn"
                value={profile.shortBioEn}
                rows={3}
                km={km}
                error={state.fieldErrors?.shortBioEn?.[0]}
              />

              <Area
                label={t("shortBioKm")}
                name="shortBioKm"
                value={profile.shortBioKm}
                rows={3}
                khmer
                km={km}
                error={state.fieldErrors?.shortBioKm?.[0]}
              />

              <Area
                label={t("bioEn")}
                name="bioEn"
                value={profile.bioEn}
                rows={5}
                km={km}
                error={state.fieldErrors?.bioEn?.[0]}
              />

              <Area
                label={t("bioKm")}
                name="bioKm"
                value={profile.bioKm}
                rows={5}
                khmer
                km={km}
                error={state.fieldErrors?.bioKm?.[0]}
              />

              <Area
                label={t("currentFocusEn")}
                name="currentFocusEn"
                value={profile.currentFocusEn}
                rows={4}
                km={km}
                error={state.fieldErrors?.currentFocusEn?.[0]}
              />

              <Area
                label={t("currentFocusKm")}
                name="currentFocusKm"
                value={profile.currentFocusKm}
                rows={4}
                khmer
                km={km}
                error={state.fieldErrors?.currentFocusKm?.[0]}
              />
            </div>
          </Section>
        </Panel>

        {/* CONTACT */}

        <Panel active={active === "contact"}>
          <div className="space-y-4">
            <Section
              icon={Contact}
              title={t("contactInformation")}
              description={t("contactInformationDescription")}
              km={km}
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field
                  label={t("email")}
                  name="email"
                  value={profile.email}
                  type="email"
                  icon={Mail}
                  km={km}
                />

                <Field
                  label={t("phone")}
                  name="phone"
                  value={profile.phone}
                  type="tel"
                  icon={Phone}
                  numeric
                  km={km}
                />

                <Field
                  label={t("telegram")}
                  name="telegram"
                  value={profile.telegram}
                  icon={Send}
                  km={km}
                />

                <Field
                  label={t("github")}
                  name="github"
                  value={profile.github}
                  icon={Code2}
                  km={km}
                />

                <Field
                  label={t("linkedin")}
                  name="linkedin"
                  value={profile.linkedin}
                  icon={BriefcaseBusiness}
                  km={km}
                />

                <Field
                  label={t("facebook")}
                  name="facebook"
                  value={profile.facebook}
                  icon={MessageCircle}
                  km={km}
                />

                <Field
                  label={t("instagram")}
                  name="instagram"
                  value={profile.instagram}
                  icon={Camera}
                  km={km}
                />

                <Field
                  label={t("youtube")}
                  name="youtube"
                  value={profile.youtube}
                  icon={Video}
                  km={km}
                />
              </div>
            </Section>

            <Section
              icon={MapPin}
              title={t("location")}
              description={t("locationDescription")}
              km={km}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label={t("locationEn")}
                  name="locationEn"
                  value={profile.locationEn}
                  icon={MapPin}
                  km={km}
                />

                <Field
                  label={t("locationKm")}
                  name="locationKm"
                  value={profile.locationKm}
                  icon={MapPin}
                  khmer
                  km={km}
                />
              </div>
            </Section>
          </div>
        </Panel>

        {/* MEDIA */}

        <Panel active={active === "media"}>
          <Section
            icon={Image}
            title={t("media")}
            description={t("mediaDescription")}
            km={km}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <MediaUpload
                locale={locale}
                title={t("profilePhoto")}
                description={t("profilePhotoDescription")}
                current={profile.profileImage}
                inputName="profileImageFile"
                removeName="removeProfileImage"
                kind="image"
                error={state.fieldErrors?.profileImageFile?.[0]}
              />

              <MediaUpload
                locale={locale}
                title={t("badgePortrait")}
                description={t("badgePortraitDescription")}
                current={profile.badgeImage}
                inputName="badgeImageFile"
                removeName="removeBadgeImage"
                kind="image"
                error={state.fieldErrors?.badgeImageFile?.[0]}
              />

              <div className="lg:col-span-2">
                <MediaUpload
                  locale={locale}
                  title={t("cvResume")}
                  description={t("cvDescription")}
                  current={profile.cvFile}
                  inputName="cvFileUpload"
                  removeName="removeCvFile"
                  kind="pdf"
                  error={state.fieldErrors?.cvFileUpload?.[0]}
                />
              </div>
            </div>
          </Section>
        </Panel>

        <div className="flex items-center justify-between gap-3 border-t border-black/[0.055] pt-4 dark:border-white/[0.07]">
          <p className="font-body text-[11px] text-[var(--foreground-muted)]">
            {t("saveHint")}
          </p>

          <button
            type="submit"
            disabled={pending}
            className={cn(
              "font-body inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-6 text-white transition hover:bg-violet-700 disabled:opacity-60",

              km ? "text-[13px] font-normal" : "text-[13px] font-semibold",
            )}
          >
            <Save size={15} />

            {pending ? t("saving") : t("save")}
          </button>
        </div>
      </form>
    </>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function Panel({ active, children }: { active: boolean; children: ReactNode }) {
  return <div className={active ? "block" : "hidden"}>{children}</div>;
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
          <h2
            className={cn(
              "font-body text-[var(--foreground)]",

              km
                ? "text-[16px] font-normal leading-7"
                : "text-[16px] font-semibold",
            )}
          >
            {title}
          </h2>

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

function Info({
  text,
  km,
  cyan = false,
}: {
  text: string;
  km: boolean;
  cyan?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3.5 py-3",

        cyan
          ? "border-cyan-500/10 bg-cyan-500/[0.045]"
          : "border-violet-500/10 bg-violet-500/[0.045]",
      )}
    >
      <p
        className={cn(
          "font-body text-[12px]",

          km ? "font-normal leading-6" : "leading-5",
        )}
      >
        {text}
      </p>
    </div>
  );
}

type FieldProps = {
  label: string;

  name: string;

  value: string;

  type?: string;

  icon?: LucideIcon;

  required?: boolean;

  numeric?: boolean;

  khmer?: boolean;

  km: boolean;

  error?: string;

  hint?: string;

  placeholder?: string;

  min?: string;

  max?: string;
};

function Field({
  label,
  name,
  value,
  type = "text",
  icon: Icon,
  required,
  numeric,
  khmer,
  km,
  error,
  hint,
  placeholder,
  min,
  max,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className={cn(
          "font-body mb-1.5 block text-[12px] text-[var(--foreground)]",

          km ? "font-normal leading-6" : "font-semibold",
        )}
      >
        {label}
      </label>

      <div className="relative">
        {Icon ? (
          <Icon
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
          />
        ) : null}

        <input
          id={name}
          name={name}
          type={type}
          min={min}
          max={max}
          required={required}
          defaultValue={value}
          placeholder={placeholder}
          lang={khmer ? "km" : undefined}
          className={cn(
            numeric ? "font-number" : khmer ? "khmer-input-value" : "font-body",

            "h-10 w-full rounded-xl border bg-white text-[13px] font-normal outline-none transition dark:bg-[#121520]",

            error
              ? "border-red-400"
              : "border-black/[0.085] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-white/[0.08]",

            Icon ? "pl-9 pr-3" : "px-3.5",
          )}
        />
      </div>

      {error ? (
        <p className="font-body mt-1 text-[10px] text-red-600 dark:text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p className="font-body mt-1 text-[10px] text-[var(--foreground-muted)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Area({
  label,
  name,
  value,
  rows,
  khmer,
  km,
  error,
}: {
  label: string;

  name: string;

  value: string;

  rows: number;

  khmer?: boolean;

  km: boolean;

  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className={cn(
          "font-body mb-1.5 block text-[12px]",

          km ? "font-normal leading-6" : "font-semibold",
        )}
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={value}
        lang={khmer ? "km" : undefined}
        className={cn(
          khmer ? "khmer-input-value" : "font-body",

          "w-full resize-y rounded-xl border bg-white px-3.5 py-3 text-[13px] font-normal outline-none dark:bg-[#121520]",

          khmer ? "leading-7" : "leading-5",

          error
            ? "border-red-400"
            : "border-black/[0.085] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-white/[0.08]",
        )}
      />

      {error ? (
        <p className="font-body mt-1 text-[10px] text-red-600 dark:text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function MediaUpload({
  locale,
  title,
  description,
  current,
  inputName,
  removeName,
  kind,
  error,
}: {
  locale: "en" | "km";

  title: string;

  description: string;

  current: string;

  inputName: string;

  removeName: string;

  kind: "image" | "pdf";

  error?: string;
}) {
  const km = locale === "km";

  const ref = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState(current);

  const [selected, setSelected] = useState("");

  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    setPreview(current);

    setSelected("");

    setRemoved(false);
  }, [current]);

  function change(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelected(file.name);

    setRemoved(false);

    if (kind === "image") {
      setPreview(URL.createObjectURL(file));
    }
  }

  function remove() {
    setRemoved(true);

    setPreview("");

    setSelected("");

    if (ref.current) {
      ref.current.value = "";
    }
  }

  const hasFile = selected || (!removed && current);

  const fileName =
    selected || (current ? current.split("/").pop() || current : "");

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-4 dark:border-white/[0.07] dark:bg-[#10131d]">
      <input type="hidden" name={removeName} value={removed ? "1" : "0"} />

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3
            className={cn(
              "font-body text-[14px]",

              km ? "font-normal leading-6" : "font-semibold",
            )}
          >
            {title}
          </h3>

          <p
            className={cn(
              "font-body mt-1 text-[11px] text-[var(--foreground-muted)]",

              km ? "font-normal leading-6" : "leading-5",
            )}
          >
            {description}
          </p>
        </div>

        {hasFile ? (
          <button
            type="button"
            onClick={remove}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-500/[0.06]"
          >
            <X size={14} />
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-violet-500/20 bg-violet-500/[0.045]">
          {kind === "image" && preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : kind === "pdf" ? (
            <FileText size={24} className="text-violet-400" />
          ) : (
            <Camera size={23} className="text-violet-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={ref}
            type="file"
            name={inputName}
            accept={
              kind === "image"
                ? "image/jpeg,image/png,image/webp"
                : "application/pdf,.pdf"
            }
            onChange={change}
            className="sr-only"
          />

          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="font-body h-9 rounded-xl bg-violet-600 px-4 text-[12px] font-semibold text-white hover:bg-violet-700"
          >
            {hasFile
              ? km
                ? "ប្ដូរ"
                : "Replace"
              : km
                ? "ជ្រើសរើស"
                : "Choose file"}
          </button>

          {kind === "pdf" && current && !removed && !selected ? (
            <a
              href={current}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body ml-2 inline-flex h-9 items-center rounded-xl border border-black/[0.08] px-4 text-[12px] font-semibold dark:border-white/[0.08]"
            >
              {km ? "មើល" : "View"}
            </a>
          ) : null}

          <p className="font-body mt-2 text-[10px] text-[var(--foreground-muted)]">
            {kind === "image"
              ? km
                ? "JPG, PNG, WEBP • អតិបរមា 5 MB"
                : "JPG, PNG, WEBP • Max 5 MB"
              : km
                ? "PDF • អតិបរមា 10 MB"
                : "PDF • Max 10 MB"}
          </p>

          {fileName ? (
            <p className="font-body mt-1 truncate text-[10px] text-violet-700 dark:text-violet-300">
              {fileName}
            </p>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="font-body mt-2 text-[10px] text-red-600 dark:text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
