import React from 'react';
import { FadeIn } from '../../components/ui/fade-in';

export default function CareInstructionsPage() {
  return (
    <FadeIn>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-32 bg-[hsl(var(--secondary-peach))]">
      <h1 className="text-xl text-[hsl(var(--main-maroon))] mb-6 sm:mb-8 uppercase font-medium text-center sm:text-left">
        Care Instructions
      </h1>
      
      <div className="space-y-8 text-[hsl(var(--main-maroon))]">
        {/* General Care */}
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            General Care Guidelines
          </h2>
          <div className="space-y-4">
            <p>
              Our luxury glassware is crafted with the highest quality materials to ensure longevity and beauty. 
              Following these care instructions will help maintain your pieces in pristine condition.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Handle with care to prevent chips and cracks</li>
              <li>Avoid extreme temperature changes</li>
              <li>Store in a safe place away from high traffic areas</li>
              <li>Clean immediately after use</li>
              <li>Use appropriate cleaning products</li>
            </ul>
            </div>
        </section>

        {/* Cleaning Instructions */}
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Cleaning Instructions
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">
                Hand Washing (Recommended)
              </h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Use warm water and mild dish soap</li>
                <li>Clean with a soft, non-abrasive sponge or cloth</li>
                <li>Rinse thoroughly with clean water</li>
                <li>Dry immediately with a lint-free cloth</li>
                <li>Hold by the base when drying to prevent water spots</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">
                Dishwasher Use
              </h3>
              <p>While our glassware is dishwasher safe, we recommend hand washing for optimal care and longevity.</p>
              <p>If using a dishwasher:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Place items securely to prevent movement</li>
                <li>Avoid overcrowding</li>
                <li>Use a gentle cycle</li>
                <li>Skip the heat dry cycle</li>
                <li>Remove promptly when cycle is complete</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Matcha Care */}
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Matcha Glassware Special Care
          </h2>
          <div className="space-y-4">
            <p>
              Our matcha glassware requires special attention to prevent staining and maintain its pristine appearance:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Rinse immediately after use to prevent matcha powder from settling</li>
              <li>Use a bottle brush for thorough cleaning of narrow openings</li>
              <li>For stubborn stains, create a paste with baking soda and water</li>
              <li>Avoid using bleach or harsh chemicals</li>
              <li>Store completely dry to prevent any moisture-related issues</li>
            </ul>
          </div>
        </section>

        {/* Matcha Powder Care */}
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Matcha Powder Care
          </h2>
          <div className="space-y-4">
            <p>
              Proper storage and handling of matcha powder is essential to maintain its quality, flavor, and nutritional benefits:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Store in an airtight container to protect from moisture and oxygen exposure</li>
              <li>Keep in a cool, dark place away from direct sunlight to preserve color and nutrients</li>
              <li>Maintain storage temperature between 40-70°F (4-21°C)</li>
              <li>Keep away from strong-smelling items as matcha can absorb odors</li>
              <li>Use within 1-2 months after opening for best quality</li>
              <li>Always use a clean, dry spoon to prevent moisture contamination</li>
              <li>Consider refrigerator storage after opening, ensuring container is completely sealed</li>
              <li>Bring refrigerated matcha to room temperature before opening to prevent condensation</li>
            </ul>
          </div>
        </section>

        {/* Storage */}
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Storage Recommendations
          </h2>
          <div className="space-y-4">
            <ul className="list-disc pl-5 space-y-2">
              <li>Store in a cool, dry place away from direct sunlight</li>
              <li>Keep glasses upright to prevent rim damage</li>
              <li>Use dividers or protective sleeves for extra protection</li>
              <li>Avoid stacking unless specifically designed for stacking</li>
              <li>Store away from areas with temperature fluctuations</li>
            </ul>
          </div>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Troubleshooting Common Issues
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">
                Water Spots
              </h3>
              <p>
                To remove water spots, clean with a mixture of equal parts white vinegar and water, 
                then dry thoroughly with a microfiber cloth.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">
                Stubborn Stains
              </h3>
              <p>
                For persistent stains, soak in warm water with denture tablets for 30 minutes, 
                then clean as usual.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">
                Cloudy Glass
              </h3>
              <p>
                If glass becomes cloudy, soak in white vinegar for 15 minutes, 
                then hand wash with mild soap and warm water.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Need Additional Help?
          </h2>
          <div className="space-y-4">
            <p>
              If you have specific questions about caring for your Ada Studios glassware, 
              our customer service team is here to help:
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
    </FadeIn>
  );
}
