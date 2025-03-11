import { pgTable, text, boolean, timestamp, integer, uuid, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ✅ Define ENUMs
export const payrollStatusEnum = pgEnum("payroll_status", ["Implementation", "Active", "Inactive"]);

// ✅ Payroll Cycles Table (Foreign Key Table)
export const payrollCycles = pgTable("payroll_cycles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

// ✅ Payroll Date Types Table (Foreign Key Table)
export const payrollDateTypes = pgTable("payroll_date_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

// ✅ Users Table (✅ FIXED & INCLUDED)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("viewer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ✅ Clients Table
export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  contactPerson: text("contact_person").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  active: boolean("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ✅ Staff Table
export const staff = pgTable("staff", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  position: text("position").notNull(),
  active: boolean("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ✅ Fixed Payrolls Table
export const payrolls = pgTable("payrolls", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").notNull().references(() => clients.id),
  name: text("name").notNull(),
  cycleId: uuid("cycle_id").notNull().references(() => payrollCycles.id), // ✅ FIXED: Use foreign key
  dateTypeId: uuid("date_type_id").notNull().references(() => payrollDateTypes.id), // ✅ FIXED: Use foreign key
  dateValue: integer("date_value"),
  primaryConsultantId: uuid("primary_consultant_id").references(() => staff.id),
  backupConsultantId: uuid("backup_consultant_id").references(() => staff.id),
  managerId: uuid("manager_id").references(() => staff.id),
  processingDaysBeforeEft: integer("processing_days_before_eft").notNull().default(2),
  payrollSystem: text("payroll_system"),
  status: payrollStatusEnum("status").default("Implementation").notNull(), // ✅ FIXED: Status remains ENUM
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ✅ Notes Table
export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  userId: uuid("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isImportant: boolean("is_important").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ✅ Relationships (✅ Fully Fixed)
export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
  client: one(clients, {
    fields: [notes.entityId],
    references: [clients.id],
  }),
  payroll: one(payrolls, {
    fields: [notes.entityId],
    references: [payrolls.id],
  }),
}));

// ✅ Payroll Relationships (Fully Fixed)
export const payrollRelations = relations(payrolls, ({ one }) => ({
  client: one(clients, {
    fields: [payrolls.clientId],
    references: [clients.id],
  }),
  cycle: one(payrollCycles, {
    fields: [payrolls.cycleId], // ✅ FIX: Join with `payroll_cycles.id`
    references: [payrollCycles.id],
  }),
  dateType: one(payrollDateTypes, {
    fields: [payrolls.dateTypeId], // ✅ FIX: Join with `payroll_date_types.id`
    references: [payrollDateTypes.id],
  }),
  primaryConsultant: one(staff, {
    fields: [payrolls.primaryConsultantId],
    references: [staff.id],
  }),
  backupConsultant: one(staff, {
    fields: [payrolls.backupConsultantId],
    references: [staff.id],
  }),
  manager: one(staff, {
    fields: [payrolls.managerId],
    references: [staff.id],
  }),
}));

// ✅ Export Schema (Now Includes `users`)
export const schema = {
  users,
  payrolls,
  clients,
  staff,
  notes,
  payrollCycles,
  payrollDateTypes,
};
