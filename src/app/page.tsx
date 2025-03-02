import { Metadata } from "next";
import SaleBanner from "../components/Homepage/Banner";
import BrandDescription from "../components/Homepage/BrandDescription";
import InstagramFeed from "../components/Homepage/InstagramFeed";
import NewArrivals from "../components/Homepage/NewArrivals";
import ProductSlider from "../components/Homepage/ExclusiveMatcha";
import HomeSlider from "../components/Homepage/HomeSlider";
import shopify from "../lib/shopify";
import { ShopifyProduct } from "../types/shopify";
import { FadeIn } from "../components/ui/fade-in";

export const metadata: Metadata = {
  title: "Ada Studio | Premium Matcha, Glassware & Accessories",
  description: "Discover our curated collection of premium matcha, elegant glassware, and carefully selected accessories. Experience quality and style with Ada Studio.",
  openGraph: {
    title: "Ada Studio | Premium Matcha & Glassware",
    description: "Discover our curated collection of premium matcha, elegant glassware, and carefully selected accessories.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ada Studio Collection",
      },
    ],
  },
};

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
    9: "https://www.instagram.com/p/DFVxGFcTSAP/",
    10: "https://www.instagram.com/p/DA0FymySmRH/"
  }
} as const;

// Generate JSON-LD structured data
function generateStructuredData(newArrivals: NewArrivalProduct[], matchaProducts: MatchaProduct[]) {
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ada Studio",
    url: "https://adastudio.com",
    logo: "https://adastudio.com/adastudioslogo-maroon.svg",
    description: "Premium matcha, glassware, and accessories retailer",
    sameAs: [
      "https://www.instagram.com/adastudio",
      // Add other social media URLs here
    ],
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ada Studio",
    url: "https://adastudio.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://adastudio.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return [organizationStructuredData, websiteStructuredData];
}

export default async function Home() {
  const [newArrivals, matchaProducts] = await Promise.all([
    getNewArrivals(),
    getMatchaProducts()
  ]);

  const structuredData = generateStructuredData(newArrivals, matchaProducts);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="flex flex-col items-center justify-between w-full bg-secondary-peach overflow-hidden">
        <FadeIn>
          <div className="w-full">
            <SaleBanner />
            <NewArrivals products={newArrivals} />
            <ProductSlider products={matchaProducts} />
            <InstagramFeed config={INSTAGRAM_FEED_CONFIG} />
            <BrandDescription />
            <HomeSlider />
          </div>
        </FadeIn>
      </main>
    </>
  );
}
