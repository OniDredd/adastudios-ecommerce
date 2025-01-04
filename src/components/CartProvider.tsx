// components/CartProvider.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import shopifyClient from '../lib/shopify';

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
  addToCart: (item: Omit<CartItem, 'quantity' | 'lineId'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);

  // Initialize cart state
  useEffect(() => {
    const initializeCart = async () => {
      try {
        // Always create a new cart to ensure fresh state
        const newCart = await shopifyClient.createCart();
        setCartId(newCart.id);
        localStorage.setItem('shopifyCartId', newCart.id);
        
        // Clear any existing cart data
        setCart([]);
        localStorage.removeItem('cart');
      } catch (error) {
      }
    };
    initializeCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = async (item: Omit<CartItem, 'quantity' | 'lineId'>) => {
    if (!cartId) {
      return;
    }

    try {
      const cartData = await shopifyClient.addToCart(cartId, [{
        merchandiseId: item.variantId,
        quantity: 1
      }]);

      // Get the line ID from the response
      const lastLine = cartData.lines.edges[cartData.lines.edges.length - 1]?.node;
      if (!lastLine?.id) {
        throw new Error('No line ID returned from Shopify');
      }

      setCart(currentCart => {
        const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
        
        // Remove " - Default Title" from the item title if it exists
        const cleanedTitle = item.title.replace(/ - Default Title$/, '');
        const itemWithCleanTitle = { ...item, title: cleanedTitle };
        
        if (existingItem) {
          // Update existing item with new line ID and increment quantity
          return currentCart.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, lineId: lastLine.id, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }

        // Add new item with line ID and cleaned title
        return [...currentCart, { ...itemWithCleanTitle, lineId: lastLine.id, quantity: 1 }];
      });
      openCart();
    } catch (error) {
    }
  };

  const removeFromCart = async (id: string) => {
    if (!cartId) {
      return;
    }

    const item = cart.find(item => item.id === id);
    if (!item?.lineId) {
      // If no line ID is found, try to remove by product ID
      setCart(currentCart => currentCart.filter(item => item.id !== id));
      return;
    }

    try {
      await shopifyClient.removeFromCart(cartId, [item.lineId]);
      setCart(currentCart => currentCart.filter(item => item.id !== id));
    } catch (error) {
      // If Shopify removal fails, still remove from local state
      setCart(currentCart => currentCart.filter(item => item.id !== id));
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!cartId) {
      return;
    }

    const item = cart.find(item => item.id === id);
    if (!item) return;

    try {
      if (quantity <= 0) {
        if (item.lineId) {
          await shopifyClient.removeFromCart(cartId, [item.lineId]);
        }
        setCart(currentCart => currentCart.filter(item => item.id !== id));
      } else {
        const cartData = await shopifyClient.addToCart(cartId, [{
          merchandiseId: item.variantId,
          quantity: quantity
        }]);

        // Get the new line ID from the response
        const lastLine = cartData.lines.edges[cartData.lines.edges.length - 1]?.node;
        if (!lastLine?.id) {
          throw new Error('No line ID returned from Shopify');
        }

        setCart(currentCart => currentCart.map(item =>
          item.id === id ? { ...item, lineId: lastLine.id, quantity } : item
        ));
      }
    } catch (error) {
    }
  };

  const clearCart = async () => {
    if (cartId) {
      try {
        // Remove all items from Shopify cart
        const lineIds = cart.map(item => item.lineId).filter(Boolean);
        if (lineIds.length > 0) {
          await shopifyClient.removeFromCart(cartId, lineIds);
        }
      } catch (error) {
      }
    }
    setCart([]);
    localStorage.removeItem('cart');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

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
