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
  vendor: string;
  tags: string[];
  availableForSale: boolean;
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
        availableForSale: boolean;
        quantityAvailable: number;
        priceV2: {
          amount: string;
          currencyCode: string;
        };
        compareAtPriceV2: {
          amount: string;
          currencyCode: string;
        } | null;
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

// New Cart Types
interface CartCreateResponse {
  cartCreate: {
    cart: Cart;
    userErrors: UserError[];
  };
}

interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: Cart;
    userErrors: UserError[];
  };
}

interface Cart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
  cost: {
    totalAmount: Money;
    subtotalAmount: Money;
    totalTaxAmount: Money | null;
  };
}

interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    priceV2: Money;
  };
}

interface Money {
  amount: string;
  currencyCode: string;
}

interface UserError {
  field: string[];
  message: string;
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

// New Cart API Functions
export async function createCart(): Promise<Cart> {
  const mutation = `
    mutation cartCreate {
      cartCreate {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          buyerIdentity {
            email
            phone
            customer {
              id
            }
            countryCode
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await shopifyFetch<CartCreateResponse>(mutation);
  if (response.cartCreate.userErrors.length > 0) {
    throw new Error(response.cartCreate.userErrors[0].message);
  }
  return response.cartCreate.cart;
}

export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
  const mutation = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          buyerIdentity {
            email
            phone
            customer {
              id
            }
            countryCode
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: lines.map(line => ({
      merchandiseId: line.merchandiseId,
      quantity: line.quantity,
    })),
  };

  const response = await shopifyFetch<CartLinesAddResponse>(mutation, variables);
  if (response.cartLinesAdd.userErrors.length > 0) {
    throw new Error(response.cartLinesAdd.userErrors[0].message);
  }
  return response.cartLinesAdd.cart;
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
              vendor
              tags
              availableForSale
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
              variants(first: 1) {
                edges {
                  node {
                    availableForSale
                    quantityAvailable
                    priceV2 {
                      amount
                      currencyCode
                    }
                    compareAtPriceV2 {
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
            vendor
            tags
            availableForSale
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
            variants(first: 1) {
              edges {
                node {
                  availableForSale
                  quantityAvailable
                  priceV2 {
                    amount
                    currencyCode
                  }
                  compareAtPriceV2 {
                    amount
                    currencyCode
                  }
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
        vendor
        tags
        availableForSale
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
              availableForSale
              quantityAvailable
              priceV2 {
                amount
                currencyCode
              }
              compareAtPriceV2 {
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
            vendor
            tags
            availableForSale
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
                  availableForSale
                  quantityAvailable
                  priceV2 {
                    amount
                    currencyCode
                  }
                  compareAtPriceV2 {
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
  createCart,
  addToCart,
};
