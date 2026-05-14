import Image from "next/image";

type ProductImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

export default function ProductImage({
  src,
  alt,
  priority = false,
  className = "",
}: ProductImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      quality={70}
      loading={priority ? "eager" : "lazy"}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}