import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import CategoryExplorer from "@/components/home/CategoryExplorer";
import CategoryRow from "@/components/home/CategoryRow";
import OurStory from "@/components/home/OurStory";
import BlogRow from "@/components/home/BlogRow";
import OurClients from "@/components/home/OurClients";
import Newsletter from "@/components/home/Newsletter";
import GoogleReviewsStrip from "@/components/home/GoogleReviewsStrip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryExplorer />
      <CategoryRow />
      <OurStory />
      <OurClients />
      <BlogRow />
      <GoogleReviewsStrip />
      <Newsletter />
    </>
  );
}