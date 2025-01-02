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
    <section className="w-full py-20 bg-secondary-peach">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-4 px-5">
          <h2 className="text-xl font-medium text-main-maroon">
            NEW ARRIVALS
          </h2>
          <Link
            href="/shop"
            className="text-sm text-main-maroon hover:underline"
          >
            VIEW ALL
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
