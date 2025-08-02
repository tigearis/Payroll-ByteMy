import { DocumentNode } from "@apollo/client";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { RealTimeUpdates } from "@/components/real-time-updates";
import { 
  ActiveUsersDocument,
  GetStaffListDocument,
  GetAllUsersListDocument
} from "@/domains/users/graphql/generated/graphql";

/**
 * Specialized component for staff updates
 */
export function StaffUpdatesListener({
  refetchQueries = [GetStaffListDocument, GetAllUsersListDocument],
  showToasts = false,
  onUpdate,
}: {
  refetchQueries?: DocumentNode[];
  showToasts?: boolean;
  onUpdate?: (data: any) => void;
}) {
  return (
    <PermissionGuard resource="staff" action="read">
      <RealTimeUpdates
        subscription={ActiveUsersDocument}
        refetchQueries={refetchQueries}
        showToasts={showToasts}
        {...(onUpdate && { onUpdate })}
      />
    </PermissionGuard>
  );
}
