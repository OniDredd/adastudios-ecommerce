"use client";

import { useState, useEffect, type JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getDiscountPercentage, getInventoryQuantity } from "../utils/product-transforms";
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

const isOnSale = (product: ShopifyProduct): boolean => {
  const variant = product.variants.edges[0]?.node;
  return Boolean(
    variant?.compareAtPriceV2 && 
    parseFloat(variant.compareAtPriceV2.amount) > parseFloat(variant.priceV2.amount)
  );
};

export function ShopAllMenu(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<CategoryStructure | null>(null);
  const [categories, setCategories] = useState<CategoryStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string, e?: React.MouseEvent): void => {
    if (e) {
      e.preventDefault();
    }
    if (pathname.startsWith('/shop')) {
      router.replace(href);
    } else {
      router.push(href);
    }
  };

  const handleCategoryChange = (category: CategoryStructure) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(category);
      setIsTransitioning(false);
    }, 300); // Match the fade-out duration
  };

  useEffect(() => {
    const fetchProductsAndOrganize = async () => {
      try {
        // Get products from the "all" collection to respect manual sorting
        const collections = await shopify.getCollections();
        const allCollection = collections.find(c => c.handle === 'all');
        if (!allCollection) {
          throw new Error('All collection not found');
        }
        const products = await shopify.getProductsByCollection('all');
        const categoryMap = new Map<string, Set<string>>();
        const productsByCategory = new Map<string, ShopifyProduct[]>();

        const mainCategories = ["Matcha", "Glasses", "Accessories"];
        
        mainCategories.forEach(category => {
          categoryMap.set(category, new Set());
          productsByCategory.set(category, []);
        });

        products.forEach(product => {
          mainCategories.forEach(category => {
            if (product.tags.includes(category)) {
              productsByCategory.get(category)?.push(product);
              
              product.tags.forEach(subtag => {
                if (subtag !== category) {
                  categoryMap.get(category)?.add(subtag);
                }
              });
            }
          });
        });

        const transformedCategories = Array.from(categoryMap.entries()).map(([categoryName, subcats]) => {
          const categoryProducts = productsByCategory.get(categoryName) || [];
          const inStockProducts = categoryProducts.filter(product => product.availableForSale);
          const featuredProducts = inStockProducts.slice(0, 3);

          return {
            name: categoryName,
            description: `Explore our ${categoryName.toLowerCase()} collection`,
            href: `/shop?category=${categoryName.toLowerCase()}`,
            subcategories: {
              title: `${categoryName} Types`,
              items: Array.from(subcats).map(subcat => ({
                name: subcat,
                description: `${subcat} ${categoryName.toLowerCase()}`,
                href: `/shop?category=${categoryName.toLowerCase()}&subcategory=${subcat}`,
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
          <NavigationMenuTrigger className="data-[state=open]:bg-main-maroon bg-transparent border border-transparent hover:border-main-maroon hover:text-main-maroon data-[state=open]:text-secondary-peach">
            SHOP ALL
          </NavigationMenuTrigger>
        </div>
        <NavigationMenuContent className="data-[motion=from-start]:animate-slide-in-from-left data-[motion=from-end]:animate-slide-in-from-right data-[motion=to-start]:animate-slide-out-to-left data-[motion=to-end]:animate-slide-out-to-right">
          <div className="w-screen h-[400px] bg-secondary-peach flex items-center justify-center border border-main-maroon rounded-lg">
            <div className="text-main-maroon">Loading...</div>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <div onClick={(e) => handleNavigation('/shop', e)} className="inline-flex cursor-pointer">
        <NavigationMenuTrigger className="data-[state=open]:bg-main-maroon bg-transparent border border-transparent hover:border-main-maroon hover:text-main-maroon data-[state=open]:text-secondary-peach">
          SHOP ALL
        </NavigationMenuTrigger>
      </div>
      <NavigationMenuContent className="data-[motion=from-start]:animate-slide-in-from-left data-[motion=from-end]:animate-slide-in-from-right data-[motion=to-start]:animate-slide-out-to-left data-[motion=to-end]:animate-slide-out-to-right">
        <div className="w-screen h-[400px] bg-secondary-peach p-6 border border-main-maroon rounded-lg">
          <div className="container mx-auto grid grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-base font-medium text-main-maroon">Categories</h3>
              <ul className="space-y-2 pr-4">
                {categories.map((category) => (
                  <li 
                    key={category.name}
                    className="group"
                    onMouseEnter={() => handleCategoryChange(category)}
                  >
                    <a
                      href={category.href}
                      onClick={(e) => handleNavigation(category.href, e)}
                      className={`block p-2 rounded-md transition-colors border text-main-maroon ${
                        activeCategory.name === category.name 
                          ? 'border-main-maroon' 
                          : 'border-transparent hover:border-main-maroon'
                      }`}
                    >
                      <div className="text-sm font-medium">{category.name}</div>
                      <p className="text-sm opacity-80">{category.description}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2">
              <div 
                className={`grid grid-cols-3 gap-4 transition-opacity duration-300 ease-in-out ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {activeCategory.featured.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group relative"
                  >
                    <div className="aspect-square relative rounded-lg overflow-hidden border border-transparent hover:border-main-maroon transition-colors">
                      <Image
                        src={item.imageSrc}
                        alt={item.name}
                        className="object-cover"
                        fill
                      />
                    </div>
                    <div className="mt-2">
                    <h4 className="text-sm font-medium text-main-maroon mb-1 tracking-wide">
                      {item.name}
                      </h4>
                      <div 
                        className="text-xs text-main-maroon/80 line-clamp-2 leading-snug"
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

interface SaleCategory {
  name: string;
  description: string;
  href: string;
  featured: Array<{
    name: string;
    description: string;
    imageSrc: string;
    href: string;
    type: 'clearance' | 'last-chance';
  }>;
}

export function SaleMenu(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<SaleCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<SaleCategory | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string, e?: React.MouseEvent): void => {
    if (e) {
      e.preventDefault();
    }
    if (pathname.startsWith('/shop')) {
      router.replace(href);
    } else {
      router.push(href);
    }
  };

  const handleCategoryChange = (category: SaleCategory) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(category);
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const products = await shopify.getProductsByCollection('all');
        const saleProducts = products.filter(product => isOnSale(product) && product.availableForSale);
        
        // For clearance section - get products with highest discount
        const clearanceProducts = [...saleProducts]
          .sort((a, b) => getDiscountPercentage(b) - getDiscountPercentage(a))
          .slice(0, 3)
          .map(product => ({
            name: `${product.title} - ${getDiscountPercentage(product)}% OFF`,
            description: product.descriptionHtml,
            imageSrc: product.images.edges[0]?.node.originalSrc || '/placeholder.jpg',
            href: `/product/${product.handle}`,
            type: 'clearance' as const
          }));
          
        // For last chance section - get products with lowest quantity
        const lastChanceProducts = [...products]
          .filter(product => product.availableForSale && getInventoryQuantity(product) > 0)
          .sort((a, b) => getInventoryQuantity(a) - getInventoryQuantity(b))
          .slice(0, 3)
          .map(product => ({
            name: `${product.title} - Only ${getInventoryQuantity(product)} left`,
            description: product.descriptionHtml,
            imageSrc: product.images.edges[0]?.node.originalSrc || '/placeholder.jpg',
            href: `/product/${product.handle}`,
            type: 'last-chance' as const
          }));

        const saleCategories = [
          {
            name: 'Clearance',
            description: 'Up to 70% off',
            href: '/shop?onSale=true',
            featured: clearanceProducts
          },
          {
            name: 'Last Chance',
            description: 'Limited availability',
            href: '/shop?stockFilter=low',
            featured: lastChanceProducts
          }
        ];

        setCategories(saleCategories);
        setActiveCategory(saleCategories[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sale products:', error);
        setLoading(false);
      }
    };

    fetchSaleProducts();
  }, []);

  if (loading) {
    return (
      <NavigationMenuItem>
        <div onClick={(e) => handleNavigation('/shop?onSale=true', e)} className="inline-flex cursor-pointer">
          <NavigationMenuTrigger className="data-[state=open]:bg-main-maroon bg-transparent border border-transparent hover:border-main-maroon hover:text-main-maroon data-[state=open]:text-secondary-peach">
            SALE
          </NavigationMenuTrigger>
        </div>
        <NavigationMenuContent className="data-[motion=from-start]:animate-slide-in-from-left data-[motion=from-end]:animate-slide-in-from-right data-[motion=to-start]:animate-slide-out-to-left data-[motion=to-end]:animate-slide-out-to-right">
          <div className="w-screen h-[400px] bg-secondary-peach flex items-center justify-center border border-main-maroon rounded-lg">
            <div className="text-main-maroon">Loading...</div>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <div onClick={(e) => handleNavigation('/shop?onSale=true', e)} className="inline-flex cursor-pointer">
        <NavigationMenuTrigger className="data-[state=open]:bg-main-maroon bg-transparent border border-transparent hover:border-main-maroon hover:text-main-maroon data-[state=open]:text-secondary-peach">
          SALE
        </NavigationMenuTrigger>
      </div>
      <NavigationMenuContent className="data-[motion=from-start]:animate-slide-in-from-left data-[motion=from-end]:animate-slide-in-from-right data-[motion=to-start]:animate-slide-out-to-left data-[motion=to-end]:animate-slide-out-to-right">
        <div className="w-screen h-[400px] bg-secondary-peach p-6 border border-main-maroon rounded-lg">
          <div className="container mx-auto grid grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-base font-medium text-main-maroon">Sale Categories</h3>
              <ul className="space-y-2 pr-4">
                {categories.map((category) => (
                  <li key={category.name} className="group">
                    <a
                      href={category.href}
                      onClick={(e) => handleNavigation(category.href, e)}
                      onMouseEnter={() => handleCategoryChange(category)}
                      className={`block p-2 rounded-md transition-colors border text-main-maroon ${
                        activeCategory?.name === category.name 
                          ? 'border-main-maroon' 
                          : 'border-transparent hover:border-main-maroon'
                      }`}
                    >
                      <div className="text-sm font-medium">{category.name}</div>
                      <p className="text-sm opacity-80">{category.description}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2">
              <div 
                className={`grid grid-cols-3 gap-4 transition-opacity duration-300 ease-in-out ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {activeCategory?.featured.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group relative"
                  >
                    <div className="aspect-square relative rounded-lg overflow-hidden border border-transparent hover:border-main-maroon transition-colors">
                      <div className="absolute top-2 right-2 bg-main-maroon text-secondary-peach px-2 py-0.5 text-xs font-medium rounded-md z-10">
                        {item.type === 'clearance' ? `${item.name.split(' - ')[1]}` : `${item.name.split(' - ')[1]}`}
                      </div>
                      <Image
                        src={item.imageSrc}
                        alt={item.name}
                        className="object-cover"
                        fill
                      />
                    </div>
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-main-maroon mb-1 tracking-wide">
                        {item.name.split(' - ')[0]}
                      </h4>
                      <div 
                        className="text-xs text-main-maroon/80 line-clamp-2 leading-snug"
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
