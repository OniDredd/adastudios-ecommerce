import React from 'react';
import { FadeIn } from '../../components/ui/fade-in';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Ada Studio',
  description: 'Read Ada Studio\'s terms and conditions. Important information about our online store policies, shipping, payments, user accounts, and intellectual property rights.',
  openGraph: {
    title: 'Terms & Conditions | Ada Studio',
    description: 'Important legal information about using Ada Studio\'s website and services. Read our terms of service, user agreements, and policies.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ada Studio Terms & Conditions',
      },
    ],
    type: 'website',
    siteName: 'Ada Studio',
  },
  keywords: ['terms and conditions', 'legal terms', 'user agreement', 'store policies', 'payment terms', 'shipping policy', 'privacy policy', 'terms of service'],
  alternates: {
    canonical: 'https://adastudio.co.nz/terms-conditions'
  }
};

export default function TermsConditions() {
  return (
    <FadeIn>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-32 bg-[hsl(var(--secondary-peach))]">
      <h1 className="text-xl text-[hsl(var(--main-maroon))] mb-6 sm:mb-8 uppercase font-medium text-center sm:text-left">
        Terms & Conditions
      </h1>
      
      <div className="space-y-8 sm:space-y-12 text-[hsl(var(--main-maroon))]">
        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            1. Agreement to Terms
          </h2>
          <div className="space-y-4">
            <p>
              By accessing and using this website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            2. Online Store Terms
          </h2>
          <div className="space-y-4">
            <p>
              By agreeing to these Terms & Conditions, you represent that you are at least the age of majority in your state or province of residence and have given us your consent to allow any of your minor dependents to use this site.
            </p>
            <p>
              You may not use our products for any illegal or unauthorized purpose, nor may you, in the use of the Service, violate any laws in your jurisdiction.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            3. Products and Services
          </h2>
          <div className="space-y-4">
            <p>
              We reserve the right to refuse service to anyone for any reason at any time. Prices for our products are subject to change without notice. We reserve the right to modify or discontinue any product or service without notice.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            4. Accuracy of Information
          </h2>
          <div className="space-y-4">
            <p>
              We make every effort to display as accurately as possible the colors and images of our products. We cannot guarantee that your computer monitor&apos;s display of any color will be accurate.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            5. Payment Terms
          </h2>
          <div className="space-y-4">
            <p>
              We accept various forms of payment as indicated on our website. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            6. Shipping and Delivery
          </h2>
          <div className="space-y-4">
            <p>
              Shipping times and costs may vary based on location and other factors. We are not responsible for delays due to customs or other shipping-related issues beyond our control.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            7. User Account Responsibilities
          </h2>
          <div className="space-y-4">
            <p>
              If you create an account on our website, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            8. Intellectual Property
          </h2>
          <div className="space-y-4">
            <p>
              All content on this website, including text, graphics, logos, images, and software, is the property of Ada Studios or its content suppliers and is protected by international copyright laws.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base sm:text-xl font-medium mb-4 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            9. Changes to Terms
          </h2>
          <div className="space-y-4">
            <p>
              We reserve the right to update, change, or replace any part of these Terms & Conditions by posting updates and/or changes to our website. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
            </p>
          </div>
        </section>
      </div>
    </div>
    </FadeIn>
  );
}
