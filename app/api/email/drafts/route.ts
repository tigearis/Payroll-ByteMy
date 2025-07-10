// Email Drafts API Route
// Security Classification: HIGH - Draft management operations
// SOC2 Compliance: Draft creation and modification audit

import { NextRequest, NextResponse } from "next/server";
import {
  GetUserEmailDraftsDocument,
  CreateEmailDraftDocument,
  UpdateEmailDraftDocument,
  DeleteEmailDraftDocument,
  type GetUserEmailDraftsQuery,
  type CreateEmailDraftMutation,
  type UpdateEmailDraftMutation,
  type DeleteEmailDraftMutation
} from "@/domains/email/graphql/generated/graphql";
import type { EmailCategory } from "@/domains/email/types";
import { executeTypedMutation, executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuthParams } from "@/lib/auth/api-auth";

interface DraftRequest {
  templateId?: string;
  recipientEmails: string[];
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  variableValues?: Record<string, any>;
  businessContext?: {
    category: EmailCategory;
    [key: string]: any;
  };
  scheduledFor?: string;
}

interface DraftResponse {
  success: boolean;
  draft?: any;
  drafts?: any[];
  error?: string;
}

// GET - Fetch user's email drafts
export const GET = withAuthParams(async (req: NextRequest, {}, session) => {
  try {
    console.log(`📧 Fetching drafts for user ${session.userId}`);

    const draftsData = await executeTypedQuery<GetUserEmailDraftsQuery>(
      GetUserEmailDraftsDocument,
      { userId: session.userId }
    );

    const drafts = draftsData.emailDrafts;

    console.log(`✅ Found ${drafts.length} drafts`);

    return NextResponse.json<DraftResponse>({
      success: true,
      drafts: drafts.map(draft => ({
        ...draft,
        recipientCount: draft.recipientEmails ? draft.recipientEmails.length : 0,
        hasTemplate: !!draft.templateId,
        isScheduled: !!draft.scheduledFor
      }))
    });

  } catch (error: any) {
    console.error('❌ Error fetching drafts:', error);
    return NextResponse.json<DraftResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});

// POST - Create new email draft
export const POST = withAuthParams(async (req: NextRequest, {}, session) => {
  try {
    const body: DraftRequest = await req.json();
    const {
      templateId,
      recipientEmails,
      subject,
      htmlContent,
      textContent,
      variableValues,
      businessContext,
      scheduledFor
    } = body;

    console.log(`📧 Creating draft for user ${session.userId}`);

    // Validate request
    if (!recipientEmails || recipientEmails.length === 0) {
      return NextResponse.json<DraftResponse>(
        { success: false, error: "Recipients are required" },
        { status: 400 }
      );
    }

    // Create draft
    const draftData = await executeTypedMutation<CreateEmailDraftMutation>(
      CreateEmailDraftDocument,
      {
        input: {
          userId: session.userId,
          templateId: templateId || null,
          recipientEmails,
          subject,
          htmlContent,
          textContent,
          variableValues: variableValues ? JSON.stringify(variableValues) : null,
          businessContext: businessContext ? JSON.stringify(businessContext) : null,
          scheduledFor: scheduledFor || null
        }
      }
    );

    if (!draftData.insertEmailDraftsOne) {
      throw new Error('Failed to create draft');
    }

    const newDraft = draftData.insertEmailDraftsOne;
    console.log(`✅ Draft created: ${newDraft.id}`);

    return NextResponse.json<DraftResponse>({
      success: true,
      draft: {
        ...newDraft,
        recipientCount: newDraft.recipientEmails ? newDraft.recipientEmails.length : 0,
        hasTemplate: !!newDraft.templateId,
        isScheduled: !!newDraft.scheduledFor
      }
    });

  } catch (error: any) {
    console.error('❌ Error creating draft:', error);
    return NextResponse.json<DraftResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});

// PUT - Update existing draft
export const PUT = withAuthParams(async (req: NextRequest, {}, session) => {
  try {
    const { searchParams } = new URL(req.url);
    const draftId = searchParams.get('id');
    
    if (!draftId) {
      return NextResponse.json<DraftResponse>(
        { success: false, error: "Draft ID is required" },
        { status: 400 }
      );
    }

    const body: Partial<DraftRequest> = await req.json();

    console.log(`📧 Updating draft ${draftId} for user ${session.userId}`);

    // Build update data
    const updateData: any = {};
    if (body.templateId !== undefined) updateData.templateId = body.templateId;
    if (body.recipientEmails !== undefined) updateData.recipientEmails = body.recipientEmails;
    if (body.subject !== undefined) updateData.subject = body.subject;
    if (body.htmlContent !== undefined) updateData.htmlContent = body.htmlContent;
    if (body.textContent !== undefined) updateData.textContent = body.textContent;
    if (body.variableValues !== undefined) {
      updateData.variableValues = body.variableValues ? JSON.stringify(body.variableValues) : null;
    }
    if (body.businessContext !== undefined) {
      updateData.businessContext = body.businessContext ? JSON.stringify(body.businessContext) : null;
    }
    if (body.scheduledFor !== undefined) updateData.scheduledFor = body.scheduledFor;

    // Update draft
    const draftData = await executeTypedMutation<UpdateEmailDraftMutation>(
      UpdateEmailDraftDocument,
      {
        draftId,
        updates: updateData
      }
    );

    if (!draftData.updateEmailDraftsByPk) {
      return NextResponse.json<DraftResponse>(
        { success: false, error: "Draft not found or access denied" },
        { status: 404 }
      );
    }

    const updatedDraft = draftData.updateEmailDraftsByPk;
    console.log(`✅ Draft updated: ${updatedDraft.id}`);

    return NextResponse.json<DraftResponse>({
      success: true,
      draft: {
        ...updatedDraft,
        recipientCount: updatedDraft.recipientEmails ? updatedDraft.recipientEmails.length : 0,
        hasTemplate: !!updatedDraft.templateId,
        isScheduled: !!updatedDraft.scheduledFor
      }
    });

  } catch (error: any) {
    console.error('❌ Error updating draft:', error);
    return NextResponse.json<DraftResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});

// DELETE - Delete draft
export const DELETE = withAuthParams(async (req: NextRequest, {}, session) => {
  try {
    const { searchParams } = new URL(req.url);
    const draftId = searchParams.get('id');
    
    if (!draftId) {
      return NextResponse.json<DraftResponse>(
        { success: false, error: "Draft ID is required" },
        { status: 400 }
      );
    }

    console.log(`📧 Deleting draft ${draftId} for user ${session.userId}`);

    // Delete draft
    const deleteData = await executeTypedMutation<DeleteEmailDraftMutation>(
      DeleteEmailDraftDocument,
      { draftId }
    );

    if (!deleteData.deleteEmailDraftsByPk) {
      return NextResponse.json<DraftResponse>(
        { success: false, error: "Draft not found or access denied" },
        { status: 404 }
      );
    }

    console.log(`✅ Draft deleted: ${deleteData.deleteEmailDraftsByPk.id}`);

    return NextResponse.json<DraftResponse>({
      success: true,
      draft: deleteData.deleteEmailDraftsByPk
    });

  } catch (error: any) {
    console.error('❌ Error deleting draft:', error);
    return NextResponse.json<DraftResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});