"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { useCurrency } from './CurrencyProvider';

interface Product {
  id: string;
  title: string;
  handle: string;
  variantId: string;
  price: number;
  compareAtPrice?: number;
  brand: string;
  availableForSale: boolean;
  quantityAvailable?: number;
  images: { file: { url: string } }[];
}

interface ProductComponentProps {
  product: Product;
  isLoading?: boolean;
  textColor?: "main-maroon" | "secondary-peach";
}

const LOW_STOCK_THRESHOLD = 5;

const ProductSkeleton: React.FC = () => (
  <div className="animate-pulse flex flex-col h-full rounded-lg">
    <div className="aspect-[3/4] w-full bg-main-maroon/20 rounded-sm mb-2 sm:mb-3"></div>
    <div className="mt-auto px-2 sm:px-3">
      <div className="h-3 sm:h-4 bg-main-maroon/20 rounded w-3/4 mb-1 sm:mb-2"></div>
      <div className="h-4 sm:h-5 bg-main-maroon/20 rounded w-1/4 mb-2 sm:mb-3"></div>
    </div>
  </div>
);

const ProductComponent: React.FC<ProductComponentProps> = ({
  product,
  isLoading = false,
  textColor = "main-maroon",
}) => {
  const { convertPrice } = useCurrency();

  if (isLoading) {
    return <ProductSkeleton />;
  }

  const primaryImage =
    product.images && product.images.length > 0 && product.images[0].file
      ? product.images[0].file.url
      : "/placeholder-image.jpg";

  const secondaryImage =
    product.images && product.images.length > 1 && product.images[1].file
      ? product.images[1].file.url
      : primaryImage;

  const isLowStock = product.quantityAvailable !== undefined && 
                    product.quantityAvailable > 0 && 
                    product.quantityAvailable <= LOW_STOCK_THRESHOLD;

  const isDiscounted = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = isDiscounted
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const ProductContent = () => (
    <div
      className={`cursor-${product.availableForSale ? 'pointer' : 'not-allowed'} flex-grow flex flex-col transition-all duration-200 ease-in-out`}
    >
      <div className="aspect-[3/4] w-full mb-2 sm:mb-3 relative rounded-sm group overflow-hidden border border-transparent hover:border-main-maroon transition-colors">
        {/* Out of Stock Overlay and Badge */}
        {!product.availableForSale && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-peach/80 to-transparent z-10" />
            <div className="absolute top-2 right-2 z-20">
              <span className="bg-secondary-peach text-main-maroon px-2 py-1 text-[10px] font-medium rounded-full shadow-sm backdrop-blur-sm">
                Out of Stock
              </span>
            </div>
          </>
        )}

        {/* Discount Badge */}
        {isDiscounted && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-main-maroon text-secondary-peach px-2 py-1 text-[10px] font-medium rounded-full shadow-sm backdrop-blur-sm">
              {discountPercentage}% Off
            </span>
          </div>
        )}

        {/* Low Stock Badge */}
        {isLowStock && (
          <div className="absolute top-2 right-2 z-10">
            <span className="bg-main-maroon/90 text-secondary-peach px-2 py-1 text-[10px] font-medium rounded-full shadow-sm backdrop-blur-sm">
              Only {product.quantityAvailable} Left
            </span>
          </div>
        )}

        {/* Primary Image */}
        <div className="absolute inset-0">
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority
            className="object-cover object-center transform transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-110"
          />
        </div>

        {/* Secondary Image */}
        <div className="absolute inset-0">
          <Image
            src={secondaryImage}
            alt={`${product.title} - alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transform transition-all duration-500 ease-in-out opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100"
          />
        </div>
      </div>
      <div className="mt-auto px-2 sm:px-3">
        <h3 className={`text-xs sm:text-sm text-${textColor} mb-1 sm:mb-2 line-clamp-2`}>{product.title}</h3>
        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
          <p className={`text-sm sm:text-base font-medium text-${textColor} ${!product.availableForSale ? "line-through opacity-70" : ""}`}>
            {convertPrice(product.price)}
          </p>
          {isDiscounted && (
            <p className={`text-xs sm:text-sm line-through text-${textColor}/60`}>
              {convertPrice(product.compareAtPrice!)}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-col h-full rounded-lg">
      {product.availableForSale ? (
        <Link href={`/product/${product.handle}`} passHref>
          <ProductContent />
        </Link>
      ) : (
        <ProductContent />
      )}
    </div>
  );
};

export default ProductComponent;
