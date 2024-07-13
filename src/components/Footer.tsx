// components/Footer.js
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { MdOutlineColorLens } from 'react-icons/md';
import { GiClothes } from 'react-icons/gi';

export default function Footer() {
  return (
    <footer className="bg-white pt-10 pb-5 text-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">LOGO</h3>
          </div>

          {/* Shop column */}
          <div>
            <h3 className="font-bold mb-4">SHOP</h3>
            <ul className="space-y-2">
              <li><Link href="/new-arrivals">New Arrivals</Link></li>
              <li><Link href="/sale">Sale</Link></li>
            </ul>
          </div>


          {/* Rubyverse column */}
          <div>
            <h3 className="font-bold mb-4">ADA STUDIO</h3>
            <ul className="space-y-2">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/careers">Careers</Link></li>
            </ul>
          </div>
          
          {/* Rubette Care column */}
          <div>
            <h3 className="font-bold mb-4">HELP</h3>
            <ul className="space-y-2">
              <li><Link href="/contact-us">Contact Us</Link></li>
              <li><Link href="/size-guide">Size Guide</Link></li>
              <li><Link href="/help-centre">Help Centre</Link></li>
              <li><Link href="/shipping">Shipping</Link></li>
              <li><Link href="/returns">Returns</Link></li>
              <li><Link href="/my-account">My Account</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-5">
          <div className="flex items-center space-x-4">
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-gray-800" size={24} />
            </Link>
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="text-gray-800" size={24} />
            </Link>
          </div>

          <div className="text-sm">
            <span>© 2024 Ada Studio. All rights reserved.</span>
            <Link href="/privacy-policy" className="ml-4">Privacy Policy</Link>
            <Link href="/terms-conditions" className="ml-4">Terms & Conditions</Link>
            <span className="ml-4">Site by Nanogram</span>
          </div>

          <div className="flex items-center space-x-4">
            <MdOutlineColorLens className="text-rainbow" size={40} />
            <GiClothes className="text-gray-800" size={40} />
          </div>
        </div>
      </div>
    </footer>
  );
}