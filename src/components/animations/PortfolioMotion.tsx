"use client";

import { useEffect } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Lenis from "lenis";

export default function PortfolioMotion() {
  useEffect(() => {
    const site = document.querySelector<HTMLElement>(".portfolio-site");

    if (!site) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      return;
    }

    /* =====================================================
       GSAP
       ===================================================== */

    gsap.registerPlugin(ScrollTrigger);

    /* =====================================================
       LENIS
       Smooth continuous page movement
       ===================================================== */

    const lenis = new Lenis({
      smoothWheel: true,

      /*
       * Smaller = smoother / more cinematic.
       *
       * 0.07 - 0.10 is a good range.
       */
      lerp: 0.085,

      wheelMultiplier: 0.88,

      touchMultiplier: 1,

      syncTouch: false,

      autoRaf: false,
    });

    const handleLenisScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on("scroll", handleLenisScroll);

    /* =====================================================
       CONNECT LENIS TO GSAP RAF
       ===================================================== */

    const gsapTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(gsapTick);

    /*
     * Prevent GSAP trying to compensate
     * after browser/tab lag.
     */
    gsap.ticker.lagSmoothing(0);

    /* =====================================================
       SECTION MOTION
       ===================================================== */

    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".portfolio-section");

      sections.forEach((section) => {
        /*
         * Hero already has its own first-load
         * animation. Do not apply section reveal
         * to the hero.
         */
        if (section.closest(".portfolio-hero")) {
          return;
        }

        /*
         * Animate only top-level blocks.
         *
         * Important:
         * we DO NOT animate individual achievement
         * cards, gallery cards, Journey internals,
         * Teaching marquee, etc.
         */
        const blocks = Array.from(section.children).filter(
          (child): child is HTMLElement =>
            child instanceof HTMLElement &&
            child.dataset.motionIgnore !== "true",
        );

        if (blocks.length === 0) {
          return;
        }

        /* =============================================
               ENTER
               Scroll-linked, not trigger-and-play
               ============================================= */

        gsap.fromTo(
          blocks,
          {
            y: 58,

            opacity: 0.12,

            scale: 0.985,
          },
          {
            y: 0,

            opacity: 1,

            scale: 1,

            stagger: 0.055,

            ease: "none",

            scrollTrigger: {
              trigger: section,

              /*
               * Starts while section is still
               * near bottom of viewport.
               */
              start: "top 96%",

              /*
               * Fully settled around middle-lower
               * part of viewport.
               */
              end: "top 58%",

              /*
               * THIS is what makes it feel like
               * the reference video.
               */
              scrub: 0.65,

              invalidateOnRefresh: true,
            },
          },
        );

        /* =============================================
               EXIT
               Small movement as section leaves screen
               ============================================= */

        gsap.to(blocks, {
          y: -20,

          opacity: 0.72,

          scale: 0.992,

          stagger: 0.025,

          ease: "none",

          scrollTrigger: {
            trigger: section,

            start: "bottom 34%",

            end: "bottom 4%",

            scrub: 0.5,

            invalidateOnRefresh: true,
          },
        });
      });

      /* =================================================
           SMALL SECTION LABEL MOTION
           ================================================= */

      const labels = gsap.utils.toArray<HTMLElement>(
        ".portfolio-section > div:first-child",
      );

      labels.forEach((label) => {
        if (label.closest(".portfolio-hero")) {
          return;
        }

        gsap.fromTo(
          label,
          {
            x: -14,
          },
          {
            x: 0,

            ease: "none",

            scrollTrigger: {
              trigger: label,

              start: "top 95%",

              end: "top 68%",

              scrub: 0.55,
            },
          },
        );
      });
    }, site);

    /* =====================================================
       SMOOTH NAVBAR / BUTTON ANCHORS
       ===================================================== */

    const anchorLinks = Array.from(
      site.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
    );

    const listeners: Array<{
      link: HTMLAnchorElement;

      handler: (event: MouseEvent) => void;
    }> = [];

    anchorLinks.forEach((link) => {
      const handler = (event: MouseEvent) => {
        const href = link.getAttribute("href");

        if (!href || href === "#") {
          return;
        }

        const target = document.querySelector<HTMLElement>(href);

        if (!target) {
          return;
        }

        event.preventDefault();

        /*
         * Smooth movement when user clicks
         * About / Skills / Projects / Gallery etc.
         */
        lenis.scrollTo(target, {
          offset: -100,

          duration: 1.2,

          easing: (value) => 1 - Math.pow(1 - value, 4),
        });

        /*
         * Update URL hash without browser
         * performing another scroll.
         */
        window.history.replaceState(null, "", href);
      };

      link.addEventListener("click", handler);

      listeners.push({
        link,
        handler,
      });
    });

    /* =====================================================
       REFRESH AFTER PAGE IS READY
       ===================================================== */

    const refreshFrame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    /* =====================================================
       CLEANUP
       ===================================================== */

    return () => {
      cancelAnimationFrame(refreshFrame);

      listeners.forEach(({ link, handler }) => {
        link.removeEventListener("click", handler);
      });

      context.revert();

      lenis.off("scroll", handleLenisScroll);

      lenis.destroy();

      gsap.ticker.remove(gsapTick);

      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);

  return null;
}
