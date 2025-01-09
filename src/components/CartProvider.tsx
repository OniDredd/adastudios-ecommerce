// components/CartProvider.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import shopifyClient from '../lib/shopify';
import { useCurrency } from './CurrencyProvider';

interface CartItem {
  id: string;          // Product ID
  lineId: string;      // Shopify cart line ID
  variantId: string;   // Shopify variant ID for checkout
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'lineId'>) => Promise<CartItem[]>;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isItemLoading: (variantId: string) => boolean;
  error: string | null;
  maxQuantityPerItem: number;
  isInitialized: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const MAX_QUANTITY_PER_ITEM = 10;

export function CartProvider({ children }: { children: ReactNode }) {
  const { selectedCurrency } = useCurrency();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Handle hydration and initialization
  useEffect(() => {
    const hydrateCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        const savedCartId = localStorage.getItem('shopifyCartId');
        
        let validCart: CartItem[] = [];
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
              validCart = parsedCart.filter((item): item is CartItem => (
                typeof item === 'object' &&
                item !== null &&
                typeof item.id === 'string' &&
                typeof item.lineId === 'string' &&
                typeof item.variantId === 'string' &&
                typeof item.title === 'string' &&
                typeof item.price === 'number' &&
                typeof item.image === 'string' &&
                typeof item.quantity === 'number'
              ));
            }
          } catch (e) {
            console.error('Error parsing cart:', e);
          }
        }

        setCart(validCart);
        if (savedCartId) {
          setCartId(savedCartId);
        }
      } catch (e) {
        console.error('Error hydrating cart:', e);
      }
    };

    hydrateCart();
    setIsInitialized(true);

    // Initialize Shopify cart if needed
    if (!cartId) {
      shopifyClient.createCart(selectedCurrency.code).then(newCart => {
        setCartId(newCart.id);
        localStorage.setItem('shopifyCartId', newCart.id);
      }).catch(error => {
        console.error('Failed to create Shopify cart:', error);
      });
    }
  }, []);

  // Update cart when currency changes
  useEffect(() => {
    if (!isInitialized) return;
    
    // Create a new cart with the current currency
    shopifyClient.createCart(selectedCurrency.code)
      .then(async newCart => {
        // If we have items in the old cart, add them to the new cart
        if (cart.length > 0) {
          const lines = cart.map(item => ({
            merchandiseId: item.variantId,
            quantity: item.quantity
          }));
          
          const updatedCart = await shopifyClient.addToCart(newCart.id, lines);
          setCartId(updatedCart.id);
          localStorage.setItem('shopifyCartId', updatedCart.id);
        } else {
          setCartId(newCart.id);
          localStorage.setItem('shopifyCartId', newCart.id);
        }
      })
      .catch(error => {
        console.error('Failed to update cart currency:', error);
      });
  }, [selectedCurrency.code, isInitialized, cart]);


  // Persist cart changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart, isInitialized]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = async (item: Omit<CartItem, 'quantity' | 'lineId'>) => {
    setLoadingItems(prev => new Set(prev).add(item.variantId));
    setError(null);

    try {
      // Get or create cart ID
      let currentCartId = cartId;
      if (!currentCartId) {
        const newCart = await shopifyClient.createCart(selectedCurrency.code);
        currentCartId = newCart.id;
        setCartId(currentCartId);
        localStorage.setItem('shopifyCartId', currentCartId);
      }

      // Check if adding would exceed max quantity or available stock
      const existingItem = cart.find(cartItem => cartItem.variantId === item.variantId);
      const currentQuantity = existingItem?.quantity || 0;
      const newQuantity = currentQuantity + 1;

      // First check max quantity limit
      if (newQuantity > MAX_QUANTITY_PER_ITEM) {
        const error = new Error(`You can only add ${MAX_QUANTITY_PER_ITEM} ${item.title} to the cart.`);
        setError(error.message);
        throw error;
      }

      // Then check if we're trying to add more than what's in stock
      try {
        const response = await shopifyClient.shopifyFetch<{
          node: { quantityAvailable: number }
        }>(`
          query getVariantQuantity($id: ID!) {
            node(id: $id) {
              ... on ProductVariant {
                quantityAvailable
              }
            }
          }
        `, { id: item.variantId });

        const quantityAvailable = response.node.quantityAvailable;
        if (newQuantity > quantityAvailable) {
          // Don't set error for out of stock, just throw
          throw new Error('out_of_stock');
        }
      } catch (error: any) {
        if (!error.message.includes('quantityAvailable')) {
          throw error;
        }
      }

      try {
        // First attempt to add to cart
        const cartData = await shopifyClient.addToCart(currentCartId, [{
          merchandiseId: item.variantId,
          quantity: 1
        }]);

        const lastLine = cartData.lines.edges[cartData.lines.edges.length - 1]?.node;
        if (!lastLine?.id) {
          throw new Error('No line ID returned from Shopify');
        }

        // Remove " - Default Title" from the item title if it exists
        const cleanedTitle = item.title.replace(/ - Default Title$/, '');
        const itemWithCleanTitle = { ...item, title: cleanedTitle };

        // Update local cart state
        let updatedCart: CartItem[];
        if (existingItem) {
          updatedCart = cart.map(cartItem =>
            cartItem.variantId === item.variantId
              ? { ...cartItem, lineId: lastLine.id, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        } else {
          updatedCart = [...cart, { ...itemWithCleanTitle, lineId: lastLine.id, quantity: 1 }];
        }

        setCart(updatedCart);
        openCart();
        return updatedCart;
      } catch (error: any) {
        // If we get an inventory error, don't retry and don't update cart
        if (error.message === 'out_of_stock' || error.message.includes('out of stock')) {
          throw new Error('out_of_stock');
        }

        // For other errors, try creating a new cart
        const newCart = await shopifyClient.createCart(selectedCurrency.code);
        setCartId(newCart.id);
        localStorage.setItem('shopifyCartId', newCart.id);
        
        // Retry the add with the new cart
        const cartData = await shopifyClient.addToCart(newCart.id, [{
          merchandiseId: item.variantId,
          quantity: 1
        }]);

        const lastLine = cartData.lines.edges[cartData.lines.edges.length - 1]?.node;
        if (!lastLine?.id) {
          throw new Error('No line ID returned from Shopify');
        }

        // Remove " - Default Title" from the item title if it exists
        const cleanedTitle = item.title.replace(/ - Default Title$/, '');
        const itemWithCleanTitle = { ...item, title: cleanedTitle };

        // Update local cart state
        const updatedCart = [...cart, { ...itemWithCleanTitle, lineId: lastLine.id, quantity: 1 }];
        setCart(updatedCart);
        openCart();
        return updatedCart;
      }
    } catch (error: any) {
      // Don't log or set error state for expected out_of_stock errors
      if (error instanceof Error && error.message === 'out_of_stock') {
        throw error;
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
        setError(errorMessage);
        console.error('Add to cart error:', error);
        throw error;
      }
    } finally {
      setLoadingItems(prev => {
        const next = new Set(prev);
        next.delete(item.variantId);
        return next;
      });
    }
  };

  const removeFromCart = async (variantId: string) => {
    setLoadingItems(prev => new Set(prev).add(variantId));
    setError(null);

    const item = cart.find(item => item.variantId === variantId);
    if (!item?.lineId) {
      // If the item is not found in the local cart, just remove it from local state
      setCart(currentCart => currentCart.filter(item => item.variantId !== variantId));
      setLoadingItems(prev => {
        const next = new Set(prev);
        next.delete(variantId);
        return next;
      });
      return;
    }

    try {
      // Get or create cart ID
      let currentCartId = cartId;
      if (!currentCartId) {
        const newCart = await shopifyClient.createCart(selectedCurrency.code);
        currentCartId = newCart.id;
        setCartId(currentCartId);
        localStorage.setItem('shopifyCartId', currentCartId);
      }

      try {
        // First verify if the line still exists in Shopify's cart
        const cartData = await shopifyClient.shopifyFetch<{
          cart: {
            lines: {
              edges: Array<{
                node: {
                  id: string;
                  merchandise: {
                    id: string;
                  };
                };
              }>;
            };
          };
        }>(`
          query getCart($cartId: ID!) {
            cart(id: $cartId) {
              lines(first: 100) {
                edges {
                  node {
                    id
                    merchandise {
                      ... on ProductVariant {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        `, { cartId: currentCartId });

        const lineExists = cartData.cart.lines.edges.some(
          (edge: { node: { id: string } }) => edge.node.id === item.lineId
        );

        if (!lineExists) {
          // If the line doesn't exist in Shopify's cart, just update local state
          setCart(currentCart => currentCart.filter(item => item.variantId !== variantId));
          return;
        }

        // Remove from Shopify cart
        const updatedCart = await shopifyClient.removeFromCart(currentCartId, [item.lineId]);
        
        if (!updatedCart) {
          throw new Error('Failed to update cart');
        }

        // Update local cart state to match Shopify's cart state
        const updatedItems = cart.map(cartItem => {
          // Find the corresponding line in Shopify's cart
          const shopifyLine = updatedCart.lines.edges.find(edge => 
            edge.node.merchandise.id === cartItem.variantId
          );

          if (!shopifyLine) {
            // If the item is not in Shopify's cart, remove it from local state
            return null;
          }

          // Update the line ID to match Shopify's cart
          return {
            ...cartItem,
            lineId: shopifyLine.node.id,
            quantity: shopifyLine.node.quantity
          };
        }).filter((item): item is CartItem => item !== null);

        setCart(updatedItems);
      } catch (error) {
        // If we get any error trying to verify or remove the line,
        // create a new cart and sync local state
        const newCart = await shopifyClient.createCart();
        setCartId(newCart.id);
        localStorage.setItem('shopifyCartId', newCart.id);
        
        // Remove the item from local state
        setCart(currentCart => currentCart.filter(item => item.variantId !== variantId));
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      // Still remove the item from local state even if Shopify operations fail
      setCart(currentCart => currentCart.filter(item => item.variantId !== variantId));
    } finally {
      setLoadingItems(prev => {
        const next = new Set(prev);
        next.delete(variantId);
        return next;
      });
    }
  };

  const updateQuantity = async (variantId: string, quantity: number) => {
    if (quantity > MAX_QUANTITY_PER_ITEM) {
      setError(`Maximum quantity of ${MAX_QUANTITY_PER_ITEM} reached for this item`);
      return;
    }

    setLoadingItems(prev => new Set(prev).add(variantId));
    setError(null);

    const item = cart.find(item => item.variantId === variantId);
    if (!item) {
      setLoadingItems(prev => {
        const next = new Set(prev);
        next.delete(variantId);
        return next;
      });
      return;
    }

    try {
      // Get or create cart ID
      let currentCartId = cartId;
      if (!currentCartId) {
        const newCart = await shopifyClient.createCart();
        currentCartId = newCart.id;
        setCartId(currentCartId);
        localStorage.setItem('shopifyCartId', currentCartId);
      }

      // Check available stock before updating quantity
      try {
        const response = await shopifyClient.shopifyFetch<{
          node: { quantityAvailable: number }
        }>(`
          query getVariantQuantity($id: ID!) {
            node(id: $id) {
              ... on ProductVariant {
                quantityAvailable
              }
            }
          }
        `, { id: variantId });

        const quantityAvailable = response.node.quantityAvailable;
        if (quantity > quantityAvailable) {
          const error = new Error(`Only ${quantityAvailable} units available`);
          setError(error.message);
          throw error;
        }
      } catch (error: any) {
        if (!error.message.includes('quantityAvailable')) {
          throw error;
        }
      }

      if (quantity <= 0) {
        try {
          // First verify if the line still exists in Shopify's cart
          const cartData = await shopifyClient.shopifyFetch<{
            cart: {
              lines: {
                edges: Array<{
                  node: {
                    id: string;
                    merchandise: {
                      id: string;
                    };
                  };
                }>;
              };
            };
          }>(`
            query getCart($cartId: ID!) {
              cart(id: $cartId) {
                lines(first: 100) {
                  edges {
                    node {
                      id
                      merchandise {
                        ... on ProductVariant {
                          id
                        }
                      }
                    }
                  }
                }
              }
            }
          `, { cartId: currentCartId });

          const lineExists = cartData.cart.lines.edges.some(
            (edge: { node: { id: string } }) => edge.node.id === item.lineId
          );

          if (!lineExists) {
            // If line doesn't exist in Shopify's cart, just update local state
            setCart(currentCart => currentCart.filter(cartItem => cartItem.variantId !== variantId));
            return;
          }

          // Remove from Shopify cart
          await shopifyClient.removeFromCart(currentCartId, [item.lineId]);
        } catch (error) {
          console.error('Failed to remove item:', error);
        }
        // Always update local state even if Shopify operations fail
        setCart(currentCart => currentCart.filter(cartItem => cartItem.variantId !== variantId));
      } else {
        try {
          // First verify if the line still exists in Shopify's cart
          const cartData = await shopifyClient.shopifyFetch<{
            cart: {
              lines: {
                edges: Array<{
                  node: {
                    id: string;
                    merchandise: {
                      id: string;
                    };
                  };
                }>;
              };
            };
          }>(`
            query getCart($cartId: ID!) {
              cart(id: $cartId) {
                lines(first: 100) {
                  edges {
                    node {
                      id
                      merchandise {
                        ... on ProductVariant {
                          id
                        }
                      }
                    }
                  }
                }
              }
            }
          `, { cartId: currentCartId });

          const lineExists = cartData.cart.lines.edges.some(
            (edge: { node: { id: string } }) => edge.node.id === item.lineId
          );

          if (!lineExists) {
            // If line doesn't exist, create a new cart and add the item
            const newCart = await shopifyClient.createCart(selectedCurrency.code);
            currentCartId = newCart.id;
            setCartId(currentCartId);
            localStorage.setItem('shopifyCartId', currentCartId);

            // Add the item with the new quantity
            const updatedCart = await shopifyClient.addToCart(currentCartId, [{
              merchandiseId: item.variantId,
              quantity: quantity
            }]);

            const newLine = updatedCart.lines.edges[0]?.node;
            if (!newLine?.id) {
              throw new Error('No line ID returned from Shopify');
            }

            setCart(currentCart => currentCart.map(cartItem =>
              cartItem.variantId === variantId
                ? { ...cartItem, lineId: newLine.id, quantity }
                : cartItem
            ));
          } else {
            // Line exists, proceed with update
            const updatedCart = await shopifyClient.updateCartLine(currentCartId, item.lineId, quantity);
            
            const updatedLine = updatedCart.lines.edges.find(edge => 
              edge.node.merchandise.id === variantId
            )?.node;

            if (!updatedLine?.id) {
              throw new Error('No line ID returned from Shopify');
            }

            setCart(currentCart => currentCart.map(cartItem =>
              cartItem.variantId === variantId ? { ...cartItem, lineId: updatedLine.id, quantity } : cartItem
            ));
          }
        } catch (error) {
          console.error('Failed to update quantity:', error);
          throw error;
        }
      }
    } catch (error: any) {
      // If we get an inventory error, don't update cart and don't log error
      if (error.message.includes('out of stock')) {
        setError('Item is out of stock');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update item quantity';
        setError(errorMessage);
        console.error('Update quantity error:', error);
      }
    } finally {
      setLoadingItems(prev => {
        const next = new Set(prev);
        next.delete(variantId);
        return next;
      });
    }
  };

  const clearCart = async () => {
    setLoadingItems(new Set(['clear']));
    setError(null);

    try {
      // Get or create cart ID
      let currentCartId = cartId;
      if (!currentCartId) {
        const newCart = await shopifyClient.createCart();
        currentCartId = newCart.id;
        setCartId(currentCartId);
        localStorage.setItem('shopifyCartId', currentCartId);
      }

      const lineIds = cart.map(item => item.lineId).filter(Boolean);
      if (lineIds.length > 0) {
        await shopifyClient.removeFromCart(currentCartId, lineIds);
      }
      setCart([]);
      localStorage.removeItem('cart');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
      setError(errorMessage);
      console.error('Clear cart error:', error);
      // Still clear local state even if Shopify fails
      setCart([]);
      localStorage.removeItem('cart');
    } finally {
      setLoadingItems(new Set());
    }
  };

  // Only calculate cart totals after initialization to prevent hydration mismatch
  const cartCount = isInitialized ? cart.reduce((total, item) => total + (item?.quantity || 0), 0) : 0;
  const cartTotal = isInitialized ? cart.reduce((total, item) => total + ((item?.price || 0) * (item?.quantity || 0)), 0) : 0;
  const isItemLoading = (variantId: string) => loadingItems.has(variantId);

  const value = {
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    isItemLoading,
    error,
    maxQuantityPerItem: MAX_QUANTITY_PER_ITEM,
    isInitialized
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
