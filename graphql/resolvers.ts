import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { payrolls, clients, staff } from "@/drizzle/schema"

export const resolvers = {
  Query: {
    payrolls: async () => {
      return await db.select().from(payrolls)
    },
    payroll: async (_: any, { id }: { id: string }) => {
      return await db.query.payrolls.findFirst({
        where: eq(payrolls.id, Number.parseInt(id)),
      })
    },
    clients: async () => {
      return await db.select().from(clients)
    },
    client: async (_: any, { id }: { id: string }) => {
      return await db.query.clients.findFirst({
        where: eq(clients.id, Number.parseInt(id)),
      })
    },
    staff: async () => {
      return await db.select().from(staff)
    },
    staffMember: async (_: any, { id }: { id: string }) => {
      return await db.query.staff.findFirst({
        where: eq(staff.id, Number.parseInt(id)),
      })
    },
  },
  Mutation: {
    createPayroll: async (_: any, { input }: { input: any }) => {
      const [newPayroll] = await db.insert(payrolls).values(input).returning()
      return newPayroll
    },
    updatePayroll: async (_: any, { id, input }: { id: string; input: any }) => {
      const [updatedPayroll] = await db
        .update(payrolls)
        .set(input)
        .where(eq(payrolls.id, Number.parseInt(id)))
        .returning()
      return updatedPayroll
    },
    deletePayroll: async (_: any, { id }: { id: string }) => {
      await db.delete(payrolls).where(eq(payrolls.id, Number.parseInt(id)))
      return true
    },
    // Implement similar mutations for clients and staff
  },
  Payroll: {
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
}

