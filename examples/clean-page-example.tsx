// Example: Super clean page with app-level ResourceProvider

import { PermissionGuard } from "@/components/auth/permission-guard";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { RESOURCES } from "@/components/auth/resource-context";

export default function BillingPage() {
  return (
    <DashboardLayout resource={RESOURCES.BILLING}>
      <div className="p-6">
        <h1>Billing Dashboard</h1>
        
        {/* No need to specify resource - uses layout context */}
        <PermissionGuard action="read">
          <BillingDashboard />
        </PermissionGuard>
        
        <PermissionGuard action="create">
          <CreateInvoiceButton />
        </PermissionGuard>
        
        <PermissionGuard action="admin">
          <AdminPanel />
        </PermissionGuard>
        
        {/* Override resource when needed */}
        <PermissionGuard resource={RESOURCES.STAFF} action="read">
          <StaffQuickView />
        </PermissionGuard>
      </div>
    </DashboardLayout>
  );
}

// Alternative: Even simpler with auto-detection
export function AutoBillingPage() {
  return (
    <AutoResourceLayout>
      <div className="p-6">
        <h1>Billing Dashboard</h1>
        
        {/* Auto-detects "billing" from /billing/* path */}
        <PermissionGuard action="read">
          <BillingDashboard />
        </PermissionGuard>
      </div>
    </AutoResourceLayout>
  );
}

// Alternative: Pages just return content, layout handles resource
export function PureBillingPage() {
  // Layout wrapper handles ResourceProvider
  return (
    <div className="p-6">
      <h1>Billing Dashboard</h1>
      
      <PermissionGuard action="read">
        <BillingDashboard />
      </PermissionGuard>
      
      <PermissionGuard action="create">
        <CreateInvoiceButton />
      </PermissionGuard>
    </div>
  );
}

// And in your layout file or _app.tsx:
function AppWithResource({ Component, pageProps, resource }) {
  return (
    <ResourceProvider resource={resource}>
      <Component {...pageProps} />
    </ResourceProvider>
  );
}