import { useCallback, useState, useTransition } from 'react';
import { SimpleProduct } from '../lib/shopify';

export type FilterState = {
  mainCategory: string;
  subcategory: string;
  sortBy: string;
};

export const useProductFilters = (initialProducts: SimpleProduct[]) => {
  const [isPending, startTransition] = useTransition();
  const [filteredProducts, setFilteredProducts] = useState<SimpleProduct[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    mainCategory: 'all',
    subcategory: 'all',
    sortBy: 'title-asc',
  });

  const applyFilters = useCallback((products: SimpleProduct[], currentFilters: FilterState) => {
    let filtered = [...products];

    if (currentFilters.mainCategory !== 'all') {
      if (currentFilters.mainCategory === 'Sale') {
        filtered = filtered.filter(product => 
          product.compareAtPrice && 
          product.compareAtPrice > product.price
        );
      } else if (currentFilters.mainCategory === 'low-stock') {
        filtered = filtered.filter(product => 
          product.availableForSale && 
          product.quantityAvailable > 0 && 
          product.quantityAvailable <= 5
        );
      } else {
        filtered = filtered.filter(product => 
          product.tags.some(tag => tag.toLowerCase() === currentFilters.mainCategory.toLowerCase())
        );
      }
    }

    // Sort by availability first, then by selected criteria
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

    return filtered;
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setSearchLoading(true);
    
    startTransition(() => {
      const searchValue = value.toLowerCase().trim();
      let filtered = [...initialProducts];

      if (searchValue) {
        filtered = filtered.filter(product => 
          product.title.toLowerCase().includes(searchValue)
        );
      }

      filtered = applyFilters(filtered, filters);

      setFilteredProducts(filtered);
      setSearchLoading(false);
    });
  }, [applyFilters, filters, initialProducts]);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    startTransition(() => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      
      let filtered = [...initialProducts];
      
      if (searchTerm) {
        filtered = filtered.filter(product =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );
      }
      
      filtered = applyFilters(filtered, updatedFilters);
      setFilteredProducts(filtered);
    });
  }, [applyFilters, filters, initialProducts, searchTerm]);

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
