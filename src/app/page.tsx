import SaleBanner from "@/components/Homepage/Banner";
import BrandDescription from "@/components/Homepage/BrandDescription";
import InstagramFeed from "@/components/Homepage/InstagramFeed";
import NewArrivals from "@/components/Homepage/NewArrivals";
import ExclusiveMatcha from "@/components/Homepage/ExclusiveMatcha";
import HomeSlider from "@/components/Homepage/HomeSlider";
import { shopifyFetch } from "@/lib/shopify";

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
    const response = await shopifyFetch<{
      collection: { products: { edges: { node: any }[] } };
    }>(query);
    
    if (!response.collection) {
      console.error("New Arrivals collection not found");
      return [];
    }

    return response.collection.products.edges.map(({ node }: { node: any }) => {
      const product = {
        id: node.id,
        title: node.title,
        handle: node.handle,
        variantId: node.variants.edges[0]?.node.id,
        price: parseFloat(node.variants.edges[0]?.node.price.amount),
        brand: "Ada Studios",
        images: node.images.edges.map((edge: any) => ({
          file: { url: edge.node.url },
        })),
      };
      console.log("Mapped product:", JSON.stringify(product, null, 2));
      return product;
    });
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
}

async function getMatchaProducts() {
  const query = `
    query getMatchaCollection {
      collection(id: "gid://shopify/Collection/322366046400") {
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
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
    const response = await shopifyFetch<{
      collection: { products: { edges: { node: any }[] } };
    }>(query);
    
    if (!response.collection) {
      console.error("Matcha collection not found");
      return [];
    }

    return response.collection.products.edges.map(({ node }: { node: any }) => ({
      id: node.id,
      name: node.title,
      handle: node.handle,
      price: parseFloat(node.variants.edges[0]?.node.price.amount),
      imageUrl: node.images.edges[0]?.node.url || "/placeholder.jpg"
    }));
  } catch (error) {
    console.error("Error fetching matcha products:", error);
    return [];
  }
}

export default async function Home() {
  const newArrivals = await getNewArrivals();
  const matchaProducts = await getMatchaProducts();
  
  console.log("New arrivals:", JSON.stringify(newArrivals, null, 2));
  console.log("Matcha products:", JSON.stringify(matchaProducts, null, 2));

  return (
    <main className="flex flex-col items-center justify-between bg-secondary-peach">
      <SaleBanner />
      <NewArrivals products={newArrivals} />
      <ExclusiveMatcha products={matchaProducts} />
      <InstagramFeed />
      <BrandDescription />
      <HomeSlider />
    </main>
  );
}
