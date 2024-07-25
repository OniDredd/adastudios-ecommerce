import { notFound } from 'next/navigation';
import ProductPageContent from '@/components/ProductPageContent';

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

async function getProduct(slug: string): Promise<Product | null> {
  // This is a mock function that returns placeholder data
  // Replace this with your actual API call when it's ready
  const mockProduct: Product = {
    id: '1',
    name: 'Modern Glass',
    brand: 'GlassCo',
    price: 29.99,
    description: 'A sleek, modern drinking glass perfect for any occasion.',
    mainColor: '#f0f0f0', // Light gray color for main display
    colors: [
      { name: 'Clear', hex: '#ffffff' },
      { name: 'Blue Tint', hex: '#e6f2ff' },
      { name: 'Green Tint', hex: '#e6ffe6' },
      { name: 'Rose Tint', hex: '#ffe6e6' },
    ],
    sizes: ['Small', 'Medium', 'Large'],
  };

  // Simulate a delay to mimic API call
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return the mock product if the slug matches, otherwise return null
  return slug === '1' ? mockProduct : null;
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductPageContent product={product} />;
}