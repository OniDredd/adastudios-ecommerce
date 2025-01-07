"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "../../components/ui/button";
import shopify, { SimpleProduct } from "../../lib/shopify";
import { SlidersHorizontal } from "lucide-react";
import { transformProduct } from "../../utils/product-transforms";
import { useProductFilters } from "../../hooks/useProductFilters";
import { usePagination } from "../../hooks/usePagination";
import { FilterPanel } from "../../components/shop/FilterPanel";
import { ProductGrid } from "../../components/shop/ProductGrid";
import { Pagination } from "../../components/Pagination";

const PRODUCTS_PER_PAGE = 12;

export default function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const {
    filters,
    searchTerm,
    searchLoading,
    isPending,
    filteredProducts,
    updateFilters,
    handleSearch,
  } = useProductFilters(products);

  const {
    currentPage,
    totalPages,
    paginatedItems: currentProducts,
    goToPage,
  } = usePagination(filteredProducts, PRODUCTS_PER_PAGE);

  // Update filters when URL changes
  useEffect(() => {
    const category = searchParams.get("category");
    const onSale = searchParams.get("onSale");
    const stockFilter = searchParams.get("stockFilter");

    updateFilters({
      mainCategory: category || (onSale ? "Sale" : stockFilter === "low" ? "low-stock" : "all"),
      subcategory: "all",
    });
  }, [searchParams, updateFilters]);

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      // Fetch products from the "all" collection to respect manual sorting
      // Get products from the "all" collection to respect manual sorting
      const collections = await shopify.getCollections();
      const allCollection = collections.find(c => c.handle === 'all');
      if (!allCollection) {
        throw new Error('All collection not found');
      }
      const fetchedProducts = await shopify.getProductsByCollection('all');
      if (!fetchedProducts || fetchedProducts.length === 0) {
        throw new Error('No products found');
      }
      const transformedProducts = fetchedProducts.map(transformProduct);
      setProducts(transformedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError('Failed to load products. Please try again later.');
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="mx-auto pt-32 pb-8">
      {/* Header */}
      <div className="mb-8 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium text-main-maroon">Shop All</h1>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-main-maroon border-main-maroon hover:bg-main-maroon hover:text-secondary-peach transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filter Panel */}
        <div
          className={`transform transition-all duration-300 ease-in-out ${
            showFilters ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 h-0 overflow-hidden"
          }`}
        >
          <FilterPanel
            filters={filters}
            searchTerm={searchTerm}
            searchLoading={searchLoading}
            onSearchChange={handleSearch}
            onFilterChange={updateFilters}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div
        className={`transform transition-all duration-300 ease-in-out ${
          showFilters ? "translate-y-0" : "-translate-y-4"
        }`}
      >
        {error ? (
          <div className="text-center py-12">
            <p className="text-main-maroon text-lg">{error}</p>
            <button
              onClick={() => fetchProducts()}
              className="mt-4 px-4 py-2 bg-main-maroon text-secondary-peach rounded hover:bg-main-maroon/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <ProductGrid
            products={currentProducts}
            isLoading={products.length === 0 || isPending}
            loadingCount={8}
          />
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          className="mt-8"
        />
      </div>
    </div>
  );
}
