"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { createPortal } from "react-dom";

import { Bookmark, Heart, MessageCircle, Send, Share2, X } from "lucide-react";

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
  variant?: "default" | "gallery";
  shareUrl?: string;
};

const VISITOR_KEY = "chantha-portfolio-visitor-key";

const BOOKMARK_KEY = "chantha-portfolio-bookmarks";

/* =========================================================
   VISITOR
   ========================================================= */

function getVisitorKey() {
  const existing = window.localStorage.getItem(VISITOR_KEY);

  if (existing) {
    return existing;
  }

  const value =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(VISITOR_KEY, value);

  return value;
}

/* =========================================================
   BOOKMARK
   ========================================================= */

function getBookmarks() {
  try {
    const value = window.localStorage.getItem(BOOKMARK_KEY);

    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(Number);
  } catch {
    return [];
  }
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function ActivityEngagement({
  locale,
  activityId,
  title,
  initialLikeCount,
  initialCommentCount,
  comments,
  variant = "default",
  shareUrl,
}: Props) {
  const khmer = locale === "km";

  const [mounted, setMounted] = useState(false);

  const [liked, setLiked] = useState(false);

  const [bookmarked, setBookmarked] = useState(false);

  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const [commentOpen, setCommentOpen] = useState(false);

  const [commentResult, setCommentResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [pending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  /* =======================================================
     MOUNT
     ======================================================= */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* =======================================================
     LOAD LIKE + BOOKMARK
     ======================================================= */

  useEffect(() => {
    const visitorKey = getVisitorKey();

    void getPublicLikeStateAction(activityId, visitorKey).then((result) => {
      setLiked(result.liked);

      setLikeCount(result.count);
    });

    setBookmarked(getBookmarks().includes(activityId));
  }, [activityId]);

  /* =======================================================
     LOCK PAGE WHEN COMMENT MODAL IS OPEN
     ======================================================= */

  useEffect(() => {
    if (!commentOpen) {
      return;
    }

    const oldOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCommentOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [commentOpen]);

  /* =======================================================
     LIKE
     ======================================================= */

  function toggleLike() {
    const visitorKey = getVisitorKey();

    startTransition(async () => {
      const result = await togglePublicLikeAction(activityId, visitorKey);

      if (result.success) {
        setLiked(result.liked);

        setLikeCount(result.count);
      }
    });
  }

  /* =======================================================
     BOOKMARK
     ======================================================= */

  function toggleBookmark() {
    const bookmarks = getBookmarks();

    const exists = bookmarks.includes(activityId);

    const next = exists
      ? bookmarks.filter((id) => id !== activityId)
      : [...bookmarks, activityId];

    window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));

    setBookmarked(!exists);
  }

  /* =======================================================
     COMMENT
     ======================================================= */

  function submitComment(formData: FormData) {
    setCommentResult(null);

    startTransition(async () => {
      const result = await addPublicCommentAction(activityId, formData);

      setCommentResult(result);

      if (result.success) {
        formRef.current?.reset();
      }
    });
  }

  /* =======================================================
     SHARE
     ======================================================= */

  async function share() {
    const url = shareUrl
      ? `${window.location.origin}${shareUrl}`
      : window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // User cancelled sharing.
    }
  }

  return (
    <>
      {/* ===================================================
          GALLERY STYLE
         =================================================== */}

      {variant === "gallery" ? (
        <GalleryActions
          liked={liked}
          bookmarked={bookmarked}
          likeCount={likeCount}
          commentCount={initialCommentCount}
          pending={pending}
          onLike={toggleLike}
          onComment={() => {
            setCommentResult(null);

            setCommentOpen(true);
          }}
          onShare={share}
          onBookmark={toggleBookmark}
        />
      ) : (
        /* =================================================
           NORMAL STYLE
           ================================================= */

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
            onClick={() => {
              setCommentResult(null);

              setCommentOpen(true);
            }}
          />

          <EngagementButton
            label={khmer ? "ចែករំលែក" : "Share"}
            icon={Share2}
            onClick={share}
          />
        </div>
      )}

      {/* ===================================================
          IMPORTANT:
          COMMENT MODAL IS RENDERED INTO document.body
          NOT INSIDE THE GALLERY CARD
         =================================================== */}

      {mounted && commentOpen
        ? createPortal(
            <CommentModal
              locale={locale}
              title={title}
              comments={comments}
              pending={pending}
              commentResult={commentResult}
              formRef={formRef}
              onClose={() => setCommentOpen(false)}
              submitComment={submitComment}
            />,
            document.body,
          )
        : null}
    </>
  );
}

/* =========================================================
   COMMENT MODAL
   ========================================================= */

function CommentModal({
  locale,
  title,
  comments,
  pending,
  commentResult,
  formRef,
  onClose,
  submitComment,
}: {
  locale: "en" | "km";

  title: string;

  comments: PublicComment[];

  pending: boolean;

  commentResult: {
    success: boolean;
    message: string;
  } | null;

  formRef: React.RefObject<HTMLFormElement | null>;

  onClose: () => void;

  submitComment: (formData: FormData) => void;
}) {
  const khmer = locale === "km";

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]

        flex
        items-center
        justify-center

        bg-slate-950/50

        p-4

        backdrop-blur-[6px]

        dark:bg-black/75
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* =====================================================
          MODAL
         ===================================================== */}

      <div
        className="
          relative

          max-h-[88vh]
          w-full
          max-w-[500px]

          overflow-y-auto

          rounded-[26px]

          border
          border-slate-200

          bg-white

          p-5

          shadow-[0_30px_90px_rgba(15,23,42,0.28)]

          sm:p-6

          dark:border-white/[0.09]
          dark:bg-[#0b0f1d]
          dark:shadow-[0_35px_100px_rgba(0,0,0,0.55)]
        "
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* ===================================================
            HEADER
           =================================================== */}

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p
              className={cn(
                "text-[15px] text-slate-950 dark:text-white",

                khmer
                  ? "khmer-input-value font-normal leading-7"
                  : "font-body font-semibold",
              )}
            >
              {khmer ? "មតិយោបល់" : "Comments"}
            </p>

            <p
              className="
                font-body
                mt-1

                truncate

                text-[10px]
                text-slate-500

                dark:text-white/45
              "
            >
              {title}
            </p>
          </div>

          {/* CLOSE */}

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              shrink-0

              items-center
              justify-center

              rounded-xl

              border
              border-slate-200

              bg-slate-50

              text-slate-700

              transition

              hover:border-violet-300
              hover:bg-violet-50
              hover:text-violet-600

              dark:border-white/[0.10]
              dark:bg-white/[0.04]
              dark:text-white/70

              dark:hover:border-violet-400/40
              dark:hover:bg-violet-500/10
              dark:hover:text-violet-300
            "
            aria-label="Close comments"
          >
            <X size={16} strokeWidth={1.8} />
          </button>
        </div>

        {/* ===================================================
            COMMENTS AREA
           =================================================== */}

        <div className="mt-5 grid gap-3">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="
                    rounded-[16px]

                    border
                    border-slate-200

                    bg-slate-50

                    p-4

                    dark:border-white/[0.08]
                    dark:bg-white/[0.035]
                  "
              >
                <div className="flex items-center justify-between gap-3">
                  <p
                    className="
                        font-body
                        text-[11px]
                        font-semibold

                        text-slate-900

                        dark:text-white
                      "
                  >
                    {comment.name}
                  </p>

                  <span
                    className="
                        font-number
                        shrink-0

                        text-[8px]
                        text-slate-400

                        dark:text-white/35
                      "
                  >
                    {new Date(comment.createdAt).toLocaleDateString(
                      locale === "km" ? "km-KH" : "en-US",
                    )}
                  </span>
                </div>

                <p
                  className={cn(
                    "mt-2 whitespace-pre-wrap text-[11px] text-slate-600 dark:text-white/55",

                    khmer
                      ? "khmer-input-value font-normal leading-6"
                      : "font-body leading-5",
                  )}
                >
                  {comment.message}
                </p>
              </div>
            ))
          ) : (
            /* ===============================================
               EMPTY COMMENTS
               =============================================== */

            <div
              className="
                flex
                min-h-[86px]

                items-center
                justify-center

                rounded-[16px]

                border
                border-dashed
                border-slate-300

                bg-slate-50/80

                px-4

                text-center

                dark:border-white/[0.10]
                dark:bg-white/[0.025]
              "
            >
              <p
                className={cn(
                  "text-[10px] text-slate-500 dark:text-white/40",

                  khmer
                    ? "khmer-input-value font-normal leading-6"
                    : "font-body",
                )}
              >
                {khmer
                  ? "មិនទាន់មានមតិយោបល់ដែលបានអនុម័ត។"
                  : "No approved comments yet."}
              </p>
            </div>
          )}
        </div>

        {/* ===================================================
            DIVIDER
           =================================================== */}

        <div
          className="
            my-5
            h-px

            bg-slate-200

            dark:bg-white/[0.08]
          "
        />

        {/* ===================================================
            FORM
           =================================================== */}

        <form ref={formRef} action={submitComment} className="grid gap-3">
          {/* NAME + EMAIL */}

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="name"
              required
              placeholder={khmer ? "ឈ្មោះ" : "Name"}
              className="
                h-11
                min-w-0

                rounded-[14px]

                border
                border-slate-200

                bg-slate-50

                px-4

                font-body
                text-[12px]
                text-slate-900

                outline-none

                transition

                placeholder:text-slate-400

                hover:border-slate-300

                focus:border-violet-500
                focus:bg-white
                focus:ring-2
                focus:ring-violet-500/10

                dark:border-white/[0.09]
                dark:bg-white/[0.035]
                dark:text-white

                dark:placeholder:text-white/30

                dark:hover:border-white/[0.15]

                dark:focus:border-violet-400
                dark:focus:bg-white/[0.045]
                dark:focus:ring-violet-500/15
              "
            />

            <input
              name="email"
              type="email"
              placeholder={khmer ? "អ៊ីមែល (ស្រេចចិត្ត)" : "Email (optional)"}
              className="
                h-11
                min-w-0

                rounded-[14px]

                border
                border-slate-200

                bg-slate-50

                px-4

                font-body
                text-[12px]
                text-slate-900

                outline-none

                transition

                placeholder:text-slate-400

                hover:border-slate-300

                focus:border-violet-500
                focus:bg-white
                focus:ring-2
                focus:ring-violet-500/10

                dark:border-white/[0.09]
                dark:bg-white/[0.035]
                dark:text-white

                dark:placeholder:text-white/30

                dark:hover:border-white/[0.15]

                dark:focus:border-violet-400
                dark:focus:bg-white/[0.045]
                dark:focus:ring-violet-500/15
              "
            />
          </div>

          {/* MESSAGE */}

          <textarea
            name="message"
            required
            placeholder={khmer ? "សរសេរមតិយោបល់..." : "Write a comment..."}
            className="
              min-h-[115px]

              resize-y

              rounded-[14px]

              border
              border-slate-200

              bg-slate-50

              px-4
              py-3.5

              font-body
              text-[12px]
              text-slate-900

              outline-none

              transition

              placeholder:text-slate-400

              hover:border-slate-300

              focus:border-violet-500
              focus:bg-white
              focus:ring-2
              focus:ring-violet-500/10

              dark:border-white/[0.09]
              dark:bg-white/[0.035]
              dark:text-white

              dark:placeholder:text-white/30

              dark:hover:border-white/[0.15]

              dark:focus:border-violet-400
              dark:focus:bg-white/[0.045]
              dark:focus:ring-violet-500/15
            "
          />

          {/* =================================================
              SUCCESS / ERROR
             ================================================= */}

          {commentResult ? (
            <div
              className={cn(
                `
                  rounded-xl
                  border
                  px-3.5
                  py-2.5

                  font-body
                  text-[10px]
                  leading-5
                `,

                commentResult.success
                  ? `
                      border-emerald-200
                      bg-emerald-50
                      text-emerald-700

                      dark:border-emerald-500/20
                      dark:bg-emerald-500/10
                      dark:text-emerald-300
                    `
                  : `
                      border-red-200
                      bg-red-50
                      text-red-600

                      dark:border-red-500/20
                      dark:bg-red-500/10
                      dark:text-red-300
                    `,
              )}
            >
              {commentResult.success
                ? khmer
                  ? "បានផ្ញើមតិយោបល់។ វានឹងបង្ហាញបន្ទាប់ពីអ្នកគ្រប់គ្រងអនុម័ត។"
                  : "Comment submitted. It will appear after approval."
                : commentResult.message}
            </div>
          ) : null}

          {/* =================================================
              SUBMIT
             ================================================= */}

          <button
            type="submit"
            disabled={pending}
            className="
              font-body

              mt-1

              inline-flex
              h-11

              items-center
              justify-center
              gap-2

              justify-self-end

              rounded-[14px]

              bg-gradient-to-r
              from-violet-600
              via-purple-600
              to-fuchsia-600

              px-5

              text-[11px]
              font-semibold
              text-white

              shadow-[0_8px_24px_rgba(124,58,237,0.24)]

              transition

              hover:-translate-y-0.5
              hover:brightness-110
              hover:shadow-[0_12px_28px_rgba(124,58,237,0.30)]

              disabled:cursor-not-allowed
              disabled:translate-y-0
              disabled:opacity-60

              dark:from-violet-500
              dark:via-purple-500
              dark:to-fuchsia-500

              dark:shadow-[0_8px_28px_rgba(139,92,246,0.20)]
            "
          >
            <Send size={14} strokeWidth={1.8} />

            {pending
              ? khmer
                ? "កំពុងផ្ញើ..."
                : "Sending..."
              : khmer
                ? "ផ្ញើ"
                : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   GALLERY ACTIONS
   ========================================================= */

function GalleryActions({
  liked,
  bookmarked,
  likeCount,
  commentCount,
  pending,
  onLike,
  onComment,
  onShare,
  onBookmark,
}: {
  liked: boolean;
  bookmarked: boolean;
  likeCount: number;
  commentCount: number;
  pending: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onBookmark: () => void;
}) {
  return (
    <div className="flex h-[46px] items-center justify-between px-3.5">
      {/* LEFT */}

      <div className="flex items-center gap-3.5">
        {/* LIKE */}

        <button
          type="button"
          disabled={pending}
          onClick={onLike}
          aria-label="Like"
          className={cn(
            "flex items-center gap-1 transition hover:scale-110 hover:text-violet-600 disabled:opacity-50 dark:hover:text-cyan-300",

            liked ? "text-rose-500" : "text-[var(--portfolio-text)]",
          )}
        >
          <Heart
            size={18}
            strokeWidth={1.9}
            fill={liked ? "currentColor" : "none"}
          />

          {likeCount > 0 ? (
            <span className="font-number text-[9px]">{likeCount}</span>
          ) : null}
        </button>

        {/* COMMENT */}

        <button
          type="button"
          onClick={onComment}
          aria-label="Comments"
          className="flex items-center gap-1 text-[var(--portfolio-text)] transition hover:scale-110 hover:text-violet-600 dark:hover:text-cyan-300"
        >
          <MessageCircle size={18} strokeWidth={1.9} />

          {commentCount > 0 ? (
            <span className="font-number text-[9px]">{commentCount}</span>
          ) : null}
        </button>

        {/* SHARE */}

        <button
          type="button"
          onClick={onShare}
          aria-label="Share"
          className="text-[var(--portfolio-text)] transition hover:scale-110 hover:text-violet-600 dark:hover:text-cyan-300"
        >
          <Send size={18} strokeWidth={1.9} />
        </button>
      </div>

      {/* BOOKMARK */}

      <button
        type="button"
        onClick={onBookmark}
        aria-label="Bookmark"
        className={cn(
          "transition hover:scale-110 hover:text-violet-600 dark:hover:text-cyan-300",

          bookmarked
            ? "text-violet-600 dark:text-cyan-300"
            : "text-[var(--portfolio-text)]",
        )}
      >
        <Bookmark
          size={18}
          strokeWidth={1.9}
          fill={bookmarked ? "currentColor" : "none"}
        />
      </button>
    </div>
  );
}

/* =========================================================
   DEFAULT BUTTON
   ========================================================= */

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
          ? "bg-rose-500/10 text-rose-500"
          : "text-[var(--portfolio-muted)] hover:bg-[var(--portfolio-chip)] hover:text-[var(--portfolio-text)]",
      )}
    >
      <Icon size={13} fill={active ? "currentColor" : "none"} />

      {label}
    </button>
  );
}
