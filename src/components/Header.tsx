'use client'

// components/Navbar.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaUser, FaShoppingCart } from 'react-icons/fa';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ease-in-out
      ${isScrolled
        ? 'bg-white text-black py-3'
        : 'bg-transparent text-white py-7 border-b-[1px] border-white'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">LOGO</div>
          <nav>
            <ul className="flex flex-row justify-between space-x-6">
              <li><Link href="/shop">SHOP</Link></li>
              <li><Link href="/sale">SALE</Link></li>
              <li><Link href="/new-arrivals">NEW ARRIVALS</Link></li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <span>NZD</span>
            <FaSearch className="cursor-pointer" />
            <FaUser className="cursor-pointer" />
            <FaShoppingCart className="cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
}