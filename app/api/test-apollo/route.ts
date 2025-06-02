import { NextResponse } from "next/server";
import { adminApolloClient } from "@/lib/server-apollo-client";
import { gql } from "@apollo/client";

export async function GET() {
  try {
    console.log("🧪 Testing Apollo Admin Client...");

    // Test the exact same query that checkExistingHolidays uses
    const year = 2025;
    const countryCode = "AU";
    const startDate = `${year}-01-01`;
    const endDate = `${year + 1}-01-01`;

    console.log("🧪 Testing with:", { year, countryCode, startDate, endDate });

    const { data, errors } = await adminApolloClient.query({
      query: gql`
        query CheckExistingHolidays(
          $startDate: date!
          $endDate: date!
          $countryCode: bpchar!
        ) {
          holidays_aggregate(
            where: {
              country_code: { _eq: $countryCode }
              date: { _gte: $startDate, _lt: $endDate }
            }
          ) {
            aggregate {
              count
            }
          }
          holidays(
            where: {
              country_code: { _eq: $countryCode }
              date: { _gte: $startDate, _lt: $endDate }
            }
            limit: 3
            order_by: { date: asc }
          ) {
            date
            name
            country_code
          }
        }
      `,
      variables: {
        startDate,
        endDate,
        countryCode,
      },
      fetchPolicy: "network-only",
      errorPolicy: "all",
    });

    console.log("🧪 Apollo query result:", { data, errors });

    if (errors && errors.length > 0) {
      console.error("🧪 Apollo GraphQL errors:", errors);
      return NextResponse.json(
        {
          success: false,
          error: "GraphQL errors",
          details: errors,
          variables: { startDate, endDate, countryCode },
        },
        { status: 500 }
      );
    }

    if (data && data.holidays_aggregate) {
      const count = data.holidays_aggregate.aggregate.count;
      const samples = data.holidays || [];

      return NextResponse.json({
        success: true,
        message: `Found ${count} holidays for ${countryCode} ${year}`,
        data: {
          totalHolidays: count,
          sampleHolidays: samples,
          variables: { startDate, endDate, countryCode },
          shouldSkipSync: count > 0,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "No data received from Apollo query",
          details: { data, errors },
          variables: { startDate, endDate, countryCode },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("🧪 Apollo test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Apollo Client test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
