import React from 'react';

export default function ShippingReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-32 bg-[hsl(var(--secondary-peach))]">
      <h1 className="text-xl text-[hsl(var(--main-maroon))] mb-6 sm:mb-8 uppercase font-medium text-center sm:text-left">
        Shipping & Returns
      </h1>
      
      <div className="space-y-8 sm:space-y-12 text-[hsl(var(--main-maroon))]">
        {/* Shipping Section */}
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Shipping Information
          </h2>
          
          <div className="space-y-4">
            <p>
              All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed the next business day.
            </p>

            <div className="space-y-4">
              <h3 className="font-semibold">Shipping Methods</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Standard Shipping (5-7 business days)</p>
                  <p>Free over $75, $7.95 under $75</p>
                </div>

                <div>
                  <p className="font-medium">Express Shipping (2-3 business days)</p>
                  <p>$14.95 flat rate</p>
                </div>

                <div>
                  <p className="font-medium">International Shipping (7-14 business days)</p>
                  <p>Calculated at checkout</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Returns Section */}
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Returns Policy
          </h2>
          
          <div className="space-y-4">
            <p>
              We accept returns within 30 days of delivery. Items must be unused, in their original packaging, and in resalable condition.
            </p>

            <div className="space-y-4">
              <h3 className="font-semibold">Return Process</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact our customer service team to initiate your return</li>
                <li>Receive a return authorization number and shipping instructions</li>
                <li>Package your items securely with all original packaging</li>
                <li>Include your return authorization number with the package</li>
                <li>Ship the package to the provided return address</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Refund Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds will be processed within 5-7 business days of receiving your return</li>
                <li>Original shipping charges are non-refundable</li>
                <li>Return shipping costs are the responsibility of the customer</li>
                <li>Refunds will be issued to the original payment method</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Non-Returnable Items</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sale items marked as final sale</li>
                <li>Used or damaged items</li>
                <li>Items without original packaging</li>
                <li>Gift cards</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Need Help?
          </h2>
          <div className="space-y-4">
            <p>
              If you have any questions about shipping or returns, please contact our customer service team:
            </p>
            <div className="space-y-2">
              <p>Email: support@adastudios.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Hours: Monday - Friday, 9:00 AM - 5:00 PM PST</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
