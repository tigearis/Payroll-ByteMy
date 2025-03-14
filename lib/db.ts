// lib/db.ts
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "@/drizzle/schema" // ✅ Import schema correctly

const sql = neon(process.env.POSTGRES_URL!)

export const db = drizzle(sql, { schema }) // ✅ Explicitly define schema