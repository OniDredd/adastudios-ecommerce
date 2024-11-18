"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import shopify from '../lib/shopify';

interface CategoryStructure {
  name: string;
  description: string;
  href: string;
  subcategories: {
    title: string;
    items: Array<{
      name: string;
      description: string;
      href: string;
    }>;
  };
  featured: Array<{
    name: string;
    description: string;
    imageSrc: string;
    href: string;
  }>;
}

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  tags: string[];
  images: {
    edges: Array<{
      node: {
        originalSrc: string;
        altText: string | null;
      };
    }>;
  };
}

export function ShopAllMenu() {
  const [activeCategory, setActiveCategory] = useState<CategoryStructure | null>(null);
  const [categories, setCategories] = useState<CategoryStructure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsAndOrganize = async () => {
      try {
        const products = await shopify.getProducts();
        const categoryMap = new Map<string, Set<string>>();
        const productsByCategory = new Map<string, ShopifyProduct[]>();

        // First pass: collect all main categories and their subcategories
        products.forEach(product => {
          product.tags.forEach(tag => {
            if (tag === "Matcha" || tag === "Glasses" || tag === "Accessories") {
              if (!categoryMap.has(tag)) {
                categoryMap.set(tag, new Set());
                productsByCategory.set(tag, []);
              }
              // Add product to this category
              productsByCategory.get(tag)?.push(product);
              
              // Add other tags as subcategories
              product.tags.forEach(subtag => {
                if (subtag !== tag) {
                  categoryMap.get(tag)?.add(subtag);
                }
              });
            }
          });
        });

        // Transform the data into our category structure
        const transformedCategories = Array.from(categoryMap.entries()).map(([categoryName, subcats]) => {
          const categoryProducts = productsByCategory.get(categoryName) || [];
          const featuredProducts = categoryProducts.slice(0, 2);

          return {
            name: categoryName,
            description: `Explore our ${categoryName.toLowerCase()} collection`,
            href: `/shop?category=${categoryName}`,
            subcategories: {
              title: `${categoryName} Types`,
              items: Array.from(subcats).map(subcat => ({
                name: subcat,
                description: `${subcat} ${categoryName.toLowerCase()}`,
                href: `/shop?category=${categoryName}&subcategory=${subcat}`,
              })),
            },
            featured: featuredProducts.map(product => ({
              name: product.title,
              description: product.description.substring(0, 50) + '...',
              imageSrc: product.images.edges[0]?.node.originalSrc || '/placeholder.jpg',
              href: `/product/${product.handle}`,
            })),
          };
        });

        setCategories(transformedCategories);
        if (transformedCategories.length > 0) {
          setActiveCategory(transformedCategories[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProductsAndOrganize();
  }, []);

  if (loading || !activeCategory) {
    return (
      <NavigationMenuItem>
        <Link href="/shop" className="inline-flex">
          <NavigationMenuTrigger className="data-[state=open]:bg-main-maroon bg-transparent hover:bg-main-maroon hover:text-secondary-peach data-[state=open]:text-secondary-peach">
            SHOP ALL
          </NavigationMenuTrigger>
        </Link>
        <NavigationMenuContent>
          <div className="w-screen h-96 bg-secondary-peach flex items-center justify-center border border-main-maroon rounded-lg">
            <div className="text-main-maroon">Loading...</div>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <Link href="/shop" className="inline-flex">
        <NavigationMenuTrigger className="data-[state=open]:bg-main-maroon bg-transparent hover:bg-main-maroon hover:text-secondary-peach data-[state=open]:text-secondary-peach">
          SHOP ALL
        </NavigationMenuTrigger>
      </Link>
      <NavigationMenuContent>
        <div className="w-screen bg-secondary-peach p-6 border border-main-maroon rounded-lg">
          {/* Main Categories */}
          <div className="container mx-auto grid grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-main-maroon">Categories</h3>
              <ul className="space-y-2 pr-4">
                {categories.map((category) => (
                  <li 
                    key={category.name}
                    className="group"
                    onMouseEnter={() => setActiveCategory(category)}
                  >
                    <Link
                      href={category.href}
                      className={`block p-2 rounded-md transition-colors hover:bg-main-maroon hover:text-secondary-peach ${
                        activeCategory.name === category.name 
                          ? 'bg-main-maroon text-secondary-peach' 
                          : 'text-main-maroon'
                      }`}
                    >
                      <div className="text-sm font-medium">{category.name}</div>
                      <p className="text-sm opacity-80">{category.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Featured Products */}
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4">
                {activeCategory.featured.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group relative"
                  >
                    <div className="aspect-square relative rounded-lg overflow-hidden">
                      <Image
                        src={item.imageSrc}
                        alt={item.name}
                        className="object-cover transition-transform group-hover:scale-105"
                        fill
                      />
                    </div>
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-main-maroon">{item.name}</h4>
                      <p className="text-sm text-main-maroon line-clamp-2">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
