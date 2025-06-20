/**
 * Client Domain Types
 */

export interface Client {
  id: string;
  name: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;

  // Relationships
  payrolls?: import("../../payrolls/types").Payroll[];
}

export type ClientExternalSystem = {
  id: string;
  clientId: string;
  systemId: string;
  systemClientId?: string;

  // Relationships
  client: Client;
};