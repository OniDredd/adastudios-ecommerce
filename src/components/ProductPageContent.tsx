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
      name: product.name,
      variantName: variant?.name || '',
      price: product.price,
      quantity: quantity,
      image: product.images[0]?.file.url || '/placeholder.jpg',
    });
    openCart();
  };

  return (
    <div className="flex flex-col lg:flex-row container mx-auto px-4 pb-8 pt-20 space-y-8 lg:space-y-0 lg:space-x-12">
      {/* Left column - Image gallery */}
      <div className="w-full lg:w-1/2">
        <div className="relative aspect-square">
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
      <div className="w-full lg:w-1/2 space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl">{product.brand}</p>
        <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>

        {/* Variant selection */}
        {product.variants.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Variant:</h3>
            <select 
              value={selectedVariant} 
              onChange={(e) => setSelectedVariant(e.target.value)}
              className="w-full p-2 border rounded"
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
          <div className="flex items-center space-x-2">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2 py-1 border rounded">-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="px-2 py-1 border rounded">+</button>
          </div>
        </div>

        {/* Add to Cart button */}
        <button 
          onClick={handleAddToCart}
          className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition"
        >
          ADD TO BAG
        </button>

        <p className="text-sm text-gray-600">4x ${(product.price / 4).toFixed(2)} NZD with Afterpay</p>

        {/* Product Description */}
        <div>
          <h3 className="font-semibold mb-2">Product Description</h3>
          <div className="text-gray-700">
            {parse(product.description)}
          </div>
        </div>
      </div>
    </div>
  );
}