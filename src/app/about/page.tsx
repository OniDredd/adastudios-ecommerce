import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-xl font-medium text-main-maroon mb-6">Our Story</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Ada Studios was born from a passion for creating beautiful, mindful moments 
          through the art of matcha and thoughtfully designed lifestyle products.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src="/banner.jpg"
            alt="Ada Studios Matcha Experience"
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-base sm:text-xl font-medium text-main-maroon">Our Mission</h2>
          <p className="text-gray-600">
            At Ada Studios, we believe in the power of ritual and the beauty of 
            mindful living. Our mission is to bring the centuries-old tradition of 
            matcha into modern life, complemented by carefully curated lifestyle 
            pieces that enhance your daily rituals.
          </p>
          <p className="text-gray-600">
            Every product in our collection is thoughtfully selected to bring 
            harmony and elegance to your daily routine, from our premium matcha 
            sourced directly from Japanese farms to our handcrafted accessories.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-secondary-peach/10 rounded-lg p-12 mb-20">
        <h2 className="text-base sm:text-xl font-medium text-main-maroon text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-medium text-main-maroon">Quality</h3>
            <p className="text-gray-600">
              We source only the finest matcha and partner with skilled artisans 
              to bring you products of exceptional quality.
            </p>
          </div>
          <div className="text-center space-y-4">
            <h3 className="text-xl font-medium text-main-maroon">Sustainability</h3>
            <p className="text-gray-600">
              Our commitment to the environment is reflected in our eco-conscious 
              packaging and sustainable sourcing practices.
            </p>
          </div>
          <div className="text-center space-y-4">
            <h3 className="text-xl font-medium text-main-maroon">Community</h3>
            <p className="text-gray-600">
              We believe in building a community of mindful individuals who 
              appreciate the art of living well.
            </p>
          </div>
        </div>
      </div>

      {/* Craftsmanship Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-6 order-2 md:order-1">
          <h2 className="text-base sm:text-xl font-medium text-main-maroon">The Art of Craftsmanship</h2>
          <p className="text-gray-600">
            Each product in our collection tells a story of dedication and 
            expertise. From the careful cultivation of our matcha to the precise 
            crafting of our accessories, we work with artisans who share our 
            commitment to excellence.
          </p>
          <p className="text-gray-600">
            Our matcha is sourced from family-owned farms in Japan, where 
            generations of expertise ensure the highest quality leaves. Every 
            accessory is selected to enhance your matcha experience, combining 
            traditional techniques with modern design.
          </p>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden order-1 md:order-2">
          <Image
            src="/placeholder2.jpg"
            alt="Ada Studios Craftsmanship"
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Join Us Section */}
      <div className="text-center bg-main-maroon text-secondary-peach rounded-lg p-12">
        <h2 className="text-base sm:text-xl font-medium mb-6">Join Our Journey</h2>
        <p className="max-w-2xl mx-auto mb-8">
          We invite you to be part of our growing community of matcha enthusiasts 
          and mindful living advocates. Follow us on social media for brewing tips, 
          lifestyle inspiration, and updates on new collections..
        </p>
        <div className="flex justify-center space-x-6">
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
  );
}
