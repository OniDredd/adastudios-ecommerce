'use client';

import React from 'react';
import Link from 'next/link';
import { ProductGallery } from './ProductGallery';
import { OptionSelector } from './OptionSelector';
import { ShopifyProduct } from '../lib/shopify';
import AddToCartButton from './AddToCartButton';
import { useCurrency } from './CurrencyProvider';
import { useCart } from './CartProvider';
import { Share2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Types
interface SelectedOptions {
  [key: string]: string;
}

interface ProductDetailsProps {
  product: ShopifyProduct;
  collection?: {
    title: string;
  };
}

// Subcomponents
const ProductDescription = React.memo(({ description }: { description: string }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [previewContent, setPreviewContent] = React.useState('');
  const [fullContent, setFullContent] = React.useState('');

  React.useEffect(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    
    // Get first paragraph or first 80px worth of content for preview
    const firstParagraph = tempDiv.querySelector('p');
    if (firstParagraph) {
      setPreviewContent(firstParagraph.outerHTML);
      firstParagraph.remove();
      setFullContent(tempDiv.innerHTML);
    } else {
      setPreviewContent(description);
      setFullContent('');
    }
  }, [description]);

  return (
    <div className="border-t border-main-maroon/20 pt-4 pb-4">
      <h2 className="text-sm font-medium text-main-maroon mb-2">About This Product</h2>
      <div className="relative">
        <motion.div layout>
          {/* Preview content - always visible */}
          <div 
            className={cn(
              'prose prose-xs max-w-none text-main-maroon text-sm space-y-2',
              '[&>p]:mb-2 [&>ul]:list-none [&>ul]:pl-0 [&>ul]:mb-2 [&>ul>li]:mb-1',
              '[&>h3]:font-medium [&>h3]:text-sm [&>h3]:mb-1',
              '[&_strong]:font-medium [&_strong]:text-main-maroon',
              'min-h-[80px]'
            )}
            dangerouslySetInnerHTML={{ __html: previewContent }}
          />
          
          {/* Expanded content with animation */}
          <AnimatePresence initial={false}>
            {isExpanded && fullContent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: "auto",
                  opacity: 1,
                  transition: {
                    height: { duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] },
                    opacity: { duration: 0.25, delay: 0.15 }
                  }
                }}
                exit={{ 
                  height: 0,
                  opacity: 0,
                  transition: {
                    height: { duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] },
                    opacity: { duration: 0.25 }
                  }
                }}
                className="overflow-hidden"
              >
                <div
                  className={cn(
                    'prose prose-xs max-w-none text-main-maroon text-sm space-y-2',
                    '[&>p]:mb-2 [&>ul]:list-none [&>ul]:pl-0 [&>ul]:mb-2 [&>ul>li]:mb-1',
                    '[&>h3]:font-medium [&>h3]:text-sm [&>h3]:mb-1',
                    '[&_strong]:font-medium [&_strong]:text-main-maroon',
                  )}
                  dangerouslySetInnerHTML={{ __html: fullContent }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {!isExpanded && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-secondary-peach to-transparent h-8 pointer-events-none z-10" />
        )}
      </div>
      <button
        onClick={() => startTransition(() => setIsExpanded(prev => !prev))}
        disabled={isPending}
        className="mt-2 flex items-center gap-1 text-xs text-main-maroon/70 hover:text-main-maroon transition-colors disabled:opacity-50"
      >
        {isExpanded ? (
          <>Read Less <ChevronUp className="w-4 h-4" /></>
        ) : (
          <>Read More <ChevronDown className="w-4 h-4" /></>
        )}
      </button>
    </div>
  );
});

ProductDescription.displayName = 'ProductDescription';

// Main Component
export default function ProductDetails({ product, collection }: ProductDetailsProps) {
  // State
  const [selectedOptions, setSelectedOptions] = React.useState<SelectedOptions>(() => {
    const firstVariant = product.variants.edges[0]?.node;
    if (!firstVariant) return {};
    return firstVariant.selectedOptions.reduce((acc, option) => ({
      ...acc,
      [option.name]: option.value
    }), {});
  });

  const [shareStatus, setShareStatus] = React.useState<{
    message: string;
    type: 'success' | 'error' | null;
    visible: boolean;
  }>({ message: '', type: null, visible: false });

  const selectedMediaIndexRef = React.useRef(0);
  const [, forceUpdate] = React.useState({});
  const detailsRef = React.useRef<HTMLDivElement>(null);
  
  // Hooks
  const { convertPrice } = useCurrency();
  const { error: cartError } = useCart();

  // Memoized values
  const { selectedVariant, selectedVariantMediaIndex } = React.useMemo(() => {
    const variant = product.variants.edges.find(({ node }) => 
      node.selectedOptions.every(option => selectedOptions[option.name] === option.value)
    )?.node || product.variants.edges[0]?.node;

    let mediaIndex = -1;
    if (variant?.image?.originalSrc) {
      const variantUrl = variant.image.originalSrc;
      mediaIndex = product.media?.edges?.findIndex(
        media => media.node.mediaContentType === 'IMAGE' && 
                 media.node.image?.originalSrc === variantUrl
      ) ?? -1;
    }

    return { selectedVariant: variant, selectedVariantMediaIndex: mediaIndex };
  }, [product.variants.edges, selectedOptions, product.media?.edges]);

  const validOptions = React.useMemo(() => 
    product.options?.filter(option => {
      if (!option?.values?.length) return false;
      if (option.name === "Title" || option.values.every(value => !value || value === "Default Title")) {
        return false;
      }
      return option.values.some(value => value && value !== "");
    }) || []
  , [product.options]);

  const outOfStockOptions = React.useMemo(() => {
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

  // Derived values
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
  const hasVariants = validOptions.length > 0;
  const cartThumbnail = product.media?.edges?.find(
    media => media.node.mediaContentType === 'IMAGE'
  )?.node.image?.originalSrc || '';

  // Handlers
  const handleShare = React.useCallback(async () => {
    setShareStatus({ message: '', type: null, visible: false });
    
    const shareData = {
      title: product.title,
      text: `Check out ${product.title} on Ada Studios`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus({
          message: 'Link copied to clipboard!',
          type: 'success',
          visible: true
        });
        setTimeout(() => setShareStatus(prev => ({ ...prev, visible: false })), 3000);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setShareStatus({
          message: 'Failed to copy link',
          type: 'error',
          visible: true
        });
        setTimeout(() => setShareStatus(prev => ({ ...prev, visible: false })), 3000);
      }
    }
  }, [product.title]);

  const handleOptionSelect = React.useCallback((optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  }, []);

  const handleMediaChange = React.useCallback((index: number) => {
    selectedMediaIndexRef.current = index;
    forceUpdate({});
  }, []);

  // Effects
  React.useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!detailsRef.current) return;

      const details = detailsRef.current;
      const { scrollTop, scrollHeight, clientHeight } = details;
      const isScrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
      const isScrolledToTop = scrollTop === 0;

      if ((e.deltaY > 0 && !isScrolledToBottom) || (e.deltaY < 0 && !isScrolledToTop)) {
        e.preventDefault();
        details.scrollTop += e.deltaY;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  React.useEffect(() => {
    if (selectedVariantMediaIndex !== -1 && selectedVariantMediaIndex !== selectedMediaIndexRef.current) {
      selectedMediaIndexRef.current = selectedVariantMediaIndex;
      forceUpdate({});
    }
  }, [selectedVariantMediaIndex]);

  return (
    <div className="flex flex-col md:flex-row h-full md:divide-x md:divide-[0.5px] divide-main-maroon">
      {/* Product Gallery */}
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
      </div>

      {/* Product Details */}
      <div 
        ref={detailsRef}
        className="w-full md:w-1/2 min-h-screen md:max-h-screen bg-secondary-peach text-main-maroon scrollbar-thin scrollbar-thumb-main-maroon scrollbar-track-secondary-peach flex items-center"
      >
        <div className="w-full h-full flex justify-center items-centers px-4 sm:px-6 md:px-16 overflow-y-auto">
          <div className="max-w-xl mx-auto space-y-3 md:space-y-4 min-h-screen flex flex-col pt-24 md:pt-32 pb-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                {collection && (
                  <span className="text-sm">{collection.title.toUpperCase()}</span>
                )}
                <h1 className="text-lg md:text-xl font-medium leading-[1.2]">{product.title}</h1>
              </div>
              <button 
                onClick={handleShare}
                className="p-2 hover:opacity-70 relative group"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <span className="bg-main-maroon text-secondary-peach text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                    Share product
                  </span>
                  {shareStatus.visible && (
                    <span className={cn(
                      'absolute left-1/2 -translate-x-1/2 -bottom-8',
                      'text-xs px-2 py-1 rounded whitespace-nowrap',
                      shareStatus.type === 'success' && 'bg-green-600 text-white',
                      shareStatus.type === 'error' && 'bg-red-600 text-white'
                    )}>
                      {shareStatus.message}
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                <p className={cn("text-2xl font-bold", !isAvailable && "opacity-70")}>
                  {convertPrice(price)}
                </p>
                {isDiscounted && (
                  <>
                    <p className="text-lg line-through opacity-60">
                      {convertPrice(compareAtPrice)}
                    </p>
                    <span className="bg-main-maroon text-secondary-peach px-3 py-1 text-sm font-medium rounded-full">
                      {discountPercentage}% Off
                    </span>
                  </>
                )}
              </div>
              
              {/* Stock Status */}
              {selectedVariant?.quantityAvailable > 0 && selectedVariant?.quantityAvailable <= 5 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-main-maroon/50" />
                  <span className="text-sm font-medium text-main-maroon">
                    Only {selectedVariant.quantityAvailable} {selectedVariant.quantityAvailable === 1 ? 'unit' : 'units'} left
                  </span>
                </div>
              )}
            </div>

            {/* Variants */}
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

            {/* Add to Cart */}
            <div className="bg-secondary-peach">
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
                  <div className="text-xs text-main-maroon/80 text-center mt-2">
                    or 4 payments of {convertPrice(price / 4)} with <span className="font-medium">Afterpay</span>
                  </div>
                )}
              </div>

            {/* Description */}
            <ProductDescription description={product.descriptionHtml} />

            {/* Product Care */}
            <div className="border-t border-main-maroon/20 pt-4">
              <Link
                href="/care-instructions" 
                className="inline-flex items-center text-main-maroon hover:opacity-70 transition-opacity text-xs font-medium"
              >
                View Product Care Instructions
                <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
