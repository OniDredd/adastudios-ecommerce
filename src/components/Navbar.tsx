"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingCart, FaChevronDown } from "react-icons/fa";
import LogoDark from "/public/adastudioslogo-maroon.svg";
import { useCart } from './CartProvider';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShopAllMenu } from './DynamicShopMenu';

export default function Navbar() {
  const [selectedCurrency, setSelectedCurrency] = useState('NZD');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currencies = [
    { code: 'NZD', name: 'New Zealand Dollar', symbol: '$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
  ];

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className={`fixed w-full z-10 transition-all duration-300 border-b ${
      isScrolled 
        ? "bg-secondary-peach border-main-maroon" 
        : "bg-transparent border-transparent"
    }`}>
      <div className="mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Navigation Menu */}
          <nav className="flex-1">
            <NavigationMenu className="border-main-maroon">
              <NavigationMenuList className="text-main-maroon border-main-maroon">
                <ShopAllMenu />

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`
                    data-[state=open]:bg-main-maroon 
                    bg-transparent 
                    border-main-maroon
                    hover:bg-main-maroon 
                    hover:text-secondary-peach 
                    data-[state=open]:text-secondary-peach
                    ${!isScrolled && 'text-main-maroon'}
                  `}>
                    NEW
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="border-main-maroon">
                    <div className="w-screen bg-secondary-peach p-6">
                      <div className="container mx-auto grid grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-main-maroon">New Arrivals</h3>
                          <ul className="space-y-2">
                            <li>
                              <Link
                                href="/new/this-week"
                                className="block p-2 rounded-md text-main-maroon hover:bg-main-maroon hover:text-secondary-peach transition-colors"
                              >
                                <div className="text-sm font-medium">This Week</div>
                                <p className="text-sm opacity-80">See what&apos;s new</p>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/new/coming-soon"
                                className="block p-2 rounded-md text-main-maroon hover:bg-main-maroon hover:text-secondary-peach transition-colors"
                              >
                                <div className="text-sm font-medium">Coming Soon</div>
                                <p className="text-sm opacity-80">Preview upcoming items</p>
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div className="col-span-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-square relative rounded-lg overflow-hidden">
                              <Image
                                src="/placeholder.jpg"
                                alt="New Arrival 1"
                                className="object-cover"
                                fill
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-main-maroon/50 text-secondary-peach p-2">
                                <p className="text-sm font-medium">Latest Collection</p>
                              </div>
                            </div>
                            <div className="aspect-square relative rounded-lg overflow-hidden">
                              <Image
                                src="/placeholder.jpg"
                                alt="New Arrival 2"
                                className="object-cover bg-main-maroon"
                                fill
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-main-maroon/50 text-secondary-peach p-2">
                                <p className="text-sm font-medium">Coming Soon</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`
                    data-[state=open]:bg-main-maroon 
                    bg-transparent 
                    hover:bg-main-maroon 
                    hover:text-secondary-peach 
                    data-[state=open]:text-secondary-peach
                    ${!isScrolled && 'text-main-maroon'}
                  `}>
                    SALE
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="border-main-maroon">
                    <div className="w-screen bg-secondary-peach p-6">
                      <div className="container mx-auto grid grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-main-maroon">Sale Categories</h3>
                          <ul className="space-y-2">
                            <li>
                              <Link
                                href="/sale/clearance"
                                className="block p-2 rounded-md text-main-maroon hover:bg-main-maroon hover:text-secondary-peach transition-colors"
                              >
                                <div className="text-sm font-medium">Clearance</div>
                                <p className="text-sm opacity-80">Up to 70% off</p>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/sale/last-chance"
                                className="block p-2 rounded-md text-main-maroon hover:bg-main-maroon hover:text-secondary-peach transition-colors"
                              >
                                <div className="text-sm font-medium">Last Chance</div>
                                <p className="text-sm opacity-80">Final items</p>
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div className="col-span-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-square relative rounded-lg overflow-hidden">
                              <Image
                                src="/placeholder.jpg"
                                alt="Sale Item 1"
                                className="object-cover bg-main-maroon"
                                fill
                              />
                              <div className="absolute top-2 right-2 bg-main-maroon text-secondary-peach px-3 py-1 rounded-full">
                                <p className="text-sm font-bold">-40%</p>
                              </div>
                            </div>
                            <div className="aspect-square relative rounded-lg overflow-hidden">
                              <Image
                                src="/placeholder.jpg"
                                alt="Sale Item 2"
                                className="object-cover"
                                fill
                              />
                              <div className="absolute top-2 right-2 bg-main-maroon text-secondary-peach px-3 py-1 rounded-full">
                                <p className="text-sm font-bold">-30%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Center - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/">
              <Image
                src={LogoDark}
                alt="Ada Studios Logo"
                width={80}
                height={80}
                priority
              />
            </Link>
          </div>

          {/* Right side - Currency and Cart */}
          <div className="flex-1 flex justify-end items-center space-x-6 mr-10">
            <DropdownMenu onOpenChange={setIsCurrencyOpen}>
              <DropdownMenuTrigger className={`
                flex items-center gap-2 
                hover:text-main-maroon/80 
                outline-none
                ${isScrolled ? 'text-main-maroon' : 'text-main-maroon'}
              `}>
                <span className="text-sm font-medium">{selectedCurrency}</span>
                <FaChevronDown className={`transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-[200px] bg-secondary-peach border border-main-maroon"
                align="end"
                alignOffset={-5}
              >
                {currencies.map((currency) => (
                  <DropdownMenuItem
                    key={currency.code}
                    onClick={() => setSelectedCurrency(currency.code)}
                    className="flex flex-col items-start px-3 py-2 text-main-maroon hover:bg-main-maroon hover:text-secondary-peach cursor-pointer"
                  >
                    <div className="font-medium">{currency.code}</div>
                    <p className="text-sm opacity-80">
                      {currency.name} ({currency.symbol})
                    </p>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <button onClick={openCart} className="relative">
              <FaShoppingCart className={`
                cursor-pointer text-lg
                ${isScrolled ? 'text-main-maroon' : 'text-main-maroon'}
              `} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-main-maroon text-secondary-peach rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}