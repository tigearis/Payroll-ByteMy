"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PayrollEditPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  useEffect(() => {
    // Redirect to the main payroll page with edit mode enabled
    if (id) {
      const url = returnTo 
        ? `/payrolls/${id}?edit=true&returnTo=${encodeURIComponent(returnTo)}`
        : `/payrolls/${id}?edit=true`;
      router.replace(url);
    }
  }, [id, returnTo, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-medium">Redirecting to edit mode...</h2>
      </div>
    </div>
  );
}