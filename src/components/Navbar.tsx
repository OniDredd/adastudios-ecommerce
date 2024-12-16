"use client";

import { useState, useEffect } from "react";
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
      isScrolled 
        ? "bg-secondary-peach border-main-maroon" 
        : "bg-transparent border-transparent"
    }`}>
      <div className="mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Navigation Menu */}
          <nav className="flex-1">
            <NavigationMenu>
              <NavigationMenuList className="text-main-maroon">
                <ShopAllMenu />

                <NavigationMenuItem>
                  <Link
                    href="/shop?onSale=true"
                    onClick={(e) => handleNavigation('/shop?onSale=true', e)}
                    className="inline-flex"
                  >
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
                  </Link>
                  <NavigationMenuContent>
                    <div className="w-screen bg-secondary-peach p-6 border border-main-maroon rounded-lg">
                      <div className="container mx-auto grid grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-main-maroon">Sale Categories</h3>
                          <ul className="space-y-2">
                            <li>
                              <Link
                                href="/shop?onSale=true&tag=clearance"
                                onClick={(e) => handleNavigation('/shop?onSale=true&tag=clearance', e)}
                                className="block p-2 rounded-md text-main-maroon hover:bg-main-maroon hover:text-secondary-peach transition-colors"
                              >
                                <div className="text-sm font-medium">Clearance</div>
                                <p className="text-sm opacity-80">Up to 70% off</p>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/shop?stockFilter=low"
                                onClick={(e) => handleNavigation('/shop?stockFilter=low', e)}
                                className="block p-2 rounded-md text-main-maroon hover:bg-main-maroon hover:text-secondary-peach transition-colors"
                              >
                                <div className="text-sm font-medium">Last Chance</div>
                                <p className="text-sm opacity-80">Limited availability</p>
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div className="col-span-2">
                          <div className="grid grid-cols-2 gap-4">
                            {saleProducts.map((product, index) => (
                              <Link
                                key={product.id}
                                href={`/product/${product.handle}`}
                                className="group"
                              >
                                <div className="aspect-square relative rounded-lg overflow-hidden">
                                  <Image
                                    src={product.images.edges[0]?.node.originalSrc || '/placeholder.jpg'}
                                    alt={product.title}
                                    className="object-cover"
                                    fill
                                  />
                                  <div className="absolute top-2 right-2 bg-main-maroon text-secondary-peach px-3 py-1 rounded-full">
                                    <p className="text-sm font-bold">-{getDiscountPercentage(product)}%</p>
                                  </div>
                                </div>
                                <h4 className="text-base font-bold text-main-maroon mb-2 tracking-wide mt-3">
                                  {product.title}
                                </h4>
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
