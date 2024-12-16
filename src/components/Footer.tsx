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
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-16">
          {/* Logo and About Column */}
          <div className="md:col-span-2">
            <Image 
              src="/adastudioslogo-peach.svg" 
              alt="Ada Studios Logo" 
              width={180} 
              height={180} 
              className="mb-6"
            />
            <p className="text-secondary-peach/80 mb-6 max-w-sm">
              Elevating your lifestyle with luxury glassware designed for the modern woman who knows what she wants.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="opacity-100 hover:opacity-60 transition-opacity duration-200"
              >
                <FaInstagram className="w-5 h-5" />
              </Link>
              <Link 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="opacity-100 hover:opacity-60 transition-opacity duration-200"
              >
                <FaFacebookF className="w-5 h-5" />
              </Link>
              <Link 
                href="https://tiktok.com" 
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
            <h3 className="font-bold text-lg mb-4">SHOP</h3>
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
            <h3 className="font-bold text-lg mb-4">CUSTOMER CARE</h3>
            <ul className="space-y-3">
              <li><Link href="/shipping-returns" className="opacity-100 hover:opacity-60 transition-opacity duration-200">Shipping & Returns</Link></li>
              <li><Link href="/care-instructions" className="opacity-100 hover:opacity-60 transition-opacity duration-200">Care Instructions</Link></li>
              <li><Link href="/faq" className="opacity-100 hover:opacity-60 transition-opacity duration-200">FAQ</Link></li>
              <li><Link href="/contact" className="opacity-100 hover:opacity-60 transition-opacity duration-200">Contact Us</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">COMPANY</h3>
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
        <div className="border-t border-secondary-peach/20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-secondary-peach/80 order-2 md:order-1">
              © {new Date().getFullYear()} Ada Studios. All rights reserved.
            </div>
            <div className="flex items-center gap-6 order-1 md:order-2">
              <div className="flex items-center gap-3">
                <FaCcVisa className="w-8 h-8 opacity-80" />
                <FaCcMastercard className="w-8 h-8 opacity-80" />
                <FaCcApplePay className="w-8 h-8 opacity-80" />
                <SiAfterpay className="w-12 h-8 opacity-80" />
              </div>
              <span className="text-sm text-secondary-peach/60">
                Site by <a href="https://nanogram.io" target="_blank" rel="noopener noreferrer" className="opacity-100 hover:opacity-60 transition-opacity duration-200">Nanogram</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
