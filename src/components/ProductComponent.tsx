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
    <div className="h-96 w-full bg-main-maroon/20 rounded-sm mb-4"></div>
    <div className="mt-auto px-5">
      <div className="h-4 bg-main-maroon/20 rounded w-3/4 mb-2"></div>
      <div className="h-6 bg-main-maroon/20 rounded w-1/4 mb-4"></div>
      <div className="h-12 bg-main-maroon/20 rounded w-full opacity-0"></div>
    </div>
  </div>
);

const ProductComponent: React.FC<ProductComponentProps> = ({
  product,
  isLoading = false,
  textColor = "main-maroon",
}) => {
  const [isHovered, setIsHovered] = useState(false);
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
      className={`cursor-${product.availableForSale ? 'pointer' : 'not-allowed'} flex-grow flex flex-col hover:border-main-maroon transition-all duration-200 ease-in-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-96 w-full overflow-hidden mb-4 relative rounded-sm">
        {/* Out of Stock Overlay and Badge */}
        {!product.availableForSale && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-peach/80 to-transparent z-10" />
            <div className="absolute top-4 right-4 z-20">
              <span className="bg-secondary-peach text-main-maroon px-4 py-1.5 text-xs font-medium rounded-full shadow-sm backdrop-blur-sm">
                Out of Stock
              </span>
            </div>
          </>
        )}

        {/* Discount Badge */}
        {isDiscounted && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-main-maroon text-secondary-peach px-4 py-1.5 text-xs font-medium rounded-full shadow-sm backdrop-blur-sm">
              {discountPercentage}% Off
            </span>
          </div>
        )}

        {/* Low Stock Badge */}
        {isLowStock && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-main-maroon/90 text-secondary-peach px-4 py-1.5 text-xs font-medium rounded-full shadow-sm backdrop-blur-sm">
              Only {product.quantityAvailable} Left
            </span>
          </div>
        )}

        {/* Primary Image */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            sizes="100%"
            priority
            className="object-cover object-center"
          />
        </div>

        {/* Secondary Image */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={secondaryImage}
            alt={`${product.title} - alternate view`}
            fill
            sizes="100%"
            className="object-cover object-center"
          />
        </div>

        {/* Hover Add to Cart Button - Only show if product is available */}
        {product.availableForSale && (
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            onClick={(e) => e.preventDefault()}
          >
            <AddToCartButton
              product={{
                id: product.id,
                variantId: product.variantId,
                title: product.title,
                price: product.price,
                image: primaryImage,
              }}
            />
          </div>
        )}
      </div>
      <div className="mt-auto px-5">
        <h3 className={`text-sm text-${textColor} mb-2`}>{product.title}</h3>
        <div className="flex items-center gap-2 mb-4">
          <p className={`text-lg font-medium text-${textColor} ${!product.availableForSale ? "line-through opacity-70" : ""}`}>
            {convertPrice(product.price)}
          </p>
          {isDiscounted && (
            <p className={`text-sm line-through text-${textColor}/60`}>
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
