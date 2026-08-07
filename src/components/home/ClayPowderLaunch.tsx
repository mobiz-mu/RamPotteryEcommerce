"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Flame,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/hooks/useCart";

const PRODUCT = {
  id: "premium-clay-powder",
  name: "Premium Clay Powder",
  slug: "premium-clay-powder",
  subtitle: "New Launch Offer",
  oldPrice: 110,
  price: 98,
  unit: "1 pouch = 1 Kg",
  image: "/products/premium-clay.png",
  video: "/products/clay-powder-launch.mp4",
};

export default function ClayPowderLaunch() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const buyLockRef = useRef(false);

  const { addItem, items, updateQuantity } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isSoundOn, setIsSoundOn] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.volume = 1;
    video.muted = true;

    video.play().catch(() => {
      // Browser will wait for user interaction.
    });
  }, []);

  async function handleSoundToggle() {
    const video = videoRef.current;

    if (!video) return;

    const nextSoundState = !isSoundOn;

    video.volume = 1;
    video.muted = !nextSoundState;
    setIsSoundOn(nextSoundState);

    try {
      await video.play();
    } catch {
      video.muted = true;
      setIsSoundOn(false);
    }
  }

  function handleBuyNow() {
    if (buyLockRef.current) return;

    buyLockRef.current = true;

    const selectedQuantity = Math.max(1, quantity);

    const existingItem = items.find(
      (item) => item.id === PRODUCT.id || item.slug === PRODUCT.slug,
    );

    if (existingItem) {
      updateQuantity(existingItem.id, selectedQuantity);
    } else {
      addItem({
        id: PRODUCT.id,
        slug: PRODUCT.slug,
        title: PRODUCT.name,
        price: PRODUCT.price,
        image: PRODUCT.image,
        quantity: selectedQuantity,
     });
    }

    router.push("/checkout");
  }

  return (
    <section className="relative overflow-hidden bg-white py-8 sm:py-10 lg:py-14">
      <div className="container-padded">
        <div className="mx-auto grid max-w-7xl items-center gap-9 lg:grid-cols-[285px_minmax(0,1fr)_350px] lg:gap-10 xl:grid-cols-[310px_minmax(0,1fr)_390px] xl:gap-12">
          {/* Left: iPhone video */}
          <div className="promo-phone-in flex justify-center lg:justify-start">
            <div className="relative w-[225px] sm:w-[250px] lg:w-[265px] xl:w-[285px]">
              <div className="pointer-events-none absolute -left-10 top-14 h-44 w-44 rounded-full bg-red-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -right-10 bottom-16 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />

              <div className="relative rounded-[48px] bg-[#050505] p-[8px] shadow-[0_34px_90px_rgba(0,0,0,0.25)]">
                <div className="absolute left-1/2 top-[8px] z-20 h-6 w-24 -translate-x-1/2 rounded-b-[18px] bg-[#050505]" />

                <div className="relative aspect-[9/16] overflow-hidden rounded-[39px] bg-black">
                  <video
                    ref={videoRef}
                    src={PRODUCT.video}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    autoPlay
                    playsInline
                    loop
                    muted={!isSoundOn}
                    preload="auto"
                    controls={false}
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    aria-label="Ram Pottery Premium Clay Powder launch video"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSoundToggle}
                className="mx-auto mt-4 flex items-center justify-center gap-2 rounded-full bg-neutral-100 px-4 py-2.5 text-xs font-black text-neutral-700 shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition duration-300 hover:bg-neutral-950 hover:text-white"
              >
                {isSoundOn ? (
                  <Volume2 className="h-4 w-4 text-red-900" />
                ) : (
                  <VolumeX className="h-4 w-4 text-red-900" />
                )}
                {isSoundOn ? "Sound On" : "Enable Sound"}
              </button>
            </div>
          </div>

          {/* Middle: promotion text */}
          <div className="promo-content-in text-center lg:text-left">
            <div className="promo-rise inline-flex items-center gap-2 rounded-full bg-red-900 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-[0_14px_34px_rgba(120,0,0,0.18)]">
              <Sparkles className="h-3.5 w-3.5" />
              {PRODUCT.subtitle}
            </div>

            <h2 className="promo-rise mt-5 max-w-2xl text-4xl font-black leading-[0.9] tracking-[-0.08em] text-neutral-950 sm:text-5xl lg:text-[56px] xl:text-6xl">
              Premium Clay Powder
            </h2>

            <p className="promo-rise mx-auto mt-4 max-w-xl text-sm font-semibold leading-7 text-neutral-600 sm:text-base lg:mx-0">
              A new Ram Pottery launch for home creators, schools, workshops
              and DIY pottery lovers. Each pouch contains 1 Kg of clay powder.
              Just add water, mix, knead and shape your own handmade clay
              creations.
            </p>

            <div className="promo-rise mt-6 flex flex-wrap items-end justify-center gap-4 lg:justify-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-400">
                  Limited Launch Price
                </p>

                <div className="mt-1 flex items-end justify-center gap-3 lg:justify-start">
                  <span className="relative text-2xl font-black text-neutral-400 sm:text-3xl">
                    Rs {PRODUCT.oldPrice}
                    <span className="absolute left-0 top-1/2 h-[3px] w-full -rotate-6 rounded-full bg-red-700" />
                  </span>

                  <span className="text-5xl font-black leading-none tracking-[-0.08em] text-red-900 sm:text-6xl">
                    Rs {PRODUCT.price}
                  </span>
                </div>
              </div>

              <div className="promo-fire flex items-center gap-2 rounded-full bg-[#fff0df] px-4 py-3 shadow-[0_16px_40px_rgba(164,83,0,0.14)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff7a1a,#b40012)] text-white shadow-[0_10px_24px_rgba(180,0,18,0.24)]">
                  <Flame className="h-5 w-5 fill-current" />
                </span>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-red-900/60">
                    Promo Saving
                  </p>
                  <p className="text-sm font-black text-red-900">
                    Save Rs 12
                  </p>
                </div>
              </div>
            </div>

            <div className="promo-rise mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
              <span className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-bold text-neutral-700">
                {PRODUCT.unit}
              </span>
              <span className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-bold text-neutral-700">
                DIY Projects
              </span>
              <span className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-bold text-neutral-700">
                School Activities
              </span>
              <span className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-bold text-neutral-700">
                Creative Workshops
              </span>
            </div>

            <div className="promo-rise mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <div className="flex items-center overflow-hidden rounded-full bg-neutral-100">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  className="flex h-12 w-12 items-center justify-center text-neutral-700 transition hover:bg-neutral-200"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <div className="flex h-12 min-w-16 items-center justify-center px-5 text-base font-black text-neutral-950">
                  {quantity}
                </div>

                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="flex h-12 w-12 items-center justify-center text-neutral-700 transition hover:bg-neutral-200"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#ec1b23,#8f060b)] px-8 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_42px_rgba(201,15,24,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_52px_rgba(201,15,24,0.36)]"
              >
                <ShoppingBag className="h-4 w-4" />
                Buy Now
              </button>
            </div>
          </div>

          {/* Right: premium clay product image */}
          <div className="promo-product-in relative mx-auto h-[390px] w-[292px] sm:h-[460px] sm:w-[345px] lg:mx-0 lg:h-[500px] lg:w-[375px] xl:h-[530px] xl:w-[398px]">
            <div className="pointer-events-none absolute -left-8 top-10 h-40 w-40 rounded-full bg-red-500/8 blur-3xl" />
            <div className="pointer-events-none absolute -right-8 bottom-8 h-44 w-44 rounded-full bg-yellow-300/18 blur-3xl" />

            <Image
              src={PRODUCT.image}
              alt="Ram Pottery Premium Clay Powder pouch"
              fill
              sizes="(max-width: 640px) 292px, (max-width: 1024px) 345px, (max-width: 1280px) 375px, 398px"
              quality={75}
              priority
              className="object-contain drop-shadow-[0_38px_46px_rgba(15,10,5,0.18)]"
            />
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .promo-phone-in {
              animation: promoPhoneIn 900ms cubic-bezier(.16,1,.3,1) both;
            }

            .promo-content-in {
              animation: promoContentIn 900ms cubic-bezier(.16,1,.3,1) 120ms both;
            }

            .promo-product-in {
              animation: promoProductIn 900ms cubic-bezier(.16,1,.3,1) 180ms both, promoFloat 5s ease-in-out 1.1s infinite;
            }

            .promo-rise {
              animation: promoRise 760ms cubic-bezier(.16,1,.3,1) both;
            }

            .promo-fire {
              animation: promoPulse 2.8s ease-in-out infinite;
            }

            @keyframes promoPhoneIn {
              from {
                opacity: 0;
                transform: translateX(-70px) scale(.96);
              }
              to {
                opacity: 1;
                transform: translateX(0) scale(1);
              }
            }

            @keyframes promoContentIn {
              from {
                opacity: 0;
                transform: translateX(70px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }

            @keyframes promoProductIn {
              from {
                opacity: 0;
                transform: translateX(70px) scale(.96);
              }
              to {
                opacity: 1;
                transform: translateX(0) scale(1);
              }
            }

            @keyframes promoRise {
              from {
                opacity: 0;
                transform: translateY(16px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes promoFloat {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-10px);
              }
            }

            @keyframes promoPulse {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.035);
              }
            }

            @media (max-width: 1023px) {
              .promo-content-in,
              .promo-product-in {
                animation-name: promoMobileIn;
              }
            }

            @keyframes promoMobileIn {
              from {
                opacity: 0;
                transform: translateY(28px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .promo-phone-in,
              .promo-content-in,
              .promo-product-in,
              .promo-rise,
              .promo-fire {
                animation: none !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}