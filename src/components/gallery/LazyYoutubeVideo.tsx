"use client";

import { Play } from "lucide-react";
import { useState } from "react";

function getYoutubeEmbedUrl(videoId: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export default function LazyYoutubeVideo({
  youtubeId,
  title,
}: {
  youtubeId: string;
  title: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px]">
      {isPlaying ? (
        <iframe
          src={getYoutubeEmbedUrl(youtubeId)}
          title={title}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 block h-full w-full overflow-hidden"
        >
          <img
            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
            alt={title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-red-900 shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition duration-300 group-hover:scale-110">
            <Play className="ml-1 h-6 w-6 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}