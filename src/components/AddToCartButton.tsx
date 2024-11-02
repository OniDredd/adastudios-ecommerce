'use client';

import React, { useState } from 'react';
import { useCart } from './CartProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';

interface Product {
  id: string;
  title: string;
  variantId: string;
  price: number;
  image: string;
}

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.variantId,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="w-full px-1 py-1 bg-main-maroon text-secondary-peach border-[1px] border-main-maroon hover:border-secondary-peach rounded-full transition-colors duration-200 font-semibold flex items-center justify-center"
    >
      <AnimatePresence mode="wait">
        {isAdded ? (
          <motion.span
            key="added"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center"
          >
            <FaCheck className="mr-2 h-4 w-4" />
            Added!
          </motion.span>
        ) : (
          <motion.span
            key="add"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center"
          >
            <FaShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}