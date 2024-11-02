// components/ProductDetails.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProductGallery } from './ProductGallery';
import { OptionSelector } from './OptionSelector';
import { ShopifyProduct } from '../types/shopify';
import AddToCartButton from './AddToCartButton';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Glasses,
  Wine, 
  PartyPopper,
  Sparkles,
  Heart,
  ImageIcon,
  Share2,
  ShieldCheck,
  Leaf,
  Package,
  ThermometerSun
} from 'lucide-react';

interface SelectedOptions {
  [key: string]: string;
}

interface ProductDetailsProps {
  product: ShopifyProduct;
  collection?: {
    title: string;
  };
}

export default function ProductDetails({ product, collection }: ProductDetailsProps) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [activeTab, setActiveTab] = useState('features');

  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const formattedPrice = new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode
  }).format(price);

  const validOptions = product.options?.filter(
    option => option && option.values && option.values.length > 0 && option.values.some(value => value !== '')
  ) || [];

  const brand = product.vendor || 'Brand';

  const features = [
    {
      icon: <Glasses className="w-6 h-6" />,
      title: "Premium Quality",
      description: "Made from high-grade, durable glass"
    },
    {
      icon: <PartyPopper className="w-6 h-6" />,
      title: "Perfect for Parties",
      description: "Ideal for social gatherings and celebrations"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Aesthetic Design",
      description: "Beautiful, Instagram-worthy presentation"
    }
  ];

  const styling = [
    {
      icon: <Wine className="w-6 h-6" />,
      title: "Cocktail Ready",
      description: "Perfect for signature drinks and cocktails"
    },
    {
      icon: <ImageIcon className="w-6 h-6" />,
      title: "Photo Perfect",
      description: "Designed for social media moments"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Lifestyle Match",
      description: "Matches the 'Dat Girl' aesthetic"
    }
  ];

  const care = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Dishwasher Safe",
      description: "Easy to clean and maintain"
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Secure Packaging",
      description: "Carefully packed for safe delivery"
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Eco-Conscious",
      description: "Sustainable packaging materials"
    }
  ];

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
    <div className="flex h-screen text-main-maroon">
      <ProductGallery 
        images={product.images.edges} 
        title={product.title} 
      />

      <div className="w-1/2 h-screen overflow-y-auto px-32 py-32">
        <div className="max-w-xl space-y-8">
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div>
              {collection && (
                <span className="text-sm">{collection.title.toUpperCase()}</span>
              )}
              <h1 className="text-2xl font-bold">{product.title}</h1>
              <p className="text-sm">{brand}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:opacity-70">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 hover:opacity-70">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <p className="text-2xl font-bold">{formattedPrice}</p>

          <div
            className="prose prose-sm"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />

          {validOptions.length > 0 && validOptions.map((option) => (
            <OptionSelector
              key={option.id}
              option={option}
              selectedValue={selectedOptions[option.name] || option.values[0]}
              onSelect={(value) => 
                setSelectedOptions(prev => ({
                  ...prev,
                  [option.name]: value
                }))
              }
            />
          ))}

          <AddToCartButton
            product={{
              id: product.id,
              variantId: product.variants.edges[0].node.id,
              title: product.title,
              price: parseFloat(product.priceRange.minVariantPrice.amount),
              image: product.images.edges[0]?.node.originalSrc,
            }}
          />

          {price >= 1 && price <= 2000 && (
            <div className="text-sm text-gray-600 text-center">
              4x {(price / 4).toFixed(2)} NZD on <span className="font-semibold">afterpay</span>
            </div>
          )}

          {/* Product Information Section */}
          <div className="mt-12 border-t pt-8">
            <h2 className="text-xl font-bold mb-6">Product Information</h2>
            
            {glasswareInfo.map((info, index) => (
              <div key={index} className="mb-8">
                <Card className="hover:shadow-md transition-shadow border-main-maroon">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-main-maroon mt-1">
                        {info.icon}
                      </div>
                      <div className="space-y-3 flex-1">
                        <div>
                          <h3 className="font-semibold text-lg">{info.title}</h3>
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
              </div>
            ))}
          </div>

          {/* Quick Reference Icons */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center p-4">
              <ThermometerSun className="w-6 h-6 mb-2" />
              <span className="text-xs">Temperature<br />Resistant</span>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Sparkles className="w-6 h-6 mb-2" />
              <span className="text-xs">Crystal<br />Clear</span>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <ShieldCheck className="w-6 h-6 mb-2" />
              <span className="text-xs">Quality<br />Guaranteed</span>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="mt-8 bg-main-maroon rounded-lg p-4">
            <p className="text-xs text-secondary-peach text-center">
              Our glassware meets the highest quality and safety standards. 
              Each piece is carefully inspected before shipping.
            </p>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}