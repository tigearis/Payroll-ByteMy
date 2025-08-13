import { useState, useEffect } from "react";
import { EntityOption } from "../services/entity-lookup.service";

export function useEntityLookup(
  entityType: "clients" | "payrolls" | "staff" | "departments" | string
) {
  const [options, setOptions] = useState<EntityOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a mock entity lookup service that returns sample data
  const mockEntityLookup = () => {
    // Return mock data based on entity type
    switch (entityType) {
      case "clients":
        return [
          {
            id: "client-1",
            name: "Acme Corp",
            description: "Contact: John Doe",
          },
          {
            id: "client-2",
            name: "Widget Inc",
            description: "Contact: Jane Smith",
          },
          {
            id: "client-3",
            name: "Example Ltd",
            description: "Contact: Bob Johnson",
          },
        ];
      case "payrolls":
        return [
          {
            id: "payroll-1",
            name: "January 2023",
            description: "Client: Acme Corp",
          },
          {
            id: "payroll-2",
            name: "February 2023",
            description: "Client: Widget Inc",
          },
          {
            id: "payroll-3",
            name: "March 2023",
            description: "Client: Example Ltd",
          },
        ];
      case "staff":
        return [
          { id: "staff-1", name: "John Smith", description: "Role: manager" },
          {
            id: "staff-2",
            name: "Sarah Johnson",
            description: "Role: developer",
          },
          {
            id: "staff-3",
            name: "Michael Brown",
            description: "Role: consultant",
          },
        ];
      case "departments":
        return [
          {
            id: "dept-1",
            name: "Engineering",
            description: "Software development",
          },
          {
            id: "dept-2",
            name: "Finance",
            description: "Financial operations",
          },
          { id: "dept-3", name: "HR", description: "Human resources" },
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    async function fetchOptions() {
      setLoading(true);
      setError(null);

      try {
        // In a real implementation, we'd use the actual service:
        // const entityService = new EntityLookupService();
        // let result: EntityOption[] = [];
        // switch (entityType) {
        //   case "clients":
        //     result = await entityService.getClients();
        //     break;
        //   // etc.
        // }

        // Mock implementation
        const mockData = mockEntityLookup();
        setTimeout(() => {
          setOptions(mockData);
          setLoading(false);
        }, 500); // Simulate network delay
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error(`Error fetching ${entityType}:`, err);
        setLoading(false);
      }
    }

    if (entityType) {
      fetchOptions();
    }
  }, [entityType]);

  return { options, loading, error };
}

// EntityOption is imported from the service file
