import SaleBanner from "@/components/Homepage/Banner";
import BrandDescription from "@/components/Homepage/BrandDescription";
import InstagramFeed from "@/components/Homepage/InstagramFeed";
import NewArrivals from "@/components/Homepage/NewArrivals";
import ProductSlider from "@/components/Homepage/ExclusiveMatcha";
import HomeSlider from "@/components/Homepage/HomeSlider";
import shopify from '../lib/shopify';
import { ShopifyProduct } from '../types/shopify';

async function getNewArrivals() {
  const query = `
    query getNewArrivalsCollection {
      collection(id: "gid://shopify/Collection/322367914176") {
        products(first: 8) {
          edges {
            node {
              id
              title
              handle
              availableForSale
              images(first: 1) {
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
      collection: { products: { edges: { node: any }[] } };
    }>(query);
    
    if (!response.collection) {
      return [];
    }

    return response.collection.products.edges.map(({ node }: { node: any }) => {
      const variant = node.variants.edges[0]?.node;
      const product = {
        id: node.id,
        title: node.title,
        handle: node.handle,
        variantId: variant?.id || node.id,
        price: parseFloat(variant?.price.amount || "0"),
        brand: "Ada Studios",
        availableForSale: variant ? variant.availableForSale : node.availableForSale,
        images: node.images.edges.map((edge: any) => ({
          file: { url: edge.node.url },
        })),
      };
      return product;
    });
  } catch (error) {
    return [];
  }
}

async function getMatchaProducts() {
  try {
    // First get all collections to find the correct matcha collection handle
    const collections = await shopify.getCollections();
    const matchaCollection = collections.find(collection => 
      collection.handle.toLowerCase().includes('matcha') || 
      collection.title.toLowerCase().includes('matcha')
    );

    if (!matchaCollection) {
      return [];
    }

    // Use the found collection handle
    const products = await shopify.getProductsByCollection(matchaCollection.handle);
    
    return products.map((product: ShopifyProduct) => {
      const variant = product.variants.edges[0]?.node;
      const isAvailable = variant ? variant.availableForSale : product.availableForSale;
      
      
      return {
        id: product.id,
        name: product.title,
        handle: product.handle,
        price: parseFloat(product.priceRange.minVariantPrice.amount),
        imageUrl: product.images.edges[0]?.node.originalSrc || "/placeholder.jpg",
        availableForSale: isAvailable
      };
    });
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const newArrivals = await getNewArrivals();
  const matchaProducts = await getMatchaProducts();
  
  return (
    <main className="flex flex-col items-center justify-between bg-secondary-peach">
      <SaleBanner />
      <NewArrivals products={newArrivals} />
      <ProductSlider products={matchaProducts} />
      <InstagramFeed />
      <BrandDescription />
      <HomeSlider />
    </main>
  );
}
