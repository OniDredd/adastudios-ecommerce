import React from 'react';

export default function ShippingReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-8">Shipping & Returns</h1>
      
      <div className="space-y-12">
        {/* Shipping Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-3">Processing Time</h3>
              <p className="text-gray-600">
                All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed the next business day.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3">Shipping Methods</h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-medium">Standard Shipping</p>
                    <p className="text-sm">5-7 business days</p>
                  </div>
                  <div>
                    <p>Free over $75</p>
                    <p className="text-sm">$7.95 under $75</p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-medium">Express Shipping</p>
                    <p className="text-sm">2-3 business days</p>
                  </div>
                  <div>
                    <p>$14.95 flat rate</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-4">
                  <div>
                    <p className="font-medium">International Shipping</p>
                    <p className="text-sm">7-14 business days</p>
                  </div>
                  <div>
                    <p>Calculated at checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Returns Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Returns Policy</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-3">Return Window</h3>
              <p className="text-gray-600">
                We accept returns within 30 days of delivery. Items must be unused, in their original packaging, and in resalable condition.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3">Return Process</h3>
              <ol className="list-decimal list-inside space-y-4 text-gray-600">
                <li>
                  Contact our customer service team to initiate your return
                </li>
                <li>
                  Receive a return authorization number and shipping instructions
                </li>
                <li>
                  Package your items securely with all original packaging
                </li>
                <li>
                  Include your return authorization number with the package
                </li>
                <li>
                  Ship the package to the provided return address
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3">Refund Information</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Refunds will be processed within 5-7 business days of receiving your return</li>
                <li>Original shipping charges are non-refundable</li>
                <li>Return shipping costs are the responsibility of the customer</li>
                <li>Refunds will be issued to the original payment method</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3">Non-Returnable Items</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
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
          <h2 className="text-2xl font-semibold mb-6">Need Help?</h2>
          <p className="text-gray-600">
            If you have any questions about shipping or returns, please contact our customer service team:
          </p>
          <div className="mt-4 space-y-2 text-gray-600">
            <p>Email: support@adastudios.com</p>
            <p>Phone: (555) 123-4567</p>
            <p>Hours: Monday - Friday, 9:00 AM - 5:00 PM PST</p>
          </div>
        </section>
      </div>
    </div>
  );
}
