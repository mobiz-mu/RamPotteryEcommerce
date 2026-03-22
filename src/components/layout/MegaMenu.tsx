"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories } from "@/data/mock";

const categoryImageMap: Record<string, string> = {
  "Ceramic Tulsi Pot": "/images/categories/ceramic-tulsi-pot.jpg",
  "Ceramic Vase": "/images/categories/ceramic-vase.jpg",
  "Clay Cookingware": "/images/categories/clay-cookingware.jpg",
  "Clay Flower Pot": "/images/categories/clay-flower-pot.jpg",
  "Clay Flower pot": "/images/categories/clay-flower-pot.jpg",
  "Clay Matka": "/images/categories/clay-matka.jpg",
  "Clay Murti": "/images/categories/clay-murti.jpg",
  "Clay Pooja Products": "/images/categories/clay-pooja-products.jpg",
  "clay pooja products": "/images/categories/clay-pooja-products.jpg",
  "Clay Souvenir": "/images/categories/clay-souvenir.jpg",
  "Clay Souvenier": "/images/categories/clay-souvenir.jpg",
  "Clay Wind Chime": "/images/categories/clay-wind-chime.jpg",
  "Clay Wind chime": "/images/categories/clay-wind-chime.jpg",
  "Earthen Clay Lamp": "/images/categories/earthen-clay-lamp.jpg",
  "Others": "/images/categories/other-category.jpg",
  "Other Category": "/images/categories/other-category.jpg",
  "Painting & Wax Lamp": "/images/categories/painting-wax-lamp.jpg",
  "Painting & wax lamp": "/images/categories/painting-wax-lamp.jpg",
  "Tableware": "/images/categories/tableware.jpg",
  "Terracotta Home Decor": "/images/categories/terracotta-home-decor.jpg",
};

export default function MegaMenu() {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const menuCategories = useMemo(() => {
    return categories.slice(0, 14).map((category) => ({
      ...category,
      menuImage:
        categoryImageMap[category.name] ||
        category.imageUrl ||
        "/images/categories/other-category.jpg",
    }));
  }, []);

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        if (isDesktop) setOpen(true);
      }}
      onMouseLeave={() => {
        if (isDesktop) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 text-[14.5px] font-medium text-neutral-900 transition hover:text-red-600"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span>Shop</span>
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <>
          {!isDesktop ? (
            <div className="fixed inset-x-3 top-[72px] z-[90] max-h-[82vh] overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.14)] lg:hidden">
              <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
                <div className="text-base font-semibold text-neutral-950">Categories</div>

                <button
                  type="button"
                  onClick={closeMenu}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:bg-neutral-50"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[calc(82vh-74px)] overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {menuCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      onClick={closeMenu}
                      className="group flex flex-col items-center rounded-[16px] border border-neutral-200 bg-white p-3 text-center transition hover:border-red-300 hover:shadow-[0_10px_24px_rgba(0,0,0,0.05)]"
                    >
                      <div className="mb-2.5 flex h-[64px] w-[64px] items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-50">
                        <Image
                          src={category.menuImage}
                          alt={category.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="line-clamp-2 text-[12px] font-medium leading-4 text-neutral-900 transition group-hover:text-red-600">
                        {category.name}
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/shop"
                  onClick={closeMenu}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  View All Products
                </Link>
              </div>
            </div>
          ) : (
            <div className="absolute top-full z-[100] pt-4">
              <div className="fixed left-1/2 top-[170px] w-screen -translate-x-1/2 px-5 xl:px-8">
                <div className="mx-auto w-full max-w-[1560px] overflow-hidden rounded-[26px] border border-neutral-200 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.12)]">
                  <div className="flex items-center justify-end border-b border-neutral-200 px-6 py-3">
                    <Link
                      href="/shop"
                      onClick={closeMenu}
                      className="text-sm font-medium text-neutral-900 transition hover:text-red-600"
                    >
                      Browse All
                    </Link>
                  </div>

                  <div className="px-5 py-4 xl:px-6 xl:py-5">
                    <div className="grid grid-cols-7 gap-3 xl:gap-4">
                      {menuCategories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${category.slug}`}
                          onClick={closeMenu}
                          className="group flex flex-col items-center rounded-[16px] border border-neutral-200 bg-white px-2.5 py-3 text-center transition hover:-translate-y-0.5 hover:border-red-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.05)]"
                        >
                          <div className="mb-2.5 flex h-[62px] w-[62px] items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 xl:h-[68px] xl:w-[68px]">
                            <Image
                              src={category.menuImage}
                              alt={category.name}
                              width={68}
                              height={68}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="line-clamp-2 text-[12px] font-medium leading-4 text-neutral-900 transition group-hover:text-red-600 xl:text-[13px]">
                            {category.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}