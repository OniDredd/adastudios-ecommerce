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
  disabled?: boolean;
}

export default function AddToCartButton({ product, disabled = false }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (disabled) return;
    
    addToCart({
      id: product.id, // Use product.id for cart item identification
      variantId: product.variantId, // Store variantId separately for checkout
      title: product.title,
      price: product.price,
      image: product.image,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
  };

  const buttonClasses = `
    w-full px-1 py-2 
    ${disabled 
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300' 
      : 'bg-main-maroon text-secondary-peach border-main-maroon hover:border-secondary-peach cursor-pointer'
    }
    border-[1px] rounded-full transition-colors duration-200 font-semibold 
    flex items-center justify-center
  `;

  return (
    <button 
      onClick={handleAddToCart}
      className={buttonClasses}
      disabled={disabled}
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
            {disabled ? 'Out of Stock' : 'Add to Cart'}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
