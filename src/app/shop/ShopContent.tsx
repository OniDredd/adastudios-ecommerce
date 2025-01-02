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
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    try {
      const fetchedProducts = await shopify.getProducts();
      const transformedProducts = fetchedProducts.map(transformProduct);
      setProducts(transformedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
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
        <ProductGrid
          products={currentProducts}
          isLoading={loading || isPending}
          loadingCount={8}
        />

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
