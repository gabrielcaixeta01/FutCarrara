import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Sem servidor. Gera ./out estático.
  output: 'export',
  outputFileTracingRoot: __dirname,
  images: { unoptimized: true },
};

export default nextConfig;
