import React from 'react';

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-32 bg-[hsl(var(--secondary-peach))]">
      <h1 className="text-3xl sm:text-4xl text-[hsl(var(--main-maroon))] mb-6 sm:mb-8 uppercase font-bold text-center sm:text-left">
        Shipping Information
      </h1>
      
      <div className="space-y-8 sm:space-y-12 text-[hsl(var(--main-maroon))]">
        {/* Shipping Zones */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Shipping Zones & Delivery Times
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-medium mb-2">United States</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="font-medium mb-2">Continental US</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Standard: 5-7 business days</li>
                    <li>Express: 2-3 business days</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Alaska & Hawaii</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Standard: 7-10 business days</li>
                    <li>Express: 3-5 business days</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-medium mb-2">International</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="font-medium mb-2">Canada</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Standard: 7-10 business days</li>
                    <li>Express: 3-5 business days</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Other International</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Standard: 10-14 business days</li>
                    <li>Express: 5-7 business days</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Packaging */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Packaging & Protection
          </h2>
          
          <div className="space-y-4">
            <p>
              We take extra care in packaging your glassware to ensure it arrives safely:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Each piece is individually wrapped in protective bubble wrap</li>
              <li>Custom-fitted foam inserts secure items during transit</li>
              <li>Double-walled boxes provide additional protection</li>
              <li>Fragile handling instructions clearly marked on packaging</li>
              <li>Eco-friendly materials used whenever possible</li>
            </ul>
          </div>
        </section>

        {/* Order Tracking */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Order Tracking
          </h2>
          
          <div className="space-y-4">
            <p>Stay updated on your order status:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Receive automatic email notifications at each shipping milestone</li>
              <li>Track your package through our website or carrier&apos;s platform</li>
              <li>Get estimated delivery dates and real-time updates</li>
              <li>Receive delivery confirmation notifications</li>
            </ul>
          </div>
        </section>

        {/* International Shipping */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            International Shipping Guidelines
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-medium mb-2">Customs & Duties</h3>
              <p>Important information for international orders:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Import duties and taxes are not included in the shipping cost</li>
                <li>Customers are responsible for all customs fees</li>
                <li>Shipping times may vary due to customs processing</li>
                <li>Accurate customs declarations will be provided</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-medium mb-2">Restricted Countries</h3>
              <p>
                Due to shipping restrictions and regulations, we currently cannot ship to certain countries. 
                Please contact our customer service team to verify if we can ship to your location.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Shipping Support
          </h2>
          <div className="space-y-4">
            <p>
              Need assistance with your shipment? Our customer service team is here to help:
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
