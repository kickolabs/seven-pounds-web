import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

let ratelimit: Ratelimit | null = null

function getRatelimit() {
  if (ratelimit) return ratelimit
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    prefix: "7lbs",
  })
  return ratelimit
}

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean }> {
  const rl = getRatelimit()
  if (!rl) return { allowed: true } // dev: no Redis configured, skip
  const { success } = await rl.limit(ip)
  return { allowed: success }
}
