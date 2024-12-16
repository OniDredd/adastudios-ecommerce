import Link from "next/link";
import ProductComponent from "../ProductComponent";
import { Suspense } from "react";

interface Product {
  id: string;
  title: string;
  handle: string;
  variantId: string;
  price: number;
  compareAtPrice?: number;
  brand: string;
  availableForSale: boolean;
  images: Array<{
    file: {
      url: string;
    };
  }>;
}

interface NewArrivalsProps {
  products: Array<Partial<Product>>;
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  // Limit to only 4 products
  const limitedProducts = products.slice(0, 4);

  return (
    <section className="w-full py-20 bg-secondary-peach">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-4 px-5">
          <h2 className="text-2xl font-bold text-main-maroon">
            NEW ARRIVALS
          </h2>
          <Link
            href="/shopall"
            className="text-sm text-main-maroon hover:underline"
          >
            VIEW ALL
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Suspense fallback={<LoadingGrid />}>
            {limitedProducts.map((product) => {
              const processedProduct: Product = {
                id: product.id || "",
                title: product.title || "",
                handle: product.handle || "",
                variantId: product.variantId || product.id || "",
                price:
                  typeof product.price === "number"
                    ? product.price
                    : parseFloat(product.price || "0"),
                compareAtPrice: product.compareAtPrice,
                brand: product.brand || "Ada Studios",
                availableForSale: product.availableForSale ?? true,
                images: product.images || [],
              };

              return (
                <ProductComponent
                  key={processedProduct.id}
                  product={processedProduct}
                />
              );
            })}
          </Suspense>
        </div>
      </div>
    </section>
  );
}

function LoadingGrid() {
  return (
    <>
      {[...Array(4)].map((_, index) => (
        <ProductComponent
          key={index}
          product={{
            id: "",
            title: "",
            handle: "",
            variantId: "",
            price: 0,
            brand: "",
            availableForSale: true,
            images: [],
          }}
          isLoading={true}
        />
      ))}
    </>
  );
}
