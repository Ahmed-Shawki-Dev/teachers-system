import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://files.edgestore.dev/**')],
  },
}

export default nextConfig;
