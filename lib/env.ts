// Server-only — import only from API routes and server components
// Throws a clear error at startup if any required env var is missing

function require(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: "${key}". Check your .env.local file.`)
  return value
}

export const env = {
  supabaseUrl:          require("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey:      require("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceKey:   require("SUPABASE_SERVICE_ROLE_KEY"),
  razorpayKeyId:        require("NEXT_PUBLIC_RAZORPAY_KEY_ID"),
  razorpayKeySecret:    require("RAZORPAY_KEY_SECRET"),
  siteUrl:              process.env.NEXT_PUBLIC_SITE_URL ?? "https://thesevenpounds.in",
} as const
