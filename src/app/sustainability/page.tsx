import React from 'react';
import { FadeIn } from '../../components/ui/fade-in';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sustainability | Ada Studio',
  description: 'Learn about Ada Studio\'s commitment to sustainability, including our eco-friendly packaging, responsible manufacturing, and carbon footprint reduction initiatives. Discover how we\'re working towards a more sustainable future.',
  openGraph: {
    title: 'Our Commitment to Sustainability | Ada Studio',
    description: 'Discover Ada Studio\'s sustainable practices, from eco-friendly packaging to responsible manufacturing. See how we\'re working to reduce our environmental impact.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ada Studio Sustainability',
      },
    ],
    type: 'website',
    siteName: 'Ada Studio',
  },
  keywords: ['sustainability', 'eco-friendly', 'sustainable packaging', 'carbon footprint', 'recycled materials', 'environmental responsibility', 'green practices'],
  alternates: {
    canonical: 'https://adastudio.co.nz/sustainability'
  }
};

export default function Sustainability() {
  return (
    <FadeIn>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-32 bg-[hsl(var(--secondary-peach))]">
      <h1 className="text-xl text-[hsl(var(--main-maroon))] mb-6 sm:mb-8 uppercase font-medium text-center sm:text-left">
        Our Commitment to Sustainability
      </h1>
      
      <div className="space-y-8 sm:space-y-12 text-[hsl(var(--main-maroon))]">
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Sustainable Materials
          </h2>
          <div className="space-y-4">
            <p>
              At Ada Studios, we carefully select our materials to ensure they meet our high standards for both quality and sustainability. Our glassware is crafted from recycled glass whenever possible, and we continuously work to increase the percentage of recycled materials in our products.
            </p>
            </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Eco-Friendly Packaging
          </h2>
          <div className="space-y-4">
            <p>
              We use minimal, recyclable packaging materials to reduce waste. Our shipping boxes are made from recycled cardboard, and we avoid single-use plastics in our packaging whenever possible. Any protective materials used are biodegradable or easily recyclable.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Responsible Manufacturing
          </h2>
          <div className="space-y-4">
            <p>
              We partner with manufacturers who share our commitment to environmental responsibility. Our production processes are designed to minimize energy consumption and reduce waste. We regularly audit our supply chain to ensure compliance with environmental standards.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Carbon Footprint Reduction
          </h2>
          <div className="space-y-4">
            <p>
              We are actively working to reduce our carbon footprint by:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Optimizing shipping routes to reduce transportation emissions</li>
              <li>Using renewable energy in our operations where possible</li>
              <li>Implementing energy-efficient practices in our facilities</li>
              <li>Partnering with local suppliers when feasible</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Product Longevity
          </h2>
          <div className="space-y-4">
            <p>
              We believe that sustainable consumption starts with creating products that last. Our glassware is designed and crafted for durability, reducing the need for frequent replacements and minimizing waste. We also provide detailed care instructions to help our customers extend the life of their products.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Future Goals
          </h2>
          <div className="space-y-4">
            <p>
              We are committed to continuously improving our environmental impact. Our future sustainability goals include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Achieving carbon neutrality in our operations by 2025</li>
              <li>Increasing our use of recycled materials to 80% by 2024</li>
              <li>Implementing a product recycling program</li>
              <li>Expanding our use of renewable energy sources</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
    </FadeIn>
  );
}
