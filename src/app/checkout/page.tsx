import React from 'react';
import Layout from '../../components/Layout';
import CheckoutForm from '../../components/CheckoutForm';

export default function CheckoutPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <CheckoutForm />
      </div>
    </Layout>
  );
}