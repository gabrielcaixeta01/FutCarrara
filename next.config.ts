import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Sem servidor. Gera ./out estático.
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
