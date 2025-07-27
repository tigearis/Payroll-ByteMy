// app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  
  // Only redirect to dashboard if user is authenticated
  if (userId) {
    redirect("/dashboard");
  }
  
  // If not authenticated, redirect to sign-in
  redirect("/sign-in");
}