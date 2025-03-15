// components/payroll-list-card.tsx
import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { GET_PAYROLLS } from "@/graphql/queries/payrolls/getPayrolls";
import { Payroll } from "@/types/interface";
import { useSmartPolling } from "@/hooks/usePolling";

interface PayrollListCardProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function PayrollListCard({
  searchQuery,
  onSearchChange,
}: PayrollListCardProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedPayroll, setSelectedPayroll] = useState("all");
  const [selectedConsultant, setSelectedConsultant] = useState("all");

  // Use polling to periodically refresh data
  const { loading, error, data, startPolling, stopPolling, refetch } = useQuery(GET_PAYROLLS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    pollInterval: 45000  // Poll every 45 seconds
  });
  
  // Use our smart polling hook to manage polling
  useSmartPolling(
    { startPolling, stopPolling, refetch },
    {
      defaultInterval: 45000,  // Poll every 45 seconds
      pauseOnHidden: true,     // Save resources when tab not visible
      refetchOnVisible: true   // Get fresh data when returning to tab
    }
  );

  if (loading) return <div>Loading payrolls...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const payrolls: Payroll[] = data?.payrolls || [];
  
  // Get payrolls filtered by search term (used as base for other filters)
  const searchFilteredPayrolls = payrolls.filter(payroll => {
    const searchTermLower = localSearchQuery.toLowerCase();
    return payroll.name.toLowerCase().includes(searchTermLower) ||
      (payroll.client?.name && 
       payroll.client.name.toLowerCase().includes(searchTermLower)) ||
      (payroll.userByPrimaryConsultantUserId?.name &&
       payroll.userByPrimaryConsultantUserId.name.toLowerCase().includes(searchTermLower));
  });

  // Extract unique clients based on current filters (excluding client filter itself)
  const availableClients = Array.from(
    new Map(
      searchFilteredPayrolls
        .filter(p => {
          // Include if payroll matches the selected consultant
          const isConsultantMatch = selectedConsultant === "all" || 
            (p.userByPrimaryConsultantUserId?.id && 
            p.userByPrimaryConsultantUserId.id.toString() === selectedConsultant);
          
          // Include if payroll matches the selected payroll
          const isPayrollMatch = selectedPayroll === "all" || 
            p.id.toString() === selectedPayroll;
          
          return isConsultantMatch && isPayrollMatch && p.client;
        })
        .map(p => [p.client?.id, { id: p.client?.id, name: p.client?.name }])
    ).values()
  );

  // Extract unique consultants based on current filters (excluding consultant filter itself)
  const availableConsultants = Array.from(
    new Map(
      searchFilteredPayrolls
        .filter(p => {
          // Include if payroll matches the selected client
          const isClientMatch = selectedClient === "all" || 
            (p.client?.id && p.client.id.toString() === selectedClient);
          
          // Include if payroll matches the selected payroll
          const isPayrollMatch = selectedPayroll === "all" || 
            p.id.toString() === selectedPayroll;
          
          return isClientMatch && isPayrollMatch && p.userByPrimaryConsultantUserId;
        })
        .map(p => [
          p.userByPrimaryConsultantUserId?.id, 
          { 
            id: p.userByPrimaryConsultantUserId?.id,
            name: p.userByPrimaryConsultantUserId?.name 
          }
        ])
    ).values()
  );
  
  // Extract unique payrolls based on current filters (excluding payroll filter itself)
  const availablePayrolls = searchFilteredPayrolls
    .filter(p => {
      // Include if payroll matches the selected client
      const isClientMatch = selectedClient === "all" || 
        (p.client?.id && p.client.id.toString() === selectedClient);
      
      // Include if payroll matches the selected consultant
      const isConsultantMatch = selectedConsultant === "all" || 
        (p.userByPrimaryConsultantUserId?.id && 
        p.userByPrimaryConsultantUserId.id.toString() === selectedConsultant);
      
      return isClientMatch && isConsultantMatch;
    });

  // Filter payrolls based on criteria
  const filteredPayrolls = payrolls.filter(payroll => {
    // Text search filter - case insensitive
    const searchTermLower = localSearchQuery.toLowerCase();
    const textMatch = 
      payroll.name.toLowerCase().includes(searchTermLower) ||
      (payroll.client?.name && 
       payroll.client.name.toLowerCase().includes(searchTermLower)) ||
      (payroll.userByPrimaryConsultantUserId?.name &&
       payroll.userByPrimaryConsultantUserId.name.toLowerCase().includes(searchTermLower));
    
    // Client filter
    const isClientMatch = selectedClient === "all" || 
      (payroll.client?.id && payroll.client.id.toString() === selectedClient);
    
    // Payroll filter
    const isPayrollMatch = selectedPayroll === "all" || 
      payroll.id.toString() === selectedPayroll;
    
    // Consultant filter
    const isConsultantMatch = selectedConsultant === "all" || 
      (payroll.userByPrimaryConsultantUserId?.id && 
       payroll.userByPrimaryConsultantUserId.id.toString() === selectedConsultant);
    
    return textMatch && isClientMatch && isPayrollMatch && isConsultantMatch;
  });

  // Function to format name (removes underscores, capitalizes, and keeps DOW/EOM/SOM uppercase)
  const formatName = (name?: string) => {
    if (!name) return "N/A";

    return name
      .replace(/_/g, " ") // Remove underscores
      .split(" ")
      .map((word) => {
        const specialCases = ["DOW", "EOM", "SOM"];
        return specialCases.includes(word.toUpperCase())
          ? word.toUpperCase() // Keep these fully capitalized
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first letter
      })
      .join(" ");
  };

  // Function to format the day of week
  const formatDayOfWeek = (dayValue?: number) => {
    if (dayValue === undefined || dayValue === null) return "N/A";
    
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayValue % 7]; // Ensure it's within 0-6 range
  };

  // Function to format fixed date with ordinal suffix
  const formatFixedDate = (dateValue?: number) => {
    if (dateValue === undefined || dateValue === null) return "N/A";
    
    const suffix = (num: number) => {
      if (num >= 11 && num <= 13) return 'th';
      
      switch (num % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    return `${dateValue}${suffix(dateValue)}`;
  };

  // Function to display the appropriate date value based on date type
  const displayDateValue = (payroll: Payroll) => {
    if (!payroll.payroll_date_type?.name) return "N/A";
    
    const dateTypeName = payroll.payroll_date_type.name.toUpperCase();
    
    if (dateTypeName.includes("DOW") || dateTypeName.includes("WEEK A") || dateTypeName.includes("WEEK B")) {
      return formatDayOfWeek(payroll.date_value);
    } else {
      return formatFixedDate(payroll.date_value);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Payroll List</CardTitle>
          <CardDescription>Overview of all payrolls</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payrolls..."
              className="max-w-sm"
              value={localSearchQuery}
              onChange={(e) => {
                setLocalSearchQuery(e.target.value);
                onSearchChange(e.target.value);
              }}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            <Select 
              value={selectedClient} 
              onValueChange={(value) => {
                setSelectedClient(value);
                // Reset payroll filter if the selected client doesn't have the currently selected payroll
                if (value !== "all" && selectedPayroll !== "all") {
                  const payrollBelongsToClient = payrolls.some(p => 
                    p.id.toString() === selectedPayroll && 
                    p.client?.id.toString() === value
                  );
                  if (!payrollBelongsToClient) {
                    setSelectedPayroll("all");
                  }
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {availableClients.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedPayroll} 
              onValueChange={setSelectedPayroll}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Payroll" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payrolls</SelectItem>
                {availablePayrolls.map((payroll) => (
                  <SelectItem key={payroll.id} value={payroll.id.toString()}>
                    {payroll.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedConsultant} 
              onValueChange={(value) => {
                setSelectedConsultant(value);
                // Reset payroll filter if the selected consultant doesn't work with the currently selected payroll
                if (value !== "all" && selectedPayroll !== "all") {
                  const consultantWorksWithPayroll = payrolls.some(p => 
                    p.id.toString() === selectedPayroll && 
                    p.userByPrimaryConsultantUserId?.id.toString() === value
                  );
                  if (!consultantWorksWithPayroll) {
                    setSelectedPayroll("all");
                  }
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Consultant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Consultants</SelectItem>
                {availableConsultants.map((consultant) => (
                  <SelectItem key={consultant.id} value={consultant.id?.toString() || ""}>
                    {consultant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payroll Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Pay Cycle</TableHead>
              <TableHead>Date Type</TableHead>
              <TableHead>Date Value</TableHead>
              <TableHead>Primary Consultant</TableHead>
              <TableHead>Employee Count</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayrolls.length > 0 ? (
              filteredPayrolls.map((payroll) => (
                <TableRow key={payroll.id}>
                  <TableCell>
                    <Link href={`/payrolls/${payroll.id}`} className="text-primary hover:underline">
                      {payroll.name}
                    </Link>
                  </TableCell>
                  <TableCell>{payroll.client?.name || "N/A"}</TableCell>
                  <TableCell>{formatName(payroll.payroll_cycle?.name)}</TableCell>
                  <TableCell>{formatName(payroll.payroll_date_type?.name)}</TableCell>
                  <TableCell>{displayDateValue(payroll)}</TableCell>
                  <TableCell>{payroll.userByPrimaryConsultantUserId?.name || "N/A"}</TableCell>
                  <TableCell>{payroll.employeeCount !== null && payroll.employee_count !== undefined ? payroll.employee_count : "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={payroll.status === "Active" ? "default" : "secondary"}>
                      {payroll.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No payrolls found with the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
