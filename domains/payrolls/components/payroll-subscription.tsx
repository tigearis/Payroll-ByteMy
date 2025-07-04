// components/payroll-subscription.tsx
import { useSubscription } from "@apollo/client";
import { ApolloQueryResult } from "@apollo/client";
import { PayrollUpdatesDocument } from "@/domains/payrolls/graphql/generated/graphql";

type RefetchFunction = () => Promise<ApolloQueryResult<unknown>>; // Use a more specific type if possible

export const PayrollUpdatesComponent = ({
  refetchPayrolls,
}: {
  refetchPayrolls: RefetchFunction;
}) => {
  useSubscription(PayrollUpdatesDocument, {
    onData: async () => {
      await refetchPayrolls(); // Trigger refetch when subscription data is received
    },
  });

  return null; // This component doesn't need to render anything
};
