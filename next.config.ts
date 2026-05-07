import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseHostname = supabaseUrl
  ? supabaseUrl.replace(/^https?:\/\//, "").split("/")[0]
  : "*.supabase.co"

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
      },
    ],
  },
};

export default nextConfig;
