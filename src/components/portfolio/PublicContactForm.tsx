"use client";

import { useRef, useState, useTransition } from "react";

import { AlertCircle, Check, Send } from "lucide-react";

import { sendContactMessageAction } from "@/actions/contact-public";

import { cn } from "@/lib/cn";

type Props = {
  locale: "en" | "km";
};

export default function PublicContactForm({ locale }: Props) {
  const khmer = locale === "km";

  const formRef = useRef<HTMLFormElement>(null);

  const [pending, startTransition] = useTransition();

  const [result, setResult] = useState<{
    success: boolean;

    message: string;
  } | null>(null);

  const submit = (formData: FormData) => {
    setResult(null);

    startTransition(async () => {
      const response = await sendContactMessageAction(formData);

      setResult(response);

      if (response.success) {
        formRef.current?.reset();
      }
    });
  };

  return (
    <form ref={formRef} action={submit} className="grid gap-4">
      {/* ===================================================
          HONEYPOT
         =================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
      >
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* ===================================================
          NAME + EMAIL
         =================================================== */}

      <div className="grid gap-4 sm:grid-cols-2">
        <PortfolioField
          label={khmer ? "ឈ្មោះ" : "Name"}
          name="name"
          placeholder={khmer ? "ឈ្មោះរបស់អ្នក" : "Your name"}
          required
        />

        <PortfolioField
          label={khmer ? "អ៊ីមែល" : "Email"}
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>

      {/* ===================================================
          SUBJECT
         =================================================== */}

      <PortfolioField
        label={khmer ? "ប្រធានបទ" : "Subject"}
        name="subject"
        placeholder={
          khmer
            ? "តើអ្នកចង់និយាយអំពីអ្វី?"
            : "What would you like to talk about?"
        }
      />

      {/* ===================================================
          MESSAGE
         =================================================== */}

      <label className="block">
        <span className="portfolio-form-label">
          {khmer ? "សារ" : "Message"}
        </span>

        <textarea
          name="message"
          rows={5}
          minLength={5}
          maxLength={5000}
          required
          placeholder={khmer ? "សរសេរសាររបស់អ្នក..." : "Write your message..."}
          className="portfolio-input min-h-[132px] resize-y py-3"
        />
      </label>

      {/* ===================================================
          RESULT
         =================================================== */}

      {result ? (
        <div
          role="status"
          className={cn(
            "flex items-start gap-2 rounded-xl border px-3.5 py-3 font-body text-[12px]",
            result.success
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
          )}
        >
          {result.success ? (
            <Check size={15} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
          )}

          <span>
            {result.success
              ? khmer
                ? "សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ។"
                : "Your message was sent successfully."
              : result.message}
          </span>
        </div>
      ) : null}

      {/* ===================================================
          SUBMIT
         =================================================== */}

      <button
        type="submit"
        disabled={pending}
        className="portfolio-primary-button justify-self-start disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={16} />

        {pending
          ? khmer
            ? "កំពុងផ្ញើ..."
            : "Sending..."
          : khmer
            ? "ផ្ញើសារ"
            : "Send Message"}
      </button>
    </form>
  );
}

/* =========================================================
   FIELD
   ========================================================= */

function PortfolioField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;

  name: string;

  type?: string;

  placeholder?: string;

  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="portfolio-form-label">{label}</span>

      <input
        type={type}
        name={name}
        required={required}
        maxLength={name === "subject" ? 200 : name === "name" ? 100 : 200}
        placeholder={placeholder}
        className="portfolio-input"
      />
    </label>
  );
}
