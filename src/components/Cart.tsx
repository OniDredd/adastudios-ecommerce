// components/Cart.tsx
"use client";

import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import { useCart } from './CartProvider';

export default function Cart() {
  const { isCartOpen, closeCart, cart, removeFromCart, updateQuantity } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`fixed right-0 top-0 h-full w-[35vw] bg-secondary-peach border-l-[1px] border-main-maroon text-main-maroon shadow-lg transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-40`}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">YOUR BAG ({cart.length})</h2>
          <button onClick={closeCart} className="text-main-maroon hover:text-main-maroon">
            <FaTimes />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-row border-main-maroon border-[1px] p-4 rounded-lg mb-6">
              <div className="flex mb-4">
                <Image src={item.image} alt={item.title} width={80} height={80} className="mr-4" />
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <div className="flex items-center mt-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="border border-main-maroon px-2">-</button>
                    <span className="mx-2">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="border border-main-maroon px-2">+</button>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-bold">${item.price}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-sm text-main-maroon hover:underline">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <button className="w-full bg-main-maroon text-main-peach py-3 rounded font-bold mb-4">
            CHECKOUT ${total.toFixed(2)}
          </button>

          <div className="flex justify-between text-sm">
            <button onClick={closeCart} className="underline">CONTINUE SHOPPING</button>
            <p>4x ${(total / 4).toFixed(2)} on afterpay</p>
          </div>
          <p className="text-right text-sm text-main-maroon">Shipping + taxes calculated at checkout</p>
        </div>
      </div>
    </div>
  );
}