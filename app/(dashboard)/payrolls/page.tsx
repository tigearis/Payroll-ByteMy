// app/(dashboard)/payrolls/page.tsx - UPDATED VERSION
'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PayrollsMissingDates } from "@/components/payrolls-missing-dates";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";
import { PayrollListCard } from "@/components/payroll-list-card";

export default function PayrollsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAdmin, isManager, isDeveloper, isLoading: roleLoading } = useUserRole();

  useEffect(() => {
    if (roleLoading) {
      const timeout = setTimeout(() => {
        toast.info("Loading payrolls...", {
          duration: 3000,
          closeButton: true,
        });
      }, 2000);
  
      return () => clearTimeout(timeout); // Cleanup timeout when loading state changes
    }
  }, [roleLoading]);

  if (roleLoading) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payrolls</h2>
          <p className="text-muted-foreground">Manage payrolls for your clients</p>
        </div>
        <div className="flex gap-2">
          {(isAdmin || isDeveloper) && <PayrollsMissingDates />}
          {(isAdmin || isManager || isDeveloper) && (
            <Button asChild>
              <Link href="/payrolls/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Payroll
              </Link>
            </Button>
          )}
        </div>
      </div>

      <PayrollListCard
        searchQuery={searchQuery}
        onSearchChange={(query) => setSearchQuery(query)}
      />
    </div>
  );
}