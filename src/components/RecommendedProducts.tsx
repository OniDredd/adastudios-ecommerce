'use client';

import Link from 'next/link';
import { ShopifyProduct } from '../types/shopify';
import ProductComponent from './ProductComponent';
import { Suspense } from 'react';

interface RecommendedProductsProps {
  products: ShopifyProduct[];
  currentProductId: string;
}

export function RecommendedProducts({ products, currentProductId }: RecommendedProductsProps) {
  // Filter out the current product and limit to 4 recommendations
  const recommendations = products
    .filter(product => product.id !== currentProductId)
    .slice(0, 4);

  if (recommendations.length === 0) return null;

  return (
    <section className="w-full py-20 bg-secondary-peach">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-4 px-5">
          <h2 className="text-2xl font-bold text-main-maroon">
            YOU MAY ALSO LIKE
          </h2>
          <Link
            href="/shop"
            className="text-sm text-main-maroon hover:underline"
          >
            VIEW ALL
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          <Suspense fallback={<LoadingGrid />}>
            {recommendations.map((product) => {
              const processedProduct = {
                id: product.id,
                title: product.title,
                handle: product.handle,
                variantId: product.variants.edges[0]?.node.id || product.id,
                price: parseFloat(product.priceRange.minVariantPrice.amount),
                compareAtPrice: product.variants.edges[0]?.node.compareAtPriceV2
                  ? parseFloat(product.variants.edges[0].node.compareAtPriceV2.amount)
                  : undefined,
                brand: product.vendor,
                availableForSale: product.availableForSale,
                images: product.images.edges.map(edge => ({
                  file: {
                    url: edge.node.originalSrc
                  }
                }))
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
