import React from 'react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-8">Contact Us</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-medium mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-4">
            We're here to help! If you have any questions about our products, orders, or just want to say hello, 
            please don't hesitate to reach out.
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-maroon"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-maroon"
              required
            />
          </div>

          <div>
            <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Order Number (if applicable)
            </label>
            <input
              type="text"
              id="orderNumber"
              name="orderNumber"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-maroon"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-maroon"
              required
            >
              <option value="">Select a subject</option>
              <option value="order">Order Status</option>
              <option value="returns">Returns & Exchanges</option>
              <option value="product">Product Information</option>
              <option value="shipping">Shipping Information</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-maroon"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-main-maroon text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Send Message
          </button>
        </form>

        <div className="mt-12 space-y-8">
          <div>
            <h2 className="text-xl font-medium mb-4">Other Ways to Reach Us</h2>
            <div className="space-y-4 text-gray-600">
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
          </div>

          <div>
            <h2 className="text-xl font-medium mb-4">Follow Us</h2>
            <p className="text-gray-600">
              Stay connected with us on social media for the latest updates, styling tips, and more:
            </p>
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-main-maroon hover:opacity-80 transition-opacity"
              >
                Instagram
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-main-maroon hover:opacity-80 transition-opacity"
              >
                Facebook
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-main-maroon hover:opacity-80 transition-opacity"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
