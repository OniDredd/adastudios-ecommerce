import { MetadataRoute } from 'next'
import shopify from '../lib/shopify'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all products
  const products = await shopify.getProducts()
  
  // Base URL from environment or default
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://adastudio.co.nz'

  // Static routes
  const routes = [
    '',
    '/shop',
    '/about',
    '/contact',
    '/faq',
    '/shipping-returns',
    '/care-instructions',
    '/sustainability',
    '/wholesale',
    '/terms-conditions',
    '/privacy-policy'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Product routes
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.handle}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  // Collection routes for main categories
  const collectionRoutes = ['matcha', 'glasses', 'accessories'].map((category) => ({
    url: `${baseUrl}/shop?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [...routes, ...productRoutes, ...collectionRoutes]
}
