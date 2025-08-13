import { gql } from "@apollo/client";
import { adminApolloClient } from "@/lib/apollo/unified-client";

export class QueryAuditService {
  async createExecutionAudit(
    userId: string,
    queryText: string,
    parameters: Record<string, any>,
    queryType: string,
    status: "success" | "error" | "processing",
    resultCount: number,
    executionTime: number,
    fromCache: boolean,
    errorMessage?: string
  ): Promise<{ id: string; executedAt: string }> {
    try {
      // Create audit entry
      const { data } = await adminApolloClient.mutate({
        mutation: gql`
          mutation CreateQueryExecution(
            $userId: uuid!
            $queryText: String!
            $parameters: jsonb
            $queryType: String!
            $status: String!
            $resultCount: Int
            $executionTime: Int
            $fromCache: Boolean!
            $errorMessage: String
          ) {
            insert_query_executions_one(
              object: {
                user_id: $userId
                query_text: $queryText
                parameters: $parameters
                query_type: $queryType
                status: $status
                result_count: $resultCount
                execution_time: $executionTime
                from_cache: $fromCache
                error_message: $errorMessage
              }
            ) {
              id
              executed_at
            }
          }
        `,
        variables: {
          userId,
          queryText,
          parameters,
          queryType,
          status,
          resultCount,
          executionTime,
          fromCache,
          errorMessage,
        },
      });

      return data.insert_query_executions_one;
    } catch (error) {
      console.error("Error creating query audit:", error);
      // Return a placeholder in case of error to avoid breaking the flow
      return {
        id: "error",
        executedAt: new Date().toISOString(),
      };
    }
  }

  async getExecutionHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<any[]> {
    try {
      const { data } = await adminApolloClient.query({
        query: gql`
          query GetQueryExecutionHistory(
            $userId: String!
            $limit: Int!
            $offset: Int!
          ) {
            query_executions(
              where: { user_id: { _eq: $userId } }
              order_by: { executed_at: desc }
              limit: $limit
              offset: $offset
            ) {
              id
              query_text
              parameters
              query_type
              executed_at
              status
              result_count
              execution_time
              from_cache
              error_message
            }
          }
        `,
        variables: {
          userId,
          limit,
          offset,
        },
        fetchPolicy: "network-only",
      });

      return data.query_executions;
    } catch (error) {
      console.error("Error fetching execution history:", error);
      return [];
    }
  }
}
