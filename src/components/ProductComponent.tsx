"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SimpleProduct } from '../lib/shopify';
import { useCurrency } from './CurrencyProvider';

interface ProductComponentProps {
  product: SimpleProduct;
  isLoading?: boolean;
  textColor?: "main-maroon" | "secondary-peach";
  isPriority?: boolean;
}

const LOW_STOCK_THRESHOLD = 5;

const ProductSkeleton: React.FC = () => (
  <div className="relative flex flex-col h-full rounded-lg">
    <div className="aspect-[3/4] w-full bg-gradient-to-r from-secondary-peach/30 via-secondary-peach/50 to-secondary-peach/30 rounded-sm mb-2 sm:mb-3 border border-secondary-peach/20 relative animate-shimmer bg-[length:200%_100%]">
      {/* Maintain badge placeholders for consistent layout */}
      <div className="absolute top-2 right-2">
        <div className="w-16 h-5 bg-secondary-peach/40 rounded-full" />
      </div>
      <div className="absolute top-2 left-2">
        <div className="w-14 h-5 bg-secondary-peach/40 rounded-full" />
      </div>
    </div>
    <div className="mt-auto px-2 sm:px-3">
      {/* Title placeholder */}
      <div className="space-y-1 mb-1 sm:mb-2">
        <div className="h-3 sm:h-4 bg-gradient-to-r from-secondary-peach/30 via-secondary-peach/50 to-secondary-peach/30 rounded-full w-full animate-shimmer bg-[length:200%_100%]"></div>
        <div className="h-3 sm:h-4 bg-gradient-to-r from-secondary-peach/30 via-secondary-peach/50 to-secondary-peach/30 rounded-full w-2/3 animate-shimmer bg-[length:200%_100%]"></div>
      </div>
      {/* Price placeholder */}
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <div className="h-4 sm:h-5 bg-gradient-to-r from-secondary-peach/30 via-secondary-peach/50 to-secondary-peach/30 rounded-full w-16 animate-shimmer bg-[length:200%_100%]"></div>
        <div className="h-3 sm:h-4 bg-gradient-to-r from-secondary-peach/30 via-secondary-peach/50 to-secondary-peach/30 rounded-full w-12 animate-shimmer bg-[length:200%_100%]"></div>
      </div>
    </div>
  </div>
);

const ProductComponent: React.FC<ProductComponentProps> = ({
  product,
  isLoading = false,
  textColor = "main-maroon",
  isPriority = false,
}) => {
  const { convertPrice } = useCurrency();

  // Handle both media edges and direct images array
  const primaryImage = product.media?.edges?.find(
    edge => edge.node.mediaContentType === 'IMAGE'
  )?.node.image?.originalSrc || "/placeholder.jpg";

  const secondaryImage = product.media?.edges?.filter(
    edge => edge.node.mediaContentType === 'IMAGE'
  )[1]?.node.image?.originalSrc || primaryImage;

  const isLowStock = product.quantityAvailable !== undefined && 
                    product.quantityAvailable > 0 && 
                    product.quantityAvailable <= LOW_STOCK_THRESHOLD;

  const isDiscounted = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = isDiscounted
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const ProductContent: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsMounted(true);
      }, 100); // Small delay for smoother transition
      
      return () => clearTimeout(timer);
    }, []);

    return (
      <div
        className={`cursor-pointer flex-grow flex flex-col transition-all duration-700 ease-in-out opacity-0 transform translate-y-4 ${
          isMounted ? 'opacity-100 translate-y-0' : ''
        }`}
      >
      <div className="aspect-[3/4] w-full mb-2 sm:mb-3 relative rounded-sm overflow-hidden border border-transparent hover:border-main-maroon transition-colors bg-secondary-peach">
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
            alt={product.title || 'Product image'}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            priority={isPriority}
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVigAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVigAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02LjY2OjY2Njo2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njb/2wBDARUXFyAeIB4gHh4gIB4lICAgICUmJSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            className="object-cover object-center transform transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-110"
          />
        </div>

        {/* Secondary Image */}
        <div className="absolute inset-0">
          <Image
            src={secondaryImage}
            alt={`${product.title || 'Product'} - alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVigAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVigAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02LjY2OjY2Njo2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njb/2wBDARUXFyAeIB4gHh4gIB4lICAgICUmJSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            className="object-cover object-center transform transition-all duration-500 ease-in-out opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100"
            loading="lazy"
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
  };

  const content = (
    <Link href={`/product/${product.handle}`} className="flex-grow flex flex-col group">
      <ProductContent />
    </Link>
  );

  if (isLoading) {
    return <ProductSkeleton />;
  }

  return (
    <div className="relative flex flex-col h-full rounded-lg">
      {content}
    </div>
  );
};

export default ProductComponent;
