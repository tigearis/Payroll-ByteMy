import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DeveloperLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { sessionClaims } = await auth();
  
  // Extract role from JWT claims
  const userRole = sessionClaims?.["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"] as string | undefined;
  
  // Only allow developers
  if (!userRole || userRole !== "developer") {
    redirect("/");
  }

  return <>{children}</>;
}