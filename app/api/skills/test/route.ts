// app/api/skills/test/route.ts
import { gql } from "@apollo/client";
import { NextRequest, NextResponse } from "next/server";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";

interface SchemaType {
  name: string;
  kind: string;
}

interface IntrospectionResult {
  __schema?: {
    types: SchemaType[];
  };
  error?: Error;
}

export const GET = withAuth(
  async (_req: NextRequest) => {
    try {
      console.log('Testing skills system...');

      // Test if skills tables exist by checking the schema
      const introspectionQuery = gql`
        query IntrospectionQuery {
          __schema {
            types {
              name
              kind
            }
          }
        }
      `;

      const result = await executeTypedQuery<IntrospectionResult>(introspectionQuery, {});
      const data = result.__schema;
      const error = result.error;

      if (error) {
        return NextResponse.json(
          { 
            error: "Failed to query schema",
            details: error.message 
          },
          { status: 500 }
        );
      }

      const types = data?.types || [];
      const skillTypes = types.filter((type: SchemaType) => 
        type.name.toLowerCase().includes('skill') ||
        type.name.toLowerCase().includes('userskill') ||
        type.name.toLowerCase().includes('payrollrequiredskill')
      );

      const workScheduleTypes = types.filter((type: SchemaType) =>
        type.name.toLowerCase().includes('workschedule') ||
        type.name.toLowerCase().includes('work_schedule')
      );

      return NextResponse.json({
        success: true,
        message: "Skills system schema check completed",
        data: {
          totalTypes: types.length,
          skillRelatedTypes: skillTypes.map((t: SchemaType) => t.name),
          workScheduleTypes: workScheduleTypes.map((t: SchemaType) => t.name),
          hasSkillTypes: skillTypes.length > 0,
          hasWorkScheduleTypes: workScheduleTypes.length > 0
        }
      });

    } catch (error) {
      console.error("Skills test error:", error);
      return NextResponse.json(
        { 
          error: "Failed to test skills system",
          details: error instanceof Error ? error.message : "Unknown error"
        },
        { status: 500 }
      );
    }
  }
);