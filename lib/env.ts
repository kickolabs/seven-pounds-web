// Server-only — import only from API routes and server components
// Validates each variable lazily when first accessed (avoids build-time failures)

function require(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(
      `Missing required environment variable: "${key}". Check your Vercel project settings or .env.local file.`
    )
  }
  return value
}

export const env = {
  get supabaseUrl() {
    return require("NEXT_PUBLIC_SUPABASE_URL")
  },
  get supabaseAnonKey() {
    return require("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  },
  get supabaseServiceKey() {
    return require("SUPABASE_SERVICE_ROLE_KEY")
  },
  get razorpayKeyId() {
    return require("NEXT_PUBLIC_RAZORPAY_KEY_ID")
  },
  get razorpayKeySecret() {
    return require("RAZORPAY_KEY_SECRET")
  },
  get razorpayWebhookSecret() {
    return process.env.RAZORPAY_WEBHOOK_SECRET ?? ""
  },
  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "https://thesevenpounds.in"
  },
}
