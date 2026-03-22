export const SITE_CONFIG = {
  name: "Ram Pottery",
  shortName: "Ram Pottery",
  description:
    "Premium handcrafted pottery, terracotta décor, clay products, pooja items, vases, cookingware, and home accents in Mauritius.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "Info@rampottery.mu",
  phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "23057788884",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "23057788884",
  address:
    process.env.NEXT_PUBLIC_SUPPORT_ADDRESS ||
    "Robert Kennedy Street, Reunion Maurel, Petit Raffray, Mauritius",
  logo: "/brand/logo.png",
  social: {
    facebook: "#",
    instagram: "#",
    linkedin: "#",
    tiktok: "#",
  },
};