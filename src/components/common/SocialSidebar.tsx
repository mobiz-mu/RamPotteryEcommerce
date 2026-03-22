import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function SocialSidebar() {
  return (
    <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
      <Link
        href="#"
        className="flex h-11 w-11 items-center justify-center rounded-md bg-red-500 text-black transition hover:scale-105"
        aria-label="Facebook"
      >
        <Facebook className="h-5 w-5" />
      </Link>
      <Link
        href="#"
        className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-500 text-black transition hover:scale-105"
        aria-label="TikTok"
      >
        <span className="text-sm font-bold">T</span>
      </Link>
      <Link
        href="#"
        className="flex h-11 w-11 items-center justify-center rounded-md bg-yellow-400 text-black transition hover:scale-105"
        aria-label="LinkedIn"
      >
        <Linkedin className="h-5 w-5" />
      </Link>
      <Link
        href="#"
        className="flex h-11 w-11 items-center justify-center rounded-md bg-green-500 text-black transition hover:scale-105"
        aria-label="Instagram"
      >
        <Instagram className="h-5 w-5" />
      </Link>
    </div>
  );
}