// app/products/[handle]/page.tsx
import { notFound } from 'next/navigation';
import shopify from '../../../lib/shopify';
import ProductDetails from '../../../components/ProductDetails';
import { RecommendedProducts } from '../../../components/RecommendedProducts';

export default async function ProductPage({ params }: { params: { handle: string } }) {
  try {
    const product = await shopify.getProductByHandle(params.handle);

    if (!product) {
      notFound();
    }

    // Fetch all products and filter for recommendations based on tags
    const allProducts = await shopify.getProducts();
    const recommendedProducts = allProducts.filter(p => 
      p.id !== product.id && // Exclude current product
      p.tags.some(tag => product.tags.includes(tag)) // Match by tags
    );

    return (
      <main className="relative">
        <section className="min-h-screen bg-white border-b border-[0.5px] border-main-maroon">
          <ProductDetails product={product} />
        </section>
        <section>
          <RecommendedProducts products={recommendedProducts} currentProductId={product.id} />
        </section>
      </main>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}
