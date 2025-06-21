import { RealTimeUpdates } from "@/components/real-time-updates";
import { StaffSubscriptionDocument } from "@/domains/users/graphql/generated/graphql";

/**
 * Specialized component for staff updates
 */
export function StaffUpdatesListener({
  refetchQueries = ["GET_STAFF_LIST", "GET_ALL_USERS_LIST"],
  showToasts = false,
  onUpdate,
}: {
  refetchQueries?: string[];
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
