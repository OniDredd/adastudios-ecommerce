"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

interface Product {
  id: string;
  title: string;
  handle: string;
  variantId: string;
  price: number;
  brand: string;
  images: { file: { url: string } }[];
}

interface ProductComponentProps {
  product: Product;
  isLoading?: boolean;
  textColor?: "main-maroon" | "secondary-peach"; // New prop for text color
}

const ProductSkeleton: React.FC = () => (
  <div className="animate-pulse flex flex-col h-full p-1 border-gray-200 rounded-lg">
    <div className="h-48 w-full bg-gray-300 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
    <div className="mt-auto">
      <div className="h-0.5 w-full bg-gray-300 my-4"></div>
      <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
      <div className="h-10 bg-gray-300 rounded w-full"></div>
    </div>
  </div>
);

const ProductComponent: React.FC<ProductComponentProps> = ({
  product,
  isLoading = false,
  textColor = "main-maroon", // Default to main-maroon if not specified
}) => {
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <div className="relative flex flex-col h-full rounded-lg">
      <Link href={`/product/${product.handle}`} passHref>
        <div
          className="cursor-pointer flex-grow flex flex-col hover:border-main-maroon transition-all duration-200 ease-in-out"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="h-96 w-full overflow-hidden mb-4 relative rounded-sm">
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

            {/* Hover Add to Cart Button */}
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
          </div>
          <div className="mt-auto px-5">
          <h3 className={`text-sm text-${textColor} mb-2`}>{product.title}</h3>
            <p className={`text-lg font-medium text-${textColor} mb-4`}>
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductComponent;
