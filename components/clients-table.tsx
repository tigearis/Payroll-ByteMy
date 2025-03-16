// components/clients-table.tsx
import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Client {
  id: string;
  name: string;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  active: boolean;
  payrolls_aggregate?: {
    aggregate: {
      count: number;
    };
  };
}

interface ClientsTableProps {
  clients: Client[];
  isLoading?: boolean;
}

export function ClientsTable({ clients, isLoading = false }: ClientsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter clients based on search query
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.contact_person && client.contact_person.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.contact_email && client.contact_email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Payrolls</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <Link href={`/clients/${client.id}`} className="text-primary hover:underline">
                    {client.name}
                  </Link>
                </TableCell>
                <TableCell>{client.contact_person || "N/A"}</TableCell>
                <TableCell>{client.contact_email || "N/A"}</TableCell>
                <TableCell>{client.contact_phone || "N/A"}</TableCell>
                <TableCell>{client.payrolls_aggregate?.aggregate?.count || 0}</TableCell>
                <TableCell>
                  <Badge variant={client.active ? "default" : "secondary"}>
                    {client.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No clients found with the current search criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}