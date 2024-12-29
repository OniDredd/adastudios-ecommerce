'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductComponent from '../../components/ProductComponent';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import shopify from '../../lib/shopify';
import { ChevronDown, Filter, Search, SlidersHorizontal, X } from 'lucide-react';

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        originalSrc: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        availableForSale: boolean;
        quantityAvailable: number;
        compareAtPriceV2?: {
          amount: string;
          currencyCode: string;
        } | null;
      };
    }>;
  };
}

interface TransformedProduct {
  id: string;
  title: string;
  handle: string;
  variantId: string;
  price: number;
  compareAtPrice?: number;
  brand: string;
  tags: string[];
  availableForSale: boolean;
  quantityAvailable: number;
  images: { file: { url: string } }[];
}

const mainCategories = ["Matcha", "Glasses", "Accessories"];

const sortOptions = [
  { value: 'title-asc', label: 'Alphabetically, A-Z' },
  { value: 'title-desc', label: 'Alphabetically, Z-A' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'best-selling', label: 'Best Selling' },
];

const PRODUCTS_PER_PAGE = 12;

const transformProduct = (product: ShopifyProduct): TransformedProduct => ({
  id: product.id,
  title: product.title,
  handle: product.handle,
  variantId: product.variants.edges[0]?.node.id || '',
  price: parseFloat(product.priceRange.minVariantPrice.amount),
  compareAtPrice: product.variants.edges[0]?.node.compareAtPriceV2
    ? parseFloat(product.variants.edges[0].node.compareAtPriceV2.amount)
    : undefined,
  brand: '',
  tags: product.tags || [],
  availableForSale: product.availableForSale,
  quantityAvailable: product.variants.edges[0]?.node.quantityAvailable || 0,
  images: product.images.edges.map(edge => ({
    file: { url: edge.node.originalSrc }
  }))
});

const ShopContent = () => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState({
    mainCategory: 'all',
    subcategory: 'all',
    sortBy: 'title-asc',
  });

  // Update filters when URL changes
  useEffect(() => {
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const onSale = searchParams.get('onSale');
    const stockFilter = searchParams.get('stockFilter');

    setFilters(prev => ({
      ...prev,
      mainCategory: category || (onSale ? 'Sale' : (stockFilter === 'low' ? 'low-stock' : 'all')),
      subcategory: subcategory || 'all'
    }));
  }, [searchParams]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const applyFilters = useCallback((products: TransformedProduct[], currentFilters: typeof filters) => {
    let filtered = [...products];

    // Apply main category filter
    if (currentFilters.mainCategory !== 'all') {
      if (currentFilters.mainCategory === 'Sale') {
        // Show products that have a compareAtPrice higher than their regular price
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
          product.tags.includes(currentFilters.mainCategory)
        );

        if (currentFilters.subcategory !== 'all') {
          filtered = filtered.filter(product =>
            product.tags.includes(currentFilters.subcategory)
          );
        }
      }
    }

    // Apply sort
    filtered.sort((a, b) => {
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
    });

    return filtered;
  }, []);

  const filterProducts = useCallback((allProducts: TransformedProduct[], currentFilters: typeof filters) => {
    let filtered = [...allProducts];

    // Apply search filter if there's a search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }

    // Apply all other filters
    filtered = applyFilters(filtered, currentFilters);

    // Update subcategories if needed
    if (currentFilters.mainCategory !== 'all' && currentFilters.mainCategory !== 'Sale' && currentFilters.mainCategory !== 'low-stock') {
      const subCats = new Set<string>();
      filtered.forEach(product => {
        product.tags.forEach(tag => {
          if (tag !== currentFilters.mainCategory) {
            subCats.add(tag);
          }
        });
      });
      setSubCategories(Array.from(subCats));
    } else {
      setSubCategories([]);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [applyFilters, searchTerm, setSubCategories, setFilteredProducts, setCurrentPage]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setSearchLoading(true);
    
    const searchValue = value.toLowerCase().trim();
    let filtered = [...products];

    if (searchValue) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchValue)
      );
    }

    // Apply existing filters to search results
    filtered = applyFilters(filtered, filters);

    setFilteredProducts(filtered);
    setSearchLoading(false);
    setCurrentPage(1);
  }, [applyFilters, filters, products, setSearchTerm, setSearchLoading, setFilteredProducts, setCurrentPage]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedProducts = await shopify.getProducts();
      const transformedProducts = fetchedProducts.map(transformProduct);
      setProducts(transformedProducts);
      filterProducts(transformedProducts, filters);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  }, [filterProducts, filters, setLoading, setProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    filterProducts(products, filters);
  }, [filterProducts, filters, products]);

  return (
    <div className="mx-auto pt-32 pb-8">
      {/* Header */}
      <div className="mb-8 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-main-maroon">Shop All</h1>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-main-maroon border-main-maroon hover:bg-main-maroon hover:text-secondary-peach transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
        
        {/* Search and Filter Bar */}
        <div className={`transform transition-all duration-300 ease-in-out ${showFilters ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 h-0 overflow-hidden'}`}>
          <div className="bg-secondary-peach/10 rounded-lg shadow-sm border border-main-maroon/10 overflow-hidden">
            <div className="p-4 border-b border-main-maroon/10 bg-main-maroon text-secondary-peach">
              <div className="flex items-center gap-2">
                <Filter size={18} />
                <span className="font-medium">Search & Filters</span>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-white border-main-maroon/20"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-main-maroon/40" size={18} />
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-main-maroon/20 border-t-main-maroon"></div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-main-maroon flex items-center gap-2">
                    Category
                  </label>
                  <Select
                    value={filters.mainCategory}
                    onValueChange={(value) => setFilters(prev => ({ 
                      ...prev, 
                      mainCategory: value,
                      subcategory: 'all'
                    }))}
                  >
                    <SelectTrigger className="w-full bg-white border-main-maroon/20 hover:bg-main-maroon hover:text-secondary-peach transition-colors">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Sale">On Sale</SelectItem>
                      {mainCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategory Filter */}
                {filters.mainCategory !== 'all' && filters.mainCategory !== 'Sale' && filters.mainCategory !== 'low-stock' && subCategories.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-main-maroon flex items-center gap-2">
                      {filters.mainCategory} Types
                    </label>
                    <Select
                      value={filters.subcategory}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, subcategory: value }))}
                    >
                      <SelectTrigger className="w-full bg-white border-main-maroon/20 hover:bg-main-maroon hover:text-secondary-peach transition-colors">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {subCategories.map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Sort Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-main-maroon flex items-center gap-2">
                    Sort By
                  </label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                  >
                    <SelectTrigger className="w-full bg-white border-main-maroon/20 hover:bg-main-maroon hover:text-secondary-peach transition-colors">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.mainCategory !== 'all' || filters.subcategory !== 'all' || searchTerm) && (
              <div className="px-6 pb-6 flex flex-wrap gap-2 animate-in fade-in-0 slide-in-from-top-2">
                <div className="text-sm text-main-maroon/60 flex items-center gap-2">
                  <span>Active Filters:</span>
                </div>
                {searchTerm && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-sm bg-main-maroon text-secondary-peach border-main-maroon hover:bg-main-maroon/90 transition-colors flex items-center gap-1 animate-in fade-in-0 slide-in-from-left-2"
                    onClick={() => handleSearch('')}
                  >
                    Search: {searchTerm}
                    <X size={14} />
                  </Button>
                )}
                {filters.mainCategory !== 'all' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-sm bg-main-maroon text-secondary-peach border-main-maroon hover:bg-main-maroon/90 transition-colors flex items-center gap-1 animate-in fade-in-0 slide-in-from-left-2"
                    onClick={() => setFilters(prev => ({ ...prev, mainCategory: 'all', subcategory: 'all' }))}
                  >
                    {filters.mainCategory === 'low-stock' ? 'Low Stock' : filters.mainCategory}
                    <X size={14} />
                  </Button>
                )}
                {filters.subcategory !== 'all' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-sm bg-main-maroon text-secondary-peach border-main-maroon hover:bg-main-maroon/90 transition-colors flex items-center gap-1 animate-in fade-in-0 slide-in-from-left-2"
                    onClick={() => setFilters(prev => ({ ...prev, subcategory: 'all' }))}
                  >
                    {filters.subcategory}
                    <X size={14} />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className={`transform transition-all duration-300 ease-in-out ${showFilters ? 'translate-y-0' : '-translate-y-4'}`}>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, index) => (
              <ProductComponent
                key={index}
                product={{} as any}
                isLoading={true}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {currentProducts.map((product) => (
                <ProductComponent
                  key={product.id}
                  product={{...product, brand: ''}}
                  textColor="main-maroon"
                />
              ))}
            </div>

            {/* No Products Found Message */}
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-main-maroon text-lg">
                  No products found with the selected filters.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="text-main-maroon border-main-maroon hover:bg-main-maroon hover:text-secondary-peach transition-colors"
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(index + 1)}
                    className={currentPage === index + 1 
                      ? "bg-main-maroon text-secondary-peach hover:bg-main-maroon/90"
                      : "text-main-maroon border-main-maroon hover:bg-main-maroon hover:text-secondary-peach"}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="text-main-maroon border-main-maroon hover:bg-main-maroon hover:text-secondary-peach transition-colors"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ShopAllPage = () => {
  return (
    <Suspense fallback={
      <div className="mx-auto pt-32 pb-8">
        <div className="animate-pulse px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="h-8 w-48 bg-main-maroon/20 rounded mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="aspect-[3/4] bg-main-maroon/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
};

export default ShopAllPage;
