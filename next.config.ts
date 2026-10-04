import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Fail the production build on type errors rather than shipping them.
  typescript: { ignoreBuildErrors: false },
  // `pg` is a native-ish driver; keep it external to the server bundle.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
};

export default nextConfig;
