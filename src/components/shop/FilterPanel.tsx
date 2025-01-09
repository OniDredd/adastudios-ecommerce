import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Filter, Search, X } from 'lucide-react';
import { FilterState } from '../../hooks/useProductFilters';

// Collection handles and their display names
const collections = [
  { handle: "matcha", label: "Matcha" },
  { handle: "glasses", label: "Glasses" },
  { handle: "accessories", label: "Accessories" }
];

const sortOptions = [
  { value: 'manual', label: 'Best Selling' },
  { value: 'title-asc', label: 'Alphabetically, A-Z' },
  { value: 'title-desc', label: 'Alphabetically, Z-A' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
];

interface FilterPanelProps {
  filters: FilterState;
  searchTerm: string;
  searchLoading: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: Partial<FilterState>) => void;
  className?: string;
}

export function FilterPanel({
  filters,
  searchTerm,
  searchLoading,
  onSearchChange,
  onFilterChange,
  className = '',
}: FilterPanelProps) {
  return (
    <div className={`bg-secondary-peach/10 rounded-lg shadow-sm border border-main-maroon overflow-hidden ${className}`}>
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border border-main-maroon"
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
              onValueChange={(value) => onFilterChange({ 
                mainCategory: value,
                subcategory: 'all'
              })}
            >
              <SelectTrigger className="w-full bg-white border border-main-maroon hover:bg-main-maroon hover:text-secondary-peach transition-colors">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="border border-main-maroon">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Sale">On Sale</SelectItem>
                {collections.map((collection) => (
                  <SelectItem key={collection.handle} value={collection.handle}>
                    {collection.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-main-maroon flex items-center gap-2">
              Sort By
            </label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => onFilterChange({ sortBy: value })}
            >
              <SelectTrigger className="w-full bg-white border border-main-maroon hover:bg-main-maroon hover:text-secondary-peach transition-colors">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="border border-main-maroon">
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
      {(filters.mainCategory !== 'all' || searchTerm) && (
        <div className="px-6 pb-6 flex flex-wrap gap-2 animate-in fade-in-0 slide-in-from-top-2">
          <div className="text-sm text-main-maroon/60 flex items-center gap-2">
            <span>Active Filters:</span>
          </div>
          {searchTerm && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-sm bg-main-maroon text-secondary-peach border-main-maroon hover:bg-main-maroon/90 transition-colors flex items-center gap-1 animate-in fade-in-0 slide-in-from-left-2"
              onClick={() => onSearchChange('')}
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
              onClick={() => onFilterChange({ mainCategory: 'all', subcategory: 'all' })}
            >
              {filters.mainCategory === 'low-stock' 
                ? 'Low Stock' 
                : filters.mainCategory === 'Sale'
                  ? 'Sale'
                  : collections.find(c => c.handle === filters.mainCategory)?.label || filters.mainCategory}
              <X size={14} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
