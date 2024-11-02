import React from 'react';
import Layout from '../../../components/Layout';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="mb-8">Your payment was successful and your order is being processed.</p>
        <Link href="/" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </Layout>
  );
}