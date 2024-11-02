import SaleBanner from "@/components/Homepage/Banner";
import BrandDescription from "@/components/Homepage/BrandDescription";
import InstagramFeed from "@/components/Homepage/InstagramFeed";
import NewArrivals from "@/components/Homepage/NewArrivals";
import ExclusiveMatcha from "@/components/Homepage/ExclusiveMatcha";
import HomeSlider from "@/components/Homepage/HomeSlider";
import { shopifyFetch } from "@/lib/shopify";

async function getNewArrivals() {
  const query = `
    {
      products(first: 8, sortKey: CREATED_AT, reverse: true) {
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
  `;

  try {
    const response = await shopifyFetch<{
      products: { edges: { node: any }[] };
    }>(query);
    console.log("Shopify response:", JSON.stringify(response, null, 2));
    return response.products.edges.map(({ node }: { node: any }) => {
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

export default async function Home() {
  const newArrivals = await getNewArrivals();
  console.log("New arrivals:", JSON.stringify(newArrivals, null, 2));

  return (
    <main className="flex flex-col items-center justify-between bg-secondary-peach">
      <SaleBanner />
      <NewArrivals products={newArrivals} />
      <ExclusiveMatcha />
      <InstagramFeed />
      <BrandDescription />
      <HomeSlider />
    </main>
  );
}
