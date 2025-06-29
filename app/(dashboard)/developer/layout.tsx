import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { getSessionClaims } from "@/lib/auth/token-utils";

export default async function DeveloperLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Use centralized session claims utility
  const { role: userRole, error } = await getSessionClaims();
  
  // Only allow developers
  if (!userRole || userRole !== "developer") {
    redirect("/");
  }

  return <>{children}</>;
}