"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaShoppingCart, FaChevronDown } from "react-icons/fa";
import LogoDark from "/public/adastudioslogo-maroon.svg";
import { useCart } from './CartProvider';
import { useCurrency } from './CurrencyProvider';
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
import shopify from '../lib/shopify';

export default function Navbar(): JSX.Element {
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [saleProducts, setSaleProducts] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, openCart } = useCart();
  const { selectedCurrency, setSelectedCurrency, currencies } = useCurrency();
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

  const getDiscountPercentage = (product: any): number => {
    const variant = product.variants.edges[0]?.node;
    if (!variant?.compareAtPriceV2 || !variant.priceV2) return 0;
    
    const compareAtPrice = parseFloat(variant.compareAtPriceV2.amount);
    const price = parseFloat(variant.priceV2.amount);
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  };

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const products = await shopify.getProducts();
        const onSaleProducts = products
          .filter(product => {
            const variant = product.variants.edges[0]?.node;
            return variant?.compareAtPriceV2 && 
              parseFloat(variant.compareAtPriceV2.amount) > parseFloat(variant.priceV2.amount);
          })
          .sort((a, b) => getDiscountPercentage(b) - getDiscountPercentage(a));
        setSaleProducts(onSaleProducts.slice(0, 2));
      } catch (error) {
        console.error('Error fetching sale products:', error);
      }
    };

    fetchSaleProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 border-b ${
      isScrolled || isMobileMenuOpen
        ? "bg-secondary-peach border-main-maroon" 
        : "bg-transparent border-transparent"
    }`}>
      <div className="mx-auto">
        <div className="relative flex items-center justify-between h-[70px]">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-4 hover:bg-main-maroon/10 transition-colors relative w-[44px] h-[44px] flex flex-col items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className={`
              w-6 h-0.5 bg-main-maroon absolute transition-all duration-300 ease-in-out
              ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-2'}
            `}></div>
            <div className={`
              w-6 h-0.5 bg-main-maroon absolute transition-all duration-300 ease-in-out
              ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}
            `}></div>
            <div className={`
              w-6 h-0.5 bg-main-maroon absolute transition-all duration-300 ease-in-out
              ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-2'}
            `}></div>
          </button>
          {/* Left side - Navigation Menu (Desktop) */}
          <nav className="hidden md:flex flex-1">
            <NavigationMenu>
              <NavigationMenuList className="text-main-maroon">
                <ShopAllMenu />

                <NavigationMenuItem>
                  <div onClick={(e) => handleNavigation('/shop?onSale=true', e)} className="inline-flex cursor-pointer">
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
                  </div>
                  <NavigationMenuContent>
                    <div className="w-screen bg-secondary-peach p-6 border border-main-maroon rounded-lg">
                      <div className="container mx-auto grid grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-main-maroon">Sale Categories</h3>
                          <ul className="space-y-2 pr-4">
                            <li className="group">
                              <a
                                href="/shop?onSale=true&tag=clearance"
                                onClick={(e) => handleNavigation('/shop?onSale=true&tag=clearance', e)}
                                className="block p-2 rounded-md transition-colors hover:bg-main-maroon hover:text-secondary-peach text-main-maroon"
                              >
                                <div className="text-sm font-medium">Clearance</div>
                                <p className="text-sm opacity-80">Up to 70% off</p>
                              </a>
                            </li>
                            <li className="group">
                              <a
                                href="/shop?stockFilter=low"
                                onClick={(e) => handleNavigation('/shop?stockFilter=low', e)}
                                className="block p-2 rounded-md transition-colors hover:bg-main-maroon hover:text-secondary-peach text-main-maroon"
                              >
                                <div className="text-sm font-medium">Last Chance</div>
                                <p className="text-sm opacity-80">Limited availability</p>
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="col-span-2">
                          <h3 className="text-lg font-semibold text-main-maroon mb-4">Featured Sale Items</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {saleProducts.map((product) => (
                              <Link
                                key={product.id}
                                href={`/product/${product.handle}`}
                                className="group relative"
                              >
                                <div className="aspect-square relative rounded-lg overflow-hidden">
                                  <Image
                                    src={product.images.edges[0]?.node.originalSrc || '/placeholder.jpg'}
                                    alt={product.title}
                                    className="object-cover transition-transform group-hover:scale-105"
                                    fill
                                  />
                                  <div className="absolute top-2 right-2 bg-main-maroon text-secondary-peach px-3 py-1 rounded-full">
                                    <p className="text-sm font-bold">-{getDiscountPercentage(product)}%</p>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <h4 className="text-base font-bold text-main-maroon mb-2 tracking-wide">
                                    {product.title}
                                  </h4>
                                  <p className="text-sm text-main-maroon/80 line-clamp-2 leading-relaxed">
                                    Limited time offer
                                  </p>
                                </div>
                              </Link>
                            ))}
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
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <Link href="/" className="relative block">
              <Image
                src={LogoDark}
                alt="Ada Studios Logo"
                width={80}
                height={80}
                className="w-20 h-20 md:w-[90px] md:h-[90px] object-contain"
                priority
              />
            </Link>
          </div>

          {/* Right side - Currency and Cart */}
          <div className="w-8 md:w-auto flex justify-end items-center space-x-3 md:space-x-6 md:mr-10">
            <DropdownMenu onOpenChange={setIsCurrencyOpen}>
              <DropdownMenuTrigger className={`
                flex items-center gap-2 
                hover:text-main-maroon/80 
                outline-none
                ${isScrolled ? 'text-main-maroon' : 'text-main-maroon'}
              `}>
                <span className="text-sm font-medium">{selectedCurrency.code}</span>
                <FaChevronDown className={`transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-[200px] bg-secondary-peach border border-main-maroon rounded-lg"
                align="end"
                alignOffset={-5}
              >
                {currencies.map((currency) => (
                  <DropdownMenuItem
                    key={currency.code}
                    onClick={() => setSelectedCurrency(currency)}
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
            
            <button 
              onClick={openCart} 
              className="relative p-2 hover:bg-main-maroon/10 rounded-lg transition-colors"
              aria-label="Shopping cart"
            >
              <FaShoppingCart className={`
                cursor-pointer text-xl md:text-lg
                ${isScrolled ? 'text-main-maroon' : 'text-main-maroon'}
              `} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-main-maroon text-secondary-peach rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`
          md:hidden 
          fixed 
          inset-0 
          top-[70px] 
          bg-secondary-peach 
          transform 
          transition-transform 
          duration-300 
          ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full overflow-y-auto">
            <div className="px-6 py-6 space-y-6">
              <nav className="space-y-6">
                <Link
                  href="/shop"
                  className="flex items-center justify-between text-main-maroon font-medium py-3 px-4 rounded-lg hover:bg-main-maroon/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  SHOP ALL
                </Link>

                <div className="space-y-3 border-t border-main-maroon/20 pt-6">
                  <h3 className="text-sm font-semibold text-main-maroon px-4">Shop Categories</h3>
                  <Link
                    href="/shop?category=Matcha"
                    className="flex items-center text-main-maroon py-3 px-4 rounded-lg hover:bg-main-maroon/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div>
                      <div className="font-medium">Matcha</div>
                      <p className="text-sm text-main-maroon/70">Explore our matcha collection</p>
                    </div>
                  </Link>
                  <Link
                    href="/shop?category=Glasses"
                    className="flex items-center text-main-maroon py-3 px-4 rounded-lg hover:bg-main-maroon/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div>
                      <div className="font-medium">Glasses</div>
                      <p className="text-sm text-main-maroon/70">Explore our glasses collection</p>
                    </div>
                  </Link>
                  <Link
                    href="/shop?category=Accessories"
                    className="flex items-center text-main-maroon py-3 px-4 rounded-lg hover:bg-main-maroon/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div>
                      <div className="font-medium">Accessories</div>
                      <p className="text-sm text-main-maroon/70">Explore our accessories collection</p>
                    </div>
                  </Link>
                </div>
                <Link
                  href="/shop?onSale=true"
                  className="flex items-center justify-between text-main-maroon font-medium py-3 px-4 rounded-lg hover:bg-main-maroon/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  SALE
                </Link>
                
                <div className="space-y-3 border-t border-main-maroon/20 pt-6">
                  <h3 className="text-sm font-semibold text-main-maroon px-4">Sale Categories</h3>
                  <Link
                    href="/shop?onSale=true&tag=clearance"
                    className="flex items-center text-main-maroon py-3 px-4 rounded-lg hover:bg-main-maroon/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div>
                      <div className="font-medium">Clearance</div>
                      <p className="text-sm text-main-maroon/70">Up to 70% off</p>
                    </div>
                  </Link>
                  <Link
                    href="/shop?stockFilter=low"
                    className="flex items-center text-main-maroon py-3 px-4 rounded-lg hover:bg-main-maroon/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div>
                      <div className="font-medium">Last Chance</div>
                      <p className="text-sm text-main-maroon/70">Limited availability</p>
                    </div>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
