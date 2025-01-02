import { SimpleProduct } from '../../lib/shopify';
import ProductComponent from '../ProductComponent';

interface ProductGridProps {
  products: SimpleProduct[];
  isLoading?: boolean;
  loadingCount?: number;
  className?: string;
}

export function ProductGrid({ 
  products, 
  isLoading = false, 
  loadingCount = 8,
  className = '' 
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 ${className}`}>
        {[...Array(loadingCount)].map((_, index) => (
          <ProductComponent
            key={index}
            product={{} as any}
            isLoading={true}
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-main-maroon text-lg">
          No products found with the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 ${className}`}>
      {products.map((product) => (
        <ProductComponent
          key={product.id}
          product={product}
          textColor="main-maroon"
        />
      ))}
    </div>
  );
}
