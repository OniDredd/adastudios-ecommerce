// components/Footer.js
import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-main-green pb-5 text-main-creme">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 py-20">
          <div>
            <Image src="/adastudioslogo-creme.svg" alt="Ada Studios Logo" width={230} height={230} />
          </div>

          {/* Shop column */}
          <div>
            <h3 className="font-bold text-lg mb-4 font-main-font">SHOP</h3>
            <ul className="space-y-2">
              <li><Link href="/accessories" className='hover:text-secondary-brown duration-200'>Accessories</Link></li>
              <li><Link href="/sale" className='hover:text-secondary-brown duration-200'>Sale</Link></li>
            </ul>
          </div>


          {/* Ada Studio column */}
          <div>
            <h3 className="font-bold text-lg mb-4 font-main-font">ADA STUDIO</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className='hover:text-secondary-brown duration-200'>About</Link></li>
            </ul>
          </div>

          {/* Rubette Care column */}
          <div>
            <h3 className="font-bold text-lg mb-4 font-main-font">HELP</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className='hover:text-secondary-brown duration-200'>Contact Us</Link></li>
              <li><Link href="/shipping" className='hover:text-secondary-brown duration-200'>Shipping</Link></li>
              <li><Link href="/faq" className='hover:text-secondary-brown duration-200'>FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between items-center border-main-creme border-t pt-5">
          <div className="flex items-center space-x-4">
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="hover:text-secondary-brown duration-200" size={24} />
            </Link>
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="hover:text-secondary-brown duration-200" size={24} />
            </Link>
          </div>

          <div className="text-sm">
            <span>© 2024 Ada Studio. All rights reserved.</span>
            <Link href="/privacy-policy" className="ml-4 hover:text-secondary-brown duration-200">Privacy Policy</Link>
            <Link href="/terms-conditions" className="ml-4 hover:text-secondary-brown duration-200">Terms & Conditions</Link>
            <span className="ml-4">Site Created by Nanogram</span>
          </div>
        </div>
      </div>
    </footer>
  );
}