import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-32 bg-[hsl(var(--secondary-peach))]">
      <h1 className="text-3xl sm:text-4xl text-[hsl(var(--main-maroon))] mb-6 sm:mb-8 uppercase font-bold text-center sm:text-left">
        Privacy Policy
      </h1>
      
      <div className="space-y-8 sm:space-y-12 text-[hsl(var(--main-maroon))]">
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Information We Collect
          </h2>
          <div className="space-y-4">
            <p>
              When you visit our website, we collect certain information about your device, your interaction with the website, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.
            </p>
            <p>
              The personal information we collect includes names, addresses, email addresses, phone numbers, payment information, and any other information you choose to provide. We use this information to fulfill orders, communicate with you, and improve our services.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            How We Use Your Information
          </h2>
          <div className="space-y-4">
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and provide customer support</li>
              <li>Send you marketing communications (if you opt in)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
              <li>Detect and prevent fraud</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Information Sharing
          </h2>
          <div className="space-y-4">
            <p>
              We share your personal information with service providers to help us provide our services and fulfill our contracts with you. For example, we use payment processors to securely handle credit card transactions, shipping carriers to deliver orders, and marketing providers to manage our communications.
            </p>
            <p>
              We may also share your personal information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Your Rights
          </h2>
          <div className="space-y-4">
            <p>
              You have the right to access, correct, or delete your personal information. You can also object to or restrict our processing of your data. To exercise these rights, please contact us using the information provided below.
            </p>
            <p>
              If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by contacting us.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Cookies
          </h2>
          <div className="space-y-4">
            <p>
              We use cookies and similar tracking technologies to track the activity on our website and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Changes to This Policy
          </h2>
          <div className="space-y-4">
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last Updated&rdquo; date.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[hsl(var(--main-maroon))] border-b-2 border-[hsl(var(--main-maroon))] pb-2">
            Contact Us
          </h2>
          <div className="space-y-4">
            <p>
              If you have any questions about our Privacy Policy, please contact us:
            </p>
            <div className="space-y-2">
              <p>Email: privacy@adastudios.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Address: 123 Main Street, Suite 100, San Francisco, CA 94105</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
