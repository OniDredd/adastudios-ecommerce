import { Suspense } from 'react';
import ShopContent from './ShopContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Products - Ada Studio',
  description: 'Browse our collection of premium matcha, glasses, and accessories.',
};

export default function ShopAllPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto pt-32 pb-8">
        <div className="animate-pulse px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="h-8 w-48 bg-main-maroon/20 rounded mb-8"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="aspect-[3/4] bg-main-maroon/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
