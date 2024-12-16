import React from 'react';

export default function CareInstructionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-8">Care Instructions</h1>
      
      <div className="space-y-12">
        {/* General Care */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">General Care Guidelines</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Our luxury glassware is crafted with the highest quality materials to ensure longevity and beauty. 
              Following these care instructions will help maintain your pieces in pristine condition.
            </p>
            <ul className="list-disc list-inside space-y-2">
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
          <h2 className="text-2xl font-semibold mb-6">Cleaning Instructions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-3">Hand Washing (Recommended)</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-600">
                <li>Use warm water and mild dish soap</li>
                <li>Clean with a soft, non-abrasive sponge or cloth</li>
                <li>Rinse thoroughly with clean water</li>
                <li>Dry immediately with a lint-free cloth</li>
                <li>Hold by the base when drying to prevent water spots</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3">Dishwasher Use</h3>
              <div className="text-gray-600 space-y-3">
                <p>While our glassware is dishwasher safe, we recommend hand washing for optimal care and longevity.</p>
                <p>If using a dishwasher:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Place items securely to prevent movement</li>
                  <li>Avoid overcrowding</li>
                  <li>Use a gentle cycle</li>
                  <li>Skip the heat dry cycle</li>
                  <li>Remove promptly when cycle is complete</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Matcha Care */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Matcha Glassware Special Care</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Our matcha glassware requires special attention to prevent staining and maintain its pristine appearance:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Rinse immediately after use to prevent matcha powder from settling</li>
              <li>Use a bottle brush for thorough cleaning of narrow openings</li>
              <li>For stubborn stains, create a paste with baking soda and water</li>
              <li>Avoid using bleach or harsh chemicals</li>
              <li>Store completely dry to prevent any moisture-related issues</li>
            </ul>
          </div>
        </section>

        {/* Storage */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Storage Recommendations</h2>
          <div className="space-y-4 text-gray-600">
            <ul className="list-disc list-inside space-y-2">
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
          <h2 className="text-2xl font-semibold mb-6">Troubleshooting Common Issues</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-xl font-medium mb-2">Water Spots</h3>
              <p className="text-gray-600">
                To remove water spots, clean with a mixture of equal parts white vinegar and water, 
                then dry thoroughly with a microfiber cloth.
              </p>
            </div>
            <div className="border-b pb-4">
              <h3 className="text-xl font-medium mb-2">Stubborn Stains</h3>
              <p className="text-gray-600">
                For persistent stains, soak in warm water with denture tablets for 30 minutes, 
                then clean as usual.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Cloudy Glass</h3>
              <p className="text-gray-600">
                If glass becomes cloudy, soak in white vinegar for 15 minutes, 
                then hand wash with mild soap and warm water.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Need Additional Help?</h2>
          <p className="text-gray-600 mb-4">
            If you have specific questions about caring for your Ada Studios glassware, 
            our customer service team is here to help:
          </p>
          <div className="text-gray-600">
            <p>Email: support@adastudios.com</p>
            <p>Phone: (555) 123-4567</p>
            <p>Hours: Monday - Friday, 9:00 AM - 5:00 PM PST</p>
          </div>
        </section>
      </div>
    </div>
  );
}
