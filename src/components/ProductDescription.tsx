'use client';

import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { ShopifyProduct } from '../types/shopify';
import { 
  Glasses,
  Sparkles,
  ShieldCheck,
  Package,
  ThermometerSun,
} from 'lucide-react';

interface ProductDescriptionProps {
  product: ShopifyProduct;
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  // Get the last image from the array
  const lastImage = product.images.edges[product.images.edges.length - 1]?.node;

  const glasswareInfo = [
    {
      icon: <Glasses className="w-6 h-6" />,
      title: "Premium Glass Quality",
      description: "Made from high-quality, crystal-clear glass for exceptional clarity and durability",
      details: [
        "Lead-free crystal glass",
        "Scratch-resistant surface",
        "Temperature-resistant design",
        "Professional-grade thickness"
      ]
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Secure Packaging",
      description: "Each glass is carefully packaged to ensure safe delivery",
      details: [
        "Individual foam compartments",
        "Double-wall protection",
        "Shock-absorbing design",
        "Fragile handling labels"
      ]
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Care Instructions",
      description: "Proper care ensures long-lasting beauty and durability",
      details: [
        "Dishwasher safe on top rack",
        "Hand washing recommended",
        "Avoid extreme temperature changes",
        "Store upright to prevent chips"
      ]
    }
  ];

  return (
    <div className="w-full bg-secondary-peach py-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex gap-16">
          <div className="w-1/2 space-y-12">
            {/* Product Information Cards */}
            <div>
              <h2 className="text-2xl font-bold text-main-maroon mb-6">Product Information</h2>
              <div className="space-y-6">
                {glasswareInfo.map((info, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow border-main-maroon bg-secondary-peach">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-main-maroon mt-1">
                          {info.icon}
                        </div>
                        <div className="space-y-3 flex-1">
                          <div>
                            <h3 className="font-semibold text-lg text-main-maroon">{info.title}</h3>
                            <p className="text-sm text-main-maroon">{info.description}</p>
                          </div>
                          
                          <div className="bg-main-maroon rounded-lg p-4">
                            <ul className="grid grid-cols-2 gap-3">
                              {info.details.map((detail, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm text-secondary-peach">
                                  <div className="w-1.5 h-1.5 rounded-full bg-secondary-peach flex-shrink-0" />
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Reference Icons */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="flex flex-col items-center text-center p-6 bg-secondary-peach rounded-lg border border-main-maroon">
                <ThermometerSun className="w-8 h-8 mb-3 text-main-maroon" />
                <span className="text-sm text-main-maroon font-medium">Temperature<br />Resistant</span>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-secondary-peach rounded-lg border border-main-maroon">
                <Sparkles className="w-8 h-8 mb-3 text-main-maroon" />
                <span className="text-sm text-main-maroon font-medium">Crystal<br />Clear</span>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-secondary-peach rounded-lg border border-main-maroon">
                <ShieldCheck className="w-8 h-8 mb-3 text-main-maroon" />
                <span className="text-sm text-main-maroon font-medium">Quality<br />Guaranteed</span>
              </div>
            </div>

            {/* Safety Notice */}
            <div className="bg-main-maroon rounded-lg p-6 mt-8">
              <p className="text-sm text-secondary-peach text-center leading-relaxed">
                Our glassware meets the highest quality and safety standards. 
                Each piece is carefully inspected before shipping to ensure 
                you receive only the finest products.
              </p>
            </div>
          </div>

          <div className="w-1/2">
            {lastImage && (
              <div className="sticky top-8">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={lastImage.originalSrc}
                    alt={lastImage.altText || product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
