"use client";

/**
 * Permission Guard Usage Demonstration
 * 
 * This component demonstrates all the different ways to use the enhanced PermissionGuard:
 * 1. Context-based actions (most common)
 * 2. Resource override with actions
 * 3. Direct permission strings (backwards compatible)
 * 4. Multiple permissions
 * 5. Role-based permissions
 */

import { ReactNode } from "react";
import { 
  PermissionGuard, 
  ResourceProvider, 
  RESOURCES, 
  ACTIONS,
  type ResourceName 
} from "@/components/auth/permission-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Example page resource
const PAGE_RESOURCE = RESOURCES.BILLING;

export function PermissionGuardDemo() {
  return (
    <div className="space-y-6 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Permission Guard Patterns</h1>
        <p className="text-gray-600 mt-2">
          Demonstration of all permission guard usage patterns
        </p>
      </div>

      <ResourceProvider resource={PAGE_RESOURCE}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Pattern 1: Context-based Actions */}
          <DemoCard 
            title="Context-Based Actions" 
            description="Uses page resource context + action"
            resource={PAGE_RESOURCE}
          >
            <div className="space-y-2">
              <PermissionGuard action={ACTIONS.READ}>
                <Button variant="outline" size="sm">View Billing</Button>
              </PermissionGuard>
              
              <PermissionGuard action={ACTIONS.CREATE}>
                <Button variant="outline" size="sm">Create Invoice</Button>
              </PermissionGuard>
              
              <PermissionGuard action={ACTIONS.UPDATE}>
                <Button variant="outline" size="sm">Edit Settings</Button>
              </PermissionGuard>
              
              <PermissionGuard action={ACTIONS.ADMIN}>
                <Button variant="outline" size="sm">Admin Panel</Button>
              </PermissionGuard>
            </div>
          </DemoCard>

          {/* Pattern 2: Resource Override */}
          <DemoCard 
            title="Resource Override" 
            description="Override resource while keeping action pattern"
            resource="staff (override)"
          >
            <div className="space-y-2">
              <PermissionGuard resource={RESOURCES.STAFF} action={ACTIONS.READ}>
                <Button variant="outline" size="sm">View Staff</Button>
              </PermissionGuard>
              
              <PermissionGuard resource={RESOURCES.CLIENTS} action={ACTIONS.CREATE}>
                <Button variant="outline" size="sm">Add Client</Button>
              </PermissionGuard>
              
              <PermissionGuard resource={RESOURCES.PAYROLLS} action={ACTIONS.UPDATE}>
                <Button variant="outline" size="sm">Edit Payroll</Button>
              </PermissionGuard>
            </div>
          </DemoCard>

          {/* Pattern 3: Direct Permissions (Backwards Compatible) */}
          <DemoCard 
            title="Direct Permissions" 
            description="Backwards compatible permission strings"
            resource="direct"
          >
            <div className="space-y-2">
              <PermissionGuard permission="billing.read">
                <Button variant="outline" size="sm">Legacy Read</Button>
              </PermissionGuard>
              
              <PermissionGuard permission="staff.create">
                <Button variant="outline" size="sm">Legacy Create</Button>
              </PermissionGuard>
              
              <PermissionGuard permission="reports.admin">
                <Button variant="outline" size="sm">Legacy Admin</Button>
              </PermissionGuard>
            </div>
          </DemoCard>

          {/* Pattern 4: Multiple Permissions */}
          <DemoCard 
            title="Multiple Permissions" 
            description="Require any or all permissions"
            resource="multiple"
          >
            <div className="space-y-2">
              <PermissionGuard 
                permissions={["billing.read", "billing.create"]} 
                requireAll={false}
              >
                <Button variant="outline" size="sm">Any Permission</Button>
              </PermissionGuard>
              
              <PermissionGuard 
                permissions={["billing.read", "billing.admin"]} 
                requireAll={true}
              >
                <Button variant="outline" size="sm">All Permissions</Button>
              </PermissionGuard>
            </div>
          </DemoCard>

          {/* Pattern 5: Role-Based */}
          <DemoCard 
            title="Role-Based Access" 
            description="Traditional role hierarchy checks"
            resource="roles"
          >
            <div className="space-y-2">
              <PermissionGuard minRole="consultant">
                <Button variant="outline" size="sm">Consultant+</Button>
              </PermissionGuard>
              
              <PermissionGuard minRole="developer">
                <Button variant="outline" size="sm">Developer Only</Button>
              </PermissionGuard>
              
              <PermissionGuard roles={["org_admin", "manager"]}>
                <Button variant="outline" size="sm">Admin or Manager</Button>
              </PermissionGuard>
            </div>
          </DemoCard>

          {/* Pattern 6: Complex Mixed */}
          <DemoCard 
            title="Complex Scenarios" 
            description="Real-world permission combinations"
            resource="complex"
          >
            <div className="space-y-2">
              {/* Billing action with fallback */}
              <PermissionGuard 
                action={ACTIONS.CREATE}
                fallback={<Badge variant="destructive">No Create Access</Badge>}
              >
                <Button variant="outline" size="sm">Create with Fallback</Button>
              </PermissionGuard>
              
              {/* Cross-resource access */}
              <PermissionGuard resource={RESOURCES.STAFF} action={ACTIONS.READ}>
                <PermissionGuard action={ACTIONS.ADMIN}>
                  <Button variant="outline" size="sm">Nested Guards</Button>
                </PermissionGuard>
              </PermissionGuard>
              
              {/* Role + Permission combo */}
              <PermissionGuard minRole="manager">
                <PermissionGuard action={ACTIONS.APPROVE}>
                  <Button variant="outline" size="sm">Manager + Approve</Button>
                </PermissionGuard>
              </PermissionGuard>
            </div>
          </DemoCard>
        </div>
      </ResourceProvider>

      {/* Usage Examples */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">1. Page Setup with Resource Context:</h4>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
{`export const RESOURCE = RESOURCES.BILLING;

<ResourceProvider resource={RESOURCE}>
  <PermissionGuard action="create">
    <CreateButton />
  </PermissionGuard>
</ResourceProvider>`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">2. Resource Override:</h4>  
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
{`<PermissionGuard resource="staff" action="read">
  <StaffWidget />
</PermissionGuard>`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">3. Backwards Compatible:</h4>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
{`<PermissionGuard permission="billing.admin">
  <AdminPanel />
</PermissionGuard>`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for demo cards
function DemoCard({ 
  title, 
  description, 
  resource, 
  children 
}: { 
  title: string; 
  description: string; 
  resource: string | ResourceName; 
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
        <Badge variant="outline" className="w-fit">
          Resource: {resource}
        </Badge>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}