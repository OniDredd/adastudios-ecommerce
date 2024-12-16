"use client";

import Image from 'next/image';
import { FaTimes, FaShoppingBag, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcStripe } from 'react-icons/fa';
import { useCart } from './CartProvider';
import { useCurrency } from './CurrencyProvider';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { isCartOpen, closeCart, cart, removeFromCart, updateQuantity } = useCart();
  const { convertPrice } = useCurrency();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setCheckoutError(null);
    try {
      // Use variantId for checkout
      const response = await fetch(`/api/checkout?items=${encodeURIComponent(JSON.stringify(cart.map(item => ({
        id: item.variantId, // Use variantId for Shopify checkout
        quantity: item.quantity
      }))))}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Checkout failed');
      }

      const data = await response.json();
      if (!data.url) {
        throw new Error('No checkout URL returned');
      }
      
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout:', error);
      setCheckoutError(error instanceof Error ? error.message : 'Failed to create checkout');
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-200/50 backdrop-blur-md z-[998]"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Cart */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: isCartOpen ? 0 : '100%' }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="fixed right-0 top-0 h-full w-[35vw] min-w-[350px] bg-white shadow-2xl z-[999]"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-secondary-peach">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-main-maroon">Shopping Bag ({cart.length})</h2>
              <button 
                onClick={closeCart}
                className="p-2 hover:bg-main-maroon hover:text-white rounded-full transition-colors duration-200"
                aria-label="Close cart"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-gray-500"
              >
                <FaShoppingBag size={64} className="mb-4 text-main-maroon opacity-50" />
                <p className="text-lg font-medium mb-2">Your bag is empty</p>
                <button 
                  onClick={closeCart}
                  className="text-main-maroon hover:underline font-medium"
                >
                  Continue Shopping
                </button>
              </motion.div>
            ) : (
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="mb-6 p-4 bg-white rounded-lg border border-gray-200 hover:border-main-maroon transition-colors duration-200 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 bg-secondary-peach rounded-md overflow-hidden">
                        <Image 
                          src={item.image} 
                          alt={item.title} 
                          fill
                          className="object-cover"
                          sizes="(max-width: 96px) 100vw, 96px"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-main-maroon">{item.title}</h3>
                          <p className="font-bold text-main-maroon">
                            {convertPrice(item.price * item.quantity)}
                          </p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              className="px-3 py-1 hover:bg-secondary-peach transition-colors duration-200"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 border-x border-gray-200 min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-secondary-peach transition-colors duration-200"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm text-main-maroon hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Checkout Section */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 bg-white px-6 py-4">
              {/* Order Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Subtotal</span>
                  <span className="font-bold text-main-maroon">{convertPrice(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>4 interest-free payments of</span>
                  <span>{convertPrice(subtotal / 4)} with Afterpay</span>
                </div>

                {checkoutError && (
                  <div className="text-red-500 text-sm text-center mb-4">
                    {checkoutError}
                  </div>
                )}

                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-main-maroon text-white py-4 rounded-md font-medium hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                
                <button 
                  onClick={closeCart}
                  className="w-full text-main-maroon border border-main-maroon py-3 rounded-md font-medium hover:bg-secondary-peach transition-colors duration-200"
                >
                  Continue Shopping
                </button>
              </div>
              
              <div className="mt-4 space-y-2">
                <p className="text-center text-sm text-gray-500">
                  Shipping & taxes calculated at checkout
                </p>
                <div className="flex justify-center space-x-4 text-gray-400">
                  <FaCcVisa size={32} />
                  <FaCcMastercard size={32} />
                  <FaCcAmex size={32} />
                  <FaCcStripe size={32} />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
