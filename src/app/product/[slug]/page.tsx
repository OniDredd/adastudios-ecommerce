import { notFound } from 'next/navigation';
import ProductPageContent from '@/components/ProductPageContent';
import swell from '@/lib/swell';

interface SwellProduct {
  id: string;
  name: string;
  brand?: string;
  price: number;
  description: string;
  images: { file: { url: string } }[];
  variants: any; // Changed from any[] to any
  attributes: {
    main_color?: string;
    colors?: string[];
    sizes?: string[];
  };
}

async function getProduct(id: string): Promise<SwellProduct | null> {
  try {
    const product = await swell.products.get(id);
    console.log('Fetched product:', product); // Add this line for debugging
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  // Transform the Swell product data to match your component's expected format
  const transformedProduct = {
    id: product.id,
    name: product.name,
    brand: product.brand || 'Ada Studio',
    price: product.price,
    description: product.description,
    mainColor: product.attributes?.main_color || '#f0f0f0',
    colors: product.attributes?.colors?.map((color: string) => ({
      name: color,
      hex: color,
    })) || [],
    sizes: product.attributes?.sizes || [],
    images: product.images,
    variants: Array.isArray(product.variants)
      ? product.variants.map((variant: any) => ({
          id: variant.id,
          name: variant.name,
        }))
      : [],
    attributes: product.attributes,
  };

  console.log('Transformed product:', transformedProduct); // Add this line for debugging

  return <ProductPageContent product={transformedProduct} />;
}