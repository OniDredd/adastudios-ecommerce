"use client";

// components/Navbar.js
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import LogoLight from "/public/adastudioslogo-creme.svg";
import LogoDark from "/public/adastudioslogo-green.svg";

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

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ease-in-out
      ${
        isScrolled
          ? "bg-main-creme text-secondary-green py-3 border-b-[1px] border-secondary-green"
          : "bg-transparent text-main-creme py-7 border-b-[1px] border-main-creme"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Image
            src={isScrolled ? LogoDark : LogoLight}
            alt="Ada Studios Logo"
            width={150}
            height={150}
          />
          <nav>
            <ul className="flex flex-row justify-between space-x-6">
              <li>
                <Link
                  href="/shop"
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
                  href="/new-arrivals"
                  className="hover:text-secondary-brown duration-200"
                >
                  NEW ARRIVALS
                </Link>
              </li>
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
