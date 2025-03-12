export {}

declare global {
  type HasuraRole = "admin" | "org_admin" | "admin" | "manager" | "user";

  interface ClerkAuthorization {
    permission: "org:holiday:sync" | "org:holiday:view" | "org:holiday:manage";
    role: HasuraRole;
  }
}