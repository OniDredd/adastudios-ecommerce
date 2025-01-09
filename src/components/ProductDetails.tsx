'use client';

import { useState, useRef, useEffect, useMemo, useCallback, useTransition } from 'react';
import { ProductGallery } from './ProductGallery';
import { OptionSelector } from './OptionSelector';
import { ShopifyProduct } from '../lib/shopify';
import AddToCartButton from './AddToCartButton';
import { useCurrency } from './CurrencyProvider';
import { useCart } from './CartProvider';
import { Share2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

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
  
    // Process description text
    const { processedContent, shouldShowButton } = useMemo(() => {
      // If expanded, return full content
      if (isExpanded) {
        return {
          processedContent: description,
          shouldShowButton: true
        };
      }

      // Strip HTML tags to get plain text
      const plainText = description.replace(/<[^>]*>/g, '');
      
      // If text is short enough, return full content
      if (plainText.length <= CHAR_LIMIT) {
        return {
          processedContent: description,
          shouldShowButton: false
        };
      }

      // Find the last complete sentence within the limit
      let truncatedText = '';
      let currentLength = 0;
      const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [];
      
      for (const sentence of sentences) {
        if (currentLength + sentence.length <= CHAR_LIMIT) {
          truncatedText += sentence;
          currentLength += sentence.length;
        } else {
          break;
        }
      }

      // If no complete sentence found, truncate at last word
      if (!truncatedText) {
        const words = plainText.slice(0, CHAR_LIMIT).split(' ');
        words.pop(); // Remove last (potentially partial) word
        truncatedText = words.join(' ');
      }

      // Add ellipsis and wrap in paragraph
      const processedContent = `<p>${truncatedText.trim()}...</p>`;
      
      return {
        processedContent,
        shouldShowButton: true
      };
  }, [description, isExpanded]);

  const handleToggle = useCallback(() => {
    startTransition(() => {
      setIsExpanded(prev => !prev);
    });
  }, []);

  return (
    <div className="border-t border-main-maroon/20 pt-6">
      <h2 className="text-base font-medium text-main-maroon mb-3">About This Product</h2>
      <div className="relative min-h-[80px]">
        <div className="relative overflow-hidden">
          <div
            className={`
              prose prose-xs max-w-none text-main-maroon 
              [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2 
              [&>h3]:font-medium [&>h3]:text-base [&>h3]:mb-1.5
              transition-[max-height,opacity] duration-500 ease-in-out
              ${isPending ? 'opacity-70' : ''}
            `}
            style={{ 
              maxHeight: isExpanded ? '2000px' : '80px',
              opacity: isPending ? 0.7 : 1
            }}
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
          {shouldShowButton && (
            <div 
              className={`
                absolute bottom-0 left-0 right-0 
                bg-gradient-to-t from-secondary-peach to-transparent h-8
                transition-opacity duration-500
                ${isExpanded ? 'opacity-0' : 'opacity-100'}
              `}
            />
          )}
        </div>
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
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(() => {
    // Initialize with first variant's options
    const firstVariant = product.variants.edges[0]?.node;
    if (!firstVariant) return {};
    return firstVariant.selectedOptions.reduce((acc, option) => ({
      ...acc,
      [option.name]: option.value
    }), {});
  });
  
  const selectedMediaIndexRef = useRef(0);
  const [, forceUpdate] = useState({});
  
  // Initialize media index
  useEffect(() => {
    const firstVariant = product.variants.edges[0]?.node;
    if (firstVariant?.image?.originalSrc) {
      const mediaIndex = product.media?.edges?.findIndex(
        media => media.node.mediaContentType === 'IMAGE' && 
                 media.node.image?.originalSrc === firstVariant.image.originalSrc
      ) ?? -1;
      selectedMediaIndexRef.current = mediaIndex !== -1 ? mediaIndex : 0;
      forceUpdate({});
    }
  }, [product.variants.edges, product.media?.edges]);
  const [shareStatus, setShareStatus] = useState<{
    message: string;
    type: 'success' | 'error' | null;
    visible: boolean;
  }>({ message: '', type: null, visible: false });
  const detailsRef = useRef<HTMLDivElement>(null);
  const { convertPrice } = useCurrency();
  const { error: cartError } = useCart();

  // Find the selected variant and its corresponding media index
  const { selectedVariant, selectedVariantMediaIndex } = useMemo(() => {
    const variant = product.variants.edges.find(({ node }) => {
      return node.selectedOptions.every(
        option => selectedOptions[option.name] === option.value
      );
    })?.node || product.variants.edges[0]?.node;

    // Find the media index for this variant's image
    let mediaIndex = -1;
    if (variant?.image?.originalSrc) {
      const variantUrl = variant.image.originalSrc;
      const variantUrlBase = variantUrl.split('?')[0];
      const variantFilename = variantUrlBase.split('/').pop();
      
      // First try exact match in media edges
      mediaIndex = product.media?.edges?.findIndex(
        media => media.node.mediaContentType === 'IMAGE' && 
                 media.node.image?.originalSrc === variantUrl
      ) ?? -1;

      // Then try matching without URL parameters
      if (mediaIndex === -1) {
        mediaIndex = product.media?.edges?.findIndex(
          media => media.node.mediaContentType === 'IMAGE' && 
                   media.node.image?.originalSrc.split('?')[0] === variantUrlBase
        ) ?? -1;
      }

      // Then try matching just the filename
      if (mediaIndex === -1 && variantFilename) {
        mediaIndex = product.media?.edges?.findIndex(
          media => media.node.mediaContentType === 'IMAGE' && 
                   media.node.image?.originalSrc.split('/').pop()?.split('?')[0] === variantFilename
        ) ?? -1;
      }

      // If still not found, try the same process with images array
      if (mediaIndex === -1 && product.images?.edges) {
        const imageIndex = product.images.edges.findIndex(edge => {
          const imageUrl = edge.node.originalSrc;
          const imageUrlBase = imageUrl.split('?')[0];
          const imageFilename = imageUrlBase.split('/').pop();
          
          return imageUrl === variantUrl || 
                 imageUrlBase === variantUrlBase || 
                 imageFilename === variantFilename;
        });
        
        if (imageIndex !== -1) {
          const matchedImage = product.images.edges[imageIndex].node;
          // Find this image in the media array
          mediaIndex = product.media?.edges?.findIndex(
            media => media.node.mediaContentType === 'IMAGE' && 
                     media.node.image?.originalSrc === matchedImage.originalSrc
          ) ?? -1;
        }
      }

      console.log('Variant image lookup:', {
        variant: variant.title,
        variantUrl,
        variantUrlBase,
        variantFilename,
        mediaIndex,
        mediaUrls: product.media?.edges
          ?.filter(media => media.node.mediaContentType === 'IMAGE')
          .map(media => ({
            full: media.node.image?.originalSrc,
            base: media.node.image?.originalSrc.split('?')[0],
            filename: media.node.image?.originalSrc.split('/').pop()?.split('?')[0]
          })),
        imageUrls: product.images?.edges
          ?.map(edge => ({
            full: edge.node.originalSrc,
            base: edge.node.originalSrc.split('?')[0],
            filename: edge.node.originalSrc.split('/').pop()?.split('?')[0]
          }))
      });
    }

    return { selectedVariant: variant, selectedVariantMediaIndex: mediaIndex };
  }, [product.variants.edges, selectedOptions, product.media?.edges]);

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
        const variantUrl = variantImage.originalSrc;
        const variantUrlBase = variantUrl.split('?')[0];
        const variantFilename = variantUrlBase.split('/').pop();
        
        // Try all matching strategies
        let mediaIndex = -1;

        // 1. Exact match
        mediaIndex = product.media?.edges?.findIndex(
          media => media.node.mediaContentType === 'IMAGE' && 
                   media.node.image?.originalSrc === variantUrl
        ) ?? -1;

        // 2. Match without URL parameters
        if (mediaIndex === -1) {
          mediaIndex = product.media?.edges?.findIndex(
            media => media.node.mediaContentType === 'IMAGE' && 
                     media.node.image?.originalSrc.split('?')[0] === variantUrlBase
          ) ?? -1;
        }

        // 3. Match by filename
        if (mediaIndex === -1 && variantFilename) {
          mediaIndex = product.media?.edges?.findIndex(
            media => {
              if (media.node.mediaContentType !== 'IMAGE' || !media.node.image?.originalSrc) return false;
              const mediaFilename = media.node.image.originalSrc.split('/').pop()?.split('?')[0];
              // Remove any size suffixes (e.g., _100x, _medium, etc.) before comparing
              const cleanVariantFilename = variantFilename.replace(/_(small|medium|large|[0-9]+x[0-9]*|[0-9]+x|x[0-9]+)(?=\.[a-zA-Z]+$)/g, '');
              const cleanMediaFilename = mediaFilename?.replace(/_(small|medium|large|[0-9]+x[0-9]*|[0-9]+x|x[0-9]+)(?=\.[a-zA-Z]+$)/g, '');
              return cleanMediaFilename === cleanVariantFilename;
            }
          ) ?? -1;
        }

        // 4. Try matching in images array as last resort
        if (mediaIndex === -1 && product.images?.edges) {
          const imageIndex = product.images.edges.findIndex(edge => {
            const imageUrl = edge.node.originalSrc;
            const imageUrlBase = imageUrl.split('?')[0];
            const imageFilename = imageUrlBase.split('/').pop();
            
            // Try exact matches first
            if (imageUrl === variantUrl || imageUrlBase === variantUrlBase) return true;
            
            // Then try filename match with size suffix removal
            if (imageFilename && variantFilename) {
              const cleanVariantFilename = variantFilename.replace(/_(small|medium|large|[0-9]+x[0-9]*|[0-9]+x|x[0-9]+)(?=\.[a-zA-Z]+$)/g, '');
              const cleanImageFilename = imageFilename.replace(/_(small|medium|large|[0-9]+x[0-9]*|[0-9]+x|x[0-9]+)(?=\.[a-zA-Z]+$)/g, '');
              return cleanImageFilename === cleanVariantFilename;
            }
            
            return false;
          });
          
          if (imageIndex !== -1) {
            const matchedImage = product.images.edges[imageIndex].node;
            mediaIndex = product.media?.edges?.findIndex(
              media => media.node.mediaContentType === 'IMAGE' && 
                       media.node.image?.originalSrc === matchedImage.originalSrc
            ) ?? -1;
          }
        }

        if (mediaIndex !== -1) {
          const colorOption = variant.node.selectedOptions.find(
            opt => opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('colour')
          );
          if (colorOption) {
            map.set(colorOption.value, mediaIndex);
            console.log('Color variant mapped:', {
              color: colorOption.value,
              mediaIndex,
              variantTitle: variant.node.title
            });
          }
        }
      }
    });
    return map;
  }, [product.variants.edges, product.media?.edges, product.images?.edges]);

  // Handle variant changes and manual gallery navigation
  const handleMediaChange = useCallback((index: number) => {
    console.log('Manual gallery navigation:', index);
    selectedMediaIndexRef.current = index;
    forceUpdate({});
  }, []);

  // Update selected media index when variant changes
  useEffect(() => {
    let newIndex = -1;
    
    if (selectedVariantMediaIndex !== -1) {
      newIndex = selectedVariantMediaIndex;
    } else {
      // Fall back to color-based mapping if no variant image match found
      const colorOption = Object.entries(selectedOptions).find(
        ([name]) => name.toLowerCase().includes('color') || name.toLowerCase().includes('colour')
      );
      
      if (colorOption) {
        const [_, value] = colorOption;
        const mediaIndex = variantMediaMap.get(value);
        if (mediaIndex !== undefined) {
          newIndex = mediaIndex;
        }
      }
    }
    
    if (newIndex !== -1 && newIndex !== selectedMediaIndexRef.current) {
      selectedMediaIndexRef.current = newIndex;
      forceUpdate({});
    }
  }, [selectedOptions, variantMediaMap, selectedVariantMediaIndex]);

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

  // Calculate which variants are out of stock for each option
  const outOfStockOptions = useMemo(() => {
    const outOfStock = new Map<string, Set<string>>();
    
    product.variants.edges.forEach(({ node: variant }) => {
      if (!variant.availableForSale) {
        variant.selectedOptions.forEach(option => {
          if (!outOfStock.has(option.name)) {
            outOfStock.set(option.name, new Set());
          }
          outOfStock.get(option.name)?.add(option.value);
        });
      }
    });
    
    return outOfStock;
  }, [product.variants.edges]);

  const handleOptionSelect = useCallback((optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
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
    <div className="flex flex-col md:flex-row h-full md:divide-x md:divide-[0.5px] divide-main-maroon">
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
          selectedMediaIndex={selectedMediaIndexRef.current}
          onMediaChange={handleMediaChange}
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
                  disabled={false}
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
            <div className="space-y-2">
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
              
              {/* Stock Indicator */}
              <div className="flex items-center gap-2">
                {selectedVariant?.quantityAvailable === 0 ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-main-maroon/30" />
                    <span className="text-sm font-medium text-main-maroon/70">Out of Stock</span>
                  </div>
                ) : selectedVariant?.quantityAvailable <= 5 ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-main-maroon/50" />
                    <span className="text-sm font-medium text-main-maroon">
                      Only {selectedVariant.quantityAvailable} {selectedVariant.quantityAvailable === 1 ? 'unit' : 'units'} left
                    </span>
                  </div>
                ) : null}
              </div>
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
                    disabledValues={Array.from(outOfStockOptions.get(option.name) || [])}
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
                {cartError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{cartError}</span>
                  </div>
                )}
                <AddToCartButton
                  product={{
                    id: product.id,
                    variantId: selectedVariant.id,
                    title: selectedVariant.title === "Default Title" ? product.title : `${product.title} - ${selectedVariant.title}`,
                    price: parseFloat(selectedVariant.priceV2.amount),
                    image: selectedVariant.image?.originalSrc || cartThumbnail,
                  }}
                  disabled={!selectedVariant.availableForSale}
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
