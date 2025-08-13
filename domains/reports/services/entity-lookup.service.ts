import { 
  GetClientsForDropdownDocument,
  GetPayrollsForDropdownDocument,
  GetStaffForDropdownDocument,
  GetClientsForDropdownQuery,
  GetPayrollsForDropdownQuery,
  GetStaffForDropdownQuery
} from "@/domains/reports/graphql/generated/graphql";
import { clientApolloClient } from "@/lib/apollo/unified-client";

export interface EntityOption {
  id: string;
  name: string;
  description?: string;
}

export class EntityLookupService {
  async getClients(): Promise<EntityOption[]> {
    try {
      const { data } = await clientApolloClient.query<GetClientsForDropdownQuery>({
        query: GetClientsForDropdownDocument,
        fetchPolicy: "network-only",
      });

      return data.clients.map((client) => ({
        id: client.id,
        name: client.name,
        description: client.contactPerson
          ? `Contact: ${client.contactPerson}`
          : undefined,
      }));
    } catch (error) {
      console.error("Error fetching clients:", error);
      return [];
    }
  }

  async getPayrolls(): Promise<EntityOption[]> {
    try {
      const { data } = await clientApolloClient.query<GetPayrollsForDropdownQuery>({
        query: GetPayrollsForDropdownDocument,
        fetchPolicy: "network-only",
      });

      return data.payrolls.map((payroll) => ({
        id: payroll.id,
        name: payroll.name,
        description: payroll.client?.name
          ? `Client: ${payroll.client.name}`
          : `Status: ${payroll.status}`,
      }));
    } catch (error) {
      console.error("Error fetching payrolls:", error);
      return [];
    }
  }

  async getStaff(): Promise<EntityOption[]> {
    try {
      const { data } = await clientApolloClient.query<GetStaffForDropdownQuery>({
        query: GetStaffForDropdownDocument,
        fetchPolicy: "network-only",
      });

      return data.users.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        description: `Role: ${user.role}`,
      }));
    } catch (error) {
      console.error("Error fetching staff:", error);
      return [];
    }
  }

  // Generic method to fetch entities by table name
  // This method requires dynamic query construction and should be used sparingly
  // Prefer creating specific typed queries in GraphQL files instead
  async getEntitiesByTable(
    tableName: string,
    idField: string = "id",
    nameField: string = "name",
    descriptionField?: string,
    orderBy: string = nameField,
    limit: number = 100
  ): Promise<EntityOption[]> {
    try {
      // WARNING: This method uses dynamic query construction
      // For production use, prefer creating specific GraphQL queries in .graphql files
      console.warn(`Dynamic query construction used for table: ${tableName}`);
      
      // For now, return empty array and suggest using typed queries instead
      return [];
    } catch (error) {
      console.error(`Error fetching entities from ${tableName}:`, error);
      return [];
    }
  }
}
