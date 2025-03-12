import HasuraRoleGate from "@/components/hasura-role-gate";

export default async function AdminDashboard() {
  return (
    <HasuraRoleGate allowedRoles={["org_admin", "admin"]}>
      <h1>Admin Dashboard</h1>
    </HasuraRoleGate>
  );
}
