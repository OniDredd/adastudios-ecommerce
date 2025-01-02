/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com'
      },
      {
        protocol: 'https',
        hostname: '**.shopifycdn.com'
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com'
      },
      {
        protocol: 'https',
        hostname: '**.fna.fbcdn.net'
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com'
      }
    ]
  },
  // Enable React 19 features
  reactStrictMode: true,
  // Enable experimental features
  experimental: {
    // Enable optimized server components
    serverActions: {
      bodySizeLimit: '2mb'
    },
    // Optimize memory usage
    optimizePackageImports: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-select',
      'react-icons'
    ]
  },
  // Improve loading performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};

export default nextConfig;
