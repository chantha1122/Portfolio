"use client";

import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Maximize2,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

type ProjectImage = {
  id: number;

  fileUrl: string;

  captionEn: string | null;

  captionKm: string | null;
};

type Props = {
  locale: "en" | "km";

  title: string;

  images: ProjectImage[];
};

export default function ProjectImageGallery({ locale, title, images }: Props) {
  const khmer = locale === "km";

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const oldOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? null
            : (current - 1 + images.length) % images.length,
        );
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % images.length,
        );
      }
    }

    window.addEventListener("keydown", keydown);

    return () => {
      document.body.style.overflow = oldOverflow;

      window.removeEventListener("keydown", keydown);
    };
  }, [activeIndex, images.length]);

  if (images.length === 0) {
    return null;
  }

  const activeImage = activeIndex === null ? null : images[activeIndex];

  return (
    <>
      <section className="portfolio-panel mt-6 overflow-hidden p-5 sm:p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--portfolio-accent-soft)] text-[var(--portfolio-cyan)]">
            <ImageIcon size={17} />
          </div>

          <div>
            <p className="font-body text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--portfolio-cyan)]">
              {khmer ? "រូបភាពគម្រោង" : "PROJECT GALLERY"}
            </p>

            <h2
              className={
                khmer
                  ? "khmer-input-value mt-1 text-[23px] font-normal leading-9 text-[var(--portfolio-text)]"
                  : "font-display mt-1 text-[30px] leading-none text-[var(--portfolio-text)]"
              }
            >
              {khmer ? "រូបភាពបន្ថែម" : "Inside the Project"}
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-[var(--portfolio-border)] bg-[var(--portfolio-chip)] text-left"
            >
              <img
                src={image.fileUrl}
                alt={`${title} screenshot ${index + 1}`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70 transition group-hover:opacity-90" />

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                <p className="font-number text-[9px] text-white/75">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-black/35 text-white backdrop-blur-md">
                  <Maximize2 size={13} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {activeImage ? (
        <div
          className="fixed inset-0 z-[230] flex items-center justify-center bg-black/90 p-3 backdrop-blur-md sm:p-6"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveIndex(null);
            }
          }}
        >
          <div className="flex h-full max-h-[94vh] w-full max-w-[1280px] flex-col">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-body truncate text-[12px] font-semibold text-white">
                  {title}
                </p>

                <p className="font-number mt-1 text-[9px] text-white/55">
                  {String((activeIndex ?? 0) + 1).padStart(2, "0")} /{" "}
                  {String(images.length).padStart(2, "0")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/15"
              >
                <X size={17} />
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/35">
              <img
                src={activeImage.fileUrl}
                alt={title}
                className="h-full w-full object-contain"
              />

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((current) =>
                        current === null
                          ? null
                          : (current - 1 + images.length) % images.length,
                      )
                    }
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-md transition hover:bg-black/65"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((current) =>
                        current === null ? null : (current + 1) % images.length,
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-md transition hover:bg-black/65"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
