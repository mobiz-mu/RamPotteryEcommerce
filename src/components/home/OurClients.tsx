import Image from "next/image";

const clients = [
  { name: "Casuarina Hotel", src: "/our-clients/Casuarina-hotel.png" },
  { name: "Radisson Blu", src: "/our-clients/Radisson-blu.png" },
  { name: "LUX Grand Gaube", src: "/our-clients/Lux-grand-gaube.png" },
  { name: "Preskil Island Resort", src: "/our-clients/Preskill-island-resort.png" },
  { name: "Greencoast International School", src: "/our-clients/GreencoastInternationalSchool.png" },
  { name: "The Oberoi Mauritius", src: "/our-clients/Oberoi-hotel.png" },
  { name: "SICOM Insurance", src: "/our-clients/Sicom-insurance.png" },
  { name: "Shanti Maurice", src: "/our-clients/Shanti-maurice.png" },
  { name: "Zilwa Attitude", src: "/our-clients/Zilwa-attitude-hotel.png" },
  { name: "Maritim Hotel", src: "/our-clients/Maritim-hotel.png" },
  { name: "Azuri", src: "/our-clients/Azuri.png" },
];

export default function OurClients() {
  const repeatedClients = [...clients, ...clients];

  return (
    <section className="relative w-full overflow-hidden bg-white py-9 sm:py-11 lg:py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-200 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-200 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.38em] text-red-700">
          Our Trusted Partners in Mauritius
        </p>

        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-neutral-950 sm:text-3xl lg:text-4xl">
          Trusted by Leading Hotels, Resorts & Institutions
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
          Premium handcrafted pottery selected by respected hospitality,
          education, insurance and lifestyle brands across Mauritius.
        </p>
      </div>

      <div className="relative mt-8 w-full overflow-hidden sm:mt-9">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent sm:w-32" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent sm:w-32" />

        <div className="client-slider flex w-max items-center gap-8 px-4 sm:gap-12">
          {repeatedClients.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="group flex h-24 w-24 shrink-0 items-center justify-center sm:h-32 sm:w-32 lg:h-36 lg:w-36"
              title={client.name}
            >
              <Image
                src={client.src}
                alt={`${client.name} logo - Ram Pottery Mauritius trusted partner`}
                width={180}
                height={180}
                className="h-full w-full object-contain transition duration-500 ease-out group-hover:scale-125 group-hover:drop-shadow-[0_18px_28px_rgba(0,0,0,0.18)]"
                sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 144px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}