// Quick middleware test
import { NextResponse } from "next/server";

export default function middleware(request: any) {
  console.log('Middleware hit:', request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|css|js)$).*)",
  ],
};