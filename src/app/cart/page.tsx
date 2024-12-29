'use client';

import { useCart } from '../../components/CartProvider';
import Image from 'next/image';
import { useState } from 'react';
import shopifyClient from '../../lib/shopify';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = cart.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const newCart = await shopifyClient.createCart();
      const lineItems = cart.map(item => ({
        merchandiseId: item.id,
        quantity: item.quantity,
      }));
      const updatedCart = await shopifyClient.addToCart(newCart.id, lineItems);
      
      if (!updatedCart.checkoutUrl) {
        throw new Error('No checkout URL returned from Shopify');
      }

      window.location.href = updatedCart.checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center mb-4 border-b pb-4">
              <Image src={item.image} alt={item.title} width={100} height={100} className="mr-4" />
              <div className="flex-grow">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                      disabled={isLoading}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x border-gray-300">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                      disabled={isLoading}
                    >
                      +
                    </button>
                  </div>
                  <p>Price: ${item.price}</p>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                disabled={isLoading}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-8">
            <p className="text-xl font-semibold">Subtotal: ${subtotal.toFixed(2)}</p>
            <button 
              onClick={handleCheckout}
              disabled={isLoading}
              className={`bg-black text-white px-4 py-2 rounded mt-4 relative ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'
              } transition-colors w-full sm:w-auto`}
            >
              {isLoading ? (
                <>
                  <span className="opacity-0">Proceed to Checkout</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
