import { products } from "@/data/mock";
import ProductCard from "@/components/common/ProductCard";
import SectionHeading from "@/components/common/SectionHeading";

export default function BestSellers() {
  return (
    <section className="section-space bg-white">
      <div className="container-padded">
        <SectionHeading
          eyebrow="Best Sellers"
          title="Loved by Our Customers"
          description="A curated selection of our most popular handcrafted pieces."
        />

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[...products, ...products].slice(0, 8).map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}