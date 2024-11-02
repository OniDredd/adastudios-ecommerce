'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductComponent from '../../components/ProductComponent';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import shopify from '../../lib/shopify';

// Define the interfaces we need
interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
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
  images: { file: { url: string } }[];
}

const categories = {
  matcha: {
    name: "Matcha",
    subcategories: ["Ippodo", "Marukyu Koyamaen", "Hibiki-an"],
    collection: "matcha"
  },
  glasses: {
    name: "Glasses",
    subcategories: ["Wine Glasses", "Cocktail Glasses", "Everyday Glasses"],
    collection: "glasses"
  },
  accessories: {
    name: "Accessories",
    subcategories: ["Coasters", "Stirrers", "Care Products"],
    collection: "accessories"
  },
};

const sortOptions = [
  { value: 'title-asc', label: 'Alphabetically, A-Z' },
  { value: 'title-desc', label: 'Alphabetically, Z-A' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'best-selling', label: 'Best Selling' },
];

const transformProduct = (product: ShopifyProduct): TransformedProduct => ({
  id: product.id,
  title: product.title,
  handle: product.handle,
  variantId: product.variants.edges[0]?.node.id || '',
  price: parseFloat(product.priceRange.minVariantPrice.amount),
  images: product.images.edges.map(edge => ({
    file: { url: edge.node.originalSrc }
  })),
});

const ShopAllPage = () => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    mainCategory: searchParams.get('category') || 'all',
    subcategory: searchParams.get('subcategory') || 'all',
    sortBy: 'title-asc',
  });

  const getSubcategories = () => {
    if (filters.mainCategory === 'all') return [];
    return categories[filters.mainCategory as keyof typeof categories]?.subcategories || [];
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let fetchedProducts: ShopifyProduct[] = [];

      if (filters.mainCategory === 'all') {
        // Fetch all products
        fetchedProducts = await shopify.getProducts();
      } else {
        // Fetch products from specific collection
        const categoryData = categories[filters.mainCategory as keyof typeof categories];
        if (categoryData) {
          fetchedProducts = await shopify.getProductsByCollection(categoryData.collection);
        }
      }

      // Filter by subcategory if selected
      let filteredProducts = fetchedProducts;
      if (filters.subcategory !== 'all') {
        filteredProducts = fetchedProducts.filter(product => 
          product.title.includes(filters.subcategory) || 
          product.description.includes(filters.subcategory)
        );
      }

      // Sort products
      filteredProducts.sort((a, b) => {
        const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
        const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
        
        switch (filters.sortBy) {
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'title-desc':
            return b.title.localeCompare(a.title);
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          default:
            return 0;
        }
      });

      // Transform products to match your ProductComponent interface
      const transformedProducts = filteredProducts.map(transformProduct);
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]); // This will re-fetch products whenever filters change

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-main-maroon mb-6">Shop All</h1>
        
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 bg-secondary-peach/10 p-6 rounded-lg">
          {/* Main Category Filter */}
          <div className="flex-1">
            <label className="block text-main-maroon text-sm mb-2">Category</label>
            <Select
              value={filters.mainCategory}
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                mainCategory: value,
                subcategory: 'all'
              }))}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categories).map(([key, category]) => (
                  <SelectItem key={key} value={key}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory Filter */}
          {filters.mainCategory !== 'all' && (
            <div className="flex-1">
              <label className="block text-main-maroon text-sm mb-2">
                {categories[filters.mainCategory as keyof typeof categories].name} Types
              </label>
              <Select
                value={filters.subcategory}
                onValueChange={(value) => setFilters(prev => ({ ...prev, subcategory: value }))}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {getSubcategories().map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Sort Filter */}
          <div className="flex-1">
            <label className="block text-main-maroon text-sm mb-2">Sort By</label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
            >
              <SelectTrigger className="w-full bg-white">
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

        {/* Active Filters */}
        {(filters.mainCategory !== 'all' || filters.subcategory !== 'all') && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.mainCategory !== 'all' && (
              <Button
                variant="outline"
                size="sm"
                className="bg-main-maroon text-secondary-peach hover:bg-main-maroon/90"
                onClick={() => setFilters(prev => ({ ...prev, mainCategory: 'all', subcategory: 'all' }))}
              >
                {categories[filters.mainCategory as keyof typeof categories].name} ×
              </Button>
            )}
            {filters.subcategory !== 'all' && (
              <Button
                variant="outline"
                size="sm"
                className="bg-main-maroon text-secondary-peach hover:bg-main-maroon/90"
                onClick={() => setFilters(prev => ({ ...prev, subcategory: 'all' }))}
              >
                {filters.subcategory} ×
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductComponent
              key={product.id}
              product={{...product, brand: ''}}
              textColor="main-maroon"
            />
          ))}
        </div>
      )}

      {/* No Products Found Message */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-main-maroon text-lg">
            No products found with the selected filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShopAllPage;
