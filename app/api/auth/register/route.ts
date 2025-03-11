import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/drizzle/schema"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../[...nextauth]/route"

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check role-based access
    const userRole = session.user.role
    if (!userRole || !["manager", "admin"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden: Manager or admin access required" }, { status: 403 })
    }

    // Process registration
    const { email, password, name, role = "viewer" } = await req.json()

    // Validate inputs
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password and name are required" }, { status: 400 })
    }

    // Only admins can create admin users
    if (role === "admin" && userRole !== "admin") {
      return NextResponse.json({ error: "Only admins can create admin users" }, { status: 403 })
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        role,
      })
      .returning()

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        name: newUser[0].name,
        role: newUser[0].role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

