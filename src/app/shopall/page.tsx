'use server'

import Image from "next/image";
import swell from '@/lib/swell';

// Define types for your product and variant
interface Variant {
  name: string;
  // Add other variant properties as needed
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: Array<{file: {url: string}}>;
  variants?: Variant[];
  // Add other product properties as needed
}

async function getProducts(): Promise<Product[]> {
  const results = await swell.products.list({
    limit: 100, // Adjust as needed
    expand: ['variants', 'images']
  });
  return results.results;
}

export default async function AllClothing() {
  const products = await getProducts();

  return (
    <main>
      <section className="p-32 bg-main-green text-main-creme">
        <h1 className="text-4xl font-bold mb-4 font-main-font">ALL GLASSES</h1>
        <div className="flex justify-between items-start mb-8">
          <p className="max-w-md">
            Explore our collection of modern drinking glasses...
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <div key={product.id}>
              <Image
                src={product.images[0]?.file?.url || '/placeholder.jpg'}
                alt={product.name}
                width={300}
                height={400}
                className="w-full h-auto mb-2 bg-zinc-700"
              />
              <h3 className="font-bold">{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
              <div className="flex space-x-1 mt-1">
                {product.variants?.map((variant: Variant, index: number) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full bg-gray-500`}
                    title={variant.name}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}