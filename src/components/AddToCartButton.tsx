'use client';

import React, { useCallback, useTransition } from 'react';
import { useCart } from './CartProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaCheck, FaExclamationCircle } from 'react-icons/fa';

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
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = React.useState<'idle' | 'added' | 'error'>('idle');

  const handleAddToCart = useCallback(() => {
    if (disabled) return;
    
    startTransition(() => {
      try {
        addToCart({
          id: product.id,
          variantId: product.variantId,
          title: product.title,
          price: product.price,
          image: product.image,
        });
        setStatus('added');
        setTimeout(() => setStatus('idle'), 2000);
      } catch (error) {
        console.error('Error adding to cart:', error);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 2000);
      }
    });
  }, [addToCart, disabled, product]);

  const buttonClasses = `
    relative w-full px-1 py-2 
    ${disabled 
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300' 
      : isPending
        ? 'bg-secondary-peach/80 text-main-maroon/80 border-main-maroon/80 cursor-wait'
        : 'bg-secondary-peach text-main-maroon border-main-maroon hover:bg-main-maroon hover:text-secondary-peach cursor-pointer'
    }
    border-[1px] rounded-full transition-colors duration-200 font-semibold 
    flex items-center justify-center
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <button 
      onClick={handleAddToCart}
      className={`group ${buttonClasses}`}
      disabled={disabled || isPending}
      aria-label={disabled ? 'Out of Stock' : 'Add to Cart'}
    >
      <AnimatePresence mode="wait">
        {status === 'added' ? (
          <motion.span
            key="added"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center text-main-maroon group-hover:text-secondary-peach"
          >
            <FaCheck className="mr-2 h-4 w-4" />
            Added!
          </motion.span>
        ) : status === 'error' ? (
          <motion.span
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center text-red-600"
          >
            <FaExclamationCircle className="mr-2 h-4 w-4" />
            Error
          </motion.span>
        ) : (
          <motion.span
            key="add"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-main-maroon border-t-transparent rounded-full animate-spin" />
                Adding...
              </div>
            ) : (
              <>
                <FaShoppingCart className="mr-2 h-4 w-4" />
                {disabled ? 'Out of Stock' : 'Add to Cart'}
              </>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
