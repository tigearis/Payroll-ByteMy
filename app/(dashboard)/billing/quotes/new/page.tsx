"use client";

import { QuoteBuilder } from "@/domains/billing/components/quoting/quote-builder";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewQuotePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/billing/quotes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quotes
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Quote</h1>
        <p className="text-muted-foreground">
          Build a comprehensive quote for a prospective client
        </p>
      </div>
      
      <PermissionGuard permission="billing.create">
        <QuoteBuilder />
      </PermissionGuard>
    </div>
  );
}