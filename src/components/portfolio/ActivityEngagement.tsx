"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Heart, MessageCircle, Send, Share2, X } from "lucide-react";

import {
  addPublicCommentAction,
  getPublicLikeStateAction,
  togglePublicLikeAction,
} from "@/actions/interactions";
import { cn } from "@/lib/cn";

type PublicComment = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

type Props = {
  locale: "en" | "km";
  activityId: number;
  title: string;
  initialLikeCount: number;
  initialCommentCount: number;
  comments: PublicComment[];
};

const VISITOR_KEY = "chantha-portfolio-visitor-key";

function getVisitorKey() {
  const existing = window.localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;

  const value = typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(VISITOR_KEY, value);
  return value;
}

export default function ActivityEngagement({
  locale,
  activityId,
  title,
  initialLikeCount,
  initialCommentCount,
  comments,
}: Props) {
  const khmer = locale === "km";
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentResult, setCommentResult] = useState<{ success: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const visitorKey = getVisitorKey();

    void getPublicLikeStateAction(activityId, visitorKey).then((result) => {
      setLiked(result.liked);
      setLikeCount(result.count);
    });
  }, [activityId]);

  const toggleLike = () => {
    const visitorKey = getVisitorKey();

    startTransition(async () => {
      const result = await togglePublicLikeAction(activityId, visitorKey);
      if (result.success) {
        setLiked(result.liked);
        setLikeCount(result.count);
      }
    });
  };

  const submitComment = (formData: FormData) => {
    setCommentResult(null);

    startTransition(async () => {
      const result = await addPublicCommentAction(activityId, formData);
      setCommentResult(result);
      if (result.success) {
        formRef.current?.reset();
      }
    });
  };

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#projects`;

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // User cancelled sharing; no UI error is necessary.
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5 border-t border-[var(--portfolio-border)] pt-3">
        <EngagementButton
          active={liked}
          label={`${likeCount}`}
          icon={Heart}
          onClick={toggleLike}
          disabled={pending}
        />
        <EngagementButton
          label={`${initialCommentCount}`}
          icon={MessageCircle}
          onClick={() => setCommentOpen(true)}
        />
        <EngagementButton
          label={khmer ? "ចែករំលែក" : "Share"}
          icon={Share2}
          onClick={share}
        />
      </div>

      {commentOpen ? (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-[520px] overflow-y-auto rounded-[22px] border border-[var(--portfolio-border)] bg-[var(--portfolio-bg-soft)] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-body text-[14px] font-semibold text-[var(--portfolio-text)]">
                  {khmer ? "មតិយោបល់" : "Comments"}
                </p>
                <p className="font-body mt-1 line-clamp-1 text-[10px] text-[var(--portfolio-muted)]">{title}</p>
              </div>
              <button
                type="button"
                onClick={() => setCommentOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--portfolio-border)] text-[var(--portfolio-muted)]"
              >
                <X size={14} />
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              {comments.length > 0 ? comments.map((comment) => (
                <div key={comment.id} className="rounded-xl border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-body text-[11px] font-semibold text-[var(--portfolio-text)]">{comment.name}</p>
                    <span className="font-number text-[8px] text-[var(--portfolio-muted)]">
                      {new Date(comment.createdAt).toLocaleDateString(locale === "km" ? "km-KH" : "en-US")}
                    </span>
                  </div>
                  <p className="font-body mt-2 whitespace-pre-wrap text-[11px] leading-5 text-[var(--portfolio-muted)]">{comment.message}</p>
                </div>
              )) : (
                <p className="font-body rounded-xl border border-dashed border-[var(--portfolio-border)] p-4 text-center text-[11px] text-[var(--portfolio-muted)]">
                  {khmer ? "មិនទាន់មានមតិយោបល់ដែលបានអនុម័ត។" : "No approved comments yet."}
                </p>
              )}
            </div>

            <form ref={formRef} action={submitComment} className="mt-5 grid gap-3 border-t border-[var(--portfolio-border)] pt-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <input className="portfolio-input" name="name" required placeholder={khmer ? "ឈ្មោះ" : "Name"} />
                <input className="portfolio-input" name="email" type="email" placeholder={khmer ? "អ៊ីមែល (ស្រេចចិត្ត)" : "Email (optional)"} />
              </div>
              <textarea className="portfolio-input min-h-[95px] resize-y py-3" name="message" required placeholder={khmer ? "សរសេរមតិយោបល់..." : "Write a comment..."} />

              {commentResult ? (
                <p className={cn(
                  "font-body text-[10px] leading-5",
                  commentResult.success ? "text-emerald-400" : "text-red-400",
                )}>
                  {commentResult.success
                    ? khmer
                      ? "បានផ្ញើមតិយោបល់។ វានឹងបង្ហាញបន្ទាប់ពីអ្នកគ្រប់គ្រងអនុម័ត។"
                      : "Comment submitted. It will appear after approval."
                    : khmer
                      ? "មិនអាចផ្ញើមតិយោបល់បានទេ។"
                      : commentResult.message}
                </p>
              ) : null}

              <button type="submit" disabled={pending} className="portfolio-primary-button justify-self-end disabled:opacity-60">
                <Send size={14} />
                {pending ? (khmer ? "កំពុងផ្ញើ..." : "Sending...") : (khmer ? "ផ្ញើ" : "Submit")}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function EngagementButton({
  icon: Icon,
  label,
  onClick,
  active = false,
  disabled = false,
}: {
  icon: typeof Heart;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "font-body inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[10px] transition",
        active
          ? "bg-rose-500/10 text-rose-400"
          : "text-[var(--portfolio-muted)] hover:bg-[var(--portfolio-chip)] hover:text-[var(--portfolio-text)]",
      )}
    >
      <Icon size={13} fill={active ? "currentColor" : "none"} />
      {label}
    </button>
  );
}
