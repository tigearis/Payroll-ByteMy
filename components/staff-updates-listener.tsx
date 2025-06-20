import { gql } from "@apollo/client";
import { RealTimeUpdates } from "@/components/real-time-updates";

// Import extracted GraphQL operations
const STAFF_SUBSCRIPTION = gql`
  subscription staffSubscription {
    users(where: { is_staff: { _eq: true } }) {
      id
      name
      role
      updated_at
    }
  }
`;

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
      subscription={STAFF_SUBSCRIPTION}
      refetchQueries={refetchQueries}
      showToasts={showToasts}
      {...(onUpdate && { onUpdate })}
    />
  );
}
