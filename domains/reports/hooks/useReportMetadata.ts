import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export interface ReportMetadata {
  availableFields: Record<string, string[]>;
  relationships: Record<string, Record<string, string>>;
  domains: Record<string, any>; // Changed from string[] to Record<string, any>
  fieldTypes: Record<string, string>;
}

// Mock metadata for development
const MOCK_METADATA = {
  domains: {
    payrolls: {
      displayName: "Payrolls",
      description: "Payroll records and processing data",
      fields: [
        {
          name: "id",
          displayName: "ID",
          type: "string",
          description: "Unique identifier",
        },
        {
          name: "employee_id",
          displayName: "Employee",
          type: "string",
          description: "Employee reference",
        },
        {
          name: "period_start",
          displayName: "Period Start",
          type: "date",
          description: "Start date of pay period",
          recommended: true,
        },
        {
          name: "period_end",
          displayName: "Period End",
          type: "date",
          description: "End date of pay period",
          recommended: true,
        },
        {
          name: "gross_amount",
          displayName: "Gross Amount",
          type: "number",
          description: "Gross payment amount",
          recommended: true,
        },
        {
          name: "tax_amount",
          displayName: "Tax Amount",
          type: "number",
          description: "Tax withheld",
          recommended: true,
        },
        {
          name: "net_amount",
          displayName: "Net Amount",
          type: "number",
          description: "Net payment amount",
          recommended: true,
        },
        {
          name: "status",
          displayName: "Status",
          type: "string",
          description: "Processing status",
        },
        {
          name: "created_at",
          displayName: "Created At",
          type: "date",
          description: "Creation timestamp",
        },
        {
          name: "updated_at",
          displayName: "Updated At",
          type: "date",
          description: "Last update timestamp",
        },
      ],
    },
    staff: {
      displayName: "Staff",
      description: "Employee and staff member information",
      fields: [
        {
          name: "id",
          displayName: "ID",
          type: "string",
          description: "Unique identifier",
        },
        {
          name: "first_name",
          displayName: "First Name",
          type: "string",
          description: "First name",
          recommended: true,
        },
        {
          name: "last_name",
          displayName: "Last Name",
          type: "string",
          description: "Last name",
          recommended: true,
        },
        {
          name: "email",
          displayName: "Email",
          type: "string",
          description: "Email address",
          sensitive: true,
        },
        {
          name: "department_id",
          displayName: "Department",
          type: "string",
          description: "Department reference",
        },
        {
          name: "position",
          displayName: "Position",
          type: "string",
          description: "Job position",
        },
        {
          name: "hire_date",
          displayName: "Hire Date",
          type: "date",
          description: "Date of hire",
          recommended: true,
        },
        {
          name: "status",
          displayName: "Status",
          type: "string",
          description: "Employment status",
        },
      ],
    },
    clients: {
      displayName: "Clients",
      description: "Client information",
      fields: [
        {
          name: "id",
          displayName: "ID",
          type: "string",
          description: "Unique identifier",
        },
        {
          name: "name",
          displayName: "Name",
          type: "string",
          description: "Client name",
          recommended: true,
        },
        {
          name: "contact_person",
          displayName: "Contact Person",
          type: "string",
          description: "Primary contact",
        },
        {
          name: "email",
          displayName: "Email",
          type: "string",
          description: "Contact email",
          sensitive: true,
        },
        {
          name: "phone",
          displayName: "Phone",
          type: "string",
          description: "Contact phone",
          sensitive: true,
        },
        {
          name: "active",
          displayName: "Active",
          type: "boolean",
          description: "Active status",
        },
      ],
    },
    leave_requests: {
      displayName: "Leave Requests",
      description: "Employee leave requests",
      fields: [
        {
          name: "id",
          displayName: "ID",
          type: "string",
          description: "Unique identifier",
        },
        {
          name: "employee_id",
          displayName: "Employee",
          type: "string",
          description: "Employee reference",
        },
        {
          name: "start_date",
          displayName: "Start Date",
          type: "date",
          description: "Leave start date",
          recommended: true,
        },
        {
          name: "end_date",
          displayName: "End Date",
          type: "date",
          description: "Leave end date",
          recommended: true,
        },
        {
          name: "type",
          displayName: "Type",
          type: "string",
          description: "Leave type",
          recommended: true,
        },
        {
          name: "status",
          displayName: "Status",
          type: "string",
          description: "Approval status",
          recommended: true,
        },
      ],
    },
  },
  relationships: {
    payrolls: {
      employee_id: "staff.id",
    },
    staff: {
      department_id: "departments.id",
    },
    leave_requests: {
      employee_id: "staff.id",
    },
  },
  fieldTypes: {
    id: "string",
    name: "string",
    email: "string",
    phone: "string",
    date: "date",
    amount: "number",
    status: "string",
    boolean: "boolean",
  },
  availableFields: {
    payrolls: [
      "id",
      "employee_id",
      "period_start",
      "period_end",
      "gross_amount",
      "tax_amount",
      "net_amount",
      "status",
    ],
    staff: [
      "id",
      "first_name",
      "last_name",
      "email",
      "department_id",
      "position",
      "hire_date",
      "status",
    ],
    clients: ["id", "name", "contact_person", "email", "phone", "active"],
    leave_requests: [
      "id",
      "employee_id",
      "start_date",
      "end_date",
      "type",
      "status",
    ],
  },
};

export function useReportMetadata() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [metadata, setMetadata] = useState<ReportMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetadata = async () => {
    try {
      setLoading(true);
      setError(null);

      // Wait for auth to be loaded
      if (!isLoaded) {
        console.log("Auth not yet loaded, waiting...");
        return;
      }

      // Check if user is signed in
      if (!isSignedIn) {
        console.log("User not signed in");
        setError("Authentication required");
        return;
      }

      // For development, use mock data to avoid API issues
      console.log("Using mock metadata for development");
      setMetadata(MOCK_METADATA as ReportMetadata);
      return;

      /* Commented out API call for now
      console.log("Fetching auth token...");
      const token = await getToken();
      console.log("Token received:", token ? "Yes" : "No");

      console.log("Fetching metadata...");
      const response = await fetch("/api/reports/metadata", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Metadata response status:", response.status);
      const data = await response.json();
      console.log("Metadata response data:", data);

      if (!response.ok) {
        if (response.status === 403) {
          setError(
            "You don't have permission to access the reports system. Please contact your administrator."
          );
        } else {
          setError(data.error || "Failed to load report metadata");
        }
        return;
      }

      setMetadata(data);
      */
    } catch (error) {
      console.error("Detailed metadata loading error:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      loadMetadata();
    }
  }, [isLoaded]);

  const refresh = () => {
    loadMetadata();
  };

  return {
    metadata,
    error,
    loading,
    refresh,
  };
}
