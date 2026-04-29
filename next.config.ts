import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Prevent bundling @react-pdf/renderer on the server — it is browser-only
  serverExternalPackages: ["@react-pdf/renderer"],
}

export default nextConfig
