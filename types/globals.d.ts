// types/globals.d.ts
export {}

declare global {
  interface ClerkAuthorization {
    // Define roles that match your Hasura roles
    role: 'org_admin' | 'manager' | 'consultant' | 'viewer'
    
    // Define permissions if needed
    permission: 'manage:users' | 'manage:clients' | 'manage:payrolls' | 'view:reports'
  }
  
  // Define JWT claims structure for Hasura
  interface CustomJwtSessionClaims {
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': string[]
      'x-hasura-default-role': string
      'x-hasura-user-id': string
      'x-hasura-org-id'?: string
    }
    metadata: {
      role?: string
    }
  }
}