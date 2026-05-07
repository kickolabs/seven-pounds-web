import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"

function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Frame-Options", "DENY")
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  return res
}

export async function middleware(req: NextRequest) {
  let response = applySecurityHeaders(
    NextResponse.next({ request: { headers: req.headers } })
  )

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          // Recreate response so refreshed session cookies are forwarded
          response = applySecurityHeaders(
            NextResponse.next({ request: { headers: req.headers } })
          )
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
          )
        },
      },
    }
  )

  // Refresh session (required by Supabase SSR to keep tokens current)
  const { data: { user } } = await supabase.auth.getUser()

  // Protect /admin/* — allow /admin/login through unauthenticated
  const { pathname } = req.nextUrl
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static assets
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
