"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const getErrorMessage = () => {
    switch (reason) {
      case "inactive":
        return {
          title: "Account Inactive",
          description:
            "Your account has been deactivated. Please contact an administrator for assistance.",
          icon: <Shield className="h-12 w-12 text-amber-500" />,
        };
      case "insufficient_permissions":
        return {
          title: "Insufficient Permissions",
          description:
            "You don't have the required permissions to access this resource.",
          icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
        };
      case "not_staff":
        return {
          title: "Staff Access Required",
          description: "This resource is only available to staff members.",
          icon: <Shield className="h-12 w-12 text-orange-500" />,
        };
      default:
        return {
          title: "Access Denied",
          description: "You don't have permission to access this resource.",
          icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
        };
    }
  };

  const { title, description, icon } = getErrorMessage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{icon}</div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          {reason === "inactive" && (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Need help? Contact support at{" "}
              <a
                href="mailto:support@payrollmatrix.com"
                className="text-blue-600 hover:underline"
              >
                support@payrollmatrix.com
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnauthorizedContent />
    </Suspense>
  );
}
