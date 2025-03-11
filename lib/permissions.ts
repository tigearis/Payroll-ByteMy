// File: lib/permissions.ts

import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { users } from "@/drizzle/schema"
import { GraphQLError } from 'graphql'

export const checkUserPermission = async (userId: string, requiredRoles: string[]) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  })

  if (!user || !requiredRoles.includes(user.role)) {
    throw new GraphQLError('Unauthorized', {
      extensions: {
        code: 'FORBIDDEN',
        http: { status: 403 }
      }
    })
  }

  return user
}

// Role-based access control helper
export const canAccessEntity = (userRole: string, requiredRoles: string[]) => {
  return requiredRoles.includes(userRole)
}

// Specific role permissions
export const ROLE_PERMISSIONS = {
  dev: {
    canAccessDevPage: true,
    canManageUsers: false,
    canManageClients: false,
    canManagePayrolls: false
  },
  admin: {
    canAccessDevPage: false,
    canManageUsers: true,
    canManageClients: true,
    canManagePayrolls: true,
    canEditAllNotes: true
  },
  manager: {
    canAccessDevPage: false,
    canManageUsers: true,
    canManageClients: true,
    canManagePayrolls: true,
    canEditAllNotes: true
  },
  consultant: {
    canAccessDevPage: false,
    canManageUsers: false,
    canManageClients: false,
    canManagePayrolls: false,
    canEditOwnNotes: true,
    canAddNotesToAssignedPayrolls: true
  },
  viewer: {
    canAccessDevPage: false,
    canManageUsers: false,
    canManageClients: false,
    canManagePayrolls: false,
    canViewOnly: true
  }
}