/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**', // Allows all domains for development
      },
      {
        protocol: 'https',
        hostname: '**', // Allows all domains for production
      },
    ],
    // Alternatively, you can specify exact domains
    // domains: ['localhost', 'your-production-domain.com'],
  },
};

export default nextConfig;
