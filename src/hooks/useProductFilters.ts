import { useCallback, useState, useTransition, useEffect } from 'react';
import { SimpleProduct } from '../lib/shopify';

export type FilterState = {
  mainCategory: string;
  subcategory: string;
  sortBy: string;
};

export const useProductFilters = (initialProducts: SimpleProduct[]) => {
  const [isPending, startTransition] = useTransition();
  const [filteredProducts, setFilteredProducts] = useState<SimpleProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    mainCategory: 'all',
    subcategory: 'all',
    sortBy: 'manual', // Default to manual sort to respect Shopify's order
  });

  const applyFilters = useCallback((products: SimpleProduct[], currentFilters: FilterState) => {
    // Split products into in-stock and out-of-stock
    const inStock = products.filter(p => p.availableForSale && p.quantityAvailable > 0);
    const outOfStock = products.filter(p => !p.availableForSale || p.quantityAvailable === 0);
    
    // Apply category filters to both groups
    const filterByCategory = (items: SimpleProduct[]) => {
      if (currentFilters.mainCategory === 'all') {
        return items;
      }
      
      if (currentFilters.mainCategory === 'Sale') {
        return items.filter(product => 
          product.compareAtPrice && 
          product.compareAtPrice > product.price
        );
      } 
      
      if (currentFilters.mainCategory === 'low-stock') {
        return items.filter(product => 
          product.availableForSale && 
          product.quantityAvailable > 0 && 
          product.quantityAvailable <= 5
        );
      }
      
      return items.filter(product => 
        product.collections?.edges.some(edge => 
          edge.node.handle.toLowerCase() === currentFilters.mainCategory.toLowerCase()
        )
      );
    };

    // Apply filters to both groups
    const filteredInStock = filterByCategory(inStock);
    const filteredOutOfStock = filterByCategory(outOfStock);

    // Combine the results with in-stock first
    let filtered = [...filteredInStock, ...filteredOutOfStock];

    // Only apply sorting if user has explicitly chosen a sort option
    if (currentFilters.sortBy !== 'manual') {
      filtered.sort((a, b) => {
        if (a.availableForSale === b.availableForSale) {
          switch (currentFilters.sortBy) {
            case 'title-asc':
              return a.title.localeCompare(b.title);
            case 'title-desc':
              return b.title.localeCompare(a.title);
            case 'price-asc':
              return a.price - b.price;
            case 'price-desc':
              return b.price - a.price;
            default:
              return 0;
          }
        }
        return a.availableForSale ? -1 : 1;
      });
    }

    return filtered;
  }, []);

  // Update filtered products when initial products or filters change
  useEffect(() => {
    if (initialProducts.length > 0) {
      startTransition(() => {
        // If no filters are active and no search term, return initial products directly
        if (filters.mainCategory === 'all' && filters.sortBy === 'manual' && !searchTerm) {
          setFilteredProducts(initialProducts);
          return;
        }

        // Only create a new array if we need to filter
        let filtered = searchTerm 
          ? initialProducts.filter(product =>
              product.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
            )
          : initialProducts;
        
        // Only apply category/sort filters if they're not at default values
        if (filters.mainCategory !== 'all' || filters.sortBy !== 'manual') {
          filtered = applyFilters(filtered, filters);
        }
        
        setFilteredProducts(filtered);
      });
    }
  }, [initialProducts, filters, searchTerm, applyFilters]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setSearchLoading(true);
    
    startTransition(() => {
      const searchValue = value.toLowerCase().trim();
      
      // If search is cleared and no filters active, return to initial state
      if (!searchValue && filters.mainCategory === 'all' && filters.sortBy === 'manual') {
        setFilteredProducts(initialProducts);
        setSearchLoading(false);
        return;
      }

      // Only filter if we have a search term
      let filtered = searchValue
        ? initialProducts.filter(product => 
            product.title.toLowerCase().includes(searchValue)
          )
        : initialProducts;

      // Only apply category/sort filters if they're not at default values
      if (filters.mainCategory !== 'all' || filters.sortBy !== 'manual') {
        filtered = applyFilters(filtered, filters);
      }

      setFilteredProducts(filtered);
      setSearchLoading(false);
    });
  }, [applyFilters, filters, initialProducts]);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    filters,
    searchTerm,
    searchLoading,
    isPending,
    filteredProducts,
    updateFilters,
    handleSearch,
  };
};
