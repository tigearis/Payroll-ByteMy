// utils/auth.ts
import { auth } from '@clerk/nextjs/server'

export type HasuraRole = 'org_admin' | 'manager' | 'consultant' | 'viewer'

export async function checkHasuraRole(allowedRoles: HasuraRole | HasuraRole[]): Promise<boolean> {
  const { getToken } = await auth()
  
  try {
    // Get the token with Hasura claims
    const token = await getToken({ template: 'hasura' })
    
    if (!token) return false
    
    // Decode the JWT to get the claims
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    const hasuraClaims = payload['https://hasura.io/jwt/claims']
    
    if (!hasuraClaims) return false
    
    const userRole = hasuraClaims['x-hasura-default-role'] as HasuraRole
    
    if (!userRole) return false
    
    if (Array.isArray(allowedRoles)) {
      return allowedRoles.includes(userRole)
    }
    
    return userRole === allowedRoles
  } catch (error) {
    console.error('Error checking Hasura role:', error)
    return false
  }
}