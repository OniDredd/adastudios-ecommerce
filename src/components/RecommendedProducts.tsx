'use client';

import Link from 'next/link';
import { ShopifyProduct, SimpleProduct } from '../lib/shopify';
import ProductComponent from './ProductComponent';
import { Suspense } from 'react';

interface RecommendedProductsProps {
  products: ShopifyProduct[];
  currentProductId: string;
}

export function RecommendedProducts({ products, currentProductId }: RecommendedProductsProps) {
  // Filter out the current product and get only in-stock products
  const inStockRecommendations = products
    .filter(product => product.id !== currentProductId && product.availableForSale);

  // Only show section if we have at least 4 in-stock recommendations
  if (inStockRecommendations.length < 4) return null;

  // Take first 4 in-stock recommendations
  const recommendations = inStockRecommendations.slice(0, 4);

  return (
    <section className="w-full py-20 bg-secondary-peach">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-4 px-5">
          <h2 className="text-xl font-medium text-main-maroon">
            YOU MAY ALSO LIKE
          </h2>
          <Link
            href="/shopall"
            className="text-sm text-main-maroon border border-transparent hover:border-main-maroon rounded px-2 py-1 transition-colors"
          >
            VIEW ALL
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Suspense fallback={<LoadingGrid />}>
            {recommendations.map((product) => {
              const processedProduct: SimpleProduct = {
                id: product.id,
                title: product.title,
                handle: product.handle,
                variantId: product.variants.edges[0]?.node.id || product.id,
                price: parseFloat(product.priceRange.minVariantPrice.amount),
                compareAtPrice: product.variants.edges[0]?.node.compareAtPriceV2
                  ? parseFloat(product.variants.edges[0].node.compareAtPriceV2.amount)
                  : undefined,
                vendor: product.vendor,
                availableForSale: product.availableForSale,
                quantityAvailable: product.variants.edges[0]?.node.quantityAvailable || 0,
                tags: product.tags,
                media: {
                  edges: (product.media?.edges?.length ?? 0) > 0 
                    ? product.media?.edges ?? []
                    : product.images?.edges?.map(edge => ({
                        node: {
                          mediaContentType: 'IMAGE' as const,
                          image: edge.node
                        }
                      })) ?? []
                }
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
            vendor: "",
            availableForSale: true,
            quantityAvailable: 0,
            tags: [],
            media: { edges: [] },
          }}
          isLoading={true}
        />
      ))}
    </>
  );
}
