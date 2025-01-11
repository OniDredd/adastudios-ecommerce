import React from 'react';
import { FadeIn } from '../../components/ui/fade-in';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us | Ada Studio',
  description: 'Get in touch with Ada Studio. We\'re here to help with any questions about our premium matcha, glassware, and accessories. Contact our customer service team today.',
  openGraph: {
    title: 'Contact Ada Studio | Customer Service',
    description: 'Get in touch with Ada Studio. We\'re here to help with any questions about our premium matcha, glassware, and accessories.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Ada Studio',
      },
    ],
    type: 'website',
    siteName: 'Ada Studio',
  },
  keywords: ['contact', 'customer service', 'support', 'help', 'ada studio contact'],
  alternates: {
    canonical: 'https://adastudio.co.nz/contact'
  }
};

// Generate JSON-LD structured data for the contact page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Ada Studio Contact Page",
  description: "Contact information and customer service details for Ada Studio",
  mainEntity: {
    "@type": "LocalBusiness",
    name: "Ada Studio",
    description: "Premium matcha, glassware, and accessories retailer",
    email: "adastudionz@gmail.com",
    url: "https://adastudio.co.nz",
    sameAs: [
      "https://instagram.com",
      "https://facebook.com",
      "https://tiktok.com"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "adastudionz@gmail.com",
      availableLanguage: "English",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        opens: "09:00",
        closes: "17:00"
      }
    }
  }
};

export default function ContactPage() {
  return (
    <FadeIn>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-32 bg-[hsl(var(--secondary-peach))]">
      <h1 className="text-xl text-[hsl(var(--main-maroon))] mb-6 sm:mb-8 uppercase font-medium text-center sm:text-left">
        Contact Us
      </h1>
      
      <div className="space-y-8 sm:space-y-12 text-[hsl(var(--main-maroon))]">
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Get in Touch
          </h2>
          <p className="mb-4">
            We&apos;re here to help! If you have any questions about our products, orders, or just want to say hello, 
            please don&apos;t hesitate to reach out.
          </p>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Other Ways to Reach Us
          </h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium">Customer Service Hours:</p>
              <p>Monday - Friday: 9:00 AM - 5:00 PM PST</p>
              </div>
            <div>
              <p className="font-medium">Email:</p>
              <p>adastudionz@gmail.com</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Follow Us
          </h2>
          <p className="mb-4">
            Stay connected with us on social media for the latest updates, styling tips, and more:
          </p>
          <div className="flex space-x-4">
            <Link
              href="https://www.instagram.com/adastudionz/"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[hsl(var(--main-maroon))] hover:opacity-80 transition-opacity"
            >
              Instagram
            </Link>
            <Link 
              href="https://www.facebook.com/adastudionz/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[hsl(var(--main-maroon))] hover:opacity-80 transition-opacity"
              >
              Facebook
            </Link>
            <Link 
              href="https://www.tiktok.com/@adastudionz"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[hsl(var(--main-maroon))] hover:opacity-80 transition-opacity"
              >
              TikTok
            </Link>
          </div>
        </section>
      </div>
    </div>
    </FadeIn>
  );
}
