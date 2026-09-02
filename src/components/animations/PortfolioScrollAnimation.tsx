"use client";

import { useLayoutEffect } from "react";

const SECTION_SELECTOR = ".portfolio-section";

type Direction = "down" | "up";

export default function PortfolioScrollAnimation() {
  useLayoutEffect(() => {
    const portfolio = document.querySelector<HTMLElement>(".portfolio-site");

    if (!portfolio) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      return;
    }

    const sections = Array.from(
      portfolio.querySelectorAll<HTMLElement>(SECTION_SELECTOR),
    );

    if (sections.length === 0) {
      return;
    }

    let lastScrollY = window.scrollY;

    let direction: Direction = "down";

    let scrollFrame: number | null = null;

    /* =====================================================
       SCROLL DIRECTION
       ===================================================== */

    const updateDirection = () => {
      const currentScrollY = window.scrollY;

      const difference = currentScrollY - lastScrollY;

      /*
       * Ignore very tiny movement.
       */
      if (Math.abs(difference) > 2) {
        direction = difference > 0 ? "down" : "up";

        lastScrollY = currentScrollY;
      }

      scrollFrame = null;
    };

    const handleScroll = () => {
      if (scrollFrame !== null) {
        return;
      }

      scrollFrame = window.requestAnimationFrame(updateDirection);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    /* =====================================================
       ANIMATE ONE SECTION
       ===================================================== */

    const animateSection = (
      section: HTMLElement,
      currentDirection: Direction,
    ) => {
      /*
       * Animate direct children instead of the section itself.
       *
       * Important:
       * this prevents conflicts with:
       * - Achievement carousel transforms
       * - Gallery lightbox
       * - fixed overlays
       * - internal card animations
       */
      const children = Array.from(section.children).filter(
        (element): element is HTMLElement => element instanceof HTMLElement,
      );

      if (children.length === 0) {
        return;
      }

      const startY = currentDirection === "down" ? 34 : -34;

      children.forEach((element, index) => {
        /*
         * Avoid animating fixed overlays.
         */
        const position = window.getComputedStyle(element).position;

        if (position === "fixed") {
          return;
        }

        element.animate(
          [
            {
              opacity: 0,
              transform: `translate3d(0, ${startY}px, 0) scale(0.985)`,
              filter: "blur(3px)",
            },

            {
              opacity: 1,
              transform: "translate3d(0, 0, 0) scale(1)",
              filter: "blur(0px)",
            },
          ],
          {
            duration: 620,

            delay: Math.min(index, 6) * 70,

            easing: "cubic-bezier(0.22, 1, 0.36, 1)",

            fill: "both",
          },
        );
      });
    };

    /* =====================================================
       INTERSECTION OBSERVER
       ===================================================== */

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            /*
             * Prevent repeated animation while
             * section remains visible.
             */
            if (section.dataset.portfolioVisible === "true") {
              return;
            }

            section.dataset.portfolioVisible = "true";

            animateSection(section, direction);
          } else {
            /*
             * Reset when section leaves viewport.
             *
             * When user scrolls back, it can animate
             * again from the opposite direction.
             */
            section.dataset.portfolioVisible = "false";
          }
        });
      },
      {
        threshold: 0.12,

        rootMargin: "-5% 0px -8% 0px",
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();

      window.removeEventListener("scroll", handleScroll);

      if (scrollFrame !== null) {
        window.cancelAnimationFrame(scrollFrame);
      }
    };
  }, []);

  return null;
}
