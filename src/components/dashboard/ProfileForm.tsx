"use client";

import { useActionState, useState, type ReactNode } from "react";
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
  Sparkles,
  UserRound,
  Video,
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

type ProfileFormProps = {
  locale: "en" | "km";
  profile: ProfileFormData;
};

const initialState: ProfileActionState = {
  success: false,
  message: null,
};

export default function ProfileForm({ locale, profile }: ProfileFormProps) {
  const t = useTranslations("Profile");
  const isKhmerPage = locale === "km";
  const [state, formAction, pending] = useActionState(
    saveProfileAction,
    initialState,
  );
  const [toastDismissed, setToastDismissed] = useState(false);

  const showToast = Boolean(state.message) && !toastDismissed && !pending;

  return (
    <>
      <AppToast
        open={showToast}
        locale={locale}
        variant={state.success ? "success" : "error"}
        message={state.success ? t("saveSuccess") : t("saveError")}
        onClose={() => setToastDismissed(true)}
      />

      <form
        action={formAction}
        onSubmit={() => setToastDismissed(false)}
        className="space-y-4"
      >
        <input type="hidden" name="locale" value={locale} />

        <FormSection
          icon={UserRound}
          title={t("basicInformation")}
          description={t("basicInformationDescription")}
          isKhmerPage={isKhmerPage}
        >
          <div className="grid gap-x-4 gap-y-4 md:grid-cols-2">
            <Field
              label={t("fullName")}
              name="fullName"
              defaultValue={profile.fullName}
              required
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.fullName?.[0]}
            />

            <Field
              label={t("yearsExperience")}
              name="yearsExperience"
              type="number"
              min="0"
              max="100"
              numeric
              defaultValue={String(profile.yearsExperience)}
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.yearsExperience?.[0]}
            />

            <Field
              label={t("headlineEn")}
              name="headlineEn"
              defaultValue={profile.headlineEn}
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.headlineEn?.[0]}
            />

            <Field
              label={t("headlineKm")}
              name="headlineKm"
              defaultValue={profile.headlineKm}
              isKhmerPage={isKhmerPage}
              khmerValue
              error={state.fieldErrors?.headlineKm?.[0]}
            />

            <Field
              label={t("currentRoleEn")}
              name="currentRoleEn"
              icon={BriefcaseBusiness}
              defaultValue={profile.currentRoleEn}
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.currentRoleEn?.[0]}
            />

            <Field
              label={t("currentRoleKm")}
              name="currentRoleKm"
              icon={BriefcaseBusiness}
              defaultValue={profile.currentRoleKm}
              isKhmerPage={isKhmerPage}
              khmerValue
              error={state.fieldErrors?.currentRoleKm?.[0]}
            />
          </div>
        </FormSection>

        <FormSection
          icon={FileText}
          title={t("aboutMe")}
          description={t("aboutMeDescription")}
          isKhmerPage={isKhmerPage}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextAreaField
              label={t("shortBioEn")}
              name="shortBioEn"
              rows={3}
              defaultValue={profile.shortBioEn}
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.shortBioEn?.[0]}
            />

            <TextAreaField
              label={t("shortBioKm")}
              name="shortBioKm"
              rows={3}
              defaultValue={profile.shortBioKm}
              isKhmerPage={isKhmerPage}
              khmerValue
              error={state.fieldErrors?.shortBioKm?.[0]}
            />

            <TextAreaField
              label={t("bioEn")}
              name="bioEn"
              defaultValue={profile.bioEn}
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.bioEn?.[0]}
            />

            <TextAreaField
              label={t("bioKm")}
              name="bioKm"
              defaultValue={profile.bioKm}
              isKhmerPage={isKhmerPage}
              khmerValue
              error={state.fieldErrors?.bioKm?.[0]}
            />

            <TextAreaField
              label={t("currentFocusEn")}
              name="currentFocusEn"
              rows={3}
              icon={Sparkles}
              defaultValue={profile.currentFocusEn}
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.currentFocusEn?.[0]}
            />

            <TextAreaField
              label={t("currentFocusKm")}
              name="currentFocusKm"
              rows={3}
              icon={Sparkles}
              defaultValue={profile.currentFocusKm}
              isKhmerPage={isKhmerPage}
              khmerValue
              error={state.fieldErrors?.currentFocusKm?.[0]}
            />
          </div>
        </FormSection>

        <FormSection
          icon={Contact}
          title={t("contactInformation")}
          description={t("contactInformationDescription")}
          isKhmerPage={isKhmerPage}
        >
          <div className="grid gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
            <Field
              label={t("email")}
              name="email"
              type="email"
              icon={Mail}
              defaultValue={profile.email}
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.email?.[0]}
            />
            <Field
              label={t("phone")}
              name="phone"
              type="tel"
              icon={Phone}
              defaultValue={profile.phone}
              numeric
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.phone?.[0]}
            />
            <Field
              label={t("telegram")}
              name="telegram"
              icon={Send}
              defaultValue={profile.telegram}
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.telegram?.[0]}
            />
            <Field
              label={t("github")}
              name="github"
              icon={Code2}
              defaultValue={profile.github}
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.github?.[0]}
            />
            <Field
              label={t("linkedin")}
              name="linkedin"
              icon={BriefcaseBusiness}
              defaultValue={profile.linkedin}
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.linkedin?.[0]}
            />

            <Field
              label={t("facebook")}
              name="facebook"
              icon={MessageCircle}
              defaultValue={profile.facebook}
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.facebook?.[0]}
            />

            <Field
              label={t("instagram")}
              name="instagram"
              icon={Camera}
              defaultValue={profile.instagram}
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.instagram?.[0]}
            />

            <Field
              label={t("youtube")}
              name="youtube"
              icon={Video}
              defaultValue={profile.youtube}
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.youtube?.[0]}
            />
          </div>
        </FormSection>

        <FormSection
          icon={MapPin}
          title={t("location")}
          description={t("locationDescription")}
          isKhmerPage={isKhmerPage}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label={t("locationEn")}
              name="locationEn"
              icon={MapPin}
              defaultValue={profile.locationEn}
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.locationEn?.[0]}
            />
            <Field
              label={t("locationKm")}
              name="locationKm"
              icon={MapPin}
              defaultValue={profile.locationKm}
              isKhmerPage={isKhmerPage}
              khmerValue
              error={state.fieldErrors?.locationKm?.[0]}
            />
          </div>
        </FormSection>

        <FormSection
          icon={Image}
          title={t("media")}
          description={t("mediaDescription")}
          isKhmerPage={isKhmerPage}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label={t("profileImage")}
              name="profileImage"
              defaultValue={profile.profileImage}
              placeholder="/images/profile.jpg"
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.profileImage?.[0]}
            />
            <Field
              label={t("badgeImage")}
              name="badgeImage"
              defaultValue={profile.badgeImage}
              placeholder="/images/profile-badge.png"
              isKhmerPage={isKhmerPage}
              error={state.fieldErrors?.badgeImage?.[0]}
            />
            <div className="md:col-span-2">
              <Field
                label={t("cvFile")}
                name="cvFile"
                defaultValue={profile.cvFile}
                placeholder="/files/chantha-cv.pdf"
                isKhmerPage={isKhmerPage}
                error={state.fieldErrors?.cvFile?.[0]}
              />
            </div>
          </div>
        </FormSection>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={pending}
            className={cn(
              "font-body inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 text-white shadow-[0_8px_18px_rgba(124,58,237,0.15)] transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-600",
              isKhmerPage
                ? "text-[13px] font-normal"
                : "text-[13px] font-semibold",
            )}
          >
            <Save size={15} strokeWidth={1.9} />
            {pending ? t("saving") : t("save")}
          </button>
        </div>
      </form>
    </>
  );
}

type FormSectionProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  isKhmerPage: boolean;
};

function FormSection({
  icon: Icon,
  title,
  description,
  children,
  isKhmerPage,
}: FormSectionProps) {
  return (
    <section className="rounded-2xl border border-black/[0.055] bg-black/[0.01] p-4 dark:border-white/[0.07] dark:bg-white/[0.015] md:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-700 dark:text-violet-300">
          <Icon size={16} strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
          <h2
            className={cn(
              "font-body text-[var(--foreground)]",
              isKhmerPage
                ? "text-[16px] font-normal leading-7"
                : "text-[16px] font-semibold leading-6",
            )}
          >
            {title}
          </h2>
          {description ? (
            <p className="font-body mt-0.5 text-[11px] leading-5 text-[var(--foreground-muted)]">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  icon?: LucideIcon;
  defaultValue?: string;
  required?: boolean;
  numeric?: boolean;
  khmerValue?: boolean;
  isKhmerPage: boolean;
  error?: string;
  placeholder?: string;
  min?: string;
  max?: string;
};

function Field({
  label,
  name,
  type = "text",
  icon: Icon,
  defaultValue = "",
  required = false,
  numeric = false,
  khmerValue = false,
  isKhmerPage,
  error,
  placeholder,
  min,
  max,
}: FieldProps) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className={cn(
          "font-body mb-1.5 block text-[var(--foreground)]",
          isKhmerPage
            ? "text-[12px] font-normal leading-6"
            : "text-[12px] font-semibold leading-5",
        )}
      >
        {label}
      </label>

      <div className="relative">
        {Icon ? (
          <Icon
            size={14}
            strokeWidth={1.7}
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
          defaultValue={defaultValue}
          placeholder={placeholder}
          lang={khmerValue ? "km" : undefined}
          className={cn(
            numeric
              ? "font-number"
              : khmerValue
                ? "khmer-input-value"
                : "font-body",
            "h-10 w-full rounded-xl border bg-white text-[13px] font-normal text-[var(--foreground)] outline-none transition placeholder:text-[var(--foreground-muted)]/55 dark:bg-[#121520]",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 dark:border-red-400/60"
              : "border-black/[0.085] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-white/[0.08]",
            Icon ? "pl-9 pr-3" : "px-3.5",
          )}
        />
      </div>

      {error ? (
        <p className="font-body mt-1 text-[10px] leading-4 text-red-600 dark:text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextAreaFieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  khmerValue?: boolean;
  isKhmerPage: boolean;
  error?: string;
  rows?: number;
  icon?: LucideIcon;
};

function TextAreaField({
  label,
  name,
  defaultValue = "",
  khmerValue = false,
  isKhmerPage,
  error,
  rows = 4,
}: TextAreaFieldProps) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className={cn(
          "font-body mb-1.5 block text-[var(--foreground)]",
          isKhmerPage
            ? "text-[12px] font-normal leading-6"
            : "text-[12px] font-semibold leading-5",
        )}
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        lang={khmerValue ? "km" : undefined}
        className={cn(
          khmerValue ? "khmer-input-value" : "font-body",
          "w-full resize-y rounded-xl border bg-white px-3.5 py-3 text-[13px] font-normal text-[var(--foreground)] outline-none transition dark:bg-[#121520]",
          rows <= 3 ? "min-h-[82px]" : "min-h-[104px]",
          khmerValue ? "leading-7" : "leading-5",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 dark:border-red-400/60"
            : "border-black/[0.085] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-white/[0.08]",
        )}
      />

      {error ? (
        <p className="font-body mt-1 text-[10px] leading-4 text-red-600 dark:text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
