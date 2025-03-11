// File: graphql/noteResolvers.ts

import { db } from "@/lib/db"
import { eq, and, or } from "drizzle-orm"
import { notes, payrolls, clients, users } from "@/drizzle/schema"
import { GraphQLError } from 'graphql'
import { checkUserPermission } from "@/lib/permissions"

// Helper function to check note ownership or access permissions
const checkNoteAccess = async (userId: string, noteId: string, entityType: 'client' | 'payroll') => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  })

  if (!user) {
    throw new GraphQLError('Unauthorized', {
      extensions: {
        code: 'FORBIDDEN',
        http: { status: 403 }
      }
    })
  }

  // Find the note
  const note = await db.query.notes.findFirst({
    where: and(
      eq(notes.id, noteId),
      eq(notes.entityType, entityType)
    )
  })

  if (!note) {
    throw new GraphQLError('Note not found', {
      extensions: {
        code: 'NOT_FOUND',
        http: { status: 404 }
      }
    })
  }

  // Admin and managers can do anything
  if (['admin', 'manager'].includes(user.role)) {
    return { user, note }
  }

  // Consultant specific logic
  if (user.role === 'consultant') {
    if (entityType === 'payroll') {
      // Check if consultant is assigned to this payroll
      const payroll = await db.query.payrolls.findFirst({
        where: or(
          eq(payrolls.id, note.entityId),
          eq(payrolls.primary_consultant_id, userId),
          eq(payrolls.backup_consultant_id, userId)
        )
      })

      if (payroll) {
        return { user, note }
      }
    }
  }

  // Note owner can always edit their own notes
  if (note.userId === userId) {
    return { user, note }
  }

  throw new GraphQLError('Unauthorized to access this note', {
    extensions: {
      code: 'FORBIDDEN',
      http: { status: 403 }
    }
  })
}

export const noteResolvers = {
  Query: {
    payrollNotes: async (_: any, { payrollId }: any, context: any) => {
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

      return await db.select().from(notes)
        .where(and(
          eq(notes.entityType, 'payroll'),
          eq(notes.entityId, payrollId)
        ))
    },

    clientNotes: async (_: any, { clientId }: any, context: any) => {
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

      return await db.select().from(notes)
        .where(and(
          eq(notes.entityType, 'client'),
          eq(notes.entityId, clientId)
        ))
    }
  },

  Mutation: {
    // Payroll Notes
    addPayrollNote: async (_: any, { payrollId, content, isImportant = false }: any, context: any) => {
      if (!context.user) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const allowedRoles = ['admin', 'manager', 'consultant']
      const user = await checkUserPermission(context.user.id, allowedRoles)

      // For consultants, check if they're assigned to this payroll
      if (user.role === 'consultant') {
        const payroll = await db.query.payrolls.findFirst({
          where: or(
            eq(payrolls.id, payrollId),
            eq(payrolls.primary_consultant_id, context.user.id),
            eq(payrolls.backup_consultant_id, context.user.id)
          )
        })

        if (!payroll) {
          throw new GraphQLError('Unauthorized to add note to this payroll', {
            extensions: {
              code: 'FORBIDDEN',
              http: { status: 403 }
            }
          })
        }
      }

      const [newNote] = await db.insert(notes).values({
        entityType: 'payroll',
        entityId: payrollId,
        userId: context.user.id,
        content,
        isImportant
      }).returning()

      return newNote
    },

    updatePayrollNote: async (_: any, { noteId, content, isImportant }: any, context: any) => {
      if (!context.user) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const { user, note } = await checkNoteAccess(context.user.id, noteId, 'payroll')

      const updateData: { content?: string, isImportant?: boolean, updatedAt?: Date } = {
        updatedAt: new Date()
      }

      if (content !== undefined) updateData.content = content
      if (isImportant !== undefined) updateData.isImportant = isImportant

      const [updatedNote] = await db
        .update(notes)
        .set(updateData)
        .where(eq(notes.id, noteId))
        .returning()

      return updatedNote
    },

    deletePayrollNote: async (_: any, { noteId }: any, context: any) => {
      if (!context.user) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const { user, note } = await checkNoteAccess(context.user.id, noteId, 'payroll')

      await db.delete(notes).where(eq(notes.id, noteId))
      return true
    },

    // Client Notes (similar structure to Payroll Notes)
    addClientNote: async (_: any, { clientId, content, isImportant = false }: any, context: any) => {
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

      const [newNote] = await db.insert(notes).values({
        entityType: 'client',
        entityId: clientId,
        userId: context.user.id,
        content,
        isImportant
      }).returning()

      return newNote
    },

    updateClientNote: async (_: any, { noteId, content, isImportant }: any, context: any) => {
      if (!context.user) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const { user, note } = await checkNoteAccess(context.user.id, noteId, 'client')

      const updateData: { content?: string, isImportant?: boolean, updatedAt?: Date } = {
        updatedAt: new Date()
      }

      if (content !== undefined) updateData.content = content
      if (isImportant !== undefined) updateData.isImportant = isImportant

      const [updatedNote] = await db
        .update(notes)
        .set(updateData)
        .where(eq(notes.id, noteId))
        .returning()

      return updatedNote
    },

    deleteClientNote: async (_: any, { noteId }: any, context: any) => {
      if (!context.user) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const { user, note } = await checkNoteAccess(context.user.id, noteId, 'client')

      await db.delete(notes).where(eq(notes.id, noteId))
      return true
    },
  },

  // Resolvers for nested note queries
  Payroll: {
    notes: async (parent: any) => {
      return await db.select().from(notes)
        .where(and(
          eq(notes.entityType, 'payroll'),
          eq(notes.entityId, parent.id)
        ))
    }
  },

  Client: {
    notes: async (parent: any) => {
      return await db.select().from(notes)
        .where(and(
          eq(notes.entityType, 'client'),
          eq(notes.entityId, parent.id)
        ))
    }
  },

  Note: {
    user: async (parent: any) => {
      return await db.query.users.findFirst({
        where: eq(users.id, parent.userId)
      })
    }
  }
}