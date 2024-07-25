"use client";

import Image from 'next/image';
import { useState } from 'react';
import { FaTimes, FaGift, FaBox } from 'react-icons/fa';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
  }

export default function Cart({ isOpen, onClose }: CartProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className={`fixed right-0 top-0 h-full w-[35vw] bg-main-creme border-l-[1px] border-secondary-green shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-500 ease-in-out z-40`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">YOUR BAG 1</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <div className="flex flex-row border-main-green border-[1px] p-4 rounded-lg mb-6">
          <div className="flex mb-4">
            <Image src="/eddie-shirt.jpg" alt="EDDIE SHIRT" width={80} height={80} className="mr-4" />
            <div>
              <p className="text-sm text-gray-500">RUBY</p>
              <h3 className="font-bold">EDDIE SHIRT</h3>
              <p className="text-sm">White 8</p>
              <div className="flex items-center mt-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="border px-2">-</button>
                <span className="mx-2">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="border px-2">+</button>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm text-gray-500">NEW</p>
              <p className="font-bold">$249</p>
              <button className="text-sm text-gray-500 hover:underline">Remove</button>
              <button className="text-sm text-gray-500 hover:underline block">Move to Wishlist</button>
            </div>
          </div>
        </div>

        <button className="w-full bg-secondary-brown text-main-creme py-3 rounded font-bold mb-4">
          CHECKOUT $249
        </button>

        <div className="flex justify-between text-sm">
          <button className="underline">CONTINUE SHOPPING</button>
          <p>4x $62.25 on afterpay</p>
        </div>
        <p className="text-right text-sm text-gray-500">Shipping + taxes calculated at checkout</p>
      </div>
    </div>
  );
}