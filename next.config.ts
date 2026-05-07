import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"

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
}

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG ?? "",
  project: process.env.SENTRY_PROJECT ?? "",
  // Only upload source maps when a Sentry auth token is explicitly provided
  silent: !process.env.SENTRY_AUTH_TOKEN,
  // Disable Sentry telemetry
  telemetry: false,
})
