// app/(dashboard)/jwt-test/page.tsx
import { JwtTestPanel } from "@/lib/dev/test-components";

export default function JWTTestPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">JWT Configuration Test</h1>
        <p className="text-gray-600 mt-2">
          Test your Clerk + Hasura JWT configuration and diagnose authentication
          issues.
        </p>
      </div>

      <JwtTestPanel />
    </div>
  );
}
