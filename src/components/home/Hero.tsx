import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/images/hero/hero-desktop.jpg"
          alt="Ram Pottery handcrafted clay aromatherapy collection"
          fill
          priority
          sizes="(max-width: 767px) 0px, 100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 md:hidden">
        <Image
          src="/images/hero/hero-mobile.jpg"
          alt="Ram Pottery handcrafted clay aromatherapy collection"
          fill
          priority
          sizes="(max-width: 767px) 100vw, 0px"
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,8,4,0.18)_0%,rgba(35,12,6,0.26)_22%,rgba(45,15,7,0.34)_48%,rgba(25,9,4,0.46)_72%,rgba(18,7,3,0.58)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_26%,rgba(0,0,0,0)_58%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.08),rgba(0,0,0,0),rgba(0,0,0,0.08))]" />

      <div className="relative z-10 flex min-h-[74vh] items-center justify-center px-6 pb-20 pt-24 text-center sm:min-h-[78vh] sm:pb-24 sm:pt-28 md:min-h-[88vh] md:pb-28 md:pt-32 lg:min-h-[94vh] lg:pb-32 lg:pt-36">
        <div className="mx-auto max-w-6xl">
          <h1
            className="mx-auto max-w-5xl text-balance text-[2.1rem] font-medium leading-[1.04] tracking-[-0.04em] text-white sm:text-[2.8rem] md:text-[4rem] lg:text-[4.9rem] xl:text-[5.35rem]"
            style={{
              fontFamily: 'var(--font-heading), "Times New Roman", Times, serif',
            }}
          >
            Soulful Aromatherapy with
            <br />
            Handcrafted Clay, Glazed to Perfection
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-[0.96rem] font-normal leading-7 text-white/88 sm:text-[1.02rem] md:mt-6 md:text-[1.18rem] md:leading-8">
            Slow-Crafted Ceramics made for Soulful Homes
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10">
            <Link
              href="/shop"
              className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-950 transition duration-200 hover:-translate-y-0.5 hover:bg-white/92"
            >
              Shop Collection
            </Link>

            <Link
              href="/workshop"
              className="inline-flex rounded-full border border-white/60 bg-transparent px-6 py-3 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/10"
            >
              Discover Workshop
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}