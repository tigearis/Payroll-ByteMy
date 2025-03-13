"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenerateMissingDatesButtonProps {
  payrollIds: string[];
  onSuccess?: () => void;
}

export function GenerateMissingDatesButton({ 
  payrollIds, 
  onSuccess 
}: GenerateMissingDatesButtonProps) {
  const { isLoaded, userId, getToken } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function getUserRole() {
      if (isLoaded && userId) {
        try {
          const token = await getToken({ template: "hasura" });
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const role = payload['https://hasura.io/jwt/claims']?.['x-hasura-default-role'];
            setUserRole(role);
          }
        } catch (error) {
          console.error('Error getting user role:', error);
        }
      }
    }
    
    getUserRole();
  }, [isLoaded, userId, getToken]);

  const handleGenerateMissingDates = async () => {
    if (payrollIds.length === 0) return;

    try {
      setIsGenerating(true);
      const response = await fetch('/api/cron/generate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payrollIds }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate dates');
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error generating dates:', error);
      // You could add a toast notification here
    } finally {
      setIsGenerating(false);
    }
  };

  // Only render if user is admin and there are payrolls to process
  if (!userRole || !['org_admin', 'admin'].includes(userRole) || payrollIds.length === 0) {
    return null;
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleGenerateMissingDates}
      disabled={isGenerating}
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
      {isGenerating ? 'Generating...' : 'Generate Missing Dates'}
    </Button>
  );
}