"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, EyeOff, MessageCircle, Trash2 } from "lucide-react";

import {
  deleteCommentAction,
  setCommentApprovalAction,
} from "@/actions/interactions";
import AppToast from "@/components/ui/AppToast";
import { cn } from "@/lib/cn";

type CommentItem = {
  id: number;
  name: string;
  email: string | null;
  message: string;
  isApproved: boolean;
  createdAt: string;
  activity: {
    id: number;
    titleEn: string;
    titleKm: string | null;
    type: string;
  };
};

type Props = {
  locale: "en" | "km";
  comments: CommentItem[];
};

export default function CommentsManager({ locale, comments }: Props) {
  const router = useRouter();
  const khmer = locale === "km";
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED">("ALL");
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState({ open: false, success: true, message: "" });

  const filtered = comments.filter((comment) => {
    if (filter === "ALL") return true;
    if (filter === "APPROVED") return comment.isApproved;
    return !comment.isApproved;
  });

  const approve = (id: number, isApproved: boolean) => {
    startTransition(async () => {
      const result = await setCommentApprovalAction(id, isApproved);
      setToast({ open: true, success: result.success, message: result.message });
      if (result.success) router.refresh();
    });
  };

  const remove = (id: number) => {
    if (!window.confirm(khmer ? "តើអ្នកចង់លុបមតិយោបល់នេះមែនទេ?" : "Delete this comment?")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteCommentAction(id);
      setToast({ open: true, success: result.success, message: result.message });
      if (result.success) router.refresh();
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
          {khmer ? "គ្រប់គ្រងមតិយោបល់" : "Comment Moderation"}
        </h1>
        <p className="font-body mt-1.5 max-w-2xl text-[14px] leading-6 text-[var(--foreground-muted)]">
          {khmer
            ? "ពិនិត្យ អនុម័ត លាក់ ឬលុបមតិយោបល់របស់អ្នកទស្សនា មុនពេលបង្ហាញសាធារណៈ។"
            : "Review, approve, hide or delete visitor comments before they appear publicly."}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {(["ALL", "PENDING", "APPROVED"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={cn(
              "font-body h-9 rounded-xl border px-3 text-[11px] font-semibold transition",
              filter === item
                ? "border-violet-600 bg-violet-600 text-white"
                : "border-black/[0.07] bg-white text-[var(--foreground-muted)] dark:border-white/[0.08] dark:bg-[#0d0f19]",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="mt-4 overflow-hidden rounded-2xl border border-black/[0.065] bg-white shadow-sm dark:border-white/[0.075] dark:bg-[#0d0f19]">
        {filtered.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-700 dark:text-violet-300">
              <MessageCircle size={20} />
            </div>
            <p className="font-body mt-3 text-[15px] font-semibold">
              {khmer ? "មិនទាន់មានមតិយោបល់" : "No comments yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.055] dark:divide-white/[0.06]">
            {filtered.map((comment) => (
              <article key={comment.id} className="p-4 md:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-body text-[13px] font-semibold">{comment.name}</p>
                      <span className={cn(
                        "rounded-full px-2 py-0.5 font-body text-[9px]",
                        comment.isApproved
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                      )}>
                        {comment.isApproved ? "APPROVED" : "PENDING"}
                      </span>
                    </div>

                    <p className="font-body mt-1 text-[10px] text-[var(--foreground-muted)]">
                      {khmer && comment.activity.titleKm ? comment.activity.titleKm : comment.activity.titleEn}
                      {` • ${comment.activity.type}`}
                      {` • ${new Date(comment.createdAt).toLocaleDateString(locale === "km" ? "km-KH" : "en-US")}`}
                    </p>

                    <p className="font-body mt-3 whitespace-pre-wrap text-[12px] leading-6 text-[var(--foreground-muted)]">
                      {comment.message}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {comment.isApproved ? (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => approve(comment.id, false)}
                        className="font-body inline-flex h-9 items-center gap-2 rounded-xl border border-black/[0.07] px-3 text-[11px] font-semibold text-[var(--foreground-muted)] dark:border-white/[0.08]"
                      >
                        <EyeOff size={14} />
                        {khmer ? "លាក់" : "Hide"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => approve(comment.id, true)}
                        className="font-body inline-flex h-9 items-center gap-2 rounded-xl bg-emerald-600 px-3 text-[11px] font-semibold text-white"
                      >
                        <Check size={14} />
                        {khmer ? "អនុម័ត" : "Approve"}
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => remove(comment.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/15 text-red-500 hover:bg-red-500/5"
                      aria-label="Delete comment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
