import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.1.20'],
  async rewrites() {
    return [
      {
        source: '/app-preview/:path*',
        destination: 'http://localhost:8081/:path*',
      },
    ];
  },
};

export default nextConfig;
