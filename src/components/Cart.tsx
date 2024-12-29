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
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
        cache: 'no-store',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Checkout failed');
      }

      const data = await response.json();
      const { checkoutUrl } = data;
      if (!checkoutUrl) {
        throw new Error('No checkout URL returned');
      }
      
      window.location.href = checkoutUrl;
    } catch (error) {
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
            className="fixed inset-0 bg-secondary-peach/50 backdrop-blur-md z-[998]"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Cart */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: isCartOpen ? 0 : '100%' }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="fixed right-0 top-0 h-full w-full sm:w-[90vw] md:w-[70vw] lg:w-[35vw] max-w-[500px] bg-white z-[999] border-l border-main-maroon"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-main-maroon bg-secondary-peach">
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
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            {cart.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-main-maroon/70"
              >
                <FaShoppingBag size={64} className="mb-4 text-main-maroon opacity-40" />
                <p className="text-xl font-medium mb-3 text-main-maroon">Your bag is empty</p>
                <p className="text-main-maroon/60 text-center mb-4 max-w-[240px]">Add items to your bag to begin the checkout process</p>
                <button 
                  onClick={closeCart}
                  className="text-main-maroon border border-main-maroon/30 hover:border-main-maroon px-6 py-2 rounded-lg font-medium hover:bg-secondary-peach/30 transition-all duration-200"
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
                    className="mb-6 p-4 sm:p-5 bg-white rounded-lg border border-gray-200 hover:border-main-maroon/50 transition-all duration-200"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-secondary-peach rounded-lg overflow-hidden">
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
                          <h3 className="font-medium text-main-maroon text-[15px] leading-snug">{item.title}</h3>
                          <p className="font-bold text-main-maroon">
                            {convertPrice(item.price * item.quantity)}
                          </p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-l-md border border-gray-200 hover:bg-secondary-peach active:bg-secondary-peach/80 transition-all duration-200 hover:border-main-maroon/30"
                              aria-label="Decrease quantity"
                            >
                              <span className="text-main-maroon font-medium">−</span>
                            </button>
                            <span className="w-10 sm:w-12 h-8 sm:h-9 flex items-center justify-center border-y border-gray-200 bg-white text-main-maroon font-medium">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-r-md border border-gray-200 hover:bg-secondary-peach active:bg-secondary-peach/80 transition-all duration-200 hover:border-main-maroon/30"
                              aria-label="Increase quantity"
                            >
                              <span className="text-main-maroon font-medium">+</span>
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm text-main-maroon/70 hover:text-main-maroon hover:underline transition-colors duration-200"
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
            <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-4">
              {/* Order Summary */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium text-main-maroon">Subtotal</span>
                  <span className="font-bold text-main-maroon">{convertPrice(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between text-sm text-main-maroon/70 py-3 px-4 bg-secondary-peach/20 rounded-lg hover:bg-secondary-peach/30 transition-colors duration-200"
                >
                  <span>4 interest-free payments of</span>
                  <span className="font-medium">{convertPrice(subtotal / 4)} with <span className="text-main-maroon">Afterpay</span></span>
                </motion.div>

                {checkoutError && (
                  <div className="text-red-500 text-sm text-center mb-4">
                    {checkoutError}
                  </div>
                )}

                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-main-maroon text-white py-4 rounded-lg font-medium hover:opacity-90 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                
                <button 
                  onClick={closeCart}
                  className="w-full text-main-maroon border border-main-maroon py-3 rounded-lg font-medium hover:bg-secondary-peach/50 active:bg-secondary-peach transition-all duration-200"
                >
                  Continue Shopping
                </button>
              </div>
              
              <div className="mt-4 space-y-2">
                <p className="text-center text-sm text-main-maroon/70">
                  Shipping & taxes calculated at checkout
                </p>
                <div className="flex flex-wrap justify-center gap-6 text-main-maroon/40 mt-6">
                  <FaCcVisa size={28} className="sm:text-[32px]" />
                  <FaCcMastercard size={28} className="sm:text-[32px]" />
                  <FaCcAmex size={28} className="sm:text-[32px]" />
                  <FaCcStripe size={28} className="sm:text-[32px]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
