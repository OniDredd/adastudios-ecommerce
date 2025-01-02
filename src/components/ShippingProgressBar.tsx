import { motion } from 'framer-motion';
import { FaTruck } from 'react-icons/fa';

interface ShippingProgressBarProps {
  subtotal: number;
  freeShippingThreshold: number;
}

export default function ShippingProgressBar({ subtotal, freeShippingThreshold }: ShippingProgressBarProps) {
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remaining = Math.max(freeShippingThreshold - subtotal, 0);

  return (
    <div className="border-b border-main-maroon/10 px-3 sm:px-4 pt-4 pb-3">
      <div className="relative h-2 bg-secondary-peach/50 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 left-0 h-full bg-main-maroon shadow-sm"
        />
      </div>
      <div className="flex items-center justify-center text-xs text-main-maroon">
        <FaTruck className={`${remaining === 0 ? "text-main-maroon" : "text-main-maroon/70"} mr-1`} />
        {remaining > 0 ? (
          <p>
            <span className="font-medium">${remaining.toFixed(2)}</span> away from free shipping
          </p>
        ) : (
          <p className="font-medium">You&apos;ve qualified for free shipping!</p>
        )}
      </div>
    </div>
  );
}
