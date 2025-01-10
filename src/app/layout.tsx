import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Cart from "../components/Cart";
import AnnouncementBar from "../components/AnnouncementBar";
import { CartProvider } from "../components/CartProvider";
import { CurrencyProvider } from "../components/CurrencyProvider";

const montserrat = Montserrat({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Ada Studio | Premium Matcha, Glassware & Accessories",
    template: "%s | Ada Studio"
  },
  description: "Discover our curated collection of premium matcha, elegant glassware, and carefully selected accessories. Experience quality and style with Ada Studio.",
  metadataBase: new URL('https://adastudio.com'),
  keywords: ["matcha", "glassware", "accessories", "premium tea", "tea accessories", "luxury glassware", "tea shop"],
  authors: [{ name: "Ada Studio" }],
  creator: "Ada Studio",
  publisher: "Ada Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://adastudio.com",
    siteName: "Ada Studio",
    title: "Ada Studio | Premium Matcha, Glassware & Accessories",
    description: "Discover our curated collection of premium matcha, elegant glassware, and carefully selected accessories. Experience quality and style with Ada Studio.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ada Studio - Premium Matcha & Glassware",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ada Studio | Premium Matcha, Glassware & Accessories",
    description: "Discover our curated collection of premium matcha, elegant glassware, and carefully selected accessories. Experience quality and style with Ada Studio.",
    images: ["/twitter-image.jpg"],
    creator: "@adastudio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // You'll need to replace this with actual verification code
  },
  category: "ecommerce",
  classification: "online store",
  referrer: "origin-when-cross-origin",
  colorScheme: "light",
  themeColor: "#8B0000", // main-maroon color
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {
    capable: true,
    title: "Ada Studio",
    statusBarStyle: "default",
  },
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
            <AnnouncementBar />
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
