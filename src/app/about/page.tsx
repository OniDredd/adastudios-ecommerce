import React from 'react';
import Image from 'next/image';
import { FadeIn } from '../../components/ui/fade-in';

export default function AboutPage() {
  return (
    <FadeIn>
      <div >
        {/* Hero Section */}
        <div className="text-center px-16 pt-32 pb-16 border-[1px] border-main-maroon flex flex-col items-center justify-center">
          <h1 className="text-xl font-medium text-main-maroon mb-8">Our Story</h1>
          <p className="text-lg text-main-maroon max-w-2xl">
            Ada Studios was born from a passion for creating beautiful, mindful moments 
            through the art of matcha and thoughtfully designed lifestyle products.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2">
          <div className="relative h-[600px] border-[1px] border-t-0 border-main-maroon">
            <Image
              src="/banner.jpg"
              alt="Ada Studios Matcha Experience"
              fill
              style={{ objectFit: 'cover' }}
              className="object-cover object-center"
            />
          </div>
          <div className="flex flex-col justify-center space-y-8 p-16 border-[1px] border-t-0 border-l-0 border-main-maroon">
            <h2 className="text-base sm:text-xl font-medium text-main-maroon">Our Mission</h2>
            <p className="text-main-maroon">
              At Ada Studios, we believe in the power of ritual and the beauty of 
              mindful living. Our mission is to bring the centuries-old tradition of 
              matcha into modern life, complemented by carefully curated lifestyle 
              pieces that enhance your daily rituals.
            </p>
            <p className="text-main-maroon">
              Every product in our collection is thoughtfully selected to bring 
              harmony and elegance to your daily routine, from our premium matcha 
              sourced directly from Japanese farms to our handcrafted accessories.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="border-[1px] border-t-0 border-main-maroon">
          <h2 className="text-base sm:text-xl font-medium text-main-maroon text-center py-16 border-b-[1px] border-main-maroon">Our Values</h2>
          <div className="grid md:grid-cols-3">
            <div className="flex flex-col items-center justify-center text-center space-y-6 p-16 border-r-[1px] border-main-maroon">
              <h3 className="text-xl font-medium text-main-maroon">Quality</h3>
              <p className="text-main-maroon">
                We source only the finest matcha and partner with skilled artisans 
                to bring you products of exceptional quality.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center text-center space-y-6 p-16 border-r-[1px] border-main-maroon">
              <h3 className="text-xl font-medium text-main-maroon">Sustainability</h3>
              <p className="text-main-maroon">
                Our commitment to the environment is reflected in our eco-conscious 
                packaging and sustainable sourcing practices.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center text-center space-y-6 p-16">
              <h3 className="text-xl font-medium text-main-maroon">Community</h3>
              <p className="text-main-maroon">
                We believe in building a community of mindful individuals who 
                appreciate the art of living well.
              </p>
            </div>
          </div>
        </div>

        {/* Craftsmanship Section */}
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-8 p-16 border-[1px] border-t-0 border-main-maroon order-2 md:order-1">
            <h2 className="text-base sm:text-xl font-medium text-main-maroon">The Art of Craftsmanship</h2>
            <p className="text-main-maroon">
              Each product in our collection tells a story of dedication and 
              expertise. From the careful cultivation of our matcha to the precise 
              crafting of our accessories, we work with artisans who share our 
              commitment to excellence.
            </p>
            <p className="text-main-maroon">
              Our matcha is sourced from family-owned farms in Japan, where 
              generations of expertise ensure the highest quality leaves. Every 
              accessory is selected to enhance your matcha experience, combining 
              traditional techniques with modern design.
            </p>
          </div>
          <div className="relative h-[600px] border-[1px] border-t-0 border-l-0 border-main-maroon order-1 md:order-2">
            <Image
              src="/placeholder2.jpg"
              alt="Ada Studios Craftsmanship"
              fill
              style={{ objectFit: 'cover' }}
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Join Us Section */}
        <div className="flex flex-col items-center justify-center text-center bg-main-maroon text-secondary-peach p-16 border-[1px] border-t-0 border-main-maroon">
          <h2 className="text-base sm:text-xl font-medium mb-8">Join Our Journey</h2>
          <p className="max-w-2xl mb-12">
            We invite you to be part of our growing community of matcha enthusiasts 
            and mindful living advocates. Follow us on social media for brewing tips, 
            lifestyle inspiration, and updates on new collections.
          </p>
          <div className="flex justify-center space-x-12">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              Instagram
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              Facebook
            </a>
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
