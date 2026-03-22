import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return [
    "",
    "/about",
    "/blogs",
    "/workshop",
    "/contact",
    "/shop",
    "/wishlist",
    "/cart",
    "/checkout",
    "/login",
    "/signup",
    "/privacy-policy",
    "/terms",
    "/shipping-returns",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}