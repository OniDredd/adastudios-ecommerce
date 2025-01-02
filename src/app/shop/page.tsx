import { Suspense } from 'react';
import ShopContent from './ShopContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Products - Ada Studio',
  description: 'Browse our collection of premium matcha, glasses, and accessories.',
};

export default function ShopAllPage() {
  return <ShopContent />;
}
