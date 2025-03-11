import { render, screen, fireEvent } from "@testing-library/react"
import SignInPage from "./page"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

// Mock next-auth
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}))

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

describe("SignInPage", () => {
  it("renders correctly", () => {
    render(<SignInPage />)
    expect(screen.getByText("Sign In")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
  })

  it("handles form submission", async () => {
    const mockSignIn = signIn as jest.Mock
    const mockRouter = { push: jest.fn() }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

    mockSignIn.mockResolvedValue({ error: null })

    render(<SignInPage />)

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } })
    fireEvent.click(screen.getByText("Sign In"))

    expect(mockSignIn).toHaveBeenCalledWith("credentials", {
      email: "test@example.com",
      password: "password123",
      redirect: false,
    })

    await screen.findByText("Sign In")
    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard")
  })

  it("displays error message on failed sign in", async () => {
    const mockSignIn = signIn as jest.Mock
    mockSignIn.mockResolvedValue({ error: "Invalid credentials" })

    render(<SignInPage />)

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrongpassword" } })
    fireEvent.click(screen.getByText("Sign In"))

    await screen.findByText("Invalid email or password")
  })
})

