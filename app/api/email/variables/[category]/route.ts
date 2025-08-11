// Email Variables API Route
// Security Classification: HIGH - Variable definitions and suggestions
// SOC2 Compliance: Template variable validation

import { NextRequest, NextResponse } from "next/server";
import { variableProcessor } from "@/domains/email/services/variable-processor";
import type { EmailCategory } from "@/domains/email/types";
import {
  EMAIL_CATEGORIES,
  PAYROLL_VARIABLES,
  BILLING_VARIABLES,
  LEAVE_VARIABLES,
  SAMPLE_PREVIEW_DATA
} from "@/domains/email/types/template-types";
import { withAuthParams } from "@/lib/auth/api-auth";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

interface VariableResponse {
  success: boolean;
  variables?: Array<{
    key: string;
    label: string;
    example: string;
    required: boolean;
  }>;
  sampleData?: Record<string, any>;
  categoryInfo?: any;
  error?: string;
}

// GET - Get variables for a specific category
export const GET = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { category } = await params;
    const { searchParams } = new URL(req.url);
    const includeSampleData = searchParams.get('includeSampleData') === 'true';

    console.log(`📧 Fetching variables for category: ${category}`);

    // Validate category
    if (!EMAIL_CATEGORIES[category as EmailCategory]) {
      return NextResponse.json<VariableResponse>(
        { success: false, error: `Unknown category: ${category}` },
        { status: 400 }
      );
    }

    // Get variable suggestions for the category
    const suggestions = variableProcessor.getVariableSuggestions(category as EmailCategory);
    
    // Get category information
    const categoryInfo = EMAIL_CATEGORIES[category as EmailCategory];

    const response: VariableResponse = {
      success: true,
      variables: suggestions,
      categoryInfo
    };

    // Include sample data if requested
    if (includeSampleData) {
      response.sampleData = SAMPLE_PREVIEW_DATA[category as EmailCategory] || {};
    }

    console.log(`✅ Found ${suggestions.length} variables for ${category}`);

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('❌ Error fetching variables:', error);
    return NextResponse.json<VariableResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});

// POST - Validate variable values
export const POST = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { category } = await params;
    const body = await req.json();
    const { variables, requiredVariables = [] } = body;

    console.log(`📧 Validating variables for category: ${category}`);

    // Validate category
    if (!EMAIL_CATEGORIES[category as EmailCategory]) {
      return NextResponse.json(
        { success: false, error: `Unknown category: ${category}` },
        { status: 400 }
      );
    }

    // Get variable suggestions to determine required variables
    const suggestions = variableProcessor.getVariableSuggestions(category as EmailCategory);
    const categoryRequiredVars = suggestions
      .filter(v => v.required)
      .map(v => v.key);

    const allRequiredVars = [...new Set([...requiredVariables, ...categoryRequiredVars])];

    // Validate variables
    const validation = variableProcessor.validateVariables(variables, allRequiredVars);

    console.log(`✅ Variable validation completed:`, {
      isValid: validation.isValid,
      errorCount: validation.errors.length
    });

    return NextResponse.json({
      success: true,
      validation: {
        isValid: validation.isValid,
        errors: validation.errors,
        sanitizedVariables: validation.sanitizedVariables,
        requiredVariables: allRequiredVars,
        providedVariables: Object.keys(variables),
        missingRequired: allRequiredVars.filter(
          required => !variables.hasOwnProperty(required) || 
                      variables[required] === null || 
                      variables[required] === undefined ||
                      variables[required] === ''
        )
      }
    });

  } catch (error: any) {
    console.error('❌ Error validating variables:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});