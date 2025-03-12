import ClientHasuraRoleGate from "@/components/client-hasura-role-gate";

export default function ProtectedPage() {
  return (
    <ClientHasuraRoleGate allowedRoles={["admin", "org_admin"]}>
      <h1>Admin Only Content</h1>
    </ClientHasuraRoleGate>
  );
}
