"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Archive,
  CheckCircle2,
  Mail,
  MailOpen,
  Reply,
  Send,
  Trash2,
  X,
} from "lucide-react";

import {
  deleteContactMessageAction,
  replyToContactMessageAction,
  updateContactMessageStatusAction,
} from "@/actions/content";

import AppToast from "@/components/ui/AppToast";

import { cn } from "@/lib/cn";

/* =========================================================
   TYPES
   ========================================================= */

type MessageStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

type MessageItem = {
  id: number;

  name: string;

  email: string;

  subject: string | null;

  message: string;

  status: MessageStatus;

  createdAt: string;

  replyMessage?: string | null;

  repliedAt?: string | null;
};

type Props = {
  locale: "en" | "km";

  messages: MessageItem[];
};

/* =========================================================
   MAIN
   ========================================================= */

export default function MessagesManager({ locale, messages }: Props) {
  const router = useRouter();

  const khmer = locale === "km";

  const [selected, setSelected] = useState<MessageItem | null>(null);

  const [filter, setFilter] = useState<"ALL" | MessageStatus>("ALL");

  const [pending, startTransition] = useTransition();

  const [replyPending, startReplyTransition] = useTransition();

  const [replyOpen, setReplyOpen] = useState(false);

  const [replyText, setReplyText] = useState("");

  const [toast, setToast] = useState({
    open: false,

    success: true,

    message: "",
  });

  /* =======================================================
     FILTERED DATA
     ======================================================= */

  const filtered =
    filter === "ALL"
      ? messages
      : messages.filter((message) => message.status === filter);

  /* =======================================================
     CHANGE FILTER
     ======================================================= */

  function changeFilter(status: "ALL" | MessageStatus) {
    setFilter(status);

    /*
     * Prevent an old message from another
     * status tab remaining open on the right.
     */
    setSelected(null);

    setReplyOpen(false);

    setReplyText("");
  }

  /* =======================================================
     UPDATE STATUS
     ======================================================= */

  function updateStatus(id: number, status: Exclude<MessageStatus, "REPLIED">) {
    startTransition(async () => {
      const result = await updateContactMessageStatusAction(id, status);

      setToast({
        open: true,

        success: result.success,

        message: result.message,
      });

      if (!result.success) {
        return;
      }

      /*
       * Update the detail immediately.
       */
      if (selected?.id === id) {
        if (filter !== "ALL" && filter !== status) {
          setSelected(null);
        } else {
          setSelected((current) =>
            current
              ? {
                  ...current,

                  status,
                }
              : current,
          );
        }
      }

      router.refresh();
    });
  }

  /* =======================================================
     OPEN MESSAGE
     ======================================================= */

  function openMessage(message: MessageItem) {
    setSelected(message);

    setReplyOpen(false);

    setReplyText("");

    /*
     * Opening a NEW message automatically
     * marks it as READ.
     */
    if (message.status === "NEW") {
      updateStatus(message.id, "READ");
    }
  }

  /* =======================================================
     OPEN REPLY
     ======================================================= */

  function openReply() {
    if (!selected) {
      return;
    }

    setReplyText("");

    setReplyOpen(true);
  }

  /* =======================================================
     CLOSE REPLY
     ======================================================= */

  function closeReply() {
    if (replyPending) {
      return;
    }

    setReplyOpen(false);

    setReplyText("");
  }

  /* =======================================================
     SEND REPLY
     ======================================================= */

  function sendReply() {
    if (!selected) {
      return;
    }

    const cleanReply = replyText.trim();

    if (cleanReply.length < 2) {
      return;
    }

    const messageId = selected.id;

    startReplyTransition(async () => {
      const result = await replyToContactMessageAction(messageId, cleanReply);

      setToast({
        open: true,

        success: result.success,

        message: result.message,
      });

      if (!result.success) {
        return;
      }

      /*
       * Update the visible message immediately.
       */
      if (filter === "ALL" || filter === "REPLIED") {
        setSelected((current) =>
          current?.id === messageId
            ? {
                ...current,

                status: "REPLIED",

                replyMessage: cleanReply,

                repliedAt: new Date().toISOString(),
              }
            : current,
        );
      } else {
        /*
         * Example:
         * user replies while viewing READ tab.
         * It no longer belongs to READ,
         * so close the detail panel.
         */
        setSelected(null);
      }

      setReplyOpen(false);

      setReplyText("");

      router.refresh();
    });
  }

  /* =======================================================
     DELETE
     ======================================================= */

  function remove(id: number) {
    const confirmed = window.confirm(
      khmer ? "តើអ្នកចង់លុបសារនេះមែនទេ?" : "Delete this message?",
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result = await deleteContactMessageAction(id);

      setToast({
        open: true,

        success: result.success,

        message: result.message,
      });

      if (!result.success) {
        return;
      }

      setSelected(null);

      setReplyOpen(false);

      setReplyText("");

      router.refresh();
    });
  }

  return (
    <>
      {/* ===================================================
          TOAST
         =================================================== */}

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

      {/* ===================================================
          PAGE HEADER
         =================================================== */}

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

      {/* ===================================================
          FILTERS
         =================================================== */}

      <div className="mt-5 flex flex-wrap gap-2">
        {(["ALL", "NEW", "READ", "REPLIED", "ARCHIVED"] as const).map(
          (status) => (
            <button
              key={status}
              type="button"
              onClick={() => changeFilter(status)}
              className={cn(
                "font-body h-9 rounded-xl border px-3 text-[11px] font-semibold transition",
                filter === status
                  ? "border-violet-600 bg-violet-600 text-white"
                  : "border-black/[0.07] bg-white text-[var(--foreground-muted)] hover:text-[var(--foreground)] dark:border-white/[0.08] dark:bg-[#0d0f19]",
              )}
            >
              {status}
            </button>
          ),
        )}
      </div>

      {/* ===================================================
          CONTENT
         =================================================== */}

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
        {/* =================================================
            MESSAGE LIST
           ================================================= */}

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
                  onClick={() => openMessage(message)}
                  className={cn(
                    "flex w-full items-start gap-3 p-4 text-left transition hover:bg-black/[0.015] dark:hover:bg-white/[0.02]",
                    selected?.id === message.id && "bg-violet-500/[0.04]",
                  )}
                >
                  {/* ICON */}

                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      message.status === "NEW"
                        ? "bg-violet-500/10 text-violet-700 dark:text-violet-300"
                        : "bg-black/[0.035] text-[var(--foreground-muted)] dark:bg-white/[0.04]",
                    )}
                  >
                    {message.status === "NEW" ? (
                      <Mail size={16} />
                    ) : (
                      <MailOpen size={16} />
                    )}
                  </div>

                  {/* CONTENT */}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-body truncate text-[13px] font-semibold">
                        {message.name}
                      </p>

                      <span className="font-number shrink-0 text-[9px] text-[var(--foreground-muted)]">
                        {new Date(message.createdAt).toLocaleDateString(
                          locale === "km" ? "km-KH" : "en-US",
                        )}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center gap-2">
                      <p className="font-body min-w-0 flex-1 truncate text-[11px] text-[var(--foreground-muted)]">
                        {message.subject ||
                          (khmer ? "គ្មានប្រធានបទ" : "No subject")}
                      </p>

                      <StatusBadge status={message.status} />
                    </div>

                    <p className="font-body mt-1 line-clamp-2 text-[11px] leading-5 text-[var(--foreground-muted)]">
                      {message.message}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* =================================================
            MESSAGE DETAIL
           ================================================= */}

        <aside className="rounded-2xl border border-black/[0.065] bg-white p-5 shadow-sm dark:border-white/[0.075] dark:bg-[#0d0f19]">
          {selected ? (
            <div>
              {/* HEADER */}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-body text-[15px] font-semibold">
                      {selected.name}
                    </p>

                    <StatusBadge status={selected.status} />
                  </div>

                  <a
                    href={`mailto:${selected.email}`}
                    className="font-body mt-1 block truncate text-[11px] text-violet-600 dark:text-cyan-300"
                  >
                    {selected.email}
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);

                    setReplyOpen(false);

                    setReplyText("");
                  }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                >
                  <X size={14} />
                </button>
              </div>

              {/* ORIGINAL MESSAGE */}

              <div className="mt-4 rounded-xl bg-black/[0.02] p-4 dark:bg-white/[0.025]">
                <p className="font-body text-[11px] font-semibold">
                  {selected.subject || (khmer ? "គ្មានប្រធានបទ" : "No subject")}
                </p>

                <p className="font-body mt-3 whitespace-pre-wrap text-[12px] leading-6 text-[var(--foreground-muted)]">
                  {selected.message}
                </p>
              </div>

              {/* EXISTING REPLY */}

              {selected.replyMessage ? (
                <div className="mt-3 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">
                      {khmer ? "ការឆ្លើយតបរបស់អ្នក" : "Your Reply"}
                    </p>

                    {selected.repliedAt ? (
                      <span className="font-number text-[9px] text-[var(--foreground-muted)]">
                        {new Date(selected.repliedAt).toLocaleDateString(
                          locale === "km" ? "km-KH" : "en-US",
                        )}
                      </span>
                    ) : null}
                  </div>

                  <p className="font-body mt-2 whitespace-pre-wrap text-[11px] leading-6 text-[var(--foreground-muted)]">
                    {selected.replyMessage}
                  </p>
                </div>
              ) : null}

              {/* ACTIONS */}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <ActionButton
                  icon={CheckCircle2}
                  label={
                    selected.status === "READ" || selected.status === "REPLIED"
                      ? khmer
                        ? "បានអាន"
                        : "Read"
                      : khmer
                        ? "អានរួច"
                        : "Mark Read"
                  }
                  disabled={
                    selected.status === "READ" ||
                    selected.status === "REPLIED" ||
                    selected.status === "ARCHIVED" ||
                    pending
                  }
                  onClick={() => updateStatus(selected.id, "READ")}
                />

                <ActionButton
                  icon={Reply}
                  label={
                    selected.status === "REPLIED"
                      ? khmer
                        ? "ឆ្លើយម្តងទៀត"
                        : "Reply Again"
                      : khmer
                        ? "ឆ្លើយតប"
                        : "Reply"
                  }
                  disabled={pending || replyPending}
                  onClick={openReply}
                />

                <ActionButton
                  icon={Archive}
                  label={
                    selected.status === "ARCHIVED"
                      ? khmer
                        ? "បានរក្សាទុក"
                        : "Archived"
                      : khmer
                        ? "រក្សាទុក"
                        : "Archive"
                  }
                  disabled={
                    selected.status === "ARCHIVED" || pending || replyPending
                  }
                  onClick={() => updateStatus(selected.id, "ARCHIVED")}
                />

                <ActionButton
                  icon={Trash2}
                  label={khmer ? "លុប" : "Delete"}
                  onClick={() => remove(selected.id)}
                  disabled={pending || replyPending}
                  danger
                />
              </div>
            </div>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <MailOpen size={28} className="text-violet-500" />

              <p className="font-body mt-3 text-[13px] font-semibold">
                {khmer ? "ជ្រើសរើសសារ" : "Select a message"}
              </p>

              <p className="font-body mt-1 text-[11px] text-[var(--foreground-muted)]">
                {khmer
                  ? "ព័ត៌មានលម្អិតនឹងបង្ហាញនៅទីនេះ។"
                  : "Message details will appear here."}
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* ===================================================
          REPLY MODAL
         =================================================== */}

      {replyOpen && selected ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-[520px] rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl dark:border-white/[0.08] dark:bg-[#0d0f19]">
            {/* MODAL HEADER */}

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-violet-600 dark:text-cyan-300">
                  {khmer ? "ឆ្លើយតបសារ" : "Reply Message"}
                </p>

                <h2 className="font-body mt-1 text-[17px] font-semibold text-[var(--foreground)]">
                  {khmer
                    ? `ឆ្លើយទៅ ${selected.name}`
                    : `Reply to ${selected.name}`}
                </h2>

                <p className="font-body mt-1 truncate text-[11px] text-[var(--foreground-muted)]">
                  {selected.email}
                </p>
              </div>

              <button
                type="button"
                onClick={closeReply}
                disabled={replyPending}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--foreground-muted)] transition hover:bg-black/[0.04] hover:text-[var(--foreground)] disabled:opacity-50 dark:hover:bg-white/[0.05]"
              >
                <X size={16} />
              </button>
            </div>

            {/* ORIGINAL */}

            <div className="mt-5 rounded-xl border border-black/[0.06] bg-black/[0.02] p-4 dark:border-white/[0.06] dark:bg-white/[0.025]">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
                {khmer ? "សារដើម" : "Original Message"}
              </p>

              {selected.subject ? (
                <p className="font-body mt-3 text-[12px] font-semibold text-[var(--foreground)]">
                  {selected.subject}
                </p>
              ) : null}

              <p className="font-body mt-2 max-h-[130px] overflow-y-auto whitespace-pre-wrap text-[11px] leading-6 text-[var(--foreground-muted)]">
                {selected.message}
              </p>
            </div>

            {/* REPLY */}

            <label className="mt-5 block">
              <span className="font-body mb-2 block text-[11px] font-medium text-[var(--foreground)]">
                {khmer ? "ការឆ្លើយតបរបស់អ្នក" : "Your Reply"}
              </span>

              <textarea
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                rows={7}
                maxLength={5000}
                autoFocus
                placeholder={
                  khmer ? "សរសេរការឆ្លើយតបរបស់អ្នក..." : "Write your reply..."
                }
                className="textarea min-h-[150px] resize-none"
              />

              <div className="mt-1 flex justify-end">
                <span className="font-number text-[9px] text-[var(--foreground-muted)]">
                  {replyText.length}
                  /5000
                </span>
              </div>
            </label>

            {/* BUTTONS */}

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={closeReply}
                disabled={replyPending}
                className="h-10 rounded-xl border border-black/[0.07] px-4 font-body text-[12px] font-medium text-[var(--foreground)] transition hover:bg-black/[0.025] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.08] dark:hover:bg-white/[0.04]"
              >
                {khmer ? "បោះបង់" : "Cancel"}
              </button>

              <button
                type="button"
                onClick={sendReply}
                disabled={replyPending || replyText.trim().length < 2}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 font-body text-[12px] font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={14} />

                {replyPending
                  ? khmer
                    ? "កំពុងផ្ញើ..."
                    : "Sending..."
                  : khmer
                    ? "ផ្ញើការឆ្លើយតប"
                    : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {pending ? <span className="sr-only">Updating...</span> : null}
    </>
  );
}

/* =========================================================
   ACTION BUTTON
   ========================================================= */

function ActionButton({
  icon: Icon,
  label,
  onClick,
  danger = false,
  disabled = false,
}: {
  icon: typeof Mail;

  label: string;

  onClick: () => void;

  danger?: boolean;

  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "font-body inline-flex h-9 items-center justify-center gap-2 rounded-xl border text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-45",
        danger
          ? "border-red-500/15 text-red-500 hover:bg-red-500/5"
          : "border-black/[0.07] text-[var(--foreground-muted)] hover:bg-black/[0.02] hover:text-[var(--foreground)] dark:border-white/[0.08] dark:hover:bg-white/[0.03]",
      )}
    >
      <Icon size={14} />

      {label}
    </button>
  );
}

/* =========================================================
   STATUS BADGE
   ========================================================= */

function StatusBadge({ status }: { status: MessageStatus }) {
  return (
    <span
      className={cn(
        "font-body shrink-0 rounded-full px-2 py-0.5 text-[8px] font-semibold",
        status === "NEW" &&
          "bg-violet-500/10 text-violet-700 dark:text-violet-300",
        status === "READ" && "bg-blue-500/10 text-blue-700 dark:text-blue-300",
        status === "REPLIED" &&
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        status === "ARCHIVED" &&
          "bg-black/[0.04] text-[var(--foreground-muted)] dark:bg-white/[0.05]",
      )}
    >
      {status}
    </span>
  );
}
