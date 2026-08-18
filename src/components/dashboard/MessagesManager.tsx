"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  CheckCircle2,
  Mail,
  MailOpen,
  Reply,
  Trash2,
  X,
} from "lucide-react";

import {
  deleteContactMessageAction,
  updateContactMessageStatusAction,
} from "@/actions/content";
import AppToast from "@/components/ui/AppToast";
import { cn } from "@/lib/cn";

type MessageStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

type MessageItem = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: MessageStatus;
  createdAt: string;
};

type Props = {
  locale: "en" | "km";
  messages: MessageItem[];
};

export default function MessagesManager({ locale, messages }: Props) {
  const router = useRouter();
  const khmer = locale === "km";
  const [selected, setSelected] = useState<MessageItem | null>(null);
  const [filter, setFilter] = useState<"ALL" | MessageStatus>("ALL");
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState({ open: false, success: true, message: "" });

  const filtered = filter === "ALL" ? messages : messages.filter((message) => message.status === filter);

  const updateStatus = (id: number, status: MessageStatus) => {
    startTransition(async () => {
      const result = await updateContactMessageStatusAction(id, status);
      setToast({ open: true, success: result.success, message: result.message });
      if (result.success) {
        if (selected?.id === id) {
          setSelected((current) => current ? { ...current, status } : current);
        }
        router.refresh();
      }
    });
  };

  const remove = (id: number) => {
    if (!window.confirm(khmer ? "តើអ្នកចង់លុបសារនេះមែនទេ?" : "Delete this message?")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteContactMessageAction(id);
      setToast({ open: true, success: result.success, message: result.message });
      if (result.success) {
        setSelected(null);
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
        onClose={() => setToast((current) => ({ ...current, open: false }))}
      />

      <div>
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-600 dark:text-cyan-300">
          Portfolio CMS
        </p>
        <h1 className="font-body mt-1.5 text-[28px] font-semibold">
          {khmer ? "សារទំនាក់ទំនង" : "Contact Messages"}
        </h1>
        <p className="font-body mt-1.5 max-w-2xl text-[14px] leading-6 text-[var(--foreground-muted)]">
          {khmer
            ? "ពិនិត្យ និងគ្រប់គ្រងសារដែលអ្នកទស្សនាបានផ្ញើតាមទំព័រ Get In Touch។"
            : "Review and manage messages submitted from the Get In Touch section of your portfolio."}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {(["ALL", "NEW", "READ", "REPLIED", "ARCHIVED"] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={cn(
              "font-body h-9 rounded-xl border px-3 text-[11px] font-semibold transition",
              filter === status
                ? "border-violet-600 bg-violet-600 text-white"
                : "border-black/[0.07] bg-white text-[var(--foreground-muted)] hover:text-[var(--foreground)] dark:border-white/[0.08] dark:bg-[#0d0f19]",
            )}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="overflow-hidden rounded-2xl border border-black/[0.065] bg-white shadow-sm dark:border-white/[0.075] dark:bg-[#0d0f19]">
          {filtered.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-700 dark:text-violet-300">
                <Mail size={20} />
              </div>
              <p className="font-body mt-3 text-[15px] font-semibold">
                {khmer ? "មិនទាន់មានសារ" : "No messages yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black/[0.055] dark:divide-white/[0.06]">
              {filtered.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => {
                    setSelected(message);
                    if (message.status === "NEW") {
                      updateStatus(message.id, "READ");
                    }
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 p-4 text-left transition hover:bg-black/[0.015] dark:hover:bg-white/[0.02]",
                    selected?.id === message.id && "bg-violet-500/[0.04]",
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    message.status === "NEW"
                      ? "bg-violet-500/10 text-violet-700 dark:text-violet-300"
                      : "bg-black/[0.035] text-[var(--foreground-muted)] dark:bg-white/[0.04]",
                  )}>
                    {message.status === "NEW" ? <Mail size={16} /> : <MailOpen size={16} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-body truncate text-[13px] font-semibold">{message.name}</p>
                      <span className="font-number shrink-0 text-[9px] text-[var(--foreground-muted)]">
                        {new Date(message.createdAt).toLocaleDateString(locale === "km" ? "km-KH" : "en-US")}
                      </span>
                    </div>
                    <p className="font-body mt-0.5 truncate text-[11px] text-[var(--foreground-muted)]">
                      {message.subject || (khmer ? "គ្មានប្រធានបទ" : "No subject")}
                    </p>
                    <p className="font-body mt-1 line-clamp-2 text-[11px] leading-5 text-[var(--foreground-muted)]">
                      {message.message}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <aside className="rounded-2xl border border-black/[0.065] bg-white p-5 shadow-sm dark:border-white/[0.075] dark:bg-[#0d0f19]">
          {selected ? (
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-body text-[15px] font-semibold">{selected.name}</p>
                  <a href={`mailto:${selected.email}`} className="font-body mt-1 block text-[11px] text-violet-600 dark:text-cyan-300">
                    {selected.email}
                  </a>
                </div>
                <button type="button" onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.05]">
                  <X size={14} />
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-black/[0.02] p-4 dark:bg-white/[0.025]">
                <p className="font-body text-[11px] font-semibold">{selected.subject || (khmer ? "គ្មានប្រធានបទ" : "No subject")}</p>
                <p className="font-body mt-3 whitespace-pre-wrap text-[12px] leading-6 text-[var(--foreground-muted)]">{selected.message}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <ActionButton icon={CheckCircle2} label={khmer ? "អានរួច" : "Mark Read"} onClick={() => updateStatus(selected.id, "READ")} />
                <ActionButton icon={Reply} label={khmer ? "បានឆ្លើយ" : "Replied"} onClick={() => updateStatus(selected.id, "REPLIED")} />
                <ActionButton icon={Archive} label={khmer ? "រក្សាទុក" : "Archive"} onClick={() => updateStatus(selected.id, "ARCHIVED")} />
                <ActionButton icon={Trash2} label={khmer ? "លុប" : "Delete"} onClick={() => remove(selected.id)} danger />
              </div>
            </div>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <MailOpen size={28} className="text-violet-500" />
              <p className="font-body mt-3 text-[13px] font-semibold">
                {khmer ? "ជ្រើសរើសសារ" : "Select a message"}
              </p>
              <p className="font-body mt-1 text-[11px] text-[var(--foreground-muted)]">
                {khmer ? "ព័ត៌មានលម្អិតនឹងបង្ហាញនៅទីនេះ។" : "Message details will appear here."}
              </p>
            </div>
          )}
        </aside>
      </div>

      {pending ? <span className="sr-only">Updating...</span> : null}
    </>
  );
}

function ActionButton({ icon: Icon, label, onClick, danger = false }: { icon: typeof Mail; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "font-body inline-flex h-9 items-center justify-center gap-2 rounded-xl border text-[11px] font-semibold transition",
        danger
          ? "border-red-500/15 text-red-500 hover:bg-red-500/5"
          : "border-black/[0.07] text-[var(--foreground-muted)] hover:text-[var(--foreground)] dark:border-white/[0.08]",
      )}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
