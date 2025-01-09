import React from 'react';
import Link from 'next/link';
import { FadeIn } from '../../components/ui/fade-in';

export default function Wholesale() {
  return (
    <FadeIn>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-32 bg-[hsl(var(--secondary-peach))]">
      <h1 className="text-xl text-[hsl(var(--main-maroon))] mb-6 sm:mb-8 uppercase font-medium text-center sm:text-left">
        Wholesale Partnership
      </h1>
      
      <div className="space-y-8 sm:space-y-12 text-[hsl(var(--main-maroon))]">
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Partner With Us
          </h2>
          <p>
            Join Ada Studios&apos; wholesale program and bring our luxury glassware collection to your customers. We partner with select retailers who share our vision for quality and customer experience.
          </p>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Why Partner With Ada Studios?
          </h2>
          <div className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li>Premium quality products with unique designs</li>
              <li>Competitive wholesale pricing</li>
              <li>Dedicated wholesale support team</li>
              <li>Marketing and visual merchandising support</li>
              <li>Flexible minimum order quantities</li>
              <li>Quick turnaround times</li>
            </ul>
            </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Requirements
          </h2>
          <div className="space-y-4">
            <p>
              To qualify for our wholesale program, you must:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Have a valid business license</li>
              <li>Operate a physical retail location or established online store</li>
              <li>Meet our minimum order requirements</li>
              <li>Align with our brand values and aesthetic</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            How to Apply
          </h2>
          <div className="space-y-4">
            <p>
              To apply for a wholesale account, please provide the following information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Business name and website</li>
              <li>Contact information</li>
              <li>Business license number</li>
              <li>Brief description of your business</li>
              <li>List of current brands you carry (if applicable)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Ready to Get Started?
          </h2>
          <div className="space-y-4">
            <p>
              Contact our wholesale team to begin the application process or learn more about our program.
            </p>
            <div className="mt-6">
              <Link 
                href="/contact" 
                className="inline-block bg-[hsl(var(--main-maroon))] text-[hsl(var(--secondary-peach))] px-6 py-2 rounded hover:opacity-90 transition-opacity duration-200"
                >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Additional Information
          </h2>
          <div className="space-y-4">
            <p>
              For detailed information about our wholesale terms, shipping policies, and minimum order requirements, please contact our wholesale team. We look forward to potentially partnering with you.
            </p>
          </div>
        </section>
      </div>
    </div>
    </FadeIn>
  );
}
