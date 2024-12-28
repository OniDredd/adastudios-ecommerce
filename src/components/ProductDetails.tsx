'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ProductGallery } from './ProductGallery';
import { OptionSelector } from './OptionSelector';
import { ShopifyProduct } from '../types/shopify';
import AddToCartButton from './AddToCartButton';
import { useCurrency } from './CurrencyProvider';
import { Heart, Share2 } from 'lucide-react';

interface SelectedOptions {
  [key: string]: string;
}

interface ProductDetailsProps {
  product: ShopifyProduct;
  collection?: {
    title: string;
  };
}

export default function ProductDetails({ product, collection }: ProductDetailsProps) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const detailsRef = useRef<HTMLDivElement>(null);
  const { convertPrice } = useCurrency();

  // Get the first variant's availability status and pricing
  const firstVariant = product.variants.edges[0]?.node;
  const isAvailable = firstVariant ? firstVariant.availableForSale : product.availableForSale;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtPrice = firstVariant?.compareAtPriceV2
    ? parseFloat(firstVariant.compareAtPriceV2.amount)
    : null;
  const isDiscounted = compareAtPrice && compareAtPrice > price;
  const discountPercentage = isDiscounted
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  // Memoize the variant image map to prevent recreation on every render
  const variantImageMap = useMemo(() => {
    const map = new Map<string, number>();
    product.variants.edges.forEach((variant) => {
      const variantImage = variant.node.image;
      if (variantImage?.originalSrc) {
        const imageIndex = product.images.edges.findIndex(
          img => img.node.originalSrc === variantImage.originalSrc
        );
        if (imageIndex !== -1) {
          // Create a key from the variant's color option if it exists
          const colorOption = variant.node.selectedOptions.find(
            opt => opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('colour')
          );
          if (colorOption) {
            map.set(colorOption.value, imageIndex);
          }
        }
      }
    });
    return map;
  }, [product.variants.edges, product.images.edges]);

  // Update selected image when color option changes
  useEffect(() => {
    const colorOption = Object.entries(selectedOptions).find(
      ([name]) => name.toLowerCase().includes('color') || name.toLowerCase().includes('colour')
    );
    
    if (colorOption) {
      const [_, value] = colorOption;
      const imageIndex = variantImageMap.get(value);
      if (imageIndex !== undefined) {
        setSelectedImageIndex(imageIndex);
      }
    }
  }, [selectedOptions, variantImageMap]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!detailsRef.current) return;

      const details = detailsRef.current;
      const { scrollTop, scrollHeight, clientHeight } = details;
      const isScrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
      const isScrolledToTop = scrollTop === 0;

      if (e.deltaY > 0) {
        if (!isScrolledToBottom) {
          e.preventDefault();
          details.scrollTop += e.deltaY;
        }
      } else if (e.deltaY < 0) {
        if (!isScrolledToTop) {
          e.preventDefault();
          details.scrollTop += e.deltaY;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const formattedPrice = convertPrice(price);
  const formattedCompareAtPrice = compareAtPrice ? convertPrice(compareAtPrice) : null;

  const validOptions = product.options?.filter(
    option => {
      // Skip if option is null or has no values
      if (!option || !option.values || option.values.length === 0) return false;
      
      // Skip if option name is "Title" or if all values are empty or "Default Title"
      if (
        option.name === "Title" || 
        option.values.every(value => !value || value === "Default Title")
      ) {
        return false;
      }
      
      // Keep only if there are valid values
      return option.values.some(value => value && value !== "");
    }
  ) || [];

  const hasVariants = validOptions.length > 0;
  const brand = product.vendor || 'Brand';

  return (
    <div className="flex h-full">
      <div className="w-1/2 relative">
        <ProductGallery 
          images={product.images.edges} 
          title={product.title}
          selectedImageIndex={selectedImageIndex}
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-gradient-to-t from-main-maroon to-transparent z-10 flex items-center justify-center">
            <span className="text-secondary-peach px-4 py-2 text-lg font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div 
        ref={detailsRef}
        className="w-1/2 h-screen bg-secondary-peach text-main-maroon scrollbar-thin scrollbar-thumb-main-maroon scrollbar-track-secondary-peach flex items-center"
      >
        <div className="w-full px-32">
          <div className="max-w-xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex justify-between items-start">
              <div>
                {collection && (
                  <span className="text-sm">{collection.title.toUpperCase()}</span>
                )}
                <h1 className="text-2xl font-bold">{product.title}</h1>
                <p className="text-sm">{brand}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:opacity-70">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 hover:opacity-70">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Price Section */}
            <div className="flex items-center gap-3">
              <p className={`text-2xl font-bold ${!isAvailable ? "opacity-70" : ""}`}>
                {formattedPrice}
              </p>
              {isDiscounted && (
                <>
                  <p className="text-lg line-through opacity-60">
                    {formattedCompareAtPrice}
                  </p>
                  <span className="bg-main-maroon text-secondary-peach px-3 py-1 text-sm font-medium rounded-full">
                    {discountPercentage}% Off
                  </span>
                </>
              )}
            </div>

            {/* Only show variants section if there are valid options */}
            {hasVariants && (
              <div className="space-y-4">
                {validOptions.map((option) => (
                  <OptionSelector
                    key={option.id}
                    option={option}
                    selectedValue={selectedOptions[option.name] || option.values[0]}
                    onSelect={(value) => 
                      setSelectedOptions(prev => ({
                        ...prev,
                        [option.name]: value
                      }))
                    }
                  />
                ))}
              </div>
            )}

            {/* About This Product */}
            <div className="border-t border-main-maroon/20 pt-8">
              <h2 className="text-lg font-semibold text-main-maroon mb-4">About This Product</h2>
              <div
                className="prose prose-xs max-w-none text-main-maroon [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-4 [&>h3]:font-medium [&>h3]:text-base [&>h3]:mb-2"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>

            {/* Add to Cart Button - Only show if in stock */}
            {isAvailable && (
              <div>
                <AddToCartButton
                  product={{
                    id: product.id,
                    variantId: firstVariant.id,
                    title: product.title,
                    price: parseFloat(firstVariant.priceV2.amount),
                    image: product.images.edges[0]?.node.originalSrc,
                  }}
                />
                
                {price >= 1 && price <= 2000 && (
                  <div className="text-sm text-main-maroon text-center mt-4">
                    4x {convertPrice(price / 4)} on <span className="font-semibold">afterpay</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
