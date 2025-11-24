import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if accessing admin routes
  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/api/orders") ||
    request.nextUrl.pathname.startsWith("/api/analytics")
  ) {
    const session = request.cookies.get("admin_session")

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const user = JSON.parse(session.value)
      if (user.role !== "admin") {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/orders/:path*", "/api/analytics/:path*"],
}
