import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-auth';
import { executeTypedQuery } from '@/lib/apollo/query-helpers';
import { 
  GetBillingItemsForInvoiceDocument,
  CreateInvoiceDocument,
  UpdateBillingItemDocument,
  type GetBillingItemsForInvoiceQuery,
  type CreateInvoiceMutation,
  type UpdateBillingItemMutation
} from '@/domains/billing/graphql/generated/graphql';

interface GenerateInvoiceRequest {
  clientId: string;
  billingItemIds: string[];
  dueDate?: string;
  notes?: string;
}

/**
 * POST /api/billing/invoices/generate
 * 
 * Generates an invoice from approved billing items for a specific client.
 * This automates the conversion of billing items into formal invoices.
 */
export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    const body: GenerateInvoiceRequest = await req.json();
    const { clientId, billingItemIds, dueDate, notes } = body;

    if (!clientId || !billingItemIds?.length) {
      return NextResponse.json(
        { success: false, error: 'Client ID and billing item IDs are required' },
        { status: 400 }
      );
    }

    // Check if user has permission to generate invoices
    const userRole = session.role || session.defaultRole;
    if (!userRole || !['developer', 'org_admin', 'manager'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions to generate invoices' },
        { status: 403 }
      );
    }

    // Get billing items to validate they're approved and belong to the client
    const billingItemsData = await executeTypedQuery<GetBillingItemsForInvoiceQuery>(
      GetBillingItemsForInvoiceDocument,
      { 
        clientId, 
        payrollIds: null // Will get all payrolls for this client
      }
    );

    const billingItems = billingItemsData?.billingItems || [];
    
    // Filter to only include the requested billing items
    const requestedItems = billingItems.filter(item => billingItemIds.includes(item.id));
    
    if (requestedItems.length !== billingItemIds.length) {
      return NextResponse.json(
        { success: false, error: 'Some billing items were not found or do not belong to this client' },
        { status: 400 }
      );
    }

    // Validate all items are approved
    const unapprovedItems = requestedItems.filter(item => !item.isApproved);
    if (unapprovedItems.length > 0) {
      return NextResponse.json(
        { success: false, error: 'All billing items must be approved before generating an invoice' },
        { status: 400 }
      );
    }

    // Calculate invoice totals
    const subtotal = requestedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const taxRate = 0.10; // 10% GST for Australia
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    // Generate invoice number (simple timestamp-based for now)
    const invoiceNumber = `INV-${Date.now()}`;

    // Create the invoice
    const invoiceData = {
      invoiceNumber,
      clientId,
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      taxRate,
      status: 'draft',
      issuedDate: new Date().toISOString(),
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      createdBy: session.userId,
      notes: notes || null
    };

    const createdInvoice = await executeTypedQuery<CreateInvoiceMutation>(
      CreateInvoiceDocument,
      { input: invoiceData }
    );

    if (!createdInvoice?.insertBillingInvoice) {
      throw new Error('Failed to create invoice');
    }

    const invoiceId = createdInvoice.insertBillingInvoice.id;

    // Update billing items to mark them as invoiced
    const updatePromises = billingItemIds.map(itemId =>
      executeTypedQuery<UpdateBillingItemMutation>(
        UpdateBillingItemDocument,
        {
          id: itemId,
          updates: {
            status: 'invoiced',
            invoiceId,
            invoicedDate: new Date().toISOString()
          }
        }
      )
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      data: {
        invoice: createdInvoice.insertBillingInvoice,
        invoiceNumber,
        itemsInvoiced: billingItemIds.length,
        totalAmount: totalAmount,
        subtotal: subtotal,
        taxAmount: taxAmount
      },
      message: `Invoice ${invoiceNumber} generated successfully`
    });

  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate invoice',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});