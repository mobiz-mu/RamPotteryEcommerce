import Image from "next/image";
import Link from "next/link";

export default function WhatsAppFloat() {
  const phoneNumber = "23057788884";
  const message = encodeURIComponent("Hello Ram Pottery, I need help.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Ram Pottery on WhatsApp"
      className="group fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-transparent sm:bottom-5 sm:right-5"
    >
      <div className="rounded-full bg-white/95 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-neutral-700 shadow-[0_10px_28px_rgba(15,10,5,0.12)] backdrop-blur-md transition-all duration-300 group-hover:-translate-x-1 group-hover:bg-white group-hover:text-red-900 sm:text-xs">
        Need Help?
      </div>

      <div className="relative shrink-0 animate-[whatsappFloat_2.8s_ease-in-out_infinite] transition-transform duration-300 group-hover:scale-110">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/20" />
        <span className="absolute inset-0 rounded-full bg-[#25D366]/20 blur-xl" />

        <Image
          src="/icons/whatsapp-rp.png"
          alt="WhatsApp"
          width={58}
          height={58}
          priority
          className="relative h-[54px] w-[54px] object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.22)] sm:h-[58px] sm:w-[58px]"
        />
      </div>
    </Link>
  );
}