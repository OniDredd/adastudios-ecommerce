import React from 'react';
import { FadeIn } from '../../components/ui/fade-in';

export default function ContactPage() {
  return (
    <FadeIn>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-32 bg-[hsl(var(--secondary-peach))]">
      <h1 className="text-xl text-[hsl(var(--main-maroon))] mb-6 sm:mb-8 uppercase font-medium text-center sm:text-left">
        Contact Us
      </h1>
      
      <div className="space-y-8 sm:space-y-12 text-[hsl(var(--main-maroon))]">
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Get in Touch
          </h2>
          <p className="mb-4">
            We&apos;re here to help! If you have any questions about our products, orders, or just want to say hello, 
            please don&apos;t hesitate to reach out.
          </p>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Other Ways to Reach Us
          </h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium">Customer Service Hours:</p>
              <p>Monday - Friday: 9:00 AM - 5:00 PM PST</p>
              </div>
            <div>
              <p className="font-medium">Email:</p>
              <p>support@adastudios.com</p>
            </div>
            <div>
              <p className="font-medium">Phone:</p>
              <p>(555) 123-4567</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Follow Us
          </h2>
          <p className="mb-4">
            Stay connected with us on social media for the latest updates, styling tips, and more:
          </p>
          <div className="flex space-x-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[hsl(var(--main-maroon))] hover:opacity-80 transition-opacity"
            >
              Instagram
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[hsl(var(--main-maroon))] hover:opacity-80 transition-opacity"
              >
              Facebook
            </a>
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[hsl(var(--main-maroon))] hover:opacity-80 transition-opacity"
              >
              TikTok
            </a>
          </div>
        </section>
      </div>
    </div>
    </FadeIn>
  );
}
