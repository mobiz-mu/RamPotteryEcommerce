import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants/site";

type CreatePageMetadataArgs = {
  title: string;
  description: string;
  path?: string;
  image?: string;
};

export function createPageMetadata({
  title,
  description,
  path = "",
  image = "/brand/logo.png",
}: CreatePageMetadataArgs): Metadata {
  const url = `${SITE_CONFIG.url}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}