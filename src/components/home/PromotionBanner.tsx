// src/components/home/PromotionBanner.tsx

import Image from "next/image";

export default function PromotionBanner() {
  return (
    <section
      aria-label="Raksha Bandhan promotion"
      className="w-full py-3 sm:py-4 lg:py-5"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Image
          src="/images/promotions/rakhi-promotion.webp"
          alt="Ram Pottery Raksha Bandhan special 10% off promotion"
          width={851}
          height={315}
          sizes="(max-width: 768px) 100vw, 1400px"
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}