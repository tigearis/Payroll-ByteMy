"use client";

import { useQuery } from "@apollo/client";
import {
  FileText,
  DollarSign,
  Building2,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetBillingItemsAdvancedDocument } from "@/domains/billing/graphql/generated/graphql";
import { GetClientsForDropdownDocument } from "@/domains/clients/graphql/generated/graphql";

export default function NewInvoicePage() {
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Fetch approved billing items
  const { data: billingItemsData, loading: itemsLoading } = useQuery(
    GetBillingItemsAdvancedDocument,
    {
      variables: {
        limit: 100,
        offset: 0,
        where: {
          isApproved: { _eq: true },
          invoiceId: { _isNull: true }, // Only uninvoiced items
        },
        orderBy: [{ createdAt: "DESC" }],
      },
      fetchPolicy: "cache-and-network",
    }
  );

  // Fetch clients
  const { data: clientsData, loading: clientsLoading } = useQuery(
    GetClientsForDropdownDocument,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const billingItems = billingItemsData?.billingItems || [];
  const clients = clientsData?.clients || [];

  // Filter items by selected client
  const filteredItems = selectedClient
    ? billingItems.filter(item => item.clientId === selectedClient)
    : billingItems;

  const selectedItemsData = billingItems.filter(item =>
    selectedItems.includes(item.id)
  );

  const totalAmount = selectedItemsData.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Generate Invoice"
        description="Create invoices from approved billing items"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Billing", href: "/billing" },
          { label: "Invoices", href: "/billing/invoices" },
          { label: "New" },
        ]}
        actions={[
          {
            label: "Back to Billing",
            icon: ArrowLeft,
            href: "/billing",
          },
        ]}
      />

      {/* Main Content */}
      <div className="px-0">
        <PermissionGuard action="admin">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Selection Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Client Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Select Client
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedClient}
                    onValueChange={setSelectedClient}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Clients</SelectItem>
                      {clients.map((client: any) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Billing Items Selection */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Available Billing Items
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        disabled={filteredItems.length === 0}
                      >
                        {selectedItems.length === filteredItems.length
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                      <Badge variant="secondary">
                        {filteredItems.length} items available
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {itemsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-500">
                          Loading billing items...
                        </p>
                      </div>
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Available Items
                      </h3>
                      <p className="text-gray-500">
                        {selectedClient
                          ? "No approved, uninvoiced items for this client"
                          : "No approved billing items ready for invoicing"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredItems.map((item: any) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedItems.includes(item.id)
                              ? "border-blue-200 bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                          onClick={() => handleItemToggle(item.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleItemToggle(item.id)}
                            />
                            <div className="flex-1">
                              <div className="font-medium">
                                {item.service?.name || item.description}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.client?.name} • {item.service?.category}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {formatCurrency(item.amount || 0)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.quantity}{" "}
                              {item.service?.billingUnit || "units"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Invoice Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Invoice Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Items:</span>
                    <span className="font-medium">{selectedItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (10%):</span>
                    <span className="font-medium">
                      {formatCurrency(totalAmount * 0.1)}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(totalAmount * 1.1)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Items Preview */}
              {selectedItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Selected Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedItemsData.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="truncate mr-2">
                            {item.service?.name || item.description}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(item.amount || 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full"
                  disabled={selectedItems.length === 0}
                  size="lg"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Generate Invoice
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/billing">Cancel</Link>
                </Button>
              </div>
            </div>
          </div>
        </PermissionGuard>
      </div>
    </div>
  );
}
