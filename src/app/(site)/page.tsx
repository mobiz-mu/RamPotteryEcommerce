import type { Metadata } from "next";

import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import CategoryExplorer from "@/components/home/CategoryExplorer";
import CategoryRow from "@/components/home/CategoryRow";
import OurStory from "@/components/home/OurStory";
import BlogRow from "@/components/home/BlogRow";
import OurClients from "@/components/home/OurClients";
import Newsletter from "@/components/home/Newsletter";
import GoogleReviewsStrip from "@/components/home/GoogleReviewsStrip";

const siteUrl = "https://rampottery.mu";

export const metadata: Metadata = {
  title: "Ram Pottery Mauritius | Handmade Pottery, Ceramics & Artisan Gifts",
  description:
    "Discover Ram Pottery Mauritius — premium handmade pottery, ceramics, artisan gifts, workshops and handcrafted pieces made with heritage, elegance and local craftsmanship.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Ram Pottery Mauritius | Handmade Pottery & Ceramics",
    description:
      "Shop premium handmade pottery, ceramics, artisan gifts and handcrafted pieces from Ram Pottery Mauritius.",
    url: siteUrl,
    siteName: "Ram Pottery",
    type: "website",
    locale: "en_MU",
    images: [
      {
        url: `${siteUrl}/images/videos/hero/hero-video-poster.jpg`,
        width: 1200,
        height: 630,
        alt: "Ram Pottery Mauritius handmade pottery and ceramics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ram Pottery Mauritius | Handmade Pottery & Ceramics",
    description:
      "Premium handmade pottery, ceramics and artisan gifts crafted in Mauritius.",
    images: [`${siteUrl}/images/videos/hero/hero-video-poster.jpg`],
  },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Ram Pottery",
      url: siteUrl,
      logo: `${siteUrl}/images/logo.png`,
      sameAs: [],
    },
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#localbusiness`,
      name: "Ram Pottery",
      url: siteUrl,
      image: `${siteUrl}/images/videos/hero/hero-video-poster.jpg`,
      telephone: "+23057788884",
      address: {
        "@type": "PostalAddress",
        addressCountry: "MU",
      },
      areaServed: {
        "@type": "Country",
        name: "Mauritius",
      },
      priceRange: "$$",
      description:
        "Premium handmade pottery, ceramics, artisan gifts and pottery workshops in Mauritius.",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Ram Pottery",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/shop?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "Ram Pottery Mauritius | Handmade Pottery, Ceramics & Artisan Gifts",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#localbusiness`,
      },
      description:
        "Discover Ram Pottery Mauritius — premium handmade pottery, ceramics, artisan gifts, workshops and handcrafted pieces made with heritage, elegance and local craftsmanship.",
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <main className="min-h-screen bg-[#fbf7ef] text-stone-950">
        <Hero />

        <div className="relative z-10">
          <TrustStrip />
          <CategoryExplorer />
          <CategoryRow />
          <OurStory />
          <OurClients />
          <BlogRow />
          <GoogleReviewsStrip />
          <Newsletter />
        </div>
      </main>
    </>
  );
}