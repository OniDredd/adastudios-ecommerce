import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Cart from "@/components/Cart";
import { CartProvider } from '@/components/CartProvider';
import { CurrencyProvider } from '@/components/CurrencyProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ada Studio",
  description: "Best glass in town.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CurrencyProvider>
          <CartProvider>
            <Navbar />
            <Cart />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
