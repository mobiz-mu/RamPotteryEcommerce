import type { Metadata } from "next";

import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/common/WhatsAppFloat";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.rampottery.mu";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}