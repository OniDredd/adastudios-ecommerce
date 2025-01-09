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
  const gridClassName = `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 min-h-[500px] ${className}`;

  // Determine the number of rows needed to maintain grid height
  const numRows = Math.ceil((products?.length || loadingCount) / 4);
  const minHeight = `${numRows * 400}px`; // Assuming each row is roughly 400px tall

  return (
    <div className="grid" style={{ minHeight }}>
      {/* Both grids occupy the same space using [grid-area:1/1] */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 [grid-area:1/1] transition-all duration-300 ${
        isLoading ? 'opacity-100 z-10' : 'opacity-0 z-0'
      }`}>
        {[...Array(loadingCount)].map((_, index) => (
          <ProductComponent
            key={`loading-${index}`}
            product={{} as any}
            isLoading={true}
          />
        ))}
      </div>

      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 [grid-area:1/1] transition-all duration-300 ${
        isLoading ? 'opacity-0 z-0' : 'opacity-100 z-10'
      }`}>
        {(!products || products.length === 0) ? (
          <div className="col-span-full text-center py-12">
            <p className="text-main-maroon text-lg">
              No products found with the selected filters.
            </p>
          </div>
        ) : (
          products.map((product) => (
            <ProductComponent
              key={product.id}
              product={product}
              textColor="main-maroon"
            />
          ))
        )}
      </div>
    </div>
  );
}
