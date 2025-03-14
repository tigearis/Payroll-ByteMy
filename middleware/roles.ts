// middleware/roles.ts
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
      "/tax-calculator": ["dev", "admin", "manager", "consultant"],
      "/calendar": ["dev", "admin", "manager", "consultant"],
      "/payroll-schedule": ["dev", "admin", "manager", "consultant"],
      "/staff": ["dev", "admin", "manager"],
      "/onboarding": ["dev", "admin", "manager"],
      "/ai-assistant": ["dev", "admin", "manager", "consultant"],
      // Add more rules as needed
    }

    for (const [route, allowedRoles] of Object.entries(accessRules)) {
      if (path.startsWith(route) && !allowedRoles.includes(token?.role as string)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/signin",
    },
  },
)

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/clients/:path*", 
    "/payrolls/:path*", 
    "/settings/:path*", 
    "/developer/:path*",
    "/calendar/:path*",
    "/payroll-schedule/:path*",
    "/staff/:path*",
    "/onboarding/:path*",
    "/tax-calculator/:path*",
    "/ai-assistant/:path*"
  ],
}