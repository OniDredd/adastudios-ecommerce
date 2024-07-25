"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { FaUser, FaShoppingCart } from "react-icons/fa";
import LogoLight from "/public/adastudioslogo-creme.svg";
import LogoDark from "/public/adastudioslogo-green.svg";
import { useCart } from './CartProvider';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (isHomePage) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [isHomePage]);

  const navbarStyle = isHomePage && !isScrolled
    ? "bg-transparent text-main-creme py-7 border-b-[1px] border-main-creme"
    : "bg-main-creme text-secondary-green py-3 border-b-[1px] border-secondary-green";

  return (
    <header
      className={`fixed w-full z-10 transition-all duration-300 ease-in-out ${navbarStyle}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/">
          <Image
            src={isHomePage && !isScrolled ? LogoLight : LogoDark}
            alt="Ada Studios Logo"
            width={150}
            height={150}
            />
          </Link>
          <nav>
            <ul className="flex flex-row justify-between space-x-6">
              <li>
                <Link
                  href="/shopall"
                  className="hover:text-secondary-brown duration-200"
                >
                  SHOP
                </Link>
              </li>
              <li>
                <Link
                  href="/sale"
                  className="hover:text-secondary-brown duration-200"
                >
                  SALE
                </Link>
              </li>
              <li>
                <Link
                  href="/accessories"
                  className="hover:text-secondary-brown duration-200"
                >
                  ACCESSORIES
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <span>NZD</span>
            <FaUser className="cursor-pointer" />
            <FaShoppingCart className="cursor-pointer" onClick={openCart} />
          </div>
        </div>
      </div>
    </header>
  );
}