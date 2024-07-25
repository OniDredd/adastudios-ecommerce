"use client";

import React, { useState } from "react";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  mainColor: string;
  colors: { name: string; hex: string }[];
  sizes?: string[];
}

export default function ProductPageContent({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0].name
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );

  return (
    <div className="flex flex-col md:flex-row container mx-auto px-4">
      {/* Left column */}
      <div className="w-full md:w-1/2 pr-0 md:pr-8 mb-8 md:mb-0">
        <div className="relative">
          <div
            style={{ backgroundColor: product.mainColor }}
            className="w-full aspect-square"
          ></div>
          <div className="absolute left-0 top-0 space-y-2">
            {product.colors.map((color) => (
              <div
                key={color.name}
                style={{ backgroundColor: color.hex }}
                className="w-16 h-16 cursor-pointer"
                onClick={() => setSelectedColor(color.name)}
              ></div>
            ))}
          </div>
        </div>
        <div className="flex justify-center space-x-2 mt-4">
          {["ALL", "SIZE 8", "SIZE 16", "VIDEO"].map((option) => (
            <button
              key={option}
              className={`px-4 py-2 rounded-full ${
                option === "ALL" ? "bg-pink-200" : "bg-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="w-full md:w-1/2">
        <span className="text-sm font-semibold">NEW</span>
        <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
        <p className="text-xl">{product.brand}</p>
        <p className="text-2xl font-bold mt-4">${product.price}</p>
        <p className="mt-4">{product.description}</p>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Color: {selectedColor}</h3>
          <div className="flex space-x-2">
            {product.colors.map((color) => (
              <button
                key={color.name}
                className={`w-8 h-8 rounded-full ${
                  selectedColor === color.name ? "ring-2 ring-black" : ""
                }`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedColor(color.name)}
              />
            ))}
          </div>
        </div>

        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Size</h3>
            <div className="flex space-x-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 rounded-full ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <a href="#" className="block mt-4 underline">
          SIZE GUIDE
        </a>

        <button className="w-full bg-black text-white py-3 mt-6">
          ADD TO BAG
        </button>

        <a href="#" className="block mt-4">
          FIND IN STORE
        </a>

        <p className="mt-4 text-sm">4x $62.25 NZD on afterpay</p>
      </div>
    </div>
  );
}
