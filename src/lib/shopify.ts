import { GraphQLClient } from 'graphql-request';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !storefrontAccessToken) {
  throw new Error('Shopify configuration is missing');
}

const endpoint = `https://${domain}/api/2023-07/graphql.json`;

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

interface ShopifyImage {
  originalSrc: string;
  altText: string | null;
}

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
    id: string;
  }>;
  variants: {
    edges: Array<{
      node: {
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
        image: ShopifyImage;
        title: string;
        id: string;
        priceV2: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
}

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  try {
    const data = await graphQLClient.request<T>(query, variables);
    return data;
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    throw new Error('Failed to fetch data from Shopify');
  }
}

export async function getCollections(): Promise<ShopifyCollection[]> {
  const query = `
    query getCollections {
      collections(first: 250) {
        edges {
          node {
            id
            handle
            title
            description
          }
        }
      }
    }
  `;

  interface CollectionsResponse {
    collections: {
      edges: Array<{
        node: ShopifyCollection;
      }>;
    };
  }

  const response = await shopifyFetch<CollectionsResponse>(query);
  return response.collections.edges.map(edge => edge.node);
}

export async function getProductsByCollection(collectionHandle: string): Promise<ShopifyProduct[]> {
  const query = `
    query getProductsByCollection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        products(first: $first) {
          edges {
            node {
              id
              title
              handle
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  interface ProductsByCollectionResponse {
    collection: {
      products: {
        edges: Array<{
          node: ShopifyProduct;
        }>;
      };
    };
  }

  const response = await shopifyFetch<ProductsByCollectionResponse>(query, { handle: collectionHandle, first: 250 });
  return response.collection.products.edges.map(edge => edge.node);
}

export async function searchProducts(searchTerm: string): Promise<ShopifyProduct[]> {
  const query = `
    query searchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
          }
        }
      }
    }`;

  interface SearchProductsResponse {
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  }

  const response = await shopifyFetch<SearchProductsResponse>(query, { query: searchTerm, first: 20 });
  return response.products.edges.map(edge => edge.node);
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        options {
          name
          values
          id
        }
        variants(first: 250) {
          edges {
            node {
              selectedOptions {
                name
                value
              }
              image {
                originalSrc
                altText
              }
              title
              id
              priceV2 {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  interface ProductResponse {
    product: ShopifyProduct;
  }

  try {
    const response = await shopifyFetch<ProductResponse>(query, { handle });
    return response.product;
  } catch (error) {
    console.error('Error fetching product by handle:', error);
    return null;
  }
}

export async function getProducts({ limit = 250 }: { limit?: number } = {}): Promise<ShopifyProduct[]> {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
            options {
              name
              values
              id
            }
            variants(first: 250) {
              edges {
                node {
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    originalSrc
                    altText
                  }
                  title
                  id
                  priceV2 {
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

  interface ProductsResponse {
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  }

  const response = await shopifyFetch<ProductsResponse>(query, { first: limit });
  return response.products.edges.map(edge => edge.node);
}

export default {
  getCollections,
  getProductsByCollection,
  searchProducts,
  shopifyFetch,
  getProductByHandle,
  getProducts,
};