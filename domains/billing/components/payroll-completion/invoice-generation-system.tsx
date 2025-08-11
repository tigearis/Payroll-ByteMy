"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import { 
  FileText,
  Plus,
  Edit,
  Trash2,
  Send,
  Download,
  Eye,
  Check,
  X,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Users,
  Building,
  Calculator,
  Mail,
  Printer
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// GraphQL Queries
const GET_PAYROLL_INVOICES = gql`
  query GetPayrollInvoices($payrollDateId: uuid!) {
    invoices(
      where: { payroll_date_id: { _eq: $payrollDateId } }
      order_by: { created_at: desc }
    ) {
      id
      payroll_date_id
      invoice_number
      invoice_date
      due_date
      subtotal_amount
      tax_amount
      total_amount
      status
      approval_status
      approved_by_user_id
      sent_at
      paid_at
      notes
      payment_terms
      created_at
      updated_at
      payroll_date {
        id
        payroll {
          id
          name
          client {
            id
            name
            billing_contact_email
            billing_address
          }
        }
      }
      created_by_user {
        id
        computed_name
      }
      approved_by_user {
        id
        computed_name
      }
      invoice_line_items {
        id
        description
        service_code
        quantity
        unit_rate
        line_total
        billing_item_id
        billing_item {
          id
          service {
            name
            category
          }
        }
      }
    }
  }
`;

const GET_INVOICE_GENERATION_DATA = gql`
  query GetInvoiceGenerationData($payrollDateId: uuid!) {
    payrollDates(where: { id: { _eq: $payrollDateId } }) {
      id
      status
      payroll {
        id
        name
        client {
          id
          name
          billing_contact_email
          billing_address
          payment_terms_days
        }
      }
    }
    
    # Get approved billing items ready for invoicing
    billing_items(
      where: { 
        payroll_date_id: { _eq: $payrollDateId }
        approval_status: { _eq: "approved" }
        invoice_line_item: { _is_null: true }  # Not yet invoiced
      }
      order_by: { service_code: asc }
    ) {
      id
      service_code
      description
      quantity
      rate
      total_amount
      billing_tier
      service {
        id
        name
        category
      }
      time_entry {
        id
        staff_user {
          computed_name
        }
      }
    }
    
    # Get any service overrides that affect billing
    payroll_service_overrides(
      where: { 
        payroll_date_id: { _eq: $payrollDateId }
        is_approved: { _eq: true }
      }
    ) {
      id
      service_id
      override_rate
      override_reason
      service {
        name
      }
    }
  }
`;

const GET_INVOICE_STATISTICS = gql`
  query GetInvoiceStatistics($payrollDateId: uuid!) {
    invoicesAggregate: invoices_aggregate(
      where: { payroll_date_id: { _eq: $payrollDateId } }
    ) {
      aggregate {
        count
        sum {
          total_amount
        }
      }
    }
    
    draftInvoicesAggregate: invoices_aggregate(
      where: { 
        payroll_date_id: { _eq: $payrollDateId }
        status: { _eq: "draft" }
      }
    ) {
      aggregate {
        count
        sum {
          total_amount
        }
      }
    }
    
    sentInvoicesAggregate: invoices_aggregate(
      where: { 
        payroll_date_id: { _eq: $payrollDateId }
        status: { _eq: "sent" }
      }
    ) {
      aggregate {
        count
        sum {
          total_amount
        }
      }
    }
    
    paidInvoicesAggregate: invoices_aggregate(
      where: { 
        payroll_date_id: { _eq: $payrollDateId }
        status: { _eq: "paid" }
      }
    ) {
      aggregate {
        count
        sum {
          total_amount
        }
      }
    }
  }
`;

const GENERATE_INVOICE = gql`
  mutation GenerateInvoice($input: GenerateInvoiceInput!) {
    generateInvoice(input: $input) {
      success
      invoice {
        id
        invoice_number
        total_amount
      }
      errors
    }
  }
`;

const UPDATE_INVOICE = gql`
  mutation UpdateInvoice($id: uuid!, $input: invoices_set_input!) {
    update_invoices_by_pk(pk_columns: { id: $id }, _set: $input) {
      id
      status
      approval_status
      total_amount
    }
  }
`;

const APPROVE_INVOICE = gql`
  mutation ApproveInvoice($id: uuid!, $userId: uuid!) {
    update_invoices_by_pk(
      pk_columns: { id: $id }
      _set: { 
        approval_status: "approved"
        approved_by_user_id: $userId
      }
    ) {
      id
      approval_status
      approved_by_user {
        computed_name
      }
    }
  }
`;

const SEND_INVOICE = gql`
  mutation SendInvoice($id: uuid!) {
    update_invoices_by_pk(
      pk_columns: { id: $id }
      _set: { 
        status: "sent"
        sent_at: "now()"
      }
    ) {
      id
      status
      sent_at
    }
  }
`;

const DELETE_INVOICE = gql`
  mutation DeleteInvoice($id: uuid!) {
    delete_invoices_by_pk(id: $id) {
      id
      invoice_number
    }
  }
`;

// Types
interface Invoice {
  id: string;
  payroll_date_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  subtotal_amount: number;
  tax_amount?: number;
  total_amount: number;
  status: string;
  approval_status: string;
  approved_by_user_id?: string;
  sent_at?: string;
  paid_at?: string;
  notes?: string;
  payment_terms?: string;
  created_at: string;
  updated_at: string;
  payroll_date: {
    id: string;
    payroll: {
      id: string;
      name: string;
      client: {
        id: string;
        name: string;
        billing_contact_email?: string;
        billing_address?: string;
      };
    };
  };
  created_by_user?: {
    id: string;
    computed_name: string;
  };
  approved_by_user?: {
    id: string;
    computed_name: string;
  };
  invoice_line_items: InvoiceLineItem[];
}

interface InvoiceLineItem {
  id: string;
  description: string;
  service_code?: string;
  quantity: number;
  unit_rate: number;
  line_total: number;
  billing_item_id?: string;
  billing_item?: {
    id: string;
    service?: {
      name: string;
      category: string;
    };
  };
}

interface BillingItem {
  id: string;
  service_code?: string;
  description: string;
  quantity: number;
  rate: number;
  total_amount: number;
  billing_tier: string;
  service?: {
    id: string;
    name: string;
    category: string;
  };
  time_entry?: {
    id: string;
    staff_user: {
      computed_name: string;
    };
  };
}

interface ServiceOverride {
  id: string;
  service_id: string;
  override_rate: number;
  override_reason: string;
  service: {
    name: string;
  };
}

interface InvoiceFormData {
  invoice_date: string;
  due_date: string;
  payment_terms?: string;
  notes?: string;
  selected_billing_items: string[];
  tax_rate?: number;
}

interface InvoiceGenerationSystemProps {
  payrollDateId: string;
  canApprove?: boolean;
  currentUserId?: string;
}

export function InvoiceGenerationSystem({ 
  payrollDateId,
  canApprove = false,
  currentUserId = "00000000-0000-0000-0000-000000000000"
}: InvoiceGenerationSystemProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    selected_billing_items: [],
    tax_rate: 10 // Default GST rate
  });

  // GraphQL hooks
  const { data: invoicesData, loading: invoicesLoading, refetch } = useQuery(GET_PAYROLL_INVOICES, {
    variables: { payrollDateId }
  });
  
  const { data: generationData } = useQuery(GET_INVOICE_GENERATION_DATA, {
    variables: { payrollDateId }
  });
  
  const { data: statsData } = useQuery(GET_INVOICE_STATISTICS, {
    variables: { payrollDateId }
  });

  const [generateInvoice] = useMutation(GENERATE_INVOICE);
  const [updateInvoice] = useMutation(UPDATE_INVOICE);
  const [approveInvoice] = useMutation(APPROVE_INVOICE);
  const [sendInvoice] = useMutation(SEND_INVOICE);
  const [deleteInvoice] = useMutation(DELETE_INVOICE);

  const invoices: Invoice[] = invoicesData?.invoices || [];
  const payrollDate = generationData?.payrollDates?.[0];
  const availableBillingItems: BillingItem[] = generationData?.billing_items || [];
  const serviceOverrides: ServiceOverride[] = generationData?.payroll_service_overrides || [];

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      if (statusFilter === "all") return true;
      return invoice.status === statusFilter;
    });
  }, [invoices, statusFilter]);

  // Statistics
  const totalInvoices = statsData?.invoicesAggregate?.aggregate?.count || 0;
  const totalInvoiceAmount = statsData?.invoicesAggregate?.aggregate?.sum?.total_amount || 0;
  const draftInvoices = statsData?.draftInvoicesAggregate?.aggregate?.count || 0;
  const sentInvoices = statsData?.sentInvoicesAggregate?.aggregate?.count || 0;
  const paidInvoices = statsData?.paidInvoicesAggregate?.aggregate?.count || 0;
  const draftAmount = statsData?.draftInvoicesAggregate?.aggregate?.sum?.total_amount || 0;
  const sentAmount = statsData?.sentInvoicesAggregate?.aggregate?.sum?.total_amount || 0;
  const paidAmount = statsData?.paidInvoicesAggregate?.aggregate?.sum?.total_amount || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
      case "sent": return "bg-blue-100 text-blue-800";
      case "paid": return "bg-green-100 text-green-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-orange-100 text-orange-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateSelectedTotal = () => {
    const selectedItems = availableBillingItems.filter(item => 
      formData.selected_billing_items.includes(item.id)
    );
    const subtotal = selectedItems.reduce((sum, item) => sum + item.total_amount, 0);
    const taxAmount = formData.tax_rate ? (subtotal * formData.tax_rate / 100) : 0;
    return {
      subtotal,
      taxAmount,
      total: subtotal + taxAmount
    };
  };

  const handleGenerateInvoice = async () => {
    try {
      if (formData.selected_billing_items.length === 0) {
        toast.error("Please select at least one billing item");
        return;
      }

      const { subtotal, taxAmount, total } = calculateSelectedTotal();

      const result = await generateInvoice({
        variables: {
          input: {
            payrollDateId,
            invoiceDate: formData.invoice_date,
            dueDate: formData.due_date,
            subtotalAmount: subtotal,
            taxAmount: taxAmount,
            totalAmount: total,
            paymentTerms: formData.payment_terms,
            notes: formData.notes,
            billingItemIds: formData.selected_billing_items,
            createdBy: currentUserId
          }
        }
      });

      if (result.data?.generateInvoice?.success) {
        const invoice = result.data.generateInvoice.invoice;
        toast.success(`Invoice ${invoice.invoice_number} generated successfully ($${invoice.total_amount.toFixed(2)})`);
        
        setIsGenerateDialogOpen(false);
        setFormData({
          invoice_date: new Date().toISOString().split('T')[0],
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          selected_billing_items: [],
          tax_rate: 10
        });
        refetch();
      } else {
        toast.error("Failed to generate invoice");
      }
    } catch (error: any) {
      toast.error(`Failed to generate invoice: ${error.message}`);
    }
  };

  const handleApproveInvoice = async (invoice: Invoice) => {
    if (!canApprove) {
      toast.error("You don't have permission to approve invoices");
      return;
    }

    try {
      await approveInvoice({
        variables: {
          id: invoice.id,
          userId: currentUserId
        }
      });

      toast.success(`Invoice ${invoice.invoice_number} approved`);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to approve invoice: ${error.message}`);
    }
  };

  const handleSendInvoice = async (invoice: Invoice) => {
    if (invoice.approval_status !== "approved") {
      toast.error("Invoice must be approved before sending");
      return;
    }

    try {
      await sendInvoice({
        variables: { id: invoice.id }
      });

      toast.success(`Invoice ${invoice.invoice_number} sent to client`);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to send invoice: ${error.message}`);
    }
  };

  const handleDeleteInvoice = async (invoice: Invoice) => {
    if (!confirm(`Delete invoice ${invoice.invoice_number}? This will release the billing items for re-invoicing.`)) {
      return;
    }

    try {
      await deleteInvoice({
        variables: { id: invoice.id }
      });

      toast.success(`Invoice ${invoice.invoice_number} deleted`);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to delete invoice: ${error.message}`);
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewDialogOpen(true);
  };

  const InvoiceGenerationForm = () => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="invoice_date">Invoice Date *</Label>
          <Input
            id="invoice_date"
            type="date"
            value={formData.invoice_date}
            onChange={(e) => setFormData(prev => ({ ...prev, invoice_date: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="due_date">Due Date *</Label>
          <Input
            id="due_date"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="payment_terms">Payment Terms</Label>
          <Select 
            value={formData.payment_terms || ""} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, payment_terms: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="net_7">Net 7 days</SelectItem>
              <SelectItem value="net_14">Net 14 days</SelectItem>
              <SelectItem value="net_30">Net 30 days</SelectItem>
              <SelectItem value="net_60">Net 60 days</SelectItem>
              <SelectItem value="due_on_receipt">Due on receipt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tax_rate">Tax Rate (%)</Label>
          <Input
            id="tax_rate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.tax_rate || ""}
            onChange={(e) => {
              const newFormData = { ...formData };
              if (e.target.value) {
                newFormData.tax_rate = parseFloat(e.target.value);
              } else {
                delete newFormData.tax_rate;
              }
              setFormData(newFormData);
            }}
            placeholder="10.00"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Invoice Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ""}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes for the invoice"
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Select Billing Items *</Label>
          <div className="text-sm text-muted-foreground">
            {availableBillingItems.length} items available
          </div>
        </div>
        
        {availableBillingItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No approved billing items available for invoicing</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg">
            {availableBillingItems.map(item => (
              <div key={item.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.selected_billing_items.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        selected_billing_items: [...prev.selected_billing_items, item.id]
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        selected_billing_items: prev.selected_billing_items.filter(id => id !== item.id)
                      }));
                    }
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.service_code} • {item.service?.category}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${item.total_amount.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.quantity} × ${item.rate.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  {item.time_entry && (
                    <div className="text-xs text-blue-600 mt-1">
                      Time entry by {item.time_entry.staff_user.computed_name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {formData.selected_billing_items.length > 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Invoice Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${calculateSelectedTotal().subtotal.toFixed(2)}</span>
            </div>
            {formData.tax_rate && (
              <div className="flex justify-between">
                <span>Tax ({formData.tax_rate}%):</span>
                <span>${calculateSelectedTotal().taxAmount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-medium text-green-900">
              <span>Total:</span>
              <span>${calculateSelectedTotal().total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const InvoiceViewDialog = () => {
    if (!selectedInvoice) return null;

    return (
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Invoice Details</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Number:</strong> {selectedInvoice.invoice_number}</div>
              <div><strong>Date:</strong> {new Date(selectedInvoice.invoice_date).toLocaleDateString()}</div>
              <div><strong>Due Date:</strong> {new Date(selectedInvoice.due_date).toLocaleDateString()}</div>
              <div><strong>Payment Terms:</strong> {selectedInvoice.payment_terms || "N/A"}</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Client Information</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Name:</strong> {selectedInvoice.payroll_date.payroll.client.name}</div>
              <div><strong>Email:</strong> {selectedInvoice.payroll_date.payroll.client.billing_contact_email || "N/A"}</div>
              {selectedInvoice.payroll_date.payroll.client.billing_address && (
                <div><strong>Address:</strong> {selectedInvoice.payroll_date.payroll.client.billing_address}</div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Line Items</h4>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Service Code</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Rate</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedInvoice.invoice_line_items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.service_code || "-"}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.unit_rate.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.line_total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${selectedInvoice.subtotal_amount.toFixed(2)}</span>
            </div>
            {selectedInvoice.tax_amount && selectedInvoice.tax_amount > 0 && (
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${selectedInvoice.tax_amount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>${selectedInvoice.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {selectedInvoice.notes && (
          <div>
            <h4 className="font-medium mb-2">Notes</h4>
            <p className="text-sm text-muted-foreground">{selectedInvoice.notes}</p>
          </div>
        )}
      </div>
    );
  };

  if (invoicesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading invoice generation system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoice Generation System</h2>
          <p className="text-muted-foreground">
            {payrollDate ? 
              `${payrollDate.payroll.name} - ${payrollDate.payroll.client.name}` : 
              "Generate and manage invoices with approval workflow"
            }
          </p>
        </div>
        
        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={availableBillingItems.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Generate New Invoice</DialogTitle>
            </DialogHeader>
            <InvoiceGenerationForm />
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateInvoice} 
                disabled={formData.selected_billing_items.length === 0}
              >
                Generate Invoice
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              ${totalInvoiceAmount.toFixed(2)} total value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Edit className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{draftInvoices}</div>
            <p className="text-xs text-muted-foreground">
              ${draftAmount.toFixed(2)} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
            <Send className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{sentInvoices}</div>
            <p className="text-xs text-muted-foreground">
              ${sentAmount.toFixed(2)} awaiting payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidInvoices}</div>
            <p className="text-xs text-muted-foreground">
              ${paidAmount.toFixed(2)} collected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice Management
            </CardTitle>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Invoices</h3>
              <p>No invoices have been generated for this payroll.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Approval</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div className="font-medium">{invoice.invoice_number}</div>
                        <div className="text-sm text-muted-foreground">
                          Due: {new Date(invoice.due_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          {new Date(invoice.invoice_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{invoice.payroll_date.payroll.client.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {invoice.payroll_date.payroll.name}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="font-medium">${invoice.total_amount.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.invoice_line_items.length} items
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline" className={getApprovalStatusColor(invoice.approval_status)}>
                            {invoice.approval_status}
                          </Badge>
                          {invoice.approved_by_user && (
                            <div className="text-xs text-muted-foreground">
                              by {invoice.approved_by_user.computed_name}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {invoice.created_by_user?.computed_name || "Unknown"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(invoice.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {invoice.approval_status === "pending" && canApprove && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApproveInvoice(invoice)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {invoice.approval_status === "approved" && invoice.status === "draft" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendInvoice(invoice)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInvoice(invoice)}
                            className="text-red-600 hover:text-red-700"
                            disabled={invoice.status === "paid"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Invoice {selectedInvoice?.invoice_number} - {selectedInvoice?.payroll_date.payroll.client.name}
            </DialogTitle>
          </DialogHeader>
          <InvoiceViewDialog />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedInvoice && selectedInvoice.approval_status === "approved" && (
              <>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Client
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}