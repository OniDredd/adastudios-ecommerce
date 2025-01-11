'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from "next/navigation";
import { FaInstagram, FaFacebookF, FaTiktok, FaPinterestP, FaCcVisa, FaCcMastercard, FaCcApplePay } from 'react-icons/fa';
import { SiAfterpay } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';

export default function Footer() {
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

  return (
    <footer className="bg-main-maroon text-secondary-peach">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 py-12 md:py-16">
          {/* Logo and About Column */}
          <div className="flex flex-col items-start">
            <Image 
              src="/adastudioslogo-peach.svg" 
              alt="Ada Studios Logo" 
              width={225} 
              height={225} 
              className="mb-10"
            />
            <div className="flex space-x-6">
              <Link 
                href="https://www.instagram.com/adastudionz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="opacity-100 hover:opacity-60 transition-opacity duration-200"
              >
                <FaInstagram className="w-6 h-6" />
              </Link>
              <Link 
                href="https://www.facebook.com/adastudionz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="opacity-100 hover:opacity-60 transition-opacity duration-200"
              >
                <FaFacebookF className="w-5 h-5" />
              </Link>
              <Link 
                href="https://www.tiktok.com/@adastudionz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="opacity-100 hover:opacity-60 transition-opacity duration-200"
              >
                <FaTiktok className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">SHOP</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/shop" 
                  onClick={(e) => handleNavigation('/shop', e)}
                  className="opacity-100 hover:opacity-60 transition-opacity duration-200"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link 
                  href="/shop?category=matcha" 
                  onClick={(e) => handleNavigation('/shop?category=Matcha', e)}
                  className="opacity-100 hover:opacity-60 transition-opacity duration-200"
                >
                  Matcha
                </Link>
              </li>
              <li>
                <Link 
                  href="/shop?category=glasses" 
                  onClick={(e) => handleNavigation('/shop?category=Glasses', e)}
                  className="opacity-100 hover:opacity-60 transition-opacity duration-200"
                >
                  Glasses
                </Link>
              </li>
              <li>
                <Link 
                  href="/shop?category=accessories" 
                  onClick={(e) => handleNavigation('/shop?category=Accessories', e)}
                  className="opacity-100 hover:opacity-60 transition-opacity duration-200"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">CUSTOMER CARE</h3>
            <ul className="space-y-3">
              <li><Link href="/shipping-returns" className="opacity-100 hover:opacity-60 transition-opacity duration-200">Shipping & Returns</Link></li>
              <li><Link href="/care-instructions" className="opacity-100 hover:opacity-60 transition-opacity duration-200">Care Instructions</Link></li>
              <li><Link href="/faq" className="opacity-100 hover:opacity-60 transition-opacity duration-200">FAQ</Link></li>
              <li><Link href="/contact" className="opacity-100 hover:opacity-60 transition-opacity duration-200">Contact Us</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">COMPANY</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="opacity-100 hover:opacity-60 transition-opacity duration-200">About Us</Link></li>
              <li><Link href="/sustainability" className="opacity-100 hover:opacity-60 transition-opacity duration-200">Sustainability</Link></li>
              <li><Link href="/wholesale" className="opacity-100 hover:opacity-60 transition-opacity duration-200">Wholesale</Link></li>
              <li><Link href="/terms-conditions" className="opacity-100 hover:opacity-60 transition-opacity duration-200">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="opacity-100 hover:opacity-60 transition-opacity duration-200">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-peach/20 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-xs sm:text-sm text-secondary-peach/80 order-2 sm:order-1 text-center sm:text-left">
              © {new Date().getFullYear()} Ada Studios. All rights reserved.
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 order-1 sm:order-2">
              <div className="flex flex-wrap justify-center items-center gap-4">
                <FaCcVisa className="w-7 h-7 sm:w-8 sm:h-8 opacity-80" />
                <FaCcMastercard className="w-7 h-7 sm:w-8 sm:h-8 opacity-80" />
                <FaCcApplePay className="w-7 h-7 sm:w-8 sm:h-8 opacity-80" />
                <SiAfterpay className="w-10 h-7 sm:w-12 sm:h-8 opacity-80" />
              </div>
              <span className="text-xs sm:text-sm text-secondary-peach/60">
                Site by <a href="https://nonogram.io" target="_blank" rel="noopener noreferrer" className="opacity-100 hover:opacity-60 transition-opacity duration-200">Nonogram</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
