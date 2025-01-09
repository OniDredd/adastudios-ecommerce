import { ShopifyProduct, SimpleProduct } from '../lib/shopify';

export const getDiscountPercentage = (product: ShopifyProduct): number => {
  const variant = product.variants.edges[0]?.node;
  if (!variant?.compareAtPriceV2 || !variant.priceV2) return 0;
  
  const originalPrice = parseFloat(variant.compareAtPriceV2.amount);
  const currentPrice = parseFloat(variant.priceV2.amount);
  
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const getInventoryQuantity = (product: ShopifyProduct): number => {
  return product.variants.edges.reduce((total, edge) => 
    total + (edge.node.quantityAvailable || 0), 0);
};

export const transformProduct = (product: ShopifyProduct): SimpleProduct => ({
  id: product.id,
  title: product.title,
  handle: product.handle,
  variantId: product.variants.edges[0]?.node.id || '',
  price: parseFloat(product.priceRange.minVariantPrice.amount),
  compareAtPrice: product.variants.edges[0]?.node.compareAtPriceV2
    ? parseFloat(product.variants.edges[0].node.compareAtPriceV2.amount)
    : undefined,
  vendor: product.vendor,
  availableForSale: product.availableForSale,
  quantityAvailable: product.variants.edges.reduce((total, edge) => 
    total + (edge.node.quantityAvailable || 0), 0),
  tags: product.tags,
  collections: product.collections,
  media: {
    edges: product.media.edges.length > 0 
      ? product.media.edges 
      : product.images.edges.map(edge => ({
          node: {
            mediaContentType: 'IMAGE' as const,
            image: edge.node
          }
        }))
  }
});
