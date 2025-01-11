import React from 'react';
import { FadeIn } from '../../components/ui/fade-in';

export default function ShippingReturnsPage() {
  return (
    <FadeIn>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-32 bg-[hsl(var(--secondary-peach))]">
        <h1 className="text-xl text-[hsl(var(--main-maroon))] mb-6 sm:mb-8 uppercase font-medium text-center sm:text-left">
          SHIPPING & RETURNS
        </h1>
        
        <div className="space-y-8 sm:space-y-12 text-[hsl(var(--main-maroon))]">
          <section>
            <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
              Shipping Information
            </h2>
            <p className="mb-4">
              All orders are processed within 2-3 business days. Orders placed on weekends or holidays will be processed the next business day.
            </p>

            <h3 className="font-semibold mb-3">Shipping Methods</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Domestic Shipping (5-7 business days)</p>
                <p>Free over $100, $7.00 under $100</p>
              </div>
              <div>
                <p className="font-medium">International Shipping (7-14 business days)</p>
                <p>Calculated at checkout</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
              Returns Policy
            </h2>
            <p className="mb-4">
              We do not accept returns for change of mind. Please ensure you carefully review your order before completing your purchase.
            </p>
            <p>
              If your glassware arrives damaged, we&apos;re here to help. Please reach out to us at{' '}
              <a href="mailto:adastudionz@gmail.com" className="text-[hsl(var(--main-maroon))] hover:underline">
                adastudionz@gmail.com
              </a>{' '}
              with details of the damage, including photos if possible, so we can resolve the issue promptly.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
              Need Help?
            </h2>
            <p>
              If you have any questions about shipping or returns, please contact our customer service team:
              <br />
              Email:{' '}
              <a href="mailto:adastudionz@gmail.com" className="text-[hsl(var(--main-maroon))] hover:underline">
                adastudionz@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </FadeIn>
  );
}
