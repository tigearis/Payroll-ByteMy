// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  try {
    // Check authentication and authorization
    const { userId, getToken } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the token to check user role
    const token = await getToken({ template: 'hasura' })
    if (!token) {
      return NextResponse.json({ error: 'Failed to verify permissions' }, { status: 403 })
    }
    
    // Decode the JWT to get the claims
    const tokenParts = token.split('.')
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
    const hasuraClaims = payload['https://hasura.io/jwt/claims']
    const userRole = hasuraClaims?.['x-hasura-default-role']
    
    // Only admins and managers can create users
    if (!['org_admin', 'manager'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }
    
    // Parse request body
    const { email, password, firstName, lastName, role } = await req.json()
    
    // Validate inputs
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    
    // Validate role
    const validRoles = ['org_admin', 'manager', 'consultant', 'viewer']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    
    // Managers can't create admin users
    if (userRole === 'manager' && role === 'org_admin') {
      return NextResponse.json({ error: 'Managers cannot create admin users' }, { status: 403 })
    }
    
    // Create user in Clerk
    const response = await fetch(`${process.env.CLERK_API_URL}/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: [{ email_address: email }],
        password,
        first_name: firstName,
        last_name: lastName,
        public_metadata: { role }
      })
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Failed to create user: ${errorData}`)
    }
    
    const userData = await response.json()
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: userData.id,
        email,
        firstName,
        lastName,
        role
      }
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create user' 
    }, { status: 500 })
  }
}