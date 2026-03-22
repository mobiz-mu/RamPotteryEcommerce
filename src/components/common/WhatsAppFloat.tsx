import Image from "next/image";
import Link from "next/link";

export default function WhatsAppFloat() {
  const phoneNumber = "23057788884";
  const message = encodeURIComponent("Hello Ram Pottery , I need Help ?");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Ram Pottery on WhatsApp"
      className="group fixed bottom-4 left-4 z-50 flex items-center gap-3 bg-transparent sm:bottom-5 sm:left-5"
    >
      <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-[1.04]">
        <span className="absolute inset-0 rounded-full bg-[#25D366]/20 blur-xl" />
        <Image
          src="/icons/whatsapp-rp.png"
          alt="WhatsApp"
          width={72}
          height={72}
          priority
          className="relative h-[64px] w-[64px] object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.22)] sm:h-[72px] sm:w-[72px]"
        />
      </div>

      <div className="rounded-[10px] bg-[#f3f4f6]/96 px-5 py-3 text-[15px] font-medium text-[#4b5563] shadow-[0_8px_24px_rgba(0,0,0,0.10)] backdrop-blur-[6px] transition-all duration-300 group-hover:bg-white">
        ✨ Need Help?
      </div>
    </Link>
  );
}