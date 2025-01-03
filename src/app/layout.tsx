import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Cart from "../components/Cart";
import { CartProvider } from "../components/CartProvider";
import { CurrencyProvider } from "../components/CurrencyProvider";

const montserrat = Montserrat({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Ada Studio",
  description: "Best glass in town.",
  metadataBase: new URL('https://adastudio.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
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
