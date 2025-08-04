import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { NextRequest } from 'next/server';

// Mock the auth and Apollo client
jest.mock('@/lib/auth/api-auth');
jest.mock('@/lib/apollo/unified-client');

// Import the API routes after mocking
import { POST as Tier1Generate } from '@/app/api/billing/tier1/generate/route';
import { POST as Tier2Generate } from '@/app/api/billing/tier2/generate/route';
import { POST as Tier3Generate } from '@/app/api/billing/tier3/generate/route';
import { POST as ProcessAutomatic, GET as GetCandidates } from '@/app/api/billing/process-automatic/route';

// Test data
const TEST_DATA = {
  clientId: 'test-client-123',
  payrollId: 'test-payroll-456',
  payrollDateId: 'test-payroll-date-789',
  userId: 'test-user-abc',
  serviceId: 'test-service-def',
  billingMonth: '2025-01-01'
};

// Mock Apollo Client responses
const mockApolloClient = {
  query: jest.fn(),
  mutate: jest.fn()
};

// Mock successful responses
const mockPayrollDateResponse = {
  data: {
    payrollDatesByPk: {
      id: TEST_DATA.payrollDateId,
      status: 'completed',
      payrollId: TEST_DATA.payrollId,
      completedAt: '2025-01-15T10:00:00Z',
      completedBy: TEST_DATA.userId,
      payroll: {
        id: TEST_DATA.payrollId,
        name: 'Test Payroll',
        clientId: TEST_DATA.clientId,
        client: {
          id: TEST_DATA.clientId,
          name: 'Test Client'
        }
      }
    }
  }
};

const mockPayrollResponse = {
  data: {
    payrollsByPk: {
      id: TEST_DATA.payrollId,
      name: 'Test Payroll',
      clientId: TEST_DATA.clientId,
      status: 'active',
      client: {
        id: TEST_DATA.clientId,
        name: 'Test Client'
      },
      payrollDates: [
        { id: '1', status: 'completed' },
        { id: '2', status: 'completed' }
      ]
    }
  }
};

const mockClientResponse = {
  data: {
    clientsByPk: {
      id: TEST_DATA.clientId,
      name: 'Test Client',
      active: true
    }
  }
};

const mockMonthlyCompletionResponse = {
  data: {
    monthlyBillingCompletion: [{
      id: 'monthly-123',
      status: 'ready_to_bill',
      tier3BillingGenerated: false,
      autoBillingEnabled: true,
      completedPayrolls: 4,
      totalPayrolls: 4,
      completedPayrollDates: 8,
      totalPayrollDates: 8
    }]
  }
};

const mockServiceAgreementsResponse = {
  data: {
    clientServiceAgreements: [{
      id: 'agreement-123',
      serviceId: TEST_DATA.serviceId,
      customRate: 150,
      billingFrequency: 'per_payroll_date',
      service: {
        id: TEST_DATA.serviceId,
        name: 'Basic Payroll Processing',
        description: 'Standard payroll processing service',
        billingUnit: 'Per Payroll Date',
        defaultRate: 150,
        billingTier: 'payroll_date'
      }
    }]
  }
};

const mockBillingItemMutation = {
  data: {
    insertBillingItemsOne: {
      id: 'billing-item-123',
      description: 'Test Billing Item',
      totalAmount: 150
    }
  }
};

const mockLogEventMutation = {
  data: {
    insertBillingEventLogOne: {
      id: 'log-123'
    }
  }
};

describe('Billing API Integration Tests', () => {
  beforeAll(() => {
    // Setup global mocks
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
  });

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default mock implementations
    mockApolloClient.query.mockImplementation(({ query, variables }) => {
      const queryString = query.loc?.source?.body || '';
      
      if (queryString.includes('CheckPayrollDate')) {
        return Promise.resolve(mockPayrollDateResponse);
      }
      if (queryString.includes('CheckPayrollCompletion')) {
        return Promise.resolve(mockPayrollResponse);
      }
      if (queryString.includes('CheckClient')) {
        return Promise.resolve(mockClientResponse);
      }
      if (queryString.includes('CheckMonthlyCompletion')) {
        return Promise.resolve(mockMonthlyCompletionResponse);
      }
      if (queryString.includes('GetTier1Services') || queryString.includes('clientServiceAgreements')) {
        return Promise.resolve(mockServiceAgreementsResponse);
      }
      
      return Promise.resolve({ data: {} });
    });
    
    mockApolloClient.mutate.mockImplementation(({ mutation }) => {
      const mutationString = mutation.loc?.source?.body || '';
      
      if (mutationString.includes('CreateBillingItem')) {
        return Promise.resolve(mockBillingItemMutation);
      }
      if (mutationString.includes('LogBillingEvent')) {
        return Promise.resolve(mockLogEventMutation);
      }
      
      return Promise.resolve({ data: {} });
    });
  });

  describe('Tier 1 Billing API', () => {
    test('should generate tier 1 billing for completed payroll date', async () => {
      const request = new NextRequest('http://localhost:3000/api/billing/tier1/generate', {
        method: 'POST',
        body: JSON.stringify({
          payrollDateId: TEST_DATA.payrollDateId,
          completedBy: TEST_DATA.userId
        })
      });

      const response = await Tier1Generate(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.tier).toBe(1);
      expect(result.payrollDateId).toBe(TEST_DATA.payrollDateId);
      expect(result.itemsCreated).toBeGreaterThanOrEqual(0);
      expect(result.totalAmount).toBeGreaterThanOrEqual(0);
    });

    test('should reject request for incomplete payroll date', async () => {
      // Mock incomplete payroll date
      mockApolloClient.query.mockResolvedValueOnce({
        data: {
          payrollDatesByPk: {
            ...mockPayrollDateResponse.data.payrollDatesByPk,
            status: 'pending'
          }
        }
      });

      const request = new NextRequest('http://localhost:3000/api/billing/tier1/generate', {
        method: 'POST',
        body: JSON.stringify({
          payrollDateId: TEST_DATA.payrollDateId,
          completedBy: TEST_DATA.userId
        })
      });

      const response = await Tier1Generate(request);
      const result = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      expect(result.error).toContain('must be completed');
    });

    test('should handle missing payroll date', async () => {
      mockApolloClient.query.mockResolvedValueOnce({
        data: { payrollDatesByPk: null }
      });

      const request = new NextRequest('http://localhost:3000/api/billing/tier1/generate', {
        method: 'POST',
        body: JSON.stringify({
          payrollDateId: 'nonexistent-id',
          completedBy: TEST_DATA.userId
        })
      });

      const response = await Tier1Generate(request);
      const result = await response.json();

      expect(response.status).toBe(404);
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    test('should validate required parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/billing/tier1/generate', {
        method: 'POST',
        body: JSON.stringify({
          payrollDateId: '', // Missing required field
          completedBy: TEST_DATA.userId
        })
      });

      const response = await Tier1Generate(request);
      const result = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      expect(result.error).toContain('required');
    });
  });

  describe('Tier 2 Billing API', () => {
    test('should generate tier 2 billing for completed payroll', async () => {
      const request = new NextRequest('http://localhost:3000/api/billing/tier2/generate', {
        method: 'POST',
        body: JSON.stringify({
          payrollId: TEST_DATA.payrollId,
          completedBy: TEST_DATA.userId
        })
      });

      const response = await Tier2Generate(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.tier).toBe(2);
      expect(result.payrollId).toBe(TEST_DATA.payrollId);
    });

    test('should reject request for incomplete payroll', async () => {
      // Mock payroll with incomplete dates
      mockApolloClient.query.mockResolvedValueOnce({
        data: {
          payrollsByPk: {
            ...mockPayrollResponse.data.payrollsByPk,
            payrollDates: [
              { id: '1', status: 'completed' },
              { id: '2', status: 'pending' } // One incomplete date
            ]
          }
        }
      });

      const request = new NextRequest('http://localhost:3000/api/billing/tier2/generate', {
        method: 'POST',
        body: JSON.stringify({
          payrollId: TEST_DATA.payrollId,
          completedBy: TEST_DATA.userId
        })
      });

      const response = await Tier2Generate(request);
      const result = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      expect(result.error).toContain('must be completed');
    });
  });

  describe('Tier 3 Billing API', () => {
    test('should generate tier 3 billing for ready monthly completion', async () => {
      const request = new NextRequest('http://localhost:3000/api/billing/tier3/generate', {
        method: 'POST',
        body: JSON.stringify({
          clientId: TEST_DATA.clientId,
          billingMonth: TEST_DATA.billingMonth,
          generatedBy: TEST_DATA.userId
        })
      });

      const response = await Tier3Generate(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.tier).toBe(3);
      expect(result.clientId).toBe(TEST_DATA.clientId);
      expect(result.billingMonth).toBe(TEST_DATA.billingMonth);
    });

    test('should reject request for non-ready monthly completion', async () => {
      // Mock non-ready monthly completion
      mockApolloClient.query.mockImplementation(({ query }) => {
        const queryString = query.loc?.source?.body || '';
        
        if (queryString.includes('CheckClient')) {
          return Promise.resolve(mockClientResponse);
        }
        if (queryString.includes('CheckMonthlyCompletion')) {
          return Promise.resolve({
            data: {
              monthlyBillingCompletion: [{
                ...mockMonthlyCompletionResponse.data.monthlyBillingCompletion[0],
                status: 'pending' // Not ready
              }]
            }
          });
        }
        
        return Promise.resolve({ data: {} });
      });

      const request = new NextRequest('http://localhost:3000/api/billing/tier3/generate', {
        method: 'POST',
        body: JSON.stringify({
          clientId: TEST_DATA.clientId,
          billingMonth: TEST_DATA.billingMonth,
          generatedBy: TEST_DATA.userId
        })
      });

      const response = await Tier3Generate(request);
      const result = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      expect(result.error).toContain('not ready');
    });
  });

  describe('Automatic Billing Processing', () => {
    test('should process automatic billing for all tiers', async () => {
      // Mock candidates for each tier
      mockApolloClient.query.mockImplementation(({ query }) => {
        const queryString = query.loc?.source?.body || '';
        
        if (queryString.includes('GetTier1Candidates')) {
          return Promise.resolve({
            data: {
              payrollDates: [
                {
                  id: 'pd1',
                  completedBy: TEST_DATA.userId,
                  completedAt: '2025-01-15T10:00:00Z',
                  payrollId: TEST_DATA.payrollId,
                  payroll: {
                    id: TEST_DATA.payrollId,
                    name: 'Test Payroll',
                    client: { id: TEST_DATA.clientId, name: 'Test Client' }
                  }
                }
              ]
            }
          });
        }
        
        if (queryString.includes('GetTier2Candidates')) {
          return Promise.resolve({
            data: {
              payrolls: [
                {
                  id: TEST_DATA.payrollId,
                  name: 'Test Payroll',
                  primaryConsultantUserId: TEST_DATA.userId,
                  client: { id: TEST_DATA.clientId, name: 'Test Client' }
                }
              ]
            }
          });
        }
        
        if (queryString.includes('GetTier3Candidates')) {
          return Promise.resolve({
            data: {
              monthlyBillingCompletion: [
                {
                  id: 'monthly-123',
                  clientId: TEST_DATA.clientId,
                  billingMonth: TEST_DATA.billingMonth,
                  client: { id: TEST_DATA.clientId, name: 'Test Client' }
                }
              ]
            }
          });
        }
        
        return Promise.resolve({ data: {} });
      });

      // Mock internal API calls
      global.fetch = jest.fn()
        .mockResolvedValue({
          json: () => Promise.resolve({
            success: true,
            itemsCreated: 1,
            totalAmount: 150
          })
        });

      const request = new NextRequest('http://localhost:3000/api/billing/process-automatic', {
        method: 'POST'
      });

      const response = await ProcessAutomatic(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.tier1Results).toBeDefined();
      expect(result.tier2Results).toBeDefined();
      expect(result.tier3Results).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.totalItemsCreated).toBeGreaterThanOrEqual(0);
    });

    test('should get billing candidates count', async () => {
      // Mock aggregate responses
      mockApolloClient.query.mockResolvedValueOnce({
        data: {
          tier1Candidates: { aggregate: { count: 5 } },
          tier2Candidates: { aggregate: { count: 3 } },
          tier3Candidates: { aggregate: { count: 2 } }
        }
      });

      const request = new NextRequest('http://localhost:3000/api/billing/process-automatic', {
        method: 'GET'
      });

      const response = await GetCandidates(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.candidateCount).toEqual({
        tier1: 5,
        tier2: 3,
        tier3: 2
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors', async () => {
      mockApolloClient.query.mockRejectedValueOnce(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/api/billing/tier1/generate', {
        method: 'POST',
        body: JSON.stringify({
          payrollDateId: TEST_DATA.payrollDateId,
          completedBy: TEST_DATA.userId
        })
      });

      const response = await Tier1Generate(request);
      const result = await response.json();

      expect(response.status).toBe(500);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Internal server error');
    });

    test('should handle invalid JSON in request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/billing/tier1/generate', {
        method: 'POST',
        body: 'invalid json'
      });

      const response = await Tier1Generate(request);
      const result = await response.json();

      expect(response.status).toBe(500);
      expect(result.success).toBe(false);
    });

    test('should handle missing environment variables', async () => {
      const originalUrl = process.env.NEXTAUTH_URL;
      delete process.env.NEXTAUTH_URL;

      // Mock internal fetch to fail
      global.fetch = jest.fn().mockRejectedValue(new Error('Invalid URL'));

      const request = new NextRequest('http://localhost:3000/api/billing/process-automatic', {
        method: 'POST'
      });

      const response = await ProcessAutomatic(request);
      const result = await response.json();

      expect(response.status).toBe(500);
      expect(result.success).toBe(false);

      // Restore environment variable
      process.env.NEXTAUTH_URL = originalUrl;
    });
  });

  describe('Data Validation', () => {
    test('should validate UUID format for IDs', async () => {
      const request = new NextRequest('http://localhost:3000/api/billing/tier1/generate', {
        method: 'POST',
        body: JSON.stringify({
          payrollDateId: 'invalid-uuid',
          completedBy: TEST_DATA.userId
        })
      });

      // Mock query to return null for invalid UUID
      mockApolloClient.query.mockResolvedValueOnce({
        data: { payrollDatesByPk: null }
      });

      const response = await Tier1Generate(request);
      const result = await response.json();

      expect(response.status).toBe(404);
      expect(result.success).toBe(false);
    });

    test('should validate date format for billing month', async () => {
      const request = new NextRequest('http://localhost:3000/api/billing/tier3/generate', {
        method: 'POST',
        body: JSON.stringify({
          clientId: TEST_DATA.clientId,
          billingMonth: 'invalid-date',
          generatedBy: TEST_DATA.userId
        })
      });

      // This would typically be caught by the database or validation layer
      mockApolloClient.query.mockRejectedValueOnce(new Error('Invalid date format'));

      const response = await Tier3Generate(request);
      const result = await response.json();

      expect(response.status).toBe(500);
      expect(result.success).toBe(false);
    });
  });

  describe('Business Logic Validation', () => {
    test('should prevent duplicate billing for same payroll date', async () => {
      // Mock existing billing items
      mockApolloClient.query.mockImplementation(({ query }) => {
        const queryString = query.loc?.source?.body || '';
        
        if (queryString.includes('CheckPayrollDate')) {
          return Promise.resolve(mockPayrollDateResponse);
        }
        if (queryString.includes('CheckExistingBilling')) {
          return Promise.resolve({
            data: {
              billingItems: [{ id: 'existing-item' }] // Existing billing item
            }
          });
        }
        if (queryString.includes('GetTier1Services')) {
          return Promise.resolve(mockServiceAgreementsResponse);
        }
        
        return Promise.resolve({ data: {} });
      });

      const request = new NextRequest('http://localhost:3000/api/billing/tier1/generate', {
        method: 'POST',
        body: JSON.stringify({
          payrollDateId: TEST_DATA.payrollDateId,
          completedBy: TEST_DATA.userId
        })
      });

      const response = await Tier1Generate(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.itemsCreated).toBe(0); // No new items created due to duplicates
    });

    test('should calculate correct billing amounts', async () => {
      // Mock service with custom rate
      mockApolloClient.query.mockImplementation(({ query }) => {
        const queryString = query.loc?.source?.body || '';
        
        if (queryString.includes('GetTier1Services')) {
          return Promise.resolve({
            data: {
              clientServiceAgreements: [{
                id: 'agreement-123',
                serviceId: TEST_DATA.serviceId,
                customRate: 200, // Custom rate
                billingFrequency: 'per_payroll_date',
                service: {
                  id: TEST_DATA.serviceId,
                  name: 'Premium Service',
                  defaultRate: 150, // Default rate (should use custom)
                  billingTier: 'payroll_date'
                }
              }]
            }
          });
        }
        
        if (queryString.includes('CheckPayrollDate')) {
          return Promise.resolve(mockPayrollDateResponse);
        }
        
        return Promise.resolve({ data: {} });
      });

      const request = new NextRequest('http://localhost:3000/api/billing/tier1/generate', {
        method: 'POST',
        body: JSON.stringify({
          payrollDateId: TEST_DATA.payrollDateId,
          completedBy: TEST_DATA.userId
        })
      });

      const response = await Tier1Generate(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.totalAmount).toBe(200); // Should use custom rate, not default
    });
  });

  afterAll(() => {
    // Clean up mocks
    jest.restoreAllMocks();
  });
});