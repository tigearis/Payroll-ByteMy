// components/client-hasura-role-gate.tsx
"use client"

import { useAuth } from '@clerk/nextjs'
import { ReactNode, useState, useEffect } from 'react'
import { HasuraRole } from '@/lib/auth'

type ClientHasuraRoleGateProps = {
  children: ReactNode
  allowedRoles: HasuraRole[]
  fallback?: ReactNode
}

export default function ClientHasuraRoleGate({ 
  children, 
  allowedRoles,
  fallback = <div>You dont have permission to view this content</div>
}: ClientHasuraRoleGateProps) {
  const { isLoaded, getToken } = useAuth()
  const [hasPermission, setHasPermission] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  
  useEffect(() => {
    async function checkRole() {
      if (!isLoaded) return
      
      try {
        // Get the token with Hasura claims
        const token = await getToken({ template: 'hasura' })
        
        if (!token) {
          setHasPermission(false)
          return
        }
        
        // Decode the JWT to get the claims
        const payload = JSON.parse(atob(token.split('.')[1]))
        const hasuraClaims = payload['https://hasura.io/jwt/claims']
        
        if (!hasuraClaims) {
          setHasPermission(false)
          return
        }
        
        const userRole = hasuraClaims['x-hasura-default-role'] as HasuraRole
        
        setHasPermission(allowedRoles.includes(userRole))
      } catch (error) {
        console.error('Error checking Hasura role:', error)
        setHasPermission(false)
      } finally {
        setIsChecking(false)
      }
    }
    
    checkRole()
  }, [isLoaded, getToken, allowedRoles])
  
  // Handle loading state
  if (!isLoaded || isChecking) {
    return <div>Loading...</div>
  }
  
  if (!hasPermission) {
    return fallback
  }
  
  return <>{children}</>
}