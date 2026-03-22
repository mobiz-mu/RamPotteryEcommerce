export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl: string;
  featured?: boolean;
};

export type ProductImage = {
  id: string;
  imageUrl: string;
  alt?: string;
  isPrimary?: boolean;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price: number;
  salePrice?: number | null;
  sku?: string;
  stockQty?: number;
  badge?: "new" | "sale" | "best-seller";
  category?: Category;
  images: ProductImage[];
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  subtitle?: string;
  desktopImage: string;
  mobileImage: string;
  ctaLabel?: string;
  ctaLink?: string;
};

export type CartItem = {
  productId: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
};

export type CheckoutPayload = {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  area?: string;
  note?: string;
  deliveryMethod?: string;
  items: CartItem[];
};