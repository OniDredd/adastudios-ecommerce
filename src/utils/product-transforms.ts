import { ShopifyProduct, SimpleProduct } from '../lib/shopify';

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
  quantityAvailable: product.variants.edges[0]?.node.quantityAvailable || 0,
  tags: product.tags,
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
