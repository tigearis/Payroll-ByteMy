import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Define role-based access rules
    const accessRules = {
      "/developer": ["dev"],
      "/settings": ["dev", "admin"],
      "/clients": ["dev", "admin", "manager", "consultant"],
      "/payrolls": ["dev", "admin", "manager", "consultant"],
      // Add more rules as needed
    }

    for (const [route, allowedRoles] of Object.entries(accessRules)) {
      if (path.startsWith(route) && !allowedRoles.includes(token?.role as string)) {
        return NextResponse.rewrite(new URL("/unauthorized", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = {
  matcher: ["/dashboard/:path*", "/clients/:path*", "/payrolls/:path*", "/settings/:path*", "/developer/:path*"],
}

