/**
 * Client Domain Types
 * Only contains domain-specific types, not core entities
 */

// Re-export core types from main types for domain convenience
export type { Client, ClientExternalSystem } from "@/types/interfaces";

// Domain-specific data transformation type
export interface ClientExtracted {
  id: UUID;
  name: string;
  contactPerson: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  active: boolean;
  payrolls?: Array<{
    id: UUID;
    name: string;
    status: string;
    active?: boolean;
  }>;
}

// ===========================
// Component Props (Domain-Specific)
// ===========================

/**
 * Props for clients table component
 */
export interface ClientsTableProps {
  clients: ClientExtracted[];
  loading?: boolean;
  onRefresh?: () => void;
  visibleColumns?: string[];
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  onSort?: (field: string) => void;
}

/**
 * Props for client card component
 */
export interface ClientCardProps {
  client: {
    id: UUID;
    name: string;
    contactEmail: string;
    contactPerson: string;
    contactPhone: string;
  };
  onEdit?: () => void;
  className?: string;
}