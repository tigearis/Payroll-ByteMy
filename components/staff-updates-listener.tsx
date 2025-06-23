import { DocumentNode } from "@apollo/client";

import { RealTimeUpdates } from "@/components/real-time-updates";
import { 
  StaffSubscriptionDocument,
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
    <RealTimeUpdates
      subscription={StaffSubscriptionDocument}
      refetchQueries={refetchQueries}
      showToasts={showToasts}
      {...(onUpdate && { onUpdate })}
    />
  );
}
