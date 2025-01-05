import React from 'react';

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-32 bg-[hsl(var(--secondary-peach))]">
      <h1 className="text-xl text-[hsl(var(--main-maroon))] mb-6 sm:mb-8 uppercase font-medium text-center sm:text-left">
        Frequently Asked Questions
      </h1>
      
      <div className="space-y-8 sm:space-y-12 text-[hsl(var(--main-maroon))]">
        {/* Products */}
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Product Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">What materials are your glasses made from?</h3>
              <p>
                Our glassware is crafted from premium borosilicate glass, known for its durability, 
                clarity, and resistance to thermal shock. Each piece is carefully designed and 
                manufactured to our exacting standards.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Are your products dishwasher safe?</h3>
              <p>
                Yes, all our glassware is dishwasher safe. However, for optimal care and longevity, 
                we recommend hand washing. Please refer to our Care Instructions page for detailed 
                cleaning guidelines.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Do you offer gift packaging?</h3>
              <p>
                Yes, we offer elegant gift packaging options at checkout. Each gift package includes 
                premium wrapping paper, a personalized note card, and protective packaging to ensure 
                safe delivery.
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
                Once your order ships, you&apos;ll receive a confirmation email with tracking information. 
                You can also track your order by logging into your account on our website and viewing 
                your order history.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">What payment methods do you accept?</h3>
              <p>
                We accept all major credit cards (Visa, Mastercard), Apple Pay, and Afterpay for 
                installment payments. All transactions are securely processed and encrypted.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Can I modify or cancel my order?</h3>
              <p>
                Orders can be modified or cancelled within 1 hour of placement. Please contact our 
                customer service team immediately if you need to make changes to your order.
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
                Standard shipping takes 5-7 business days within the US. Express shipping (2-3 business days) 
                is available at checkout. International shipping typically takes 7-14 business days.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Do you ship internationally?</h3>
              <p>
                Yes, we ship to most countries worldwide. International shipping rates and delivery times 
                vary by location. Customs fees and import duties may apply and are the responsibility of 
                the customer.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Is shipping insurance included?</h3>
              <p>
                All orders are automatically insured against loss or damage during transit. If your package 
                arrives damaged, please contact us immediately with photos for a replacement.
              </p>
            </div>
          </div>
        </section>

        {/* Returns & Exchanges */}
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Returns & Exchanges
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">What is your return policy?</h3>
              <p>
                We accept returns within 30 days of delivery. Items must be unused, in their original 
                packaging, and in resalable condition. Please visit our Returns page for detailed 
                instructions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">How do I initiate a return?</h3>
              <p>
                Contact our customer service team to initiate a return. We&apos;ll provide you with a return 
                authorization number and shipping instructions. Return shipping costs are the responsibility 
                of the customer.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">What if I receive a damaged item?</h3>
              <p>
                If you receive a damaged item, please contact us within 48 hours of delivery with photos 
                of the damage. We&apos;ll arrange for a replacement to be sent at no additional cost.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Still Have Questions?
          </h2>
          <div className="space-y-4">
            <p>
              Our customer service team is here to help! Contact us through any of the following methods:
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
