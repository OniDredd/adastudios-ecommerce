import { Suspense } from 'react';
import ShopContent from './ShopContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Products - Ada Studio',
  description: 'Explore our curated collection of premium matcha, elegant glassware, and carefully selected accessories. Find the perfect pieces to enhance your daily rituals.',
  openGraph: {
    title: 'Shop Premium Matcha & Glassware | Ada Studio',
    description: 'Explore our curated collection of premium matcha, elegant glassware, and carefully selected accessories. Find the perfect pieces to enhance your daily rituals.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ada Studio Collection',
      },
    ],
    type: 'website',
    siteName: 'Ada Studio',
  },
  keywords: ['matcha', 'glassware', 'tea accessories', 'premium tea', 'japanese tea', 'tea sets', 'modern glassware'],
  alternates: {
    canonical: 'https://adastudio.co.nz/shop'
  }
};

// Generate JSON-LD structured data for the product listing page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Ada Studio Shop",
  description: "Explore our curated collection of premium matcha, elegant glassware, and carefully selected accessories.",
  url: "https://adastudio.com/shop",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Matcha Collection",
        url: "https://adastudio.com/shop?category=matcha"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Glassware Collection",
        url: "https://adastudio.com/shop?category=glasses"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Accessories Collection",
        url: "https://adastudio.com/shop?category=accessories"
      }
    ]
  }
};


export default function ShopAllPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ShopContent />
    </>
  );
}
