'use client';

import { useState, useRef, useEffect, useMemo, useCallback, useTransition } from 'react';
import { ProductGallery } from './ProductGallery';
import { OptionSelector } from './OptionSelector';
import { ShopifyProduct } from '../lib/shopify';
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
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [plainText, setPlainText] = useState('');
  const [processedContent, setProcessedContent] = useState(description);
  
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const div = document.createElement('div');
    div.innerHTML = description;
    const text = div.textContent || div.innerText || '';
    setPlainText(text);

    if (text.length > CHAR_LIMIT && !isExpanded) {
      div.innerHTML = description;
      let currentLength = 0;
      const walk = document.createTreeWalker(div, NodeFilter.SHOW_TEXT);
      let node = walk.nextNode();
      
      while (node) {
        const textLength = node.textContent?.length || 0;
        if (currentLength + textLength > CHAR_LIMIT) {
          const remainingLength = CHAR_LIMIT - currentLength;
          node.textContent = node.textContent?.slice(0, remainingLength) + '...';
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
      setProcessedContent(div.innerHTML);
    } else {
      setProcessedContent(description);
    }
  }, [description, isExpanded]);

  const shouldShowButton = plainText.length > CHAR_LIMIT;

  const handleToggle = useCallback(() => {
    startTransition(() => {
      setIsExpanded(prev => !prev);
    });
  }, []);

  return (
    <div className="border-t border-main-maroon/20 pt-6">
      <h2 className="text-base font-medium text-main-maroon mb-3">About This Product</h2>
      <div className="relative">
        <div
          className={`
            prose prose-xs max-w-none text-main-maroon 
            [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2 
            [&>h3]:font-medium [&>h3]:text-base [&>h3]:mb-1.5
            ${isPending ? 'opacity-70' : ''}
          `}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
        {shouldShowButton && (
          <div className="relative z-10 mt-2">
            <button
              onClick={handleToggle}
              disabled={isPending}
              className="flex items-center gap-2 text-sm font-medium text-main-maroon hover:opacity-70 transition-opacity disabled:opacity-50"
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
  const [isPending, startTransition] = useTransition();
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(() => {
    // Initialize with first variant's options
    const firstVariant = product.variants.edges[0]?.node;
    if (!firstVariant) return {};
    return firstVariant.selectedOptions.reduce((acc, option) => ({
      ...acc,
      [option.name]: option.value
    }), {});
  });
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>(0);
  const [shareStatus, setShareStatus] = useState<{
    message: string;
    type: 'success' | 'error' | null;
    visible: boolean;
  }>({ message: '', type: null, visible: false });
  const detailsRef = useRef<HTMLDivElement>(null);
  const { convertPrice } = useCurrency();

  // Get the first variant's availability status and pricing
  // Find the selected variant based on selected options
  const selectedVariant = useMemo(() => {
    return product.variants.edges.find(({ node }) => {
      return node.selectedOptions.every(
        option => selectedOptions[option.name] === option.value
      );
    })?.node || product.variants.edges[0]?.node;
  }, [product.variants.edges, selectedOptions]);

  const isAvailable = selectedVariant ? selectedVariant.availableForSale : product.availableForSale;
  const price = selectedVariant 
    ? parseFloat(selectedVariant.priceV2.amount)
    : parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtPrice = selectedVariant?.compareAtPriceV2
    ? parseFloat(selectedVariant.compareAtPriceV2.amount)
    : null;
  const isDiscounted = compareAtPrice && compareAtPrice > price;
  const discountPercentage = isDiscounted
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const handleShare = useCallback(async () => {
    setShareStatus({ message: '', type: null, visible: false });
    
    const shareData = {
      title: product.title,
      text: `Check out ${product.title} on Ada Studios`,
      url: window.location.href
    };

    // Check if Web Share API is available and can share this data
    if (typeof navigator.share === 'function' && 
        typeof navigator.canShare === 'function' && 
        navigator.canShare(shareData)) {
      // Use Web Share API
      navigator.share(shareData).catch(() => {
        // Ignore any errors from share dialog (including cancellation)
      });
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus({
          message: 'Link copied to clipboard!',
          type: 'success',
          visible: true
        });
        setTimeout(() => {
          setShareStatus(prev => ({ ...prev, visible: false }));
        }, 3000);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        setShareStatus({
          message: 'Failed to copy link',
          type: 'error',
          visible: true
        });
        setTimeout(() => {
          setShareStatus(prev => ({ ...prev, visible: false }));
        }, 3000);
      }
    }
  }, [product.title]);

  const variantMediaMap = useMemo(() => {
    const map = new Map<string, number>();
    product.variants.edges.forEach((variant) => {
      const variantImage = variant.node.image;
      if (variantImage?.originalSrc) {
        // Find matching media by comparing image URLs
        const mediaIndex = product.media?.edges?.findIndex(
          media => media.node.mediaContentType === 'IMAGE' && 
                   media.node.image?.originalSrc === variantImage.originalSrc
        ) ?? -1;
        if (mediaIndex !== -1) {
          const colorOption = variant.node.selectedOptions.find(
            opt => opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('colour')
          );
          if (colorOption) {
            map.set(colorOption.value, mediaIndex);
          }
        }
      }
    });
    return map;
  }, [product.variants.edges, product.media?.edges]);

  useEffect(() => {
    const colorOption = Object.entries(selectedOptions).find(
      ([name]) => name.toLowerCase().includes('color') || name.toLowerCase().includes('colour')
    );
    
    if (colorOption) {
      const [_, value] = colorOption;
      const mediaIndex = variantMediaMap.get(value);
      if (mediaIndex !== undefined) {
        startTransition(() => {
          setSelectedMediaIndex(mediaIndex);
        });
      }
    }
  }, [selectedOptions, variantMediaMap]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!detailsRef.current) return;

      const details = detailsRef.current;
      const { scrollTop, scrollHeight, clientHeight } = details;
      const isScrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
      const isScrolledToTop = scrollTop === 0;

      if (e.deltaY > 0 && !isScrolledToBottom) {
        e.preventDefault();
        details.scrollTop += e.deltaY;
      } else if (e.deltaY < 0 && !isScrolledToTop) {
        e.preventDefault();
        details.scrollTop += e.deltaY;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const handleOptionSelect = useCallback((optionName: string, value: string) => {
    startTransition(() => {
      setSelectedOptions(prev => ({
        ...prev,
        [optionName]: value
      }));
    });
  }, []);

  const formattedPrice = convertPrice(price);
  const formattedCompareAtPrice = compareAtPrice ? convertPrice(compareAtPrice) : null;

  const validOptions = useMemo(() => 
    product.options?.filter(option => {
      if (!option || !option.values || option.values.length === 0) return false;
      if (
        option.name === "Title" || 
        option.values.every(value => !value || value === "Default Title")
      ) {
        return false;
      }
      return option.values.some(value => value && value !== "");
    }) || []
  , [product.options]);

  const hasVariants = validOptions.length > 0;

  // Get first image for cart thumbnail
  const cartThumbnail = product.media?.edges?.find(
    media => media.node.mediaContentType === 'IMAGE'
  )?.node.image?.originalSrc || '';

  return (
    <div className={`
      flex flex-col md:flex-row h-full md:divide-x md:divide-[0.5px] divide-main-maroon
      ${isPending ? 'opacity-70' : ''}
    `}>
      <div className="w-full md:w-1/2 relative">
        <ProductGallery 
          media={product.media?.edges?.length > 0 
            ? product.media?.edges 
            : product.images.edges.map(edge => ({
                node: {
                  mediaContentType: 'IMAGE' as const,
                  image: edge.node
                }
              }))
          } 
          title={product.title}
          selectedMediaIndex={selectedMediaIndex}
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
        <div className="w-full h-full px-4 sm:px-6 md:px-24 overflow-y-auto">
          <div className="max-w-xl mx-auto space-y-4 md:space-y-6 min-h-screen flex flex-col justify-center py-6 md:py-16">
            {/* Header Section */}
            <div className="flex justify-between items-start">
              <div>
                {collection && (
                  <span className="text-sm">{collection.title.toUpperCase()}</span>
                )}
                <h1 className="text-xl md:text-xl font-medium leading-[1.2]">{product.title}</h1>
              </div>
              <div>
                <button 
                  onClick={handleShare}
                  className="p-2 hover:opacity-70 relative group"
                  aria-label="Share product"
                  disabled={isPending}
                >
                  <Share2 className="w-5 h-5" />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    {/* Hover tooltip */}
                    <span className="bg-main-maroon text-secondary-peach text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                      Share product
                    </span>
                    {/* Status message */}
                    {shareStatus.visible && (
                      <span className={`
                        absolute left-1/2 -translate-x-1/2 -bottom-8
                        text-xs px-2 py-1 rounded whitespace-nowrap
                        ${shareStatus.type === 'success' ? 'bg-green-600 text-white' : ''}
                        ${shareStatus.type === 'error' ? 'bg-red-600 text-white' : ''}
                      `}>
                        {shareStatus.message}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Price Section */}
            <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
              <p className={`text-3xl font-bold ${!isAvailable ? "opacity-70" : ""}`}>
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

            {/* Variants Section */}
            {hasVariants && (
              <div className="space-y-4">
                {validOptions.map((option) => (
                  <OptionSelector
                    key={option.id}
                    option={option}
                    selectedValue={selectedOptions[option.name] || option.values[0]}
                    onSelect={(value) => handleOptionSelect(option.name, value)}
                  />
                ))}
              </div>
            )}

            {/* About This Product */}
            <ProductDescription description={product.descriptionHtml} />

            {/* Product Care Link */}
            <div className="border-t border-main-maroon/20 pt-6">
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
              <div className="sticky bottom-0 left-0 right-0 bg-secondary-peach py-3 px-4 md:px-0 md:py-0 md:static mt-auto md:mt-0 z-40">
                <AddToCartButton
                  product={{
                    id: product.id,
                    variantId: selectedVariant.id,
                    title: selectedVariant.title === "Default Title" ? product.title : `${product.title} - ${selectedVariant.title}`,
                    price: parseFloat(selectedVariant.priceV2.amount),
                    image: selectedVariant.image?.originalSrc || cartThumbnail,
                  }}
                />
                
                {price >= 1 && price <= 2000 && (
                  <div className="text-xs md:text-sm text-main-maroon text-center mt-1.5 md:mt-4">
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
