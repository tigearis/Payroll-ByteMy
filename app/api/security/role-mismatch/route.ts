/**
 * API endpoint for handling role mismatch reports from client components
 */

import { NextRequest, NextResponse } from 'next/server';
import { roleSecurityMonitor } from '@/lib/security/role-monitoring';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Convert timestamp back to Date object
    const event = {
      ...data,
      timestamp: new Date(data.timestamp),
    };
    
    // Use server-side role monitoring
    await roleSecurityMonitor.monitorRoleMismatch(event);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to process role mismatch report:', error);
    return NextResponse.json(
      { error: 'Failed to process role mismatch report' },
      { status: 500 }
    );
  }
}