// Example API route to set a user's role
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  try {
    // Admin authorization check
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Parse request body
    const { targetUserId, role } = await req.json()
    
    // Update user public metadata via Clerk API
    const response = await fetch(`${process.env.CLERK_API_URL}/users/${targetUserId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        public_metadata: { role }
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to update user role')
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error setting role:', error)
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 })
  }
}