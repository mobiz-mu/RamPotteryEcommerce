import { products } from "@/data/mock";
import ProductCard from "@/components/common/ProductCard";
import SectionHeading from "@/components/common/SectionHeading";

export default function NewArrivals() {
  return (
    <section className="section-space bg-[#fafafa]">
      <div className="container-padded">
        <SectionHeading
          eyebrow="New Arrivals"
          title="Fresh Creations Just Arrived"
          description="Discover new handmade pieces crafted to bring elegance and character into your space."
        />

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[...products, ...products].slice(0, 8).map((product, index) => (
            <ProductCard key={`${product.id}-new-${index}`} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}