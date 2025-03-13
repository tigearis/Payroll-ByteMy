// components/hasura-role-gate.tsx
import { ReactNode } from 'react'
import { checkHasuraRole, HasuraRole } from '@/lib/auth'

type HasuraRoleGateProps = {
  children: ReactNode
  allowedRoles: HasuraRole[]
  fallback?: ReactNode
}

export default async function HasuraRoleGate({ 
  children, 
  allowedRoles,
  fallback = <div>You dont have permission to view this content</div>
}: HasuraRoleGateProps) {
  const hasPermission = await checkHasuraRole(allowedRoles)
  
  if (!hasPermission) {
    return fallback
  }
  
  return <>{children}</>
}