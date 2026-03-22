"use client";

import Image from "next/image";
import { Star } from "lucide-react";

type Review = {
  id: number;
  name: string;
  date: string;
  rating: number;
  text: string;
};

const reviews: Review[] = [
  { id: 1, name: "Kevin Ramdin", date: "Jan 14, 2025", rating: 5, text: "Beautiful handmade pieces. Very elegant and premium finish." },
  { id: 2, name: "Marie Claire", date: "Feb 02, 2025", rating: 5, text: "Mo finn bien content kalite ek design. Vraiman zoli." },
  { id: 3, name: "Jean-Luc Armoogum", date: "Feb 18, 2025", rating: 4, text: "Très belles poteries artisanales. Service chaleureux et professionnel." },
  { id: 4, name: "Asha Devi", date: "Mar 03, 2025", rating: 5, text: "Lovely products and very refined pottery work." },
  { id: 5, name: "Yanish Appadoo", date: "Mar 09, 2025", rating: 5, text: "Bann pieces la tro zoli. Mo pou re-vini sûr." },
  { id: 6, name: "Sabrina Mootien", date: "Mar 22, 2025", rating: 5, text: "Une très belle collection avec une vraie âme artisanale." },
  { id: 7, name: "Vikash Oogarah", date: "Apr 01, 2025", rating: 4, text: "Good quality pottery and very nice customer service." },
  { id: 8, name: "Nathalie Labonne", date: "Apr 12, 2025", rating: 5, text: "Mo adore sa style naturel ek classy la." },
  { id: 9, name: "Christopher Tang", date: "Apr 20, 2025", rating: 5, text: "Très satisfait. Les finitions sont magnifiques." },
  { id: 10, name: "Priya Seebun", date: "May 02, 2025", rating: 5, text: "Elegant clay pieces that look amazing at home." },
  { id: 11, name: "Ruben Moorghen", date: "May 11, 2025", rating: 5, text: "Travay-la propre ek très artistique. Mo content." },
  { id: 12, name: "Amandine Hoareau", date: "May 19, 2025", rating: 4, text: "Superbe sélection de poteries avec beaucoup de charme." },
  { id: 13, name: "Shivani Boodhun", date: "Jun 01, 2025", rating: 5, text: "Very tasteful collection and authentic craftsmanship." },
  { id: 14, name: "Daren Soondrum", date: "Jun 09, 2025", rating: 5, text: "Mo bien aimé l'accueil ek qualité bann produits." },
  { id: 15, name: "Elodie Virahsawmy", date: "Jun 18, 2025", rating: 5, text: "Des créations raffinées, parfaites pour offrir ou décorer." },
  { id: 16, name: "Kersley Ramloll", date: "Jun 27, 2025", rating: 5, text: "Beautiful textures, premium look, and truly handmade feel." },
  { id: 17, name: "Vanessa Lutchman", date: "Jul 06, 2025", rating: 4, text: "Sa boutique la ena enn très bon style artisanal." },
  { id: 18, name: "Didier Cangy", date: "Jul 14, 2025", rating: 5, text: "Excellente qualité et très belle présentation." },
  { id: 19, name: "Riyana Gopaul", date: "Jul 22, 2025", rating: 5, text: "A calm and premium pottery shopping experience." },
  { id: 20, name: "Stephan Ah-Yan", date: "Aug 01, 2025", rating: 5, text: "Vraiment top. Bann pots la élégant ek unique." },
];

const marqueeReviews = [...reviews, ...reviews];

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function avatarColor(seed: string) {
  const colors = [
    "bg-[#5c6bc0]",
    "bg-[#ab47bc]",
    "bg-[#ef5350]",
    "bg-[#26a69a]",
    "bg-[#42a5f5]",
    "bg-[#ec407a]",
    "bg-[#ff7043]",
    "bg-[#7e57c2]",
    "bg-[#26c6da]",
    "bg-[#8d6e63]",
  ];

  let total = 0;
  for (let i = 0; i < seed.length; i++) total += seed.charCodeAt(i);
  return colors[total % colors.length];
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-[18px] w-[18px] ${
            star <= rating
              ? "fill-[#fb8c00] text-[#fb8c00]"
              : "fill-transparent text-[#fb8c00]"
          }`}
          strokeWidth={1.8}
        />
      ))}
    </div>
  );
}

export default function GoogleReviewsStrip() {
  return (
    <section className="w-full bg-white py-8 md:py-10">
      <div className="w-full overflow-hidden bg-white">
        <div className="flex w-full items-stretch gap-4">
          <div className="hidden w-[320px] shrink-0 items-center justify-center bg-white pl-4 pr-1 md:flex lg:w-[360px]">
            <div className="flex w-full items-center gap-4">
              <div className="h-[74px] w-[84px] overflow-hidden rounded-[6px] bg-neutral-100">
                <Image
                  src="/images/google-reviews-cover.jpg"
                  alt="Ram Pottery reviews cover"
                  width={84}
                  height={74}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-[16px] font-medium leading-[1.1] text-neutral-900">
                  Ram Pottery Studio
                </h3>

                <div className="mt-2">
                  <Stars rating={5} />
                </div>

                <p className="mt-1 text-[14px] font-medium leading-none text-neutral-900">
                  20 Google Reviews
                </p>
              </div>
            </div>
          </div>

          <div className="relative min-w-0 flex-1 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent" />

            <div className="reviews-marquee flex w-max items-stretch gap-6">
              {marqueeReviews.map((review, index) => (
                <article
                  key={`${review.id}-${index}`}
                  className="w-[310px] shrink-0 rounded-[14px] bg-[#f5f5f5] px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[18px] font-medium text-white ${avatarColor(
                          review.name
                        )}`}
                      >
                        {getInitials(review.name)}
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate text-[16px] font-medium leading-tight text-[#202124]">
                          {review.name}
                        </h4>
                        <p className="mt-1 text-[13px] leading-none text-[#5f6368]">
                          {review.date}
                        </p>
                      </div>
                    </div>

                    <div className="mt-[2px] shrink-0">
                      <Image
                        src="/images/google-badge.jpg"
                        alt="Google"
                        width={24}
                        height={24}
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <Stars rating={review.rating} />
                  </div>

                  <p className="mt-4 line-clamp-2 text-[15px] leading-[1.45] text-[#202124]">
                    {review.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 px-4 md:hidden">
          <div className="h-[62px] w-[72px] overflow-hidden rounded-[6px] bg-neutral-100">
            <Image
              src="/images/google-reviews-cover.jpg"
              alt="Ram Pottery reviews cover"
              width={72}
              height={62}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-[15px] font-medium leading-tight text-neutral-900">
              Ram Pottery Studio
            </h3>
            <div className="mt-2">
              <Stars rating={5} />
            </div>
            <p className="mt-1 text-[14px] font-medium text-neutral-900">
              20 Google Reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}