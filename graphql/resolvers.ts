// File: graphql/resolvers.ts

import { db } from "@/lib/db"
import { eq, and, or } from "drizzle-orm"
import { payrolls, clients, staff, users } from "@/drizzle/schema"
import { GraphQLError } from 'graphql'
import { checkUserPermission } from "@/lib/permissions"
import { noteResolvers } from "./noteResolvers"

export const resolvers = {
  Query: {
    // Merge existing queries with note queries
    ...noteResolvers.Query,

    payrolls: async (_: any, __: any, context: any) => {
      // Ensure user is authenticated
      if (!context.user) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      // Allow access based on roles
      const allowedRoles = ['admin', 'manager', 'consultant']
      await checkUserPermission(context.user.id, allowedRoles)

      // If user is a consultant, only show their assigned payrolls
      if (context.user.role === 'consultant') {
        return await db.select().from(payrolls).where(
          or(
            eq(payrolls.primary_consultant_id, context.user.id),
            eq(payrolls.backup_consultant_id, context.user.id)
          )
        )
      }

      // Admin and manager can see all payrolls
      return await db.select().from(payrolls)
    },

    payroll: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const allowedRoles = ['admin', 'manager', 'consultant']
      await checkUserPermission(context.user.id, allowedRoles)

      // For consultants, only allow access to their assigned payrolls
      if (context.user.role === 'consultant') {
        const payroll = await db.query.payrolls.findFirst({
          where: and(
            eq(payrolls.id, id),
            or(
              eq(payrolls.primary_consultant_id, context.user.id),
              eq(payrolls.backup_consultant_id, context.user.id)
            )
          )
        })

        if (!payroll) {
          throw new GraphQLError('Payroll not found or unauthorized', {
            extensions: {
              code: 'NOT_FOUND',
              http: { status: 404 }
            }
          })
        }

        return payroll
      }

      // Admin and manager can access any payroll
      return await db.query.payrolls.findFirst({
        where: eq(payrolls.id, id)
      })
    },

    clients: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const allowedRoles = ['admin', 'manager', 'consultant']
      await checkUserPermission(context.user.id, allowedRoles)

      // All allowed roles can view clients
      return await db.select().from(clients)
    },

    client: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const allowedRoles = ['admin', 'manager', 'consultant']
      await checkUserPermission(context.user.id, allowedRoles)

      return await db.query.clients.findFirst({
        where: eq(clients.id, id)
      })
    },

    staff: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const allowedRoles = ['admin', 'manager']
      await checkUserPermission(context.user.id, allowedRoles)

      // Only admin and manager can view staff list
      return await db.select().from(staff)
    },

    staffMember: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const allowedRoles = ['admin', 'manager']
      await checkUserPermission(context.user.id, allowedRoles)

      return await db.query.staff.findFirst({
        where: eq(staff.id, id)
      })
    },
  },

  Mutation: {
    // Merge existing mutations with note mutations
    ...noteResolvers.Mutation,

    createPayroll: async (_: any, { input }: { input: any }, context: any) => {
      if (!context.user) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const allowedRoles = ['admin', 'manager']
      await checkUserPermission(context.user.id, allowedRoles)

      const [newPayroll] = await db.insert(payrolls).values(input).returning()
      return newPayroll
    },

    updatePayroll: async (_: any, { id, input }: { id: string; input: any }, context: any) => {
      if (!context.user) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const allowedRoles = ['admin', 'manager']
      await checkUserPermission(context.user.id, allowedRoles)

      const [updatedPayroll] = await db
        .update(payrolls)
        .set(input)
        .where(eq(payrolls.id, id))
        .returning()
      return updatedPayroll
    },

    // Add more mutations as needed
  },

  // Resolvers for nested relationships
  Payroll: {
    ...noteResolvers.Payroll,
    client: async (parent: any) => {
      return await db.query.clients.findFirst({
        where: eq(clients.id, parent.client_id),
      })
    },
    primaryConsultant: async (parent: any) => {
      if (!parent.primary_consultant_id) return null
      return await db.query.staff.findFirst({
        where: eq(staff.id, parent.primary_consultant_id),
      })
    },
    backupConsultant: async (parent: any) => {
      if (!parent.backup_consultant_id) return null
      return await db.query.staff.findFirst({
        where: eq(staff.id, parent.backup_consultant_id),
      })
    },
    manager: async (parent: any) => {
      if (!parent.manager_id) return null
      return await db.query.staff.findFirst({
        where: eq(staff.id, parent.manager_id),
      })
    },
  },

  Client: {
    ...noteResolvers.Client,
    payrolls: async (parent: any) => {
      return await db.select().from(payrolls).where(eq(payrolls.client_id, parent.id))
    },
  },

  Staff: {
    primaryPayrolls: async (parent: any) => {
      return await db.select().from(payrolls).where(eq(payrolls.primary_consultant_id, parent.id))
    },
    backupPayrolls: async (parent: any) => {
      return await db.select().from(payrolls).where(eq(payrolls.backup_consultant_id, parent.id))
    },
    managedPayrolls: async (parent: any) => {
      return await db.select().from(payrolls).where(eq(payrolls.manager_id, parent.id))
    },
  },

  Note: noteResolvers.Note,
}