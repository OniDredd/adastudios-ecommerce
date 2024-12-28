"use client";

import React, { useState } from "react";
import Image from 'next/image';
import parse from 'html-react-parser';
import { useCart } from '@/components/CartProvider';

interface Variant {
  id: string;
  name: string;
  // Add other variant properties as needed
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  mainColor: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  images: { file: { url: string } }[];
  variants: { id: string; name: string }[];
}

export default function ProductPageContent({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<string>(product.variants[0]?.id || '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, openCart } = useCart();

  const handleAddToCart = () => {
    const variant = product.variants.find(v => v.id === selectedVariant);
    addToCart({
      id: product.id,
      variantId: selectedVariant,
      title: product.name,
      price: product.price,
      image: product.images[0]?.file.url || '/placeholder.jpg',
    });
    openCart();
  };

  return (
    <div className="flex flex-col lg:flex-row container mx-auto px-4 sm:px-6 pb-8 pt-24 space-y-6 lg:space-y-0 lg:space-x-12">
      {/* Left column - Image gallery */}
      <div className="w-full lg:w-1/2">
        <div className="relative aspect-square mb-4">
          <Image
            src={product.images[currentImageIndex].file.url}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        {/* Add thumbnail navigation if needed */}
      </div>

      {/* Right column - Product details */}
      <div className="w-full lg:w-1/2 space-y-5">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
          <p className="text-lg sm:text-xl text-gray-600">{product.brand}</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 pt-2">
            <p className="text-2xl sm:text-3xl font-bold">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-600">4x ${(product.price / 4).toFixed(2)} NZD with Afterpay</p>
          </div>
        </div>

        {/* Variant selection */}
        {product.variants.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Variant:</h3>
            <select 
              value={selectedVariant} 
              onChange={(e) => setSelectedVariant(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quantity selector */}
        <div>
          <h3 className="font-semibold mb-2">Quantity</h3>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))} 
              className="w-10 h-10 flex items-center justify-center border rounded-lg text-lg hover:bg-gray-50 active:bg-gray-100 transition"
            >
              -
            </button>
            <span className="text-lg font-medium w-8 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)} 
              className="w-10 h-10 flex items-center justify-center border rounded-lg text-lg hover:bg-gray-50 active:bg-gray-100 transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart button */}
        <button 
          onClick={handleAddToCart}
          className="w-full bg-green-700 text-white py-4 rounded-lg text-lg font-medium hover:bg-green-800 active:bg-green-900 transition-colors shadow-sm"
        >
          ADD TO BAG
        </button>

        {/* Product Description */}
        <div className="pt-4">
          <h3 className="font-semibold text-lg mb-3">Product Description</h3>
          <div className="text-gray-700 space-y-2">
            {parse(product.description)}
          </div>
        </div>
      </div>
    </div>
  );
}
