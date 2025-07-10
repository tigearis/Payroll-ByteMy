// app/(dashboard)/bulk-upload/page.tsx
import { PermissionGuard } from "@/components/auth/permission-guard";
import { BulkUploadInterface } from "@/components/bulk-upload/bulk-upload-interface";

export default function BulkUploadPage() {
  return (
    <div className="container mx-auto py-6">
      <PermissionGuard
        minRole="manager"
        fallback={
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600">
              You need manager or higher permissions to access the bulk upload
              feature.
            </p>
          </div>
        }
      >
        <BulkUploadInterface />
      </PermissionGuard>
    </div>
  );
}
