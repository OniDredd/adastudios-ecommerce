import React from 'react';
import Link from 'next/link';

export default function Wholesale() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-8">Wholesale Partnership</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Partner With Us</h2>
          <p className="text-gray-600">
            Join Ada Studios&apos; wholesale program and bring our luxury glassware collection to your customers. We partner with select retailers who share our vision for quality and customer experience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Why Partner With Ada Studios?</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Premium quality products with unique designs</li>
            <li>Competitive wholesale pricing</li>
            <li>Dedicated wholesale support team</li>
            <li>Marketing and visual merchandising support</li>
            <li>Flexible minimum order quantities</li>
            <li>Quick turnaround times</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Requirements</h2>
          <p className="text-gray-600">
            To qualify for our wholesale program, you must:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-gray-600">
            <li>Have a valid business license</li>
            <li>Operate a physical retail location or established online store</li>
            <li>Meet our minimum order requirements</li>
            <li>Align with our brand values and aesthetic</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">How to Apply</h2>
          <p className="text-gray-600">
            To apply for a wholesale account, please provide the following information:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-gray-600">
            <li>Business name and website</li>
            <li>Contact information</li>
            <li>Business license number</li>
            <li>Brief description of your business</li>
            <li>List of current brands you carry (if applicable)</li>
          </ul>
        </section>

        <section className="bg-main-maroon text-secondary-peach p-6 rounded-lg mt-8">
          <h2 className="text-xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="mb-4">
            Contact our wholesale team to begin the application process or learn more about our program.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-secondary-peach text-main-maroon px-6 py-2 rounded hover:opacity-90 transition-opacity duration-200"
          >
            Contact Us
          </Link>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <p className="text-gray-600">
            For detailed information about our wholesale terms, shipping policies, and minimum order requirements, please contact our wholesale team. We look forward to potentially partnering with you.
          </p>
        </section>
      </div>
    </div>
  );
}
