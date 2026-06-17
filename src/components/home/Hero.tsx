"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);

    if (!video || !section) return;

    const playVideo = async () => {
      if (reducedMotionMedia.matches) return;

      try {
        video.muted = true;
        video.playsInline = true;
        await video.play();
      } catch {
        // Mobile browsers sometimes wait until the video is ready.
      }
    };

    const pauseVideo = () => {
      if (!video.paused) {
        video.pause();
      }
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
        if (entry.isIntersecting) {
          void playVideo();
        } else {
          pauseVideo();
        }
      },
      {
        threshold: 0.25,
      },
    );

    observer.observe(section);

    video.addEventListener("canplay", playVideo);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    void playVideo();

    return () => {
      observer.disconnect();
      video.removeEventListener("canplay", playVideo);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-hero-title"
      className="relative isolate w-full overflow-hidden bg-white"
    >
      <h1 id="home-hero-title" className="sr-only">
        Ram Pottery Mauritius - Unique Handmade Pottery, Ceramics and Artisan Gifts
      </h1>

      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
          poster="/images/videos/hero/hero-video-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback"
          aria-hidden="true"
        >
          <source
            src="/images/videos/hero/ram-pottery-hero.mp4"
            type="video/mp4"
          />
        </video>

        <div className="pointer-events-none absolute inset-0 bg-black/25" />

        <div className="absolute inset-0 z-10 flex items-center justify-center px-5 text-center">
          <div className="flex max-w-4xl flex-col items-center justify-center">
            <p className="max-w-3xl text-balance [font-family:var(--font-quicksand),Quicksand,sans-serif] text-2xl font-bold leading-tight tracking-[-0.03em] text-white drop-shadow-[0_5px_28px_rgba(0,0,0,0.85)] min-[390px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              Unique Handmade Pieces for Every Occasion
            </p>

            <Link
              href="/shop"
              className="mt-5 inline-flex animate-[heroButtonPulse_2.4s_ease-in-out_infinite] items-center justify-center rounded-full border border-white/35 bg-white px-7 py-3 text-xs font-black uppercase tracking-[0.22em] text-neutral-950 shadow-[0_18px_60px_rgba(0,0,0,0.42)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f7ead7] hover:shadow-[0_22px_70px_rgba(0,0,0,0.48)] focus:outline-none focus:ring-4 focus:ring-white/35 sm:mt-6 sm:px-8 sm:py-3.5 sm:text-sm"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}