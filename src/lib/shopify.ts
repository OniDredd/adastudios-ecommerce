import { GraphQLClient } from 'graphql-request';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !storefrontAccessToken) {
  throw new Error('Shopify configuration is missing');
}

const apiVersion = process.env.NEXT_PUBLIC_STOREFRONT_API_VERSION || '2024-01';
const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export interface ShopifyImage {
  originalSrc: string;
  altText: string | null;
}

export interface ShopifyVideo {
  sources: Array<{
    url: string;
    mimeType: string;
    format: string;
    height: number;
    width: number;
  }>;
}

export interface ShopifyMediaEdge {
  node: {
    mediaContentType: 'IMAGE' | 'VIDEO';
    image?: ShopifyImage;
    sources?: ShopifyVideo['sources'];
  };
}

export interface SimpleProduct {
  id: string;
  title: string;
  handle: string;
  variantId: string;
  price: number;
  compareAtPrice?: number;
  vendor: string;
  availableForSale: boolean;
  quantityAvailable: number;
  tags: string[];
  media: {
    edges: ShopifyMediaEdge[];
  };
  collections?: {
    edges: Array<{
      node: {
        id: string;
        handle: string;
      };
    }>;
  };
}

export interface ShopifyProduct {
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
  media: {
    edges: ShopifyMediaEdge[];
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
  collections?: {
    edges: Array<{
      node: {
        id: string;
        handle: string;
      };
    }>;
  };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
}

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

interface CartLinesRemoveResponse {
  cartLinesRemove: {
    cart: Cart;
    userErrors: UserError[];
  };
}

interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
  cost: {
    totalAmount: Money;
    subtotalAmount: Money;
  };
}

interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: Money;
    product: {
      title: string;
      handle: string;
    };
  };
}

interface Money {
  amount: string;
  currencyCode: string;
}

interface UserError {
  field: string[];
  message: string;
  code: string;
}

type CartErrorCode = 
  | 'INVALID_INPUT'
  | 'INVALID_QUANTITY'
  | 'MISSING_FIELD'
  | 'INVALID_MERCHANDISE_LINE'
  | 'INVENTORY_OUT_OF_STOCK';

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  try {
    const data = await graphQLClient.request<T>(query, variables);
    return data;
  } catch (error: any) {
    if (error.response?.headers?.['content-type']?.includes('text/html')) {
      throw new Error('Received HTML response instead of JSON. This might be an authentication issue.');
    }
    
    if (error.response?.errors) {
      throw new Error(`Shopify API Error: ${JSON.stringify(error.response.errors)}`);
    }

    throw new Error(`Failed to fetch data from Shopify: ${error.message}`);
  }
}

export async function createCart(currencyCode?: string): Promise<Cart> {
  const countryCode = currencyCode === 'AUD' ? 'AU' : 'NZ';
  const presentmentCurrencyCode = currencyCode || 'NZD';
  const mutation = `
    mutation cartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      handle
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
          }
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  try {
    const variables = currencyCode ? {
      input: {
        buyerIdentity: {
          countryCode
        },
        lines: [],
        attributes: [
          {
            key: "presentmentCurrency",
            value: presentmentCurrencyCode
          }
        ]
      }
    } : {};

    const response = await shopifyFetch<CartCreateResponse>(mutation, variables);
    if (response.cartCreate.userErrors.length > 0) {
      const error = response.cartCreate.userErrors[0];
      throw new Error(`Cart creation failed: ${error.message}`);
    }
    return response.cartCreate.cart;
  } catch (error: any) {
    if (error.message.includes('HTML response')) {
      throw new Error('Unable to connect to checkout. Please check your internet connection and try again.');
    }
    throw error;
  }
}

export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
  const mutation = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(
        cartId: $cartId
        lines: $lines
      ) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      handle
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
          }
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  try {
    const variables = {
      cartId,
      lines: lines.map(line => ({
        merchandiseId: line.merchandiseId,
        quantity: line.quantity,
      })),
    };

    const response = await shopifyFetch<CartLinesAddResponse>(mutation, variables);
    if (response.cartLinesAdd.userErrors.length > 0) {
      const error = response.cartLinesAdd.userErrors[0];
      let errorMessage = 'Failed to add items to cart';
      
      switch (error.code as CartErrorCode) {
        case 'INVALID_QUANTITY':
          errorMessage = 'Invalid quantity selected';
          break;
        case 'INVENTORY_OUT_OF_STOCK':
          errorMessage = 'Item is out of stock';
          break;
        case 'INVALID_MERCHANDISE_LINE':
          errorMessage = 'One or more items are no longer available';
          break;
        default:
          errorMessage = `Failed to add items to cart: ${error.message}`;
      }
      
      throw new Error(errorMessage);
    }
    return response.cartLinesAdd.cart;
  } catch (error: any) {
    if (error.message.includes('HTML response')) {
      throw new Error('Unable to connect to checkout. Please check your internet connection and try again.');
    }
    throw error;
  }
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const mutation = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(
        cartId: $cartId
        lineIds: $lineIds
      ) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      handle
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
          }
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  try {
    const variables = {
      cartId,
      lineIds,
    };

    const response = await shopifyFetch<CartLinesRemoveResponse>(mutation, variables);
    if (response.cartLinesRemove.userErrors.length > 0) {
      const error = response.cartLinesRemove.userErrors[0];
      throw new Error(`Failed to remove items from cart: ${error.message}`);
    }
    return response.cartLinesRemove.cart;
  } catch (error: any) {
    if (error.message.includes('HTML response')) {
      throw new Error('Unable to connect to checkout. Please check your internet connection and try again.');
    }
    throw error;
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
        products(first: $first, sortKey: COLLECTION_DEFAULT) {
          edges {
            node {
              id
              title
              handle
              description
              vendor
              tags
              availableForSale
              collections(first: 5) {
                edges {
                  node {
                    id
                    handle
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 20) {
                edges {
                  node {
                    originalSrc
                    altText
                  }
                }
              }
              media(first: 20) {
                edges {
                  node {
                    ... on MediaImage {
                      mediaContentType
                      image {
                        originalSrc
                        altText
                      }
                    }
                    ... on Video {
                      mediaContentType
                      sources {
                        url
                        mimeType
                        format
                        height
                        width
                      }
                    }
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

  const response = await shopifyFetch<ProductsByCollectionResponse>(query, { 
    handle: collectionHandle, 
    first: 250
  });
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
            images(first: 20) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
            media(first: 20) {
              edges {
                node {
                  ... on MediaImage {
                    mediaContentType
                    image {
                      originalSrc
                      altText
                    }
                  }
                  ... on Video {
                    mediaContentType
                    sources {
                      url
                      mimeType
                      format
                      height
                      width
                    }
                  }
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
        images(first: 20) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        media(first: 20) {
          edges {
            node {
              ... on MediaImage {
                mediaContentType
                image {
                  originalSrc
                  altText
                }
              }
              ... on Video {
                mediaContentType
                sources {
                  url
                  mimeType
                  format
                  height
                  width
                }
              }
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
    return null;
  }
}

export async function getProducts({ limit = 250, priorityCollectionId = "" }: { limit?: number, priorityCollectionId?: string } = {}): Promise<ShopifyProduct[]> {
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
            collections(first: 5) {
              edges {
                node {
                  id
                  handle
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 20) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
            media(first: 20) {
              edges {
                node {
                  ... on MediaImage {
                    mediaContentType
                    image {
                      originalSrc
                      altText
                    }
                  }
                  ... on Video {
                    mediaContentType
                    sources {
                      url
                      mimeType
                      format
                      height
                      width
                    }
                  }
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
        node: ShopifyProduct & {
          collections: {
            edges: Array<{
              node: {
                id: string;
                handle: string;
              };
            }>;
          };
        };
      }>;
    };
  }

  const response = await shopifyFetch<ProductsResponse>(query, { first: limit });
  const products = response.products.edges.map(edge => edge.node);

  // If a priority collection ID is provided, sort products based on that collection
  if (priorityCollectionId) {
    const inCollection: ShopifyProduct[] = [];
    const outOfCollection: ShopifyProduct[] = [];

    products.forEach(product => {
      if (product.collections.edges.some(edge => edge.node.id === priorityCollectionId)) {
        inCollection.push(product);
      } else {
        outOfCollection.push(product);
      }
    });

    // Return products in the priority collection first, followed by other products
    return [...inCollection, ...outOfCollection];
  }

  return products;
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  const mutation = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      handle
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
          }
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  try {
    const variables = {
      cartId,
      lines: [{
        id: lineId,
        quantity: quantity
      }]
    };

    const response = await shopifyFetch<{
      cartLinesUpdate: {
        cart: Cart;
        userErrors: UserError[];
      }
    }>(mutation, variables);

    if (response.cartLinesUpdate.userErrors.length > 0) {
      const error = response.cartLinesUpdate.userErrors[0];
      let errorMessage = 'Failed to update cart';
      
      switch (error.code as CartErrorCode) {
        case 'INVALID_QUANTITY':
          errorMessage = 'Invalid quantity selected';
          break;
        case 'INVENTORY_OUT_OF_STOCK':
          errorMessage = 'Item is out of stock';
          break;
        default:
          errorMessage = `Failed to update cart: ${error.message}`;
      }
      
      throw new Error(errorMessage);
    }
    return response.cartLinesUpdate.cart;
  } catch (error: any) {
    if (error.message.includes('HTML response')) {
      throw new Error('Unable to connect to checkout. Please check your internet connection and try again.');
    }
    throw error;
  }
}

export async function updateCartBuyerIdentity(cartId: string, currencyCode: string): Promise<Cart> {
  const mutation = `
    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(
        cartId: $cartId,
        buyerIdentity: $buyerIdentity
      ) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      handle
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
          }
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  const countryCode = currencyCode === 'AUD' ? 'AU' : 'NZ';
  const variables = {
    cartId,
    buyerIdentity: {
      countryCode,
      currencyCode
    }
  };

  try {
    const response = await shopifyFetch<{
      cartBuyerIdentityUpdate: {
        cart: Cart;
        userErrors: UserError[];
      }
    }>(mutation, variables);

    if (response.cartBuyerIdentityUpdate.userErrors.length > 0) {
      const error = response.cartBuyerIdentityUpdate.userErrors[0];
      throw new Error(`Failed to update cart currency: ${error.message}`);
    }

    return response.cartBuyerIdentityUpdate.cart;
  } catch (error: any) {
    if (error.message.includes('HTML response')) {
      throw new Error('Unable to connect to checkout. Please check your internet connection and try again.');
    }
    throw error;
  }
}

const shopifyClient = {
  getCollections,
  getProductsByCollection,
  searchProducts,
  shopifyFetch,
  getProductByHandle,
  getProducts,
  createCart,
  addToCart,
  removeFromCart,
  updateCartLine,
  updateCartBuyerIdentity,
};

export default shopifyClient;
