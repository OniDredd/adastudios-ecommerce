import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import shopifyClient from '../../../lib/shopify';

export async function GET() {
  return NextResponse.json(
    { error: 'GET method not supported. Please use POST.' },
    { status: 405 }
  );
}

export async function POST(request: NextRequest) {
  try {
    let items;
    try {
      const body = await request.json();
      items = body.items;
    } catch (error) {
      // Try to get items from URL if JSON parsing fails
      const url = new URL(request.url);
      const itemsParam = url.searchParams.get('items');
      if (itemsParam) {
        try {
          items = JSON.parse(decodeURIComponent(itemsParam));
        } catch (error) {
        }
      }
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: items array is required' },
        { status: 400 }
      );
    }

    // Create a new cart in Shopify
    const cart = await shopifyClient.createCart();
    
    // Add items to the cart
    const updatedCart = await shopifyClient.addToCart(
      cart.id,
      items.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
      }))
    );

    if (!updatedCart.checkoutUrl) {
      throw new Error('Failed to generate checkout URL');
    }

    return NextResponse.json({ checkoutUrl: updatedCart.checkoutUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
