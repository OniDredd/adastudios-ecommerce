"use client";

import Image from 'next/image';
import { FaTimes, FaShoppingBag, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcStripe } from 'react-icons/fa';
import ShippingProgressBar from './ShippingProgressBar';
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
          <div className="px-3 sm:px-4 py-3 border-b border-main-maroon bg-secondary-peach">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-medium text-main-maroon">Shopping Bag ({cart.length})</h2>
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
          <div className="flex-1 overflow-y-auto flex flex-col">
            {cart.length > 0 && (
              <ShippingProgressBar subtotal={subtotal} freeShippingThreshold={100} />
            )}
            <div className="h-full px-2 py-2 flex-1 flex">
              {cart.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center w-full h-full text-main-maroon/70"
              >
                <FaShoppingBag size={48} className="mb-3 text-main-maroon opacity-40" />
                <p className="text-lg font-medium mb-2 text-main-maroon">Your bag is empty</p>
                <p className="text-main-maroon/60 text-center mb-3 max-w-[220px] text-sm">Add items to your bag to begin the checkout process</p>
                <button 
                  onClick={closeCart}
                  className="text-main-maroon border border-main-maroon/30 hover:border-main-maroon px-5 py-1.5 rounded-lg font-medium text-sm hover:bg-secondary-peach/30 transition-all duration-200"
                >
                  Continue Shopping
                </button>
              </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-1 w-full self-start">
                  <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="w-full px-2 py-1.5 bg-white rounded-lg border border-gray-200 hover:border-main-maroon/50 transition-all duration-200"
                    layout
                  >
                    <div className="flex gap-2.5 w-full">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-secondary-peach rounded-lg overflow-hidden">
                        <Image 
                          src={item.image} 
                          alt={item.title} 
                          fill
                          className="object-cover"
                          sizes="(max-width: 96px) 100vw, 96px"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-main-maroon text-[12px] leading-tight max-w-[70%]">{item.title}</h3>
                          <p className="font-bold text-main-maroon text-sm">
                            {convertPrice(item.price * item.quantity)}
                          </p>
                        </div>
                        <div className="mt-2.5 flex justify-between items-center">
                          <div className="flex items-center">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-l-md border border-gray-200 hover:bg-secondary-peach active:bg-secondary-peach/80 transition-all duration-200 hover:border-main-maroon/30"
                              aria-label="Decrease quantity"
                            >
                              <span className="text-main-maroon font-medium">−</span>
                            </button>
                            <span className="w-7 sm:w-8 h-6 sm:h-7 flex items-center justify-center border-y border-gray-200 bg-white text-main-maroon font-medium text-xs">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-r-md border border-gray-200 hover:bg-secondary-peach active:bg-secondary-peach/80 transition-all duration-200 hover:border-main-maroon/30"
                              aria-label="Increase quantity"
                            >
                              <span className="text-main-maroon font-medium">+</span>
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-main-maroon/70 hover:text-main-maroon hover:underline transition-colors duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Section */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 bg-white px-3 sm:px-4 py-3">
              {/* Order Summary */}
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium text-main-maroon">Subtotal</span>
                  <span className="font-bold text-main-maroon">{convertPrice(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between text-xs text-main-maroon/70 py-2"
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
                  className="w-full bg-main-maroon text-white py-3 rounded-lg font-medium text-sm hover:opacity-90 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                
                <button 
                  onClick={closeCart}
                  className="w-full text-main-maroon border border-main-maroon py-2.5 rounded-lg font-medium text-sm hover:bg-secondary-peach/50 active:bg-secondary-peach transition-all duration-200"
                >
                  Continue Shopping
                </button>
              </div>
              
              <div className="mt-4 space-y-2">
                <p className="text-center text-sm text-main-maroon/70">
                  Shipping & taxes calculated at checkout
                </p>
                <div className="flex flex-wrap justify-center gap-6 text-main-maroon/40 mt-6">
                  <FaCcVisa size={24} className="sm:text-[28px]" />
                  <FaCcMastercard size={24} className="sm:text-[28px]" />
                  <FaCcAmex size={24} className="sm:text-[28px]" />
                  <FaCcStripe size={24} className="sm:text-[28px]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
