import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Empty turbopack config to silence warning
  turbopack: {},
  webpack: (config, { isServer }) => {
    // sql.js requires these fallbacks for browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;

