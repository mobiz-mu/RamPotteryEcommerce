import type { Metadata } from "next";
import Image from "next/image";
import GalleryScroller from "@/components/gallery/GalleryScroller";

const siteUrl = "https://rampottery.mu";

export const metadata: Metadata = {
  title: "Ram Pottery Gallery | Exhibitions, Workshops & Events in Mauritius",
  description:
    "Explore the Ram Pottery gallery featuring exhibitions, school demonstrations, hotel showcases, artisan pottery displays and community events across Mauritius.",
  alternates: {
    canonical: `${siteUrl}/gallery`,
  },
  openGraph: {
    title: "Ram Pottery Gallery | Handmade Pottery Mauritius",
    description:
      "View Ram Pottery exhibitions, handcrafted ceramic collections, school demonstrations, hotel showcases and community events in Mauritius.",
    url: `${siteUrl}/gallery`,
    siteName: "Ram Pottery",
    type: "website",
    locale: "en_MU",
    images: [
      {
        url: `${siteUrl}/gallery/AZURI/azuri2.webp`,
        width: 1200,
        height: 630,
        alt: "Ram Pottery exhibition at Azuri Mauritius",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ram Pottery Gallery | Handmade Pottery Mauritius",
    description:
      "Explore Ram Pottery exhibitions, events and handcrafted pottery showcases across Mauritius.",
    images: [`${siteUrl}/gallery/AZURI/azuri2.webp`],
  },
};

type GalleryImage = {
  src: string;
  alt: string;
};

type GalleryVideo = {
  youtubeId: string;
  title: string;
  description: string;
};

type GallerySection = {
  folderName: string;
  displayTitle: string;
  description: string;
  videos?: GalleryVideo[];
  images: GalleryImage[];
};

const gallerySections: GallerySection[] = [
  {
    folderName: "AZURI",
    displayTitle: "AZURI",
    description:
      "A premium Ram Pottery exhibition showcase at Azuri Mauritius, featuring handmade pottery, clay décor and artisan ceramic pieces.",
    videos: [
      {
        youtubeId: "_O07dVIO86Q",
        title:
          "Ram Pottery Exhibition at Azuri Mauritius | Premium Handcrafted Pottery Showcase",
        description:
          "A refined exhibition moment from Ram Pottery at Azuri Mauritius, highlighting handmade ceramic artistry and local craftsmanship.",
      },
      {
        youtubeId: "ag10tcNb6DM",
        title:
          "Ram Pottery Exhibition at Azuri Mauritius | Premium Handcrafted Pottery Showcase",
        description:
          "A closer look at Ram Pottery’s handcrafted display and elegant pottery presentation at Azuri Mauritius.",
      },
      {
        youtubeId: "ydE1Wnunc9M",
        title:
          "Ram Pottery Exhibition at Azuri Mauritius | Premium Handcrafted Pottery Showcase",
        description:
          "Ram Pottery artisan ceramics showcased in a refined exhibition setting at Azuri Mauritius.",
      },
      {
        youtubeId: "QfAqU34n1es",
        title:
          "Ram Pottery Exhibition at Azuri Mauritius | Premium Handcrafted Pottery Showcase",
        description:
          "A beautiful pottery exhibition highlight from Ram Pottery’s premium handcrafted collection at Azuri Mauritius.",
      },
    ],
    images: [
      {
        src: "/gallery/AZURI/azuri2.webp",
        alt: "Ram Pottery handmade pottery exhibition at Azuri Mauritius",
      },
      {
        src: "/gallery/AZURI/azuri1.webp",
        alt: "Ram Pottery artisan ceramic display at Azuri Mauritius",
      },
    ],
  },
  {
    folderName: "Ganga-Talao-Grand-Bassin-Mautitius",
    displayTitle: "Ganga Talao Grand Bassin Mauritius",
    description:
      "Ram Pottery community service at Ganga Talao, Grand Bassin, Mauritius during Maha Shivratree, with tea and snacks distribution.",
    videos: [
      {
        youtubeId: "adwnpcKtm5c",
        title:
          "Ram Pottery Maha Shivratree Service at Ganga Talao | Tea & Snacks Distribution Mauritius",
        description:
          "A meaningful Ram Pottery community initiative at Ganga Talao for Maha Shivratree, sharing tea and snacks with devotees in Mauritius.",
      },
    ],
    images: [
      {
        src: "/gallery/Ganga-Talao-Grand-Bassin-Mautitius/GrandBassin2.webp",
        alt: "Ram Pottery tea and snacks distribution at Ganga Talao Mauritius",
      },
      {
        src: "/gallery/Ganga-Talao-Grand-Bassin-Mautitius/GrandBassin3.webp",
        alt: "Ram Pottery Maha Shivratree service at Grand Bassin Mauritius",
      },
      {
        src: "/gallery/Ganga-Talao-Grand-Bassin-Mautitius/GrandBassin4.webp",
        alt: "Ram Pottery community service during Maha Shivratree Mauritius",
      },
      {
        src: "/gallery/Ganga-Talao-Grand-Bassin-Mautitius/GrandBassin5.webp",
        alt: "Ram Pottery Ganga Talao Grand Bassin community event",
      },
      {
        src: "/gallery/Ganga-Talao-Grand-Bassin-Mautitius/GrandBassin6.webp",
        alt: "Ram Pottery volunteers at Ganga Talao Mauritius",
      },
      {
        src: "/gallery/Ganga-Talao-Grand-Bassin-Mautitius/GrandBassin7.webp",
        alt: "Ram Pottery tea service at Maha Shivratree Mauritius",
      },
      {
        src: "/gallery/Ganga-Talao-Grand-Bassin-Mautitius/GrandBassin8.webp",
        alt: "Ram Pottery snacks distribution Grand Bassin Mauritius",
      },
      {
        src: "/gallery/Ganga-Talao-Grand-Bassin-Mautitius/GrandBassin9.webp",
        alt: "Ram Pottery Ganga Talao Maha Shivratree event Mauritius",
      },
      {
        src: "/gallery/Ganga-Talao-Grand-Bassin-Mautitius/GrandBassin10.webp",
        alt: "Ram Pottery community initiative at Ganga Talao Mauritius",
      },
      {
        src: "/gallery/Ganga-Talao-Grand-Bassin-Mautitius/GrandBassin1.webp",
        alt: "Ram Pottery Grand Bassin Mauritius Maha Shivratree service",
      },
    ],
  },
  {
    folderName: "Greencoast-International-School",
    displayTitle: "Greencoast International School",
    description:
      "Ram Pottery school activity and creative pottery demonstration with students at Greencoast International School.",
    images: [
      {
        src: "/gallery/Greencoast-International-School/Greencoast-International-School4.webp",
        alt: "Ram Pottery pottery demonstration at Greencoast International School",
      },
      {
        src: "/gallery/Greencoast-International-School/Greencoast-International-School1.webp",
        alt: "Ram Pottery school pottery activity at Greencoast International School",
      },
      {
        src: "/gallery/Greencoast-International-School/Greencoast-International-School2.webp",
        alt: "Students discovering pottery with Ram Pottery Mauritius",
      },
      {
        src: "/gallery/Greencoast-International-School/Greencoast-International-School3.webp",
        alt: "Ram Pottery creative school workshop Mauritius",
      },
    ],
  },
  {
    folderName: "JobFairEvent",
    displayTitle: "Job Fair Event",
    description:
      "Ram Pottery participation at a local event, presenting handcrafted pottery and artisan ceramic creations.",
    images: [
      {
        src: "/gallery/JobFairEvent/JobFairEvent3.webp",
        alt: "Ram Pottery display at local event in Mauritius",
      },
      {
        src: "/gallery/JobFairEvent/JobFairEvent1.webp",
        alt: "Ram Pottery handmade pottery at event booth",
      },
      {
        src: "/gallery/JobFairEvent/JobFairEvent2.webp",
        alt: "Ram Pottery artisan ceramics event display Mauritius",
      },
    ],
  },
  {
    folderName: "Les-Super-Génies-Nursery-School-And-Crèche",
    displayTitle: "Les Super Génies Nursery School And Crèche",
    description:
      "Ram Pottery pottery demonstration for young learners at Les Super Génies Nursery School and Crèche.",
    images: [
      {
        src: "/gallery/Les-Super-Génies-Nursery-School-And-Crèche/Les-Super-Génies-Nursery-School-And-Crèche2.webp",
        alt: "Ram Pottery demonstration at Les Super Génies Nursery School and Crèche",
      },
      {
        src: "/gallery/Les-Super-Génies-Nursery-School-And-Crèche/Les-Super-Génies-Nursery-School-And-Crèche1.webp",
        alt: "Children learning pottery with Ram Pottery Mauritius",
      },
    ],
  },
  {
    folderName: "Radisson-blu",
    displayTitle: "Radisson Blu",
    description:
      "Ram Pottery hotel showcase featuring handmade pottery, ceramic décor and artisan collections at Radisson Blu.",
    images: [
      {
        src: "/gallery/Radisson-blu/Radisson-blu3.webp",
        alt: "Ram Pottery handmade pottery showcase at Radisson Blu",
      },
      {
        src: "/gallery/Radisson-blu/Radisson-blu4.webp",
        alt: "Ram Pottery ceramic décor display at Radisson Blu Mauritius",
      },
      {
        src: "/gallery/Radisson-blu/Radisson-blu5.webp",
        alt: "Ram Pottery artisan pottery collection at Radisson Blu",
      },
      {
        src: "/gallery/Radisson-blu/Radisson-blu1.webp",
        alt: "Ram Pottery hotel pottery exhibition Mauritius",
      },
      {
        src: "/gallery/Radisson-blu/Radisson-blu2.webp",
        alt: "Ram Pottery premium ceramic display at Radisson Blu",
      },
    ],
  },
];

const galleryJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Ram Pottery Gallery",
  url: `${siteUrl}/gallery`,
  description:
    "Gallery of Ram Pottery exhibitions, school demonstrations, hotel showcases and community events in Mauritius.",
  publisher: {
    "@type": "Organization",
    name: "Ram Pottery",
    url: siteUrl,
  },
  mainEntity: gallerySections.map((section) => ({
    "@type": "ImageGallery",
    name: section.displayTitle,
    description: section.description,
  })),
};

function getYoutubeEmbedUrl(videoId: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: videoId,
    controls: "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "0",
    iv_load_policy: "3",
    fs: "0",
  });

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

function VideoItem({
  video,
  priority = false,
}: {
  video: GalleryVideo;
  priority?: boolean;
}) {
  return (
    <article className="w-[76vw] shrink-0 sm:w-[280px] md:w-[310px] lg:w-[330px]">
      <div className="aspect-square w-full overflow-hidden rounded-[28px] border border-neutral-200 bg-neutral-950 shadow-[0_18px_60px_rgba(15,10,5,0.09)]">
        <iframe
          src={getYoutubeEmbedUrl(video.youtubeId)}
          title={video.title}
          className="h-full w-full"
          loading={priority ? "eager" : "lazy"}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      <h3 className="mt-4 line-clamp-2 text-sm font-black leading-5 tracking-[-0.02em] text-neutral-950">
        {video.title}
      </h3>

      <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-600">
        {video.description}
      </p>
    </article>
  );
}

function ImageItem({
  image,
  priority = false,
}: {
  image: GalleryImage;
  priority?: boolean;
}) {
  return (
    <div className="group relative aspect-square w-[62vw] shrink-0 overflow-hidden rounded-[28px] border border-neutral-200 bg-[#faf6ef] shadow-[0_14px_45px_rgba(15,10,5,0.06)] sm:w-[210px] md:w-[235px] lg:w-[255px]">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 640px) 62vw, (max-width: 1024px) 235px, 255px"
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        className="object-cover transition duration-700 group-hover:scale-110"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/16 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
    </div>
  );
}

function GallerySectionBlock({
  section,
  sectionIndex,
}: {
  section: GallerySection;
  sectionIndex: number;
}) {
  const videoCount = section.videos?.length || 0;
  const imageCount = section.images.length;

  return (
    <section className="mx-auto max-w-7xl border-t border-neutral-200 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-900">
            {section.folderName}
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-neutral-950 sm:text-3xl lg:text-4xl">
            {section.displayTitle}
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
            {section.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          {videoCount > 0 ? (
            <span className="rounded-full border border-red-900/10 bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-red-900">
              {videoCount} Video{videoCount > 1 ? "s" : ""}
            </span>
          ) : null}

          <span className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-600">
            {imageCount} Photo{imageCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {section.videos && section.videos.length > 0 ? (
        <div className="mt-8">
          <GalleryScroller label={`${section.displayTitle} videos`}>
            {section.videos.map((video, index) => (
              <VideoItem
                key={video.youtubeId}
                video={video}
                priority={sectionIndex === 0 && index === 0}
              />
            ))}
          </GalleryScroller>
        </div>
      ) : null}

      <div className="mt-8">
        <GalleryScroller label={`${section.displayTitle} photos`}>
          {section.images.map((image, index) => (
            <ImageItem
              key={`${section.folderName}-${image.src}`}
              image={image}
              priority={sectionIndex === 0 && index < 2}
            />
          ))}
        </GalleryScroller>
      </div>
    </section>
  );
}

export default function GalleryPage() {
  const totalPhotos = gallerySections.reduce(
    (sum, section) => sum + section.images.length,
    0,
  );

  const totalVideos = gallerySections.reduce(
    (sum, section) => sum + (section.videos?.length || 0),
    0,
  );

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(galleryJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 lg:px-8 lg:pb-8 lg:pt-10">
        <div className="overflow-hidden rounded-[34px] border border-neutral-200 bg-white px-5 py-7 shadow-[0_18px_70px_rgba(15,10,5,0.07)] sm:px-8 lg:px-10 lg:py-9">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.34em] text-red-900 sm:text-xs">
                Ram Pottery Gallery
              </p>

              <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-[-0.06em] text-neutral-950 sm:text-4xl lg:text-5xl">
                Our Gallery
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                Explore Ram Pottery exhibitions, handcrafted pottery showcases,
                school demonstrations, hotel displays and community moments
                across Mauritius.
              </p>
            </div>

            <div className="grid grid-cols-3 overflow-hidden rounded-[24px] border border-neutral-200 bg-[#faf8f4] shadow-sm">
              <div className="border-r border-neutral-200 px-4 py-4 text-center">
                <p className="text-lg font-black text-red-900">
                  {gallerySections.length}
                </p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-neutral-400">
                  Events
                </p>
              </div>

              <div className="border-r border-neutral-200 px-4 py-4 text-center">
                <p className="text-lg font-black text-red-900">{totalPhotos}</p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-neutral-400">
                  Photos
                </p>
              </div>

              <div className="px-4 py-4 text-center">
                <p className="text-lg font-black text-red-900">{totalVideos}</p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-neutral-400">
                  Videos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div>
        {gallerySections.map((section, index) => (
          <GallerySectionBlock
            key={section.folderName}
            section={section}
            sectionIndex={index}
          />
        ))}
      </div>
    </main>
  );
}