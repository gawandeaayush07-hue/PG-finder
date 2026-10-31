import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/premium",
        destination: "/",
        permanent: false,
      },
      {
        source: "/premium/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/pricing",
        destination: "/",
        permanent: false,
      },
      {
        source: "/subscription",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
