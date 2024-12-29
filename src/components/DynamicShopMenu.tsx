"use client";

import { useState, useEffect, type JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import shopify from '../lib/shopify';
import { ShopifyProduct } from '../types/shopify';

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

export function ShopAllMenu(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<CategoryStructure | null>(null);
  const [categories, setCategories] = useState<CategoryStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string, e?: React.MouseEvent): void => {
    if (e) {
      e.preventDefault();
    }
    // Always use replace when on shop page to ensure filters are cleared
    if (pathname.startsWith('/shop')) {
      router.replace(href);
    } else {
      router.push(href);
    }
  };

  const isOnSale = (product: ShopifyProduct): boolean => {
    const variant = product.variants.edges[0]?.node;
    return Boolean(
      variant?.compareAtPriceV2 && 
      parseFloat(variant.compareAtPriceV2.amount) > parseFloat(variant.priceV2.amount)
    );
  };

  useEffect(() => {
    const fetchProductsAndOrganize = async () => {
      try {
        const products = await shopify.getProducts();
        const categoryMap = new Map<string, Set<string>>();
        const productsByCategory = new Map<string, ShopifyProduct[]>();

        // Process categories (removed Clearance category)
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
              description: product.descriptionHtml,
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
        <div onClick={(e) => handleNavigation('/shop', e)} className="inline-flex cursor-pointer">
          <NavigationMenuTrigger className="data-[state=open]:bg-main-maroon bg-transparent border border-transparent hover:border-main-maroon data-[state=open]:text-secondary-peach">
            SHOP ALL
          </NavigationMenuTrigger>
        </div>
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
      <div onClick={(e) => handleNavigation('/shop', e)} className="inline-flex cursor-pointer">
        <NavigationMenuTrigger className="data-[state=open]:bg-main-maroon bg-transparent border border-transparent hover:border-main-maroon data-[state=open]:text-secondary-peach">
          SHOP ALL
        </NavigationMenuTrigger>
      </div>
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
                    <a
                      href={category.href}
                      onClick={(e) => handleNavigation(category.href, e)}
                      className={`block p-2 rounded-md transition-colors border ${
                        activeCategory.name === category.name 
                          ? 'border-main-maroon' 
                          : 'border-transparent hover:border-main-maroon text-main-maroon'
                      }`}
                    >
                      <div className="text-sm font-medium">{category.name}</div>
                      <p className="text-sm opacity-80">{category.description}</p>
                    </a>
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
                    <div className="mt-3">
                      <h4 className="text-base font-bold text-main-maroon mb-2 tracking-wide">
                        {item.name}
                      </h4>
                      <div 
                        className="text-sm text-main-maroon/80 line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
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
