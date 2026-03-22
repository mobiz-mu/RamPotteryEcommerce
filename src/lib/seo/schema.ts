import { SITE_CONFIG } from "@/lib/constants/site";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.email,
    telephone: SITE_CONFIG.phone,
    logo: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
    sameAs: [
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.linkedin,
      SITE_CONFIG.social.tiktok,
    ].filter(Boolean),
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_CONFIG.name,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Robert Kennedy Street, Reunion Maurel",
      addressLocality: "Petit Raffray",
      addressCountry: "MU",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

type ProductSchemaArgs = {
  name: string;
  description: string;
  image: string;
  slug: string;
  price: number;
  currency?: string;
  availability?: "https://schema.org/InStock" | "https://schema.org/OutOfStock";
};

export function productSchema({
  name,
  description,
  image,
  slug,
  price,
  currency = "MUR",
  availability = "https://schema.org/InStock",
}: ProductSchemaArgs) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: [`${SITE_CONFIG.url}${image}`],
    brand: {
      "@type": "Brand",
      name: SITE_CONFIG.name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: currency,
      price,
      availability,
      url: `${SITE_CONFIG.url}/products/${slug}`,
    },
  };
}

type ArticleSchemaArgs = {
  title: string;
  description: string;
  slug: string;
  image: string;
  publishedAt: string;
};

export function articleSchema({
  title,
  description,
  slug,
  image,
  publishedAt,
}: ArticleSchemaArgs) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: [`${SITE_CONFIG.url}${image}`],
    datePublished: publishedAt,
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
      },
    },
    mainEntityOfPage: `${SITE_CONFIG.url}/blogs/${slug}`,
  };
}