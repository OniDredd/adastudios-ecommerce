'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ProductGallery } from './ProductGallery';
import { OptionSelector } from './OptionSelector';
import { ShopifyProduct } from '../types/shopify';
import AddToCartButton from './AddToCartButton';
import { useCurrency } from './CurrencyProvider';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';

interface SelectedOptions {
  [key: string]: string;
}

interface ProductDetailsProps {
  product: ShopifyProduct;
  collection?: {
    title: string;
  };
}

// Character limit for collapsed description
const CHAR_LIMIT = 250;

function ProductDescription({ description }: { description: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const plainText = useMemo(() => {
    const div = document.createElement('div');
    div.innerHTML = description;
    return div.textContent || div.innerText || '';
  }, [description]);

  const shouldShowButton = plainText.length > CHAR_LIMIT;

  // Create truncated HTML content
  const truncatedContent = useMemo(() => {
    if (!shouldShowButton || isExpanded) return description;

    const div = document.createElement('div');
    div.innerHTML = description;
    
    let currentLength = 0;
    const walk = document.createTreeWalker(div, NodeFilter.SHOW_TEXT);
    let node = walk.nextNode();
    
    while (node) {
      const textLength = node.textContent?.length || 0;
      if (currentLength + textLength > CHAR_LIMIT) {
        const remainingLength = CHAR_LIMIT - currentLength;
        node.textContent = node.textContent?.slice(0, remainingLength) + '...';
        
        // Remove all following text nodes
        let next = walk.nextNode();
        while (next) {
          next.textContent = '';
          next = walk.nextNode();
        }
        break;
      }
      currentLength += textLength;
      node = walk.nextNode();
    }

    return div.innerHTML;
  }, [description, isExpanded, shouldShowButton]);

  return (
    <div className="border-t border-main-maroon/20 pt-8">
      <h2 className="text-lg font-semibold text-main-maroon mb-4">About This Product</h2>
      <div className="relative">
        <div
          className="prose prose-xs max-w-none text-main-maroon [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-4 [&>h3]:font-medium [&>h3]:text-base [&>h3]:mb-2"
          dangerouslySetInnerHTML={{ __html: truncatedContent }}
        />
        {shouldShowButton && (
          <div className="relative z-10 mt-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm font-medium text-main-maroon hover:opacity-70 transition-opacity"
            >
              {isExpanded ? (
                <>
                  Read Less
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Read More
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
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

  // Handle sharing functionality
  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title} on Ada Studios`,
          url: window.location.href
        });
      } else {
        // Fallback to copying URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // You might want to add a toast notification here
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [product.title]);

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
    <div className="flex flex-col md:flex-row h-full md:divide-x md:divide-[0.5px] divide-main-maroon">
      <div className="w-full md:w-1/2 relative">
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
        className="w-full md:w-1/2 min-h-screen md:max-h-screen bg-secondary-peach text-main-maroon scrollbar-thin scrollbar-thumb-main-maroon scrollbar-track-secondary-peach flex items-center"
      >
        <div className="w-full h-full px-4 sm:px-6 md:px-32 overflow-y-auto">
          <div className="max-w-xl mx-auto space-y-6 md:space-y-8 min-h-screen flex flex-col justify-center py-12 md:py-20">
            {/* Header Section */}
            <div className="flex justify-between items-start">
              <div>
                {collection && (
                  <span className="text-sm">{collection.title.toUpperCase()}</span>
                )}
                <h1 className="text-2xl md:text-2xl font-bold leading-tight">{product.title}</h1>
              </div>
              <div>
                <button 
                  onClick={handleShare}
                  className="p-2 hover:opacity-70 relative group"
                  aria-label="Share product"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-main-maroon text-secondary-peach text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                    Share product
                  </span>
                </button>
              </div>
            </div>

            {/* Price Section */}
            <div className="flex flex-wrap items-center gap-3">
              <p className={`text-3xl md:text-2xl font-bold ${!isAvailable ? "opacity-70" : ""}`}>
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
            <ProductDescription description={product.descriptionHtml} />

            {/* Product Care Link */}
            <div className="border-t border-main-maroon/20 pt-8">
              <a 
                href="/product-care" 
                className="inline-flex items-center text-main-maroon hover:opacity-70 transition-opacity text-sm font-medium"
              >
                View Product Care Instructions
                <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
              </a>
            </div>

            {/* Add to Cart Button - Only show if in stock */}
            {isAvailable && (
              <div className="sticky bottom-0 left-0 right-0 bg-secondary-peach py-4 px-4 md:px-0 md:py-0 md:static border-t border-main-maroon/20 md:border-0 mt-auto md:mt-0">
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
                  <div className="text-sm text-main-maroon text-center mt-2 md:mt-4">
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
