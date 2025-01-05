import { SimpleProduct } from "../lib/shopify";

export interface IncomingProduct {
  id?: string;
  title?: string;
  handle?: string;
  variantId?: string;
  price?: number | string;
  compareAtPrice?: number;
  vendor?: string;
  availableForSale?: boolean;
  quantityAvailable?: number;
  tags?: string[];
  variants?: {
    edges: Array<{
      node: {
        quantityAvailable: number;
      };
    }>;
  };
  images?: Array<{
    file: {
      url: string;
    };
  }>;
}

export interface ExclusiveMatchaProduct {
  id: string;
  name: string;
  handle: string;
  price: number;
  imageUrl: string;
  availableForSale: boolean;
}

export const transformIncomingProduct = (product: IncomingProduct): SimpleProduct => ({
  id: product.id || "",
  title: product.title || "",
  handle: product.handle || "",
  variantId: product.variantId || product.id || "",
  price: typeof product.price === "number" ? product.price : parseFloat(product.price?.toString() || "0"),
  compareAtPrice: product.compareAtPrice,
  vendor: "Ada Studios", // Always set a default vendor
  availableForSale: product.availableForSale ?? true,
  quantityAvailable: product.variants?.edges?.reduce((total: number, edge) => 
    total + (edge.node.quantityAvailable || 0), 0) ?? product.quantityAvailable ?? 0,
  tags: product.tags || [],
  media: {
    edges: (product.images || []).map((image) => ({
      node: {
        mediaContentType: 'IMAGE' as const,
        image: {
          originalSrc: image.file.url,
          altText: null
        }
      }
    }))
  }
});
