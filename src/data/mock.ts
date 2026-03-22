import type { BlogPost, Category, HeroSlide, Product } from "@/types";

export const categories: Category[] = [
  {
    id: "1",
    name: "Ceramic Tulsi Pot",
    slug: "ceramic-tulsi-pot",
    imageUrl: "/images/categories/ceramic-tulsi-pot.jpg",
    featured: true,
    description: "Handcrafted tulsi pots with elegant ceramic finishing.",
  },
  {
    id: "2",
    name: "Ceramic Vase",
    slug: "ceramic-vase",
    imageUrl: "/images/categories/ceramic-vase.jpg",
    featured: true,
    description: "Decorative premium ceramic vases.",
  },
  {
    id: "3",
    name: "Clay Cookingware",
    slug: "clay-cookingware",
    imageUrl: "/images/categories/clay-cookingware.jpg",
    featured: true,
    description: "Traditional clay cookware for authentic cooking.",
  },
  {
    id: "4",
    name: "Clay Flower Pot",
    slug: "clay-flower-pot",
    imageUrl: "/images/categories/clay-flower-pot.jpg",
    featured: true,
    description: "Beautiful handcrafted flower pots for indoor and outdoor spaces.",
  },
  {
    id: "5",
    name: "Clay Matka",
    slug: "clay-matka",
    imageUrl: "/images/categories/clay-matka.jpg",
  },
  {
    id: "6",
    name: "Clay Murti",
    slug: "clay-murti",
    imageUrl: "/images/categories/clay-murti.jpg",
  },
  {
    id: "7",
    name: "Clay Pooja Products",
    slug: "clay-pooja-products",
    imageUrl: "/images/categories/clay-pooja-products.jpg",
  },
  {
    id: "8",
    name: "Clay Souvenir",
    slug: "clay-souvenir",
    imageUrl: "/images/categories/clay-souvenir.jpg",
  },
  {
    id: "9",
    name: "Clay Wind Chime",
    slug: "clay-wind-chime",
    imageUrl: "/images/categories/clay-wind-chime.jpg",
  },
  {
    id: "10",
    name: "Earthen Clay Lamp",
    slug: "earthen-clay-lamp",
    imageUrl: "/images/categories/earthen-clay-lamp.jpg",
  },
  {
    id: "11",
    name: "Other Category",
    slug: "other-category",
    imageUrl: "/images/categories/other-category.jpg",
  },
  {
    id: "12",
    name: "Painting & Wax Lamp",
    slug: "painting-wax-lamp",
    imageUrl: "/images/categories/painting-wax-lamp.jpg",
  },
  {
    id: "13",
    name: "Tableware",
    slug: "tableware",
    imageUrl: "/images/categories/tableware.jpg",
  },
  {
    id: "14",
    name: "Terracotta Home Decor",
    slug: "terracotta-home-decor",
    imageUrl: "/images/categories/terracotta-home-decor.jpg",
  },
];

export const heroSlides: HeroSlide[] = [
  {
    id: "1",
    title: "Handcrafted Pottery, Timeless Elegance",
    subtitle: "Premium ceramic and clay creations proudly crafted for Mauritius.",
    desktopImage: "/images/hero/hero-desktop-1.jpg",
    mobileImage: "/images/hero/hero-mobile-1.jpg",
    ctaLabel: "Shop Now",
    ctaLink: "/shop",
  },
];

export const products: Product[] = [
  {
    id: "1",
    title: "Frankincense Dhoop Dish - Royal Blue",
    slug: "frankincense-dhoop-dish-royal-blue",
    shortDescription: "Elegant handcrafted incense accessory.",
    description:
      "A refined handcrafted pottery accessory designed to elevate prayer spaces and home interiors with timeless elegance.",
    price: 450,
    salePrice: 350,
    stockQty: 25,
    sku: "RP-001",
    badge: "sale",
    category: categories[6],
    images: [
      {
        id: "1",
        imageUrl: "/images/products/product-1.jpg",
        alt: "Frankincense Dhoop Dish - Royal Blue",
        isPrimary: true,
      },
    ],
  },
  {
    id: "2",
    title: "Incense Stick Holder - Satin Blue, Beige",
    slug: "incense-stick-holder-satin-blue-beige",
    shortDescription: "Premium decorative incense holder.",
    description:
      "A premium artisan-crafted incense holder made to combine utility, beauty, and a calming handcrafted presence.",
    price: 1500,
    salePrice: 1050,
    stockQty: 14,
    sku: "RP-002",
    badge: "best-seller",
    category: categories[6],
    images: [
      {
        id: "2",
        imageUrl: "/images/products/product-2.jpg",
        alt: "Incense Stick Holder - Satin Blue, Beige",
        isPrimary: true,
      },
    ],
  },
  {
    id: "3",
    title: "Take Candle Diffuser - Royal Blue",
    slug: "take-candle-diffuser-royal-blue",
    shortDescription: "Luxury handcrafted diffuser piece.",
    description:
      "A handcrafted clay diffuser designed for ambient beauty and a calm luxury atmosphere in modern interiors.",
    price: 1000,
    salePrice: 650,
    stockQty: 10,
    sku: "RP-003",
    badge: "sale",
    category: categories[13],
    images: [
      {
        id: "3",
        imageUrl: "/images/products/product-3.jpg",
        alt: "Take Candle Diffuser - Royal Blue",
        isPrimary: true,
      },
    ],
  },
  {
    id: "4",
    title: "Incense Stick Holder - Beige",
    slug: "incense-stick-holder-beige",
    shortDescription: "Minimal handcrafted holder.",
    description:
      "A clean and elegant handcrafted incense stick holder with a soft neutral finish for premium spaces.",
    price: 1500,
    salePrice: 1050,
    stockQty: 18,
    sku: "RP-004",
    badge: "sale",
    category: categories[6],
    images: [
      {
        id: "4",
        imageUrl: "/images/products/product-4.jpg",
        alt: "Incense Stick Holder - Beige",
        isPrimary: true,
      },
    ],
  },
  {
    id: "5",
    title: "Clay Flower Pot - Earth Finish",
    slug: "clay-flower-pot-earth-finish",
    shortDescription: "Elegant premium clay planter.",
    description:
      "A beautifully crafted clay flower pot that brings warmth and natural style to homes, balconies, and gardens.",
    price: 900,
    stockQty: 30,
    sku: "RP-005",
    badge: "new",
    category: categories[3],
    images: [
      {
        id: "5",
        imageUrl: "/images/products/product-5.jpg",
        alt: "Clay Flower Pot - Earth Finish",
        isPrimary: true,
      },
    ],
  },
  {
    id: "6",
    title: "Ceramic Vase - Ivory Red Accent",
    slug: "ceramic-vase-ivory-red-accent",
    shortDescription: "Elegant decorative ceramic vase.",
    description:
      "A premium ceramic vase that blends modern luxury and timeless pottery artistry for stylish interiors.",
    price: 1800,
    stockQty: 12,
    sku: "RP-006",
    badge: "new",
    category: categories[1],
    images: [
      {
        id: "6",
        imageUrl: "/images/products/product-6.jpg",
        alt: "Ceramic Vase - Ivory Red Accent",
        isPrimary: true,
      },
    ],
  },
  {
    id: "7",
    title: "Terracotta Table Accent",
    slug: "terracotta-table-accent",
    shortDescription: "Luxury handcrafted table décor piece.",
    description:
      "A premium terracotta home accent designed to give your table styling warmth, texture, and artisanal beauty.",
    price: 1250,
    stockQty: 20,
    sku: "RP-007",
    badge: "best-seller",
    category: categories[13],
    images: [
      {
        id: "7",
        imageUrl: "/images/products/product-7.jpg",
        alt: "Terracotta Table Accent",
        isPrimary: true,
      },
    ],
  },
  {
    id: "8",
    title: "Clay Cooking Pot - Rustic Finish",
    slug: "clay-cooking-pot-rustic-finish",
    shortDescription: "Traditional clay cookingware.",
    description:
      "A handcrafted clay cooking pot made for authentic cooking, traditional flavor, and beautiful presentation.",
    price: 2100,
    stockQty: 8,
    sku: "RP-008",
    badge: "best-seller",
    category: categories[2],
    images: [
      {
        id: "8",
        imageUrl: "/images/products/product-8.jpg",
        alt: "Clay Cooking Pot - Rustic Finish",
        isPrimary: true,
      },
    ],
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "How Handcrafted Pottery Elevates Your Home",
    slug: "how-handcrafted-pottery-elevates-your-home",
    excerpt:
      "Discover how artisanal clay and ceramic pieces bring warmth, texture, and timeless elegance into your interior.",
    featuredImage: "/images/blogs/blog-1.jpg",
    publishedAt: "2026-03-19",
  },
  {
    id: "2",
    title: "Why Clay Cookingware Is Making a Premium Return",
    slug: "why-clay-cookingware-is-making-a-premium-return",
    excerpt:
      "From tradition to luxury dining aesthetics, clay cookware is becoming a timeless statement again.",
    featuredImage: "/images/blogs/blog-2.jpg",
    publishedAt: "2026-03-18",
  },
  {
    id: "3",
    title: "Decorating with Terracotta in a Modern Home",
    slug: "decorating-with-terracotta-in-a-modern-home",
    excerpt:
      "Simple premium styling ideas to use terracotta accents in modern Mauritian spaces.",
    featuredImage: "/images/blogs/blog-3.jpg",
    publishedAt: "2026-03-17",
  },
];