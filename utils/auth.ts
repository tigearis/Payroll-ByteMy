import { auth } from "@clerk/nextjs/server";

export type HasuraRole = "admin" | "org_admin" | "admin" | "manager" | "user";

export async function checkHasuraRole(allowedRoles: HasuraRole[]) {
  const { sessionClaims } = await auth();

  if (!sessionClaims) return false;

  const userRole = sessionClaims?.["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"];
  return allowedRoles.includes(userRole);
}
