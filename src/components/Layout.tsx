"use client";

import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import { CartProvider } from './CartProvider';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default Layout;
