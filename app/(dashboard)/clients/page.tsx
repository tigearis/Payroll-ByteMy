// app/(dashboard)/clients/page.tsx
'use client'

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { PlusCircle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSmartPolling } from "@/hooks/usePolling";
import { useUserRole } from "@/hooks/useUserRole";
import { GET_CLIENTS } from "@/graphql/queries/clients/getClientsList"; 
import { Client } from "@/types/interface";
import { ClientsTable } from "@/components/clients-table";

export default function ClientsPage() {
  const { isAdmin, isManager, isDeveloper } = useUserRole();
  
  const { loading, error, data, refetch, startPolling, stopPolling } = useQuery(GET_CLIENTS, {

    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    pollInterval: 60000 // Poll every minute
  });
  
  useSmartPolling({ startPolling, stopPolling, refetch }, { /* options */ });
  
  if (error) return <div className="text-red-500">Error: {error.message}</div>;
  
  const clients = data?.clients || [];

  return (
    <div className="space-y-6">
      {/* Header section as before */}
      
      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>View and manage all your clients in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientsTable clients={clients} isLoading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}