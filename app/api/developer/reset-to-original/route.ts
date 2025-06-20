import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

import { withAuth } from "@/lib/api-auth";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const POST = withAuth(
  async (request: NextRequest) => {
    // Restrict to development environment only
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

  try {
    console.log("🔄 Starting reset to original state...");

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Delete all child payroll versions (keep only root payrolls)
      const { rowCount: deletedVersions } = await client.query(`
        DELETE FROM payrolls 
        WHERE parent_payroll_id IS NOT NULL
      `);

      // Reset all remaining payrolls to version 1 and remove superseded dates
      const { rowCount: resetPayrolls } = await client.query(`
        UPDATE payrolls 
        SET superseded_date = NULL, version_number = 1
        WHERE superseded_date IS NOT NULL OR version_number != 1
      `);

      // Clean up temporary versioning tables
      await client.query(`DELETE FROM payroll_version_history_results`);
      await client.query(`DELETE FROM latest_payroll_version_results`);

      await client.query("COMMIT");

      console.log(
        `✅ Reset complete: ${deletedVersions} versions deleted, ${resetPayrolls} payrolls reset`
      );

      return NextResponse.json({
        success: true,
        message: `Reset to original state complete`,
        deletedVersions: deletedVersions || 0,
        resetPayrolls: resetPayrolls || 0,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("❌ Error resetting to original state:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
  },
  {
    requiredRole: "developer",
  }
);
