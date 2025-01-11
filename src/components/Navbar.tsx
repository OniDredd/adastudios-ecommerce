"use client";

import { useState, useEffect, useCallback, type JSX } from "react";
import { MotionFade } from "./ui/motion-fade";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import LogoDark from "../../public/adastudioslogo-maroon.svg";
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
import { ShopAllMenu, SaleMenu } from './DynamicShopMenu';
import shopify from '../lib/shopify';

export default function Navbar(): JSX.Element {
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [saleProducts, setSaleProducts] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, openCart, isInitialized } = useCart();
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
      
      // Update announcement bar visibility
      const announcementBar = document.querySelector('[data-announcement-bar]');
      if (announcementBar) {
        announcementBar.setAttribute('data-scrolled', (scrollPosition > 0).toString());
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update announcement bar visibility when mobile menu changes
  useEffect(() => {
    const announcementBar = document.querySelector('[data-announcement-bar]');
    if (announcementBar) {
      announcementBar.setAttribute('data-menu-open', isMobileMenuOpen.toString());
    }
  }, [isMobileMenuOpen]);

  // Only calculate cart count after initialization to prevent hydration mismatch
  const cartItemCount = isInitialized ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <header className={`fixed w-full z-[90] transition-all duration-300 border-b ${
      isScrolled || isMobileMenuOpen || pathname !== '/'
        ? "bg-secondary-peach border-main-maroon top-0" 
        : "bg-transparent border-transparent top-[32px]"
    }`}>
      <div className="mx-auto">
        <div className="relative flex items-center justify-between h-[70px]">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-4 border border-transparent hover:border-main-maroon hover:rounded-lg transition-colors relative w-[44px] h-[44px] flex flex-col items-center justify-center"
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
          <nav className="hidden md:flex flex-1 relative z-[80]">
            <NavigationMenu>
              <NavigationMenuList className="text-main-maroon">
                <ShopAllMenu />

                <SaleMenu />
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Center - Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-[80]">
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
          <div className="w-8 md:w-auto flex justify-end items-center gap-1 md:gap-2 md:mr-10 relative z-[999]">
            <DropdownMenu onOpenChange={setIsCurrencyOpen}>
              <div className="inline-flex cursor-pointer group">
                <DropdownMenuTrigger className="data-[state=open]:bg-transparent bg-transparent border border-transparent hover:border-main-maroon rounded-lg transition-all duration-300">
                  <div className="flex items-center gap-1 px-2 md:px-3 py-2">
                    <span className="text-sm font-medium text-main-maroon">{selectedCurrency.code}</span>
                    <ChevronDownIcon className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 text-main-maroon group-data-[state=open]:rotate-180" aria-hidden="true" />
                  </div>
                </DropdownMenuTrigger>
              </div>
              <MotionFade>
                <DropdownMenuContent 
                  className="w-[200px] bg-secondary-peach border border-main-maroon rounded-lg shadow-lg z-[999]"
                  align="end"
                  sideOffset={8}
                >
                {currencies.map((currency) => (
                  <DropdownMenuItem
                    key={currency.code}
                    onClick={() => setSelectedCurrency(currency)}
                    className="flex flex-col items-start px-3 py-2 text-main-maroon border border-transparent hover:border-secondary-peach cursor-pointer"
                  >
                    <div className="font-medium">{currency.code}</div>
                    <p className="text-sm opacity-80">
                      {currency.name} ({currency.symbol})
                    </p>
                  </DropdownMenuItem>
                ))}
                </DropdownMenuContent>
              </MotionFade>
            </DropdownMenu>
            
            <button 
              onClick={openCart} 
              className="relative p-2 border border-transparent hover:border-main-maroon rounded-lg transition-colors"
              aria-label="Shopping cart"
            >
              <FaShoppingCart className={`
                cursor-pointer text-xl md:text-lg
                ${isScrolled ? 'text-main-maroon' : 'text-main-maroon'}
              `} />
              <span 
                className={`absolute -top-1 -right-1 bg-main-maroon text-secondary-peach rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium transition-opacity duration-200 ${
                  isInitialized && cartItemCount > 0 ? 'opacity-100' : 'opacity-0'
                }`}
                aria-hidden={!isInitialized || cartItemCount === 0}
              >
                {cartItemCount}
              </span>
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
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-main-maroon font-medium py-3 px-4 rounded-lg border border-transparent hover:border-main-maroon transition-colors w-full"
                >
                  SHOP ALL
                </Link>

                <div className="space-y-3 border-t border-main-maroon/20 pt-6">
                  <h3 className="text-sm font-medium text-main-maroon px-4">Shop Categories</h3>
                  <Link
                    href="/shop?category=matcha"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center text-main-maroon py-3 px-4 rounded-lg border border-transparent hover:border-main-maroon transition-colors w-full"
                  >
                    <div>
                      <div className="font-medium">Matcha</div>
                      <p className="text-sm text-main-maroon/70">Explore our matcha collection</p>
                    </div>
                  </Link>
                  <Link
                    href="/shop?category=glasses"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center text-main-maroon py-3 px-4 rounded-lg border border-transparent hover:border-main-maroon transition-colors w-full"
                  >
                    <div>
                      <div className="font-medium">Glasses</div>
                      <p className="text-sm text-main-maroon/70">Explore our glasses collection</p>
                    </div>
                  </Link>
                  <Link
                    href="/shop?category=accessories"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center text-main-maroon py-3 px-4 rounded-lg border border-transparent hover:border-main-maroon transition-colors w-full"
                  >
                    <div>
                      <div className="font-medium">Accessories</div>
                      <p className="text-sm text-main-maroon/70">Explore our accessories collection</p>
                    </div>
                  </Link>
                </div>
                <Link
                  href="/shop?onSale=true"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-main-maroon font-medium py-3 px-4 rounded-lg border border-transparent hover:border-main-maroon transition-colors w-full"
                >
                  SALE
                </Link>
                
                <div className="space-y-3 border-t border-main-maroon/20 pt-6">
                  <h3 className="text-sm font-medium text-main-maroon px-4">Sale Categories</h3>
                  <Link
                    href="/shop?onSale=true"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center text-main-maroon py-3 px-4 rounded-lg border border-transparent hover:border-main-maroon transition-colors w-full"
                  >
                    <div>
                      <div className="font-medium">Clearance</div>
                      <p className="text-sm text-main-maroon/70">Up to 70% off</p>
                    </div>
                  </Link>
                  <Link
                    href="/shop?stockFilter=low"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center text-main-maroon py-3 px-4 rounded-lg border border-transparent hover:border-main-maroon transition-colors w-full"
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
