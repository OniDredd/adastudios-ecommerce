import React, { ReactNode } from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Ada Studios
          </Link>
          <ul className="flex space-x-4">
            <li><Link href="/collections">Collections</Link></li>
            <li><Link href="/search">Search</Link></li>
            <li><Link href="/cart">Cart</Link></li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto flex-grow p-4">
        {children}
      </main>

      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Ada Studios. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;