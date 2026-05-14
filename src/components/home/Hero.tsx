"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastScrollY = useRef(0);
  const isVisible = useRef(true);

  useEffect(() => {
    const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);

    const pauseVideo = () => {
      const video = videoRef.current;
      if (!video || video.paused) return;
      video.pause();
    };

    const playVideo = async () => {
      const video = videoRef.current;

      if (!video || reducedMotionMedia.matches || !isVisible.current) return;

      try {
        await video.play();
      } catch {
        // Some browsers delay autoplay until the video is ready.
      }
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current;

      if (scrollingDown && currentY > 96) {
        pauseVideo();
      }

      if (!scrollingDown && isVisible.current) {
        void playVideo();
      }

      lastScrollY.current = currentY;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseVideo();
      } else {
        void playVideo();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;

        if (entry.isIntersecting) {
          void playVideo();
        } else {
          pauseVideo();
        }
      },
      {
        threshold: 0.2,
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    void playVideo();

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionMedia.addEventListener("change", playVideo);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionMedia.removeEventListener("change", playVideo);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-hero-title"
      className="relative isolate w-full overflow-hidden bg-[#080604]"
    >
      <h1 id="home-hero-title" className="sr-only">
        Ram Pottery Mauritius - Unique Handmade Pottery, Ceramics and Artisan
        Gifts
      </h1>

      <div className="relative h-[68svh] min-h-[430px] w-full overflow-hidden sm:h-[72svh] sm:min-h-[520px] md:h-[76vh] md:min-h-[600px] lg:h-[84vh] lg:min-h-[700px]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/images/videos/hero/hero-video-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          controls={false}
          aria-hidden="true"
          onEnded={(event) => {
            event.currentTarget.currentTime = 0;
            void event.currentTarget.play();
          }}
        >
          <source
            src="/images/videos/hero/ram-pottery-hero.mp4"
            type="video/mp4"
          />
        </video>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.20)_0%,rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.48)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#080604] via-[#080604]/45 to-transparent" />

        <div className="absolute inset-x-4 bottom-8 z-10 mx-auto flex max-w-5xl flex-col items-center text-center sm:bottom-10 md:bottom-12">
          <p className="max-w-3xl text-balance [font-family:var(--font-quicksand),Quicksand,sans-serif] text-2xl font-bold leading-tight tracking-[-0.03em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)] sm:text-4xl md:text-5xl lg:text-6xl">
            Unique Handmade Pieces for Every Occasion
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex animate-[heroButtonPulse_2.4s_ease-in-out_infinite] items-center justify-center rounded-full border border-white/25 bg-white px-7 py-3 text-sm font-black uppercase tracking-[0.18em] text-neutral-950 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f7ead7] hover:shadow-[0_22px_70px_rgba(0,0,0,0.45)] focus:outline-none focus:ring-4 focus:ring-white/35 sm:px-8 sm:py-3.5"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}