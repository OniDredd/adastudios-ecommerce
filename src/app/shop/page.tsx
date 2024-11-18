'use client';

import React, { useState, useEffect } from 'react';
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
  tags: string[];
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
  tags: product.tags || [],
  images: product.images.edges.map(edge => ({
    file: { url: edge.node.originalSrc }
  })),
});

const ShopAllPage = () => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState({
    mainCategory: searchParams.get('category') || 'all',
    subcategory: searchParams.get('subcategory') || 'all',
    sortBy: 'title-asc',
  });

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    setSearchLoading(true);
    
    if (value.trim()) {
      try {
        const searchResults = await shopify.searchProducts(value);
        const transformedResults = searchResults.map(transformProduct);
        setFilteredProducts(transformedResults);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    } else {
      filterProducts(products, filters);
    }
    
    setSearchLoading(false);
    setCurrentPage(1);
  };

  const filterProducts = (allProducts: TransformedProduct[], currentFilters: typeof filters) => {
    let filtered = [...allProducts];

    if (currentFilters.mainCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.tags.includes(currentFilters.mainCategory)
      );

      const subCats = new Set<string>();
      filtered.forEach(product => {
        product.tags.forEach(tag => {
          if (tag !== currentFilters.mainCategory) {
            subCats.add(tag);
          }
        });
      });
      setSubCategories(Array.from(subCats));

      if (currentFilters.subcategory !== 'all') {
        filtered = filtered.filter(product =>
          product.tags.includes(currentFilters.subcategory)
        );
      }
    } else {
      setSubCategories([]);
    }

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

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const fetchProducts = async () => {
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
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts(products, filters);
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
      {/* Header */}
      <div className="mb-8">
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
                      {mainCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategory Filter */}
                {filters.mainCategory !== 'all' && subCategories.length > 0 && (
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
                    {filters.mainCategory}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

export default ShopAllPage;
