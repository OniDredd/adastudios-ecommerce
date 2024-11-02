// app/products/[handle]/page.tsx
import { notFound } from 'next/navigation';
import shopify from '../../../lib/shopify';
import ProductDetails from '../../../components/ProductDetails';

export default async function ProductPage({ params }: { params: { handle: string } }) {
  try {
    const product = await shopify.getProductByHandle(params.handle);

    if (!product) {
      notFound();
    }

    return <ProductDetails product={product} />;
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}
