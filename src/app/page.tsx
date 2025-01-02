import SaleBanner from "@/components/Homepage/Banner";
import BrandDescription from "@/components/Homepage/BrandDescription";
import InstagramFeed from "@/components/Homepage/InstagramFeed";
import NewArrivals from "@/components/Homepage/NewArrivals";
import ProductSlider from "@/components/Homepage/ExclusiveMatcha";
import HomeSlider from "@/components/Homepage/HomeSlider";
import shopify from '@/lib/shopify';
import { ShopifyProduct } from '@/types/shopify';

interface NewArrivalProduct {
  id: string;
  title: string;
  handle: string;
  variantId: string;
  price: number;
  brand: string;
  availableForSale: boolean;
  images: Array<{ file: { url: string } }>;
}

interface MatchaProduct {
  id: string;
  name: string;
  handle: string;
  price: number;
  imageUrl: string;
  availableForSale: boolean;
}

async function getNewArrivals(): Promise<NewArrivalProduct[]> {
  const query = `
    query getNewArrivalsCollection {
      collection(id: "gid://shopify/Collection/322367914176") {
        products(first: 20) {
          edges {
            node {
              id
              title
              handle
              availableForSale
              images(first: 2) {
                edges {
                  node {
                    url: originalSrc
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    availableForSale
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopify.shopifyFetch<{
      collection: { 
        products: { 
          edges: Array<{ 
            node: {
              id: string;
              title: string;
              handle: string;
              availableForSale: boolean;
              images: {
                edges: Array<{
                  node: {
                    url: string;
                    altText: string;
                  }
                }>
              };
              variants: {
                edges: Array<{
                  node: {
                    id: string;
                    availableForSale: boolean;
                    price: {
                      amount: string;
                      currencyCode: string;
                    }
                  }
                }>
              }
            } 
          }> 
        } 
      }
    }>(query);
    
    if (!response.collection) {
      return [];
    }

    return response.collection.products.edges.map(({ node }) => {
      const variant = node.variants.edges[0]?.node;
      return {
        id: node.id,
        title: node.title,
        handle: node.handle,
        variantId: variant?.id || node.id,
        price: parseFloat(variant?.price.amount || "0"),
        brand: "Ada Studios",
        availableForSale: variant ? variant.availableForSale : node.availableForSale,
        images: node.images.edges.map(edge => ({
          file: { url: edge.node.url },
        })),
      };
    });
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
}

async function getMatchaProducts(): Promise<MatchaProduct[]> {
  try {
    const collections = await shopify.getCollections();
    const matchaCollection = collections.find(collection => 
      collection.handle.toLowerCase().includes('matcha') || 
      collection.title.toLowerCase().includes('matcha')
    );

    if (!matchaCollection) {
      console.warn('Matcha collection not found');
      return [];
    }

    const products = await shopify.getProductsByCollection(matchaCollection.handle);
    
    return products.map((product: ShopifyProduct) => {
      const variant = product.variants.edges[0]?.node;
      return {
        id: product.id,
        name: product.title,
        handle: product.handle,
        price: parseFloat(product.priceRange.minVariantPrice.amount),
        imageUrl: product.images.edges[0]?.node.originalSrc || "/placeholder.jpg",
        availableForSale: variant?.availableForSale ?? product.availableForSale
      };
    });
  } catch (error) {
    console.error('Error fetching matcha products:', error);
    return [];
  }
}

const INSTAGRAM_FEED_CONFIG = {
  positions: {
    1: "https://www.instagram.com/p/DBm_4feyWKt/",
    2: "https://www.instagram.com/p/C9TXTizyvrv/",
    3: "https://www.instagram.com/p/C7yOMEAPGSX/",
    4: "https://www.instagram.com/p/C6-ivdyLhjO/",
    5: "https://www.instagram.com/p/CvYA2EspiFD/",
    6: "https://www.instagram.com/p/C5IL9kSsDxN/",
    7: "https://www.instagram.com/p/DAVHVgmyJ1b/",
    8: "https://www.instagram.com/p/CwtdH_YpcO8/",
    9: "https://www.instagram.com/p/Cta1dDFLE1y/",
    10: "https://www.instagram.com/p/DA0FymySmRH/"
  }
} as const;

export default async function Home() {
  const [newArrivals, matchaProducts] = await Promise.all([
    getNewArrivals(),
    getMatchaProducts()
  ]);
  
  return (
    <main className="flex flex-col items-center justify-between bg-secondary-peach">
      <SaleBanner />
      <NewArrivals products={newArrivals} />
      <ProductSlider products={matchaProducts} />
      <InstagramFeed config={INSTAGRAM_FEED_CONFIG} />
      <BrandDescription />
      <HomeSlider />
    </main>
  );
}
