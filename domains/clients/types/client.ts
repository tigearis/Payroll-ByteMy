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

// Extracted from inline types
export interface ClientExtracted {
  id: string;
  name: string;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  active: boolean;
  payrolls?: Array<{
    id: string;
    name: string;
    status: string;
    active?: boolean;
  }>;
}

export interface ClientsTableProps {
  clients: ClientExtracted[];
  loading?: boolean;
  onRefresh?: () => void;
  visibleColumns?: string[];
  sortField?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
}

export interface ClientCardProps {
  client: {
    id: any;
    name: string;
    contact_email: string;
    contact_person: string;
    contact_phone: string;
  };
  onEdit?: () => void;
  className?: string;
}