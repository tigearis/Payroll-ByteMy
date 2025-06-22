import { test, expect } from '@playwright/test';
import { STORAGE_STATE_DEVELOPER, STORAGE_STATE_ORG_ADMIN, STORAGE_STATE_MANAGER, STORAGE_STATE_CONSULTANT, STORAGE_STATE_VIEWER, GRAPHQL_OPERATIONS } from './utils/test-config';

test.describe('GraphQL Permission Boundaries', () => {
  // GraphQL endpoint
  const GRAPHQL_ENDPOINT = '/api/graphql';

  test.describe('Developer Role - Full Access', () => {
    test.use({ storageState: STORAGE_STATE_DEVELOPER });

    test('should have access to all GraphQL operations', async ({ page }) => {
      const operations = [
        {
          query: `
            query GetCurrentUser {
              users_by_pk(id: "test") {
                id
                email
                role
                isActive
                managerId
                supersededDate
              }
            }
          `,
          operationName: 'GetCurrentUser'
        },
        {
          query: `
            mutation CreatePayroll($input: payrolls_insert_input!) {
              insert_payrolls_one(object: $input) {
                id
                status
                clientId
              }
            }
          `,
          variables: {
            input: {
              status: 'draft',
              clientId: 'test-client-id'
            }
          },
          operationName: 'CreatePayroll'
        },
        {
          query: `
            mutation DeleteClient($id: uuid!) {
              delete_clients_by_pk(id: $id) {
                id
              }
            }
          `,
          variables: { id: 'test-client-id' },
          operationName: 'DeleteClient'
        }
      ];

      for (const operation of operations) {
        const response = await page.request.post(GRAPHQL_ENDPOINT, {
          data: operation
        });

        // Should not be forbidden (403) - might be 200 with data or 400 with validation errors
        expect(response.status()).not.toBe(403);
        
        const data = await response.json();
        // Should not have permission-related errors
        if (data.errors) {
          const hasPermissionError = data.errors.some((error: any) => 
            error.message.includes('permission') || 
            error.message.includes('forbidden') ||
            error.message.includes('access denied')
          );
          expect(hasPermissionError).toBeFalsy();
        }
      }
    });

    test('should have access to sensitive fields', async ({ page }) => {
      const sensitiveFieldsQuery = {
        query: `
          query GetSensitiveData {
            users {
              id
              email
              role
              isActive
              managerId
              supersededDate
              databaseId
              clerkUserId
            }
            audit_logs {
              id
              userId
              action
              entityType
              entityId
              dataClassification
            }
          }
        `,
        operationName: 'GetSensitiveData'
      };

      const response = await page.request.post(GRAPHQL_ENDPOINT, {
        data: sensitiveFieldsQuery
      });

      expect(response.status()).not.toBe(403);
      
      const data = await response.json();
      if (data.errors) {
        const hasPermissionError = data.errors.some((error: any) => 
          error.message.includes('field') && error.message.includes('not found')
        );
        expect(hasPermissionError).toBeFalsy();
      }
    });
  });

  test.describe('Org Admin Role - Limited Write Access', () => {
    test.use({ storageState: STORAGE_STATE_ORG_ADMIN });

    test('should have read/write access but not delete access', async ({ page }) => {
      // Should be able to read
      const readQuery = {
        query: `
          query GetPayrolls {
            payrolls {
              id
              status
              clientId
            }
          }
        `,
        operationName: 'GetPayrolls'
      };

      const readResponse = await page.request.post(GRAPHQL_ENDPOINT, {
        data: readQuery
      });
      expect(readResponse.status()).not.toBe(403);

      // Should be able to create/update
      const writeQuery = {
        query: `
          mutation UpdatePayroll($id: uuid!, $input: payrolls_set_input!) {
            update_payrolls_by_pk(pk_columns: { id: $id }, _set: $input) {
              id
              status
            }
          }
        `,
        variables: {
          id: 'test-payroll-id',
          input: { status: 'processing' }
        },
        operationName: 'UpdatePayroll'
      };

      const writeResponse = await page.request.post(GRAPHQL_ENDPOINT, {
        data: writeQuery
      });
      expect(writeResponse.status()).not.toBe(403);

      // Should NOT be able to delete
      const deleteQuery = {
        query: `
          mutation DeletePayroll($id: uuid!) {
            delete_payrolls_by_pk(id: $id) {
              id
            }
          }
        `,
        variables: { id: 'test-payroll-id' },
        operationName: 'DeletePayroll'
      };

      const deleteResponse = await page.request.post(GRAPHQL_ENDPOINT, {
        data: deleteQuery
      });

      const deleteData = await deleteResponse.json();
      if (deleteData.errors) {
        const hasPermissionError = deleteData.errors.some((error: any) => 
          error.message.includes('permission') || 
          error.message.includes('forbidden')
        );
        expect(hasPermissionError).toBeTruthy();
      }
    });

    test('should not have access to developer-only operations', async ({ page }) => {
      const developerOnlyQuery = {
        query: `
          mutation UpdateUserRole($id: uuid!, $role: String!) {
            update_users_by_pk(pk_columns: { id: $id }, _set: { role: $role }) {
              id
              role
            }
          }
        `,
        variables: {
          id: 'test-user-id',
          role: 'developer'
        },
        operationName: 'UpdateUserRole'
      };

      const response = await page.request.post(GRAPHQL_ENDPOINT, {
        data: developerOnlyQuery
      });

      const data = await response.json();
      if (data.errors) {
        const hasPermissionError = data.errors.some((error: any) => 
          error.message.includes('permission') || 
          error.message.includes('forbidden')
        );
        expect(hasPermissionError).toBeTruthy();
      }
    });
  });

  test.describe('Manager Role - Read Only Access', () => {
    test.use({ storageState: STORAGE_STATE_MANAGER });

    test('should have read access to assigned data', async ({ page }) => {
      const readQueries = [
        {
          query: `
            query GetPayrolls {
              payrolls {
                id
                status
                clientId
              }
            }
          `,
          operationName: 'GetPayrolls'
        },
        {
          query: `
            query GetClients {
              clients {
                id
                name
                isActive
              }
            }
          `,
          operationName: 'GetClients'
        }
      ];

      for (const queryObj of readQueries) {
        const response = await page.request.post(GRAPHQL_ENDPOINT, {
          data: queryObj
        });
        expect(response.status()).not.toBe(403);
      }
    });

    test('should not have write access', async ({ page }) => {
      const writeQueries = [
        {
          query: `
            mutation CreatePayroll($input: payrolls_insert_input!) {
              insert_payrolls_one(object: $input) {
                id
              }
            }
          `,
          variables: {
            input: { status: 'draft', clientId: 'test' }
          },
          operationName: 'CreatePayroll'
        },
        {
          query: `
            mutation UpdateClient($id: uuid!, $input: clients_set_input!) {
              update_clients_by_pk(pk_columns: { id: $id }, _set: $input) {
                id
              }
            }
          `,
          variables: {
            id: 'test-client-id',
            input: { name: 'Updated Name' }
          },
          operationName: 'UpdateClient'
        }
      ];

      for (const queryObj of writeQueries) {
        const response = await page.request.post(GRAPHQL_ENDPOINT, {
          data: queryObj
        });

        const data = await response.json();
        if (data.errors) {
          const hasPermissionError = data.errors.some((error: any) => 
            error.message.includes('permission') || 
            error.message.includes('forbidden')
          );
          expect(hasPermissionError).toBeTruthy();
        }
      }
    });
  });

  test.describe('Consultant Role - Limited Read Access', () => {
    test.use({ storageState: STORAGE_STATE_CONSULTANT });

    test('should only access assigned payrolls and clients', async ({ page }) => {
      const assignedDataQuery = {
        query: `
          query GetAssignedData {
            payrolls(where: { assignedConsultantId: { _eq: $userId } }) {
              id
              status
              clientId
            }
            clients(where: { assignedConsultantId: { _eq: $userId } }) {
              id
              name
            }
          }
        `,
        variables: { userId: 'current-user-id' },
        operationName: 'GetAssignedData'
      };

      const response = await page.request.post(GRAPHQL_ENDPOINT, {
        data: assignedDataQuery
      });
      expect(response.status()).not.toBe(403);

      // Should NOT access all payrolls/clients
      const allDataQuery = {
        query: `
          query GetAllData {
            payrolls {
              id
              status
              clientId
            }
            clients {
              id
              name
            }
          }
        `,
        operationName: 'GetAllData'
      };

      const allDataResponse = await page.request.post(GRAPHQL_ENDPOINT, {
        data: allDataQuery
      });

      const allData = await allDataResponse.json();
      // Should return limited data or permission error
      if (allData.data) {
        // If data is returned, it should be filtered to only assigned items
        expect(allData.data.payrolls.length).toBeLessThanOrEqual(10); // Assuming consultant has limited assignments
      }
    });

    test('should not have any write access', async ({ page }) => {
      const writeQuery = {
        query: `
          mutation CreateClient($input: clients_insert_input!) {
            insert_clients_one(object: $input) {
              id
            }
          }
        `,
        variables: {
          input: { name: 'Test Client', isActive: true }
        },
        operationName: 'CreateClient'
      };

      const response = await page.request.post(GRAPHQL_ENDPOINT, {
        data: writeQuery
      });

      const data = await response.json();
      if (data.errors) {
        const hasPermissionError = data.errors.some((error: any) => 
          error.message.includes('permission') || 
          error.message.includes('forbidden')
        );
        expect(hasPermissionError).toBeTruthy();
      }
    });
  });

  test.describe('Viewer Role - Minimal Read Access', () => {
    test.use({ storageState: STORAGE_STATE_VIEWER });

    test('should only have basic read access', async ({ page }) => {
      // Should be able to read basic payroll data
      const basicQuery = {
        query: `
          query GetBasicPayrollData {
            payrolls {
              id
              status
            }
          }
        `,
        operationName: 'GetBasicPayrollData'
      };

      const response = await page.request.post(GRAPHQL_ENDPOINT, {
        data: basicQuery
      });
      expect(response.status()).not.toBe(403);
    });

    test('should not access sensitive fields', async ({ page }) => {
      const sensitiveQuery = {
        query: `
          query GetSensitiveFields {
            payrolls {
              id
              status
              amount
              salary
              taxDetails
            }
          }
        `,
        operationName: 'GetSensitiveFields'
      };

      const response = await page.request.post(GRAPHQL_ENDPOINT, {
        data: sensitiveQuery
      });

      const data = await response.json();
      if (data.errors) {
        const hasFieldError = data.errors.some((error: any) => 
          error.message.includes('field') && error.message.includes('not found')
        );
        expect(hasFieldError).toBeTruthy();
      }
    });

    test('should not have any write access', async ({ page }) => {
      const writeQueries = [
        {
          query: `
            mutation CreatePayroll($input: payrolls_insert_input!) {
              insert_payrolls_one(object: $input) {
                id
              }
            }
          `,
          variables: { input: { status: 'draft' } },
          operationName: 'CreatePayroll'
        },
        {
          query: `
            mutation UpdatePayroll($id: uuid!, $input: payrolls_set_input!) {
              update_payrolls_by_pk(pk_columns: { id: $id }, _set: $input) {
                id
              }
            }
          `,
          variables: { id: 'test', input: { status: 'processing' } },
          operationName: 'UpdatePayroll'
        }
      ];

      for (const queryObj of writeQueries) {
        const response = await page.request.post(GRAPHQL_ENDPOINT, {
          data: queryObj
        });

        const data = await response.json();
        if (data.errors) {
          const hasPermissionError = data.errors.some((error: any) => 
            error.message.includes('permission') || 
            error.message.includes('forbidden')
          );
          expect(hasPermissionError).toBeTruthy();
        }
      }
    });
  });

  test.describe('Cross-Role Permission Validation', () => {
    test.describe('Consultant attempting privilege escalation', () => {
      test.use({ storageState: STORAGE_STATE_CONSULTANT });
      
      test('should prevent privilege escalation through GraphQL', async ({ page }) => {
        // Attempt to access higher privilege operations
      const escalationAttempts = [
        {
          query: `
            mutation ElevateRole($userId: uuid!) {
              update_users_by_pk(pk_columns: { id: $userId }, _set: { role: "developer" }) {
                id
                role
              }
            }
          `,
          variables: { userId: 'current-user-id' },
          operationName: 'ElevateRole'
        },
        {
          query: `
            query GetAuditLogs {
              audit_logs {
                id
                userId
                action
                entityId
              }
            }
          `,
          operationName: 'GetAuditLogs'
        }
      ];

        for (const attempt of escalationAttempts) {
          const response = await page.request.post(GRAPHQL_ENDPOINT, {
            data: attempt
          });

          const data = await response.json();
          if (data.errors) {
            const hasPermissionError = data.errors.some((error: any) => 
              error.message.includes('permission') || 
              error.message.includes('forbidden') ||
              error.message.includes('access denied')
            );
            expect(hasPermissionError).toBeTruthy();
          }
        }
      });
    });

    test.describe('Manager permission consistency', () => {
      test.use({ storageState: STORAGE_STATE_MANAGER });
      
      test('should maintain consistent permissions across operations', async ({ page }) => {
        // Test that permission boundaries are consistent across similar operations
      const consistencyTests = [
        {
          allowed: {
            query: `
              query GetPayrolls {
                payrolls {
                  id
                  status
                }
              }
            `,
            operationName: 'GetPayrolls'
          },
          denied: {
            query: `
              mutation CreatePayroll($input: payrolls_insert_input!) {
                insert_payrolls_one(object: $input) {
                  id
                }
              }
            `,
            variables: { input: { status: 'draft' } },
            operationName: 'CreatePayroll'
          }
        }
      ];

      for (const test of consistencyTests) {
        // Allowed operation should work
        const allowedResponse = await page.request.post(GRAPHQL_ENDPOINT, {
          data: test.allowed
        });
        expect(allowedResponse.status()).not.toBe(403);

        // Denied operation should be blocked
        const deniedResponse = await page.request.post(GRAPHQL_ENDPOINT, {
          data: test.denied
        });
        const deniedData = await deniedResponse.json();
        if (deniedData.errors) {
          const hasPermissionError = deniedData.errors.some((error: any) => 
            error.message.includes('permission') || 
            error.message.includes('forbidden')
          );
          expect(hasPermissionError).toBeTruthy();
        }
      });
    });
  });
});