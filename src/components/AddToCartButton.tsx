'use client';

import React, { useCallback } from 'react';
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
  const { addToCart, error: cartError } = useCart();
  const [status, setStatus] = React.useState<'idle' | 'added' | 'error' | 'out_of_stock'>('idle');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const handleAddToCart = useCallback(async () => {
    if (disabled) return;
    
    // Start loading animation immediately
    setIsLoading(true);
    setStatus('idle');

    try {
      // Start cart operation
      const result = await addToCart({
        id: product.id,
        variantId: product.variantId,
        title: product.title,
        price: product.price,
        image: product.image,
      });
      setIsLoading(false);
      setStatus('added');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error adding to cart';
      setIsLoading(false);
      
      // Handle out of stock items
      if (message === 'out_of_stock') {
        setStatus('out_of_stock');
        setErrorMessage('Out of Stock');
        setTimeout(() => setStatus('idle'), 2000);
      } else {
        setErrorMessage(message);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 2000);
      }
    }
  }, [addToCart, disabled, product]);

  const buttonClasses = `
    relative w-full px-1 py-2 overflow-hidden
    ${disabled
      ? 'bg-main-maroon text-secondary-peach border-secondary-peach cursor-not-allowed' 
      : 'bg-secondary-peach text-main-maroon border-main-maroon hover:bg-main-maroon hover:text-secondary-peach ' + 
        ((isLoading || status !== 'idle') ? 'opacity-80 cursor-wait' : 'cursor-pointer')
    }
    border-[1px] rounded-full transition-colors duration-200 font-semibold 
    flex items-center justify-center
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <button 
      onClick={handleAddToCart}
      className={`group ${buttonClasses}`}
      disabled={disabled}
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
            className="flex items-center text-main-maroon group-hover:text-secondary-peach"
          >
            <FaExclamationCircle className="mr-2 h-4 w-4" />
            {errorMessage || 'Error'}
          </motion.span>
        ) : (
          <motion.span
            key="add"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center"
          >
            {status === 'out_of_stock' ? (
              <motion.span
                key="out_of_stock"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center text-main-maroon group-hover:text-secondary-peach"
              >
                <FaExclamationCircle className="mr-2 h-4 w-4" />
                Out of Stock
              </motion.span>
            ) : isLoading ? (
              <motion.div 
                className="flex items-center gap-2 text-main-maroon group-hover:text-secondary-peach"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div 
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                Adding...
              </motion.div>
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
