import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString();
  
  // Extract all headers
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Extract URL details
  const url = new URL(request.url);
  
  // Extract request details
  const requestDetails = {
    timestamp,
    method: request.method,
    url: request.url,
    pathname: url.pathname,
    searchParams: Object.fromEntries(url.searchParams),
    headers,
    nextUrl: {
      pathname: request.nextUrl.pathname,
      search: request.nextUrl.search,
      origin: request.nextUrl.origin,
      host: request.nextUrl.host,
    },
    geo: (request as any).geo,
    ip: (request as any).ip,
    userAgent: request.headers.get('user-agent'),
  };

  // Environment information
  const envInfo = {
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    vercelUrl: process.env.VERCEL_URL,
    isProduction: process.env.NODE_ENV === 'production',
    hasClerkSecretKey: !!process.env.CLERK_SECRET_KEY,
    hasClerkPublishableKey: !!process.env.CLERK_PUBLISHABLE_KEY,
    clerkPublishableKeyPrefix: process.env.CLERK_PUBLISHABLE_KEY?.substring(0, 20) + '...',
  };

  // Check for Clerk-specific headers
  const clerkHeaders = {
    authorization: headers.authorization,
    'clerk-session-token': headers['clerk-session-token'],
    'x-clerk-session-token': headers['x-clerk-session-token'],
    cookie: headers.cookie,
  };

  // Log everything to server console
  console.log('🐛 DEBUG AUTH ENDPOINT CALLED', {
    timestamp,
    requestDetails,
    envInfo,
    clerkHeaders,
  });

  // Return comprehensive debug information
  return NextResponse.json({
    success: true,
    timestamp,
    message: 'Debug auth endpoint - no authentication required',
    request: requestDetails,
    environment: envInfo,
    clerkHeaders,
    notes: [
      'This endpoint uses NO authentication wrapper',
      'All headers and request details are logged',
      'Check server logs for detailed output',
      'Compare frontend vs curl request differences here',
    ],
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Debug-Endpoint': 'true',
    },
  });
}

export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString();
  
  // Extract all headers
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Try to read body (if any)
  let body = null;
  try {
    const text = await request.text();
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }
  } catch (error) {
    body = { error: 'Could not read body', message: (error as Error).message };
  }

  // Extract URL details
  const url = new URL(request.url);
  
  // Extract request details
  const requestDetails = {
    timestamp,
    method: request.method,
    url: request.url,
    pathname: url.pathname,
    searchParams: Object.fromEntries(url.searchParams),
    headers,
    body,
    nextUrl: {
      pathname: request.nextUrl.pathname,
      search: request.nextUrl.search,
      origin: request.nextUrl.origin,
      host: request.nextUrl.host,
    },
    geo: (request as any).geo,
    ip: (request as any).ip,
    userAgent: request.headers.get('user-agent'),
  };

  // Environment information
  const envInfo = {
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    vercelUrl: process.env.VERCEL_URL,
    isProduction: process.env.NODE_ENV === 'production',
    hasClerkSecretKey: !!process.env.CLERK_SECRET_KEY,
    hasClerkPublishableKey: !!process.env.CLERK_PUBLISHABLE_KEY,
    clerkPublishableKeyPrefix: process.env.CLERK_PUBLISHABLE_KEY?.substring(0, 20) + '...',
  };

  // Check for Clerk-specific headers
  const clerkHeaders = {
    authorization: headers.authorization,
    'clerk-session-token': headers['clerk-session-token'],
    'x-clerk-session-token': headers['x-clerk-session-token'],
    cookie: headers.cookie,
  };

  // Log everything to server console
  console.log('🐛 DEBUG AUTH ENDPOINT CALLED (POST)', {
    timestamp,
    requestDetails,
    envInfo,
    clerkHeaders,
  });

  // Return comprehensive debug information
  return NextResponse.json({
    success: true,
    timestamp,
    message: 'Debug auth endpoint - POST request - no authentication required',
    request: requestDetails,
    environment: envInfo,
    clerkHeaders,
    notes: [
      'This endpoint uses NO authentication wrapper',
      'All headers, body, and request details are logged',
      'Check server logs for detailed output',
      'Compare frontend vs curl request differences here',
    ],
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Debug-Endpoint': 'true',
    },
  });
}