'use client';

import { useCart } from '@/components/CartProvider';
import Image from 'next/image';
import client from '@/lib/shopify';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const subtotal = cart.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const checkout = await client.checkout.create();
      const lineItems = cart.map(item => ({
        variantId: item.id,
        quantity: item.quantity,
      }));
      const updatedCheckout = await client.checkout.addLineItems(checkout.id, lineItems);
      window.location.href = updatedCheckout.webUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
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
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-8">
            <p className="text-xl font-semibold">Subtotal: ${subtotal.toFixed(2)}</p>
            <button 
              onClick={handleCheckout}
              className="bg-black text-white px-4 py-2 rounded mt-4"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}