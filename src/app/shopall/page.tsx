import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import swell from '@/lib/swell';

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: { file: { url: string } }[];
  variants: { name: string; optionValueIds: string[] }[];
}

async function getProducts(): Promise<Product[]> {
  try {
    const result = await swell.products.list({
      limit: 100,
      expand: ['variants', 'images']
    });
    return result.results;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export const revalidate = 3600; // Revalidate every hour

export default async function AllGlasses() {
  let products: Product[];

  try {
    products = await getProducts();
  } catch (error) {
    console.error('Error in AllGlasses:', error);
    return <div>Error loading products. Please try again later.</div>;
  }

  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <main>
      <section className="p-8 md:p-16 lg:p-32 bg-main-green text-main-creme">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 font-main-font">ALL GLASSES</h1>
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <p className="max-w-md mb-4 md:mb-0">
            Explore our collection of modern drinking glasses, crafted for style and functionality.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.images && product.images.length > 0 && product.images[0].file
    ? product.images[0].file.url
    : '/placeholder.jpg';

  // Check if variants is an array and has elements
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  return (
    <Link href={`/product/${product.slug}`} className="block"> {/* Use product.slug instead of product.id */}
      <div className="flex flex-col">
        <div className="relative aspect-w-3 aspect-h-4 mb-2 w-full h-64">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover rounded-lg"
          />
        </div>
        <h3 className="font-bold text-lg">{product.name}</h3>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
        {hasVariants && (
          <div className="flex space-x-2 mt-2">
            {product.variants.map((variant, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full bg-gray-500`}
                title={variant.name}
              ></div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}