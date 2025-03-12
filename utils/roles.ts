// utils/roles.ts
import { auth } from '@clerk/nextjs/server'

export type Role = 'org_admin' | 'manager' | 'consultant' | 'viewer'

export async function checkRole(role: Role | Role[]): Promise<boolean> {
  const { sessionClaims } = await auth()
  const userRole = sessionClaims?.metadata?.role as Role | undefined
  
  if (!userRole) return false
  
  if (Array.isArray(role)) {
    return role.includes(userRole)
  }
  
  return userRole === role
}