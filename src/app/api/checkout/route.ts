import { NextRequest, NextResponse } from 'next/server';
import { createCart, addToCart } from '@/lib/shopify';

interface CheckoutItem {
  id: string;
  quantity: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const items = JSON.parse(decodeURIComponent(searchParams.get('items') || '[]')) as CheckoutItem[];

    if (!items.length) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Create a new cart using the Cart API
    const cart = await createCart();
    
    // Transform variant IDs if they're not in the correct format
    // Shopify variant IDs should be in the format: gid://shopify/ProductVariant/[id]
    const transformedItems = items.map(item => ({
      merchandiseId: item.id.includes('gid://') 
        ? item.id 
        : `gid://shopify/ProductVariant/${item.id.replace('gid://shopify/ProductVariant/', '')}`,
      quantity: item.quantity,
    }));

    // Add items to the cart
    const updatedCart = await addToCart(cart.id, transformedItems);

    // Return the checkout URL from the cart
    if (!updatedCart.checkoutUrl) {
      throw new Error('No checkout URL returned from Shopify');
    }

    return NextResponse.json({
      url: updatedCart.checkoutUrl,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
