// lib/db.ts
// TODO: This file is not used since the app uses Hasura GraphQL instead of Drizzle ORM
// Commented out to avoid build issues with missing Drizzle schema

/*
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "@/drizzle/schema" // ✅ Import schema correctly

const sql = neon(process.env.POSTGRES_URL!)

export const db = drizzle(sql, { schema }) // ✅ Explicitly define schema
*/
