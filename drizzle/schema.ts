import { pgTable, serial, text, boolean, timestamp, integer } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("viewer"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const payrolls = pgTable("payrolls", {
  id: serial("id").primaryKey(),
  client_id: integer("client_id").notNull(),
  name: text("name").notNull(),
  cycle_id: integer("cycle_id").notNull(),
  date_type_id: integer("date_type_id").notNull(),
  date_value: text("date_value"),
  primary_consultant_id: integer("primary_consultant_id"),
  backup_consultant_id: integer("backup_consultant_id"),
  manager_id: integer("manager_id"),
  processing_days_before_eft: integer("processing_days_before_eft").notNull(),
  active: boolean("active").notNull(),
  created_at: timestamp("created_at").notNull(),
  updated_at: timestamp("updated_at").notNull(),
  payroll_system: text("payroll_system").notNull(),
})

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contact_person: text("contact_person").notNull(),
  contact_email: text("contact_email").notNull(),
  contact_phone: text("contact_phone").notNull(),
  active: boolean("active").notNull(),
  created_at: timestamp("created_at").notNull(),
  updated_at: timestamp("updated_at").notNull(),
})

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  position: text("position").notNull(),
  active: boolean("active").notNull(),
  created_at: timestamp("created_at").notNull(),
  updated_at: timestamp("updated_at").notNull(),
})

export const schema = {
  users,
  payrolls,
  clients,
  staff,
}

