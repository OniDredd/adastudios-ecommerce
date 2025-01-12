import Link from "next/link";
import ProductComponent from "../ProductComponent";
import { Suspense } from "react";
import { LoadingGrid } from "../LoadingGrid";
import { IncomingProduct, transformIncomingProduct } from "../../types/product";

interface NewArrivalsProps {
  products: IncomingProduct[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  // First get in-stock products
  const inStockProducts = products.filter(product => product.availableForSale);
  const outOfStockProducts = products.filter(product => !product.availableForSale);
  
  // Take first 4 in-stock products, if not enough, fill with out of stock products
  const limitedProducts = [
    ...inStockProducts.slice(0, 4),
    ...outOfStockProducts.slice(0, Math.max(0, 4 - inStockProducts.slice(0, 4).length))
  ].slice(0, 4);

  return (
    <section className="w-full py-12 md:py-20 bg-secondary-peach">
      <div className="mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-6 md:mb-4">
          <h2 className="text-lg md:text-xl font-medium text-main-maroon">
            NEW ARRIVALS
          </h2>
          <Link
            href="/shop"
            className="text-sm text-main-maroon border border-transparent hover:border-main-maroon rounded px-2 py-1 transition-colors"
          >
            VIEW ALL
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Suspense fallback={<LoadingGrid />}>
            {limitedProducts.map((product) => (
              <ProductComponent
                key={product.id}
                product={transformIncomingProduct(product)}
              />
            ))}
          </Suspense>
        </div>
      </div>
    </section>
  );
}
