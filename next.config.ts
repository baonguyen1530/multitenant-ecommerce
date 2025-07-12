import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  serverExternalPackages: ['payload', 'sharp'],
  images: {
    unoptimized: true,
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('sharp');
    }
    
    // Completely exclude sharp from being bundled
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp: false
    };
    
    // Add fallback for sharp
    config.resolve.fallback = {
      ...config.resolve.fallback,
      sharp: false
    };
    
    // Handle PayloadCMS UI assets that require sharp
    config.module.rules.push({
      test: /@payloadcms\/ui\/dist\/assets\/.*\.(png|jpe?g|gif|svg|webp)$/i,
      use: {
        loader: 'null-loader'
      }
    });
    
    // Ignore sharp-related errors
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Could not load the "sharp" module/,
      /Failed to load sharp/,
      /Module not found.*sharp/
    ];
    
    return config;
  },
};

export default withPayload(nextConfig);
