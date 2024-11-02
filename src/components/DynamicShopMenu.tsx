"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";

const categories = [
  {
    name: "Matcha",
    description: "Explore our matcha collection",
    href: "/shop?category=matcha",
    subcategories: {
      title: "Matcha Brands",
      items: [
        {
          name: "Ippodo",
          description: "Premium Japanese matcha",
          href: "/shop?category=matcha&subcategory=Ippodo",
        },
        {
          name: "Marukyu Koyamaen",
          description: "Traditional craftsmanship",
          href: "/shop?category=matcha&subcategory=Marukyu%20Koyamaen",
        },
        {
          name: "Hibiki-an",
          description: "Organic selections",
          href: "/shop?category=matcha&subcategory=Hibiki-an",
        },
      ],
    },
    featured: [
      {
        name: "Ceremonial Grade Matcha",
        description: "Premium grade for traditional preparation",
        imageSrc: "/placeholder.jpg",
        href: "/shop?category=matcha&subcategory=Ceremonial",
      },
      {
        name: "Starter Kit",
        description: "Everything you need to begin",
        imageSrc: "/placeholder.jpg",
        href: "/shop?category=matcha&subcategory=Starter%20Kit",
      },
    ],
  },
  {
    name: "Glasses",
    description: "Premium glassware selection",
    href: "/shop?category=glasses",
    subcategories: {
      title: "Glass Types",
      items: [
        {
          name: "Wine Glasses",
          description: "Red & white wine glasses",
          href: "/shop?category=glasses&subcategory=Wine%20Glasses",
        },
        {
          name: "Cocktail Glasses",
          description: "Martini, coupe & more",
          href: "/shop?category=glasses&subcategory=Cocktail%20Glasses",
        },
        {
          name: "Everyday Glasses",
          description: "Water & all-purpose",
          href: "/shop?category=glasses&subcategory=Everyday%20Glasses",
        },
      ],
    },
    featured: [
      {
        name: "Crystal Wine Set",
        description: "Elegant crystal wine glasses",
        imageSrc: "/placeholder.jpg",
        href: "/shop?category=glasses&subcategory=Crystal%20Wine%20Set",
      },
      {
        name: "Cocktail Collection",
        description: "Complete cocktail glass set",
        imageSrc: "/placeholder.jpg",
        href: "/shop?category=glasses&subcategory=Cocktail%20Collection",
      },
    ],
  },
  {
    name: "Accessories",
    description: "Complete your collection",
    href: "/shop?category=accessories",
    subcategories: {
      title: "Accessory Types",
      items: [
        {
          name: "Coasters",
          description: "Protect your surfaces",
          href: "/shop?category=accessories&subcategory=Coasters",
        },
        {
          name: "Stirrers",
          description: "Mix in style",
          href: "/shop?category=accessories&subcategory=Stirrers",
        },
        {
          name: "Care Products",
          description: "Maintain your items",
          href: "/shop?category=accessories&subcategory=Care%20Products",
        },
      ],
    },
    featured: [
      {
        name: "Marble Coaster Set",
        description: "Luxury marble coasters",
        imageSrc: "/placeholder.jpg",
        href: "/shop?category=accessories&subcategory=Marble%20Coaster%20Set",
      },
      {
        name: "Gold Stirrer Set",
        description: "Premium cocktail stirrers",
        imageSrc: "/placeholder.jpg",
        href: "/shop?category=accessories&subcategory=Gold%20Stirrer%20Set",
      },
    ],
  },
] as const;

export function ShopAllMenu() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="data-[state=open]:bg-main-maroon bg-transparent hover:bg-main-maroon hover:text-secondary-peach data-[state=open]:text-secondary-peach">
        SHOP ALL
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid w-screen grid-cols-4 p-6 bg-secondary-peach">
          {/* Main Categories */}
          <div className="col-span-1 border-r border-main-maroon">
            <ul className="space-y-2 pr-4">
              {categories.map((category) => (
                <li 
                  key={category.name}
                  className="group"
                  onMouseEnter={() => setActiveCategory(category as typeof categories[0])}
                >
                  <Link
                    href={category.href}
                    className={`block p-3 rounded-md transition-colors hover:bg-main-maroon hover:text-secondary-peach ${
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

          {/* Subcategories */}
          <div className="col-span-1 px-6 border-r border-main-maroon">
            <h3 className="text-lg font-semibold mb-4 text-main-maroon">
              {activeCategory.subcategories.title}
            </h3>
            <ul className="space-y-2">
              {activeCategory.subcategories.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="block p-2 rounded-md text-main-maroon hover:bg-main-maroon hover:text-secondary-peach transition-colors"
                  >
                    <div className="text-sm font-medium">{item.name}</div>
                    <p className="text-sm opacity-80">{item.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Products */}
          <div className="col-span-2 pl-6">
            <h3 className="text-lg font-semibold mb-4 text-main-maroon">
              Featured {activeCategory.name}
            </h3>
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
                      className="object-cover transition-transform group-hover:scale-105 bg-main-maroon"
                      fill
                    />
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-main-maroon">{item.name}</h4>
                    <p className="text-sm text-main-maroon">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}