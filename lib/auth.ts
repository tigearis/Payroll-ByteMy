// lib/auth.ts
import { auth } from "@clerk/nextjs/server";

export async function getUserSession() {
  const { sessionClaims, userId } = await auth();
  return {
    userId,
    role: sessionClaims?.["x-hasura-default-role"] || "viewer",
  };
}