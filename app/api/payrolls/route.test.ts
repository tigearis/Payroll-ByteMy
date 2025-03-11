import { NextRequest } from "next/server"
import { POST } from "./route"
import { getServerSession } from "next-auth/next"
import { describe, it, expect, jest } from "@jest/globals"

// Mock the database and NextAuth
jest.mock("@/lib/db", () => ({
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn().mockResolvedValue([{ id: 1, name: "Test Payroll" }]),
}))

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}))

describe("POST /api/payrolls", () => {
  it("creates a new payroll", async () => {
    const mockSession = {
      user: { role: "admin" },
    }
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

    const req = new NextRequest("http://localhost:3000/api/payrolls", {
      method: "POST",
      body: JSON.stringify({
        client_id: 1,
        name: "Test Payroll",
        cycle_id: 1,
        date_type_id: 1,
        processing_days_before_eft: 2,
      }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual({
      success: true,
      message: "Payroll created successfully",
      payroll: { id: 1, name: "Test Payroll" },
    })
  })

  it("returns 401 for unauthenticated requests", async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    const req = new NextRequest("http://localhost:3000/api/payrolls", {
      method: "POST",
      body: JSON.stringify({}),
    })

    const res = await POST(req)

    expect(res.status).toBe(401)
  })
})

