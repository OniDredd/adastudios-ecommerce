import React from 'react';
import { FadeIn } from '../../components/ui/fade-in';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Ada Studio',
  description: 'Find answers to common questions about Ada Studio products, shipping, returns, and more. Learn about our glassware materials, care instructions, and customer service.',
  openGraph: {
    title: 'Frequently Asked Questions | Ada Studio',
    description: 'Find answers to common questions about Ada Studio products, shipping, returns, and more.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ada Studio FAQ',
      },
    ],
    type: 'website',
    siteName: 'Ada Studio',
  },
  keywords: ['faq', 'help', 'shipping', 'returns', 'product care', 'glassware', 'matcha', 'customer service'],
  alternates: {
    canonical: 'https://adastudio.co.nz/faq'
  }
};

export default function FAQPage() {
  return (
    <FadeIn>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-32 bg-[hsl(var(--secondary-peach))]">
      <h1 className="text-xl text-[hsl(var(--main-maroon))] mb-6 sm:mb-8 uppercase font-medium text-center sm:text-left">
        Frequently Asked Questions
      </h1>
      
      <div className="space-y-8 sm:space-y-12 text-[hsl(var(--main-maroon))]">
        {/* Product Information */}
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Product Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">What materials are your glasses made from?</h3>
              <p>
                Our glassware is crafted from premium borosilicate glass, known for its durability, clarity, and resistance to thermal shock. Each piece is carefully designed and manufactured to our exacting standards.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Are your products dishwasher safe?</h3>
              <p>
                Yes, all our glassware is dishwasher safe. However, for optimal care and longevity, we recommend hand washing. Please refer to our Care Instructions page for detailed cleaning guidelines.
              </p>
            </div>
          </div>
        </section>

        {/* Ordering */}
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Ordering
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">How do I track my order?</h3>
              <p>
                Once your order ships, you'll receive a confirmation email with tracking information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">What payment methods do you accept?</h3>
              <p>
                We accept all major credit cards (Visa, Mastercard), Apple Pay, and Afterpay for installment payments. All transactions are securely processed and encrypted.
              </p>
            </div>
          </div>
        </section>

        {/* Shipping */}
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Shipping
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">How long will it take to receive my order?</h3>
              <p>
                Standard shipping takes 5-7 business days within Express shipping (2-3 business days) is available at checkout. International shipping typically takes 7-14 business days.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Do you ship internationally?</h3>
              <p>
                We ship within New Zealand and Australia. We will expand our shipping zone in the future.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
    </FadeIn>
  );
}
