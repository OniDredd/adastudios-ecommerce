import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import shopify from '../../../lib/shopify';
import ProductDetails from '../../../components/ProductDetails';
import { RecommendedProducts } from '../../../components/RecommendedProducts';
import type { ShopifyProduct } from '../../../lib/shopify';

type Params = Promise<{ handle: string }>;

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const { handle } = await params;
  try {
    const product = await shopify.getProductByHandle(handle);
    if (!product) return notFound();

    return {
      title: `${product.title} - Ada Studio`,
      description: product.description,
      openGraph: {
        title: `${product.title} - Ada Studio`,
        description: product.description,
        images: [
          {
            url: product.images.edges[0]?.node.originalSrc || '',
            width: 1200,
            height: 630,
            alt: product.title,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: 'Product - Ada Studio',
      description: 'Product details',
    };
  }
}

function ProductContent({ 
  product, 
  recommendedProducts 
}: { 
  product: ShopifyProduct;
  recommendedProducts: ShopifyProduct[];
}) {
  return (
    <>
      <section className="min-h-screen bg-white border-b border-[0.5px] border-main-maroon">
        <ProductDetails product={product} />
      </section>
      <section>
        <RecommendedProducts 
          products={recommendedProducts} 
          currentProductId={product.id} 
        />
      </section>
    </>
  );
}

export default async function ProductPage({ params }: { params: Params }) {
  const { handle } = await params;
  try {
    // Parallel data fetching
    const [product, allProducts] = await Promise.all([
      shopify.getProductByHandle(handle),
      shopify.getProducts()
    ]);

    if (!product) {
      notFound();
    }

    // Filter recommendations based on tags
    const recommendedProducts = allProducts.filter(p => 
      p.id !== product.id && // Exclude current product
      p.tags.some(tag => product.tags.includes(tag)) // Match by tags
    );

    return (
      <main className="relative">
        <Suspense fallback={
          <div className="min-h-screen animate-pulse">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square bg-main-maroon/10 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 w-2/3 bg-main-maroon/10 rounded"></div>
                  <div className="h-4 w-1/3 bg-main-maroon/10 rounded"></div>
                  <div className="h-24 bg-main-maroon/10 rounded"></div>
                  <div className="h-12 w-full bg-main-maroon/10 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        }>
          <ProductContent 
            product={product} 
            recommendedProducts={recommendedProducts}
          />
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}

// Configure page options
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Use Node.js runtime for better video support
export const fetchCache = 'force-no-store'; // Disable caching for dynamic content
