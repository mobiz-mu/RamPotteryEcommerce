"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const desktopVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const getActiveVideo = () =>
      window.innerWidth < 768 ? mobileVideoRef.current : desktopVideoRef.current;

    const playActiveVideo = async () => {
      const activeVideo = getActiveVideo();
      const inactiveVideo =
        window.innerWidth < 768 ? desktopVideoRef.current : mobileVideoRef.current;

      inactiveVideo?.pause();

      try {
        await activeVideo?.play();
      } catch {
        // Browser may delay autoplay.
      }
    };

    playActiveVideo();

    const handleScroll = () => {
      const activeVideo = getActiveVideo();
      const currentY = window.scrollY;

      if (currentY > lastScrollY.current && currentY > 80) {
        activeVideo?.pause();
      } else if (currentY < lastScrollY.current) {
        playActiveVideo();
      }

      lastScrollY.current = currentY;
    };

    const handleResize = () => {
      playActiveVideo();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="relative isolate w-full overflow-hidden bg-black">
      <div className="relative aspect-[16/9] min-h-[560px] w-full sm:min-h-[620px] lg:min-h-[700px]">
        {/* Desktop video */}
        <video
          ref={desktopVideoRef}
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
          poster="/images/videos/hero/hero-video-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          controls={false}
        >
          <source src="/images/videos/hero/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Mobile video */}
        <video
          ref={mobileVideoRef}
          className="absolute inset-0 h-full w-full object-cover md:hidden"
          poster="/images/videos/hero/hero-video-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          controls={false}
        >
          <source src="/images/videos/hero/hero-video-mobile.mp4" type="video/mp4" />
        </video>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.02),rgba(0,0,0,0.12))]" />
      </div>
    </section>
  );
}