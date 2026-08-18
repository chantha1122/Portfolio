"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, KeyRound, LockKeyhole, Save, ShieldCheck } from "lucide-react";

import {
  changePasswordAction,
  initialChangePasswordState,
} from "@/actions/security";
import AppToast from "@/components/ui/AppToast";
import { cn } from "@/lib/cn";

type Props = {
  locale: "en" | "km";
};

export default function ChangePasswordForm({ locale }: Props) {
  const khmer = locale === "km";
  const [state, formAction, pending] = useActionState(
    changePasswordAction,
    initialChangePasswordState,
  );
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [toastDismissed, setToastDismissed] = useState(false);
  const showToast = Boolean(state.message) && !toastDismissed && !pending;

  return (
    <>
      <AppToast
        open={showToast}
        locale={locale}
        variant={state.success ? "success" : "error"}
        message={
          state.success
            ? khmer
              ? "បានផ្លាស់ប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ។"
              : "Password changed successfully."
            : khmer
              ? "មិនអាចផ្លាស់ប្តូរពាក្យសម្ងាត់បានទេ។ សូមពិនិត្យព័ត៌មាន។"
              : "Unable to change password. Please check the information."
        }
        onClose={() => setToastDismissed(true)}
      />

      <form
        action={formAction}
        onSubmit={() => setToastDismissed(false)}
        className="space-y-4"
      >
        <PasswordField
          label={khmer ? "ពាក្យសម្ងាត់បច្ចុប្បន្ន" : "Current Password"}
          name="currentPassword"
          show={showCurrent}
          onToggle={() => setShowCurrent((value) => !value)}
          error={state.fieldErrors?.currentPassword?.[0]}
        />

        <PasswordField
          label={khmer ? "ពាក្យសម្ងាត់ថ្មី" : "New Password"}
          name="newPassword"
          show={showNew}
          onToggle={() => setShowNew((value) => !value)}
          error={state.fieldErrors?.newPassword?.[0]}
        />

        <PasswordField
          label={khmer ? "បញ្ជាក់ពាក្យសម្ងាត់ថ្មី" : "Confirm New Password"}
          name="confirmPassword"
          show={showNew}
          onToggle={() => setShowNew((value) => !value)}
          error={state.fieldErrors?.confirmPassword?.[0]}
        />

        <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/[0.045] p-3.5">
          <div className="flex gap-3">
            <ShieldCheck size={17} className="mt-0.5 shrink-0 text-cyan-600 dark:text-cyan-300" />
            <p className="font-body text-[11px] leading-5 text-[var(--foreground-muted)]">
              {khmer
                ? "ប្រើពាក្យសម្ងាត់យ៉ាងតិច ៨ តួអក្សរ ហើយកុំប្រើពាក្យសម្ងាត់ដូចគ្នាជាមួយគណនីផ្សេង។"
                : "Use at least 8 characters and avoid reusing the same password on other accounts."}
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-black/[0.06] pt-4 dark:border-white/[0.07]">
          <button
            type="submit"
            disabled={pending}
            className="font-body inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-5 text-[12px] font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
          >
            <Save size={15} />
            {pending
              ? khmer
                ? "កំពុងរក្សាទុក..."
                : "Saving..."
              : khmer
                ? "ផ្លាស់ប្តូរពាក្យសម្ងាត់"
                : "Change Password"}
          </button>
        </div>
      </form>
    </>
  );
}

function PasswordField({
  label,
  name,
  show,
  onToggle,
  error,
}: {
  label: string;
  name: string;
  show: boolean;
  onToggle: () => void;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="font-body mb-1.5 block text-[12px] font-semibold">
        {label}
      </label>
      <div className="relative">
        <LockKeyhole
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
        />
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          autoComplete={name === "currentPassword" ? "current-password" : "new-password"}
          className={cn(
            "font-body h-10 w-full rounded-xl border bg-white pl-9 pr-10 text-[13px] outline-none transition dark:bg-[#121520]",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
              : "border-black/[0.085] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-white/[0.08]",
          )}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--foreground-muted)] hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {error ? <p className="font-body mt-1 text-[10px] text-red-500">{error}</p> : null}
    </div>
  );
}
