// components/sync-user-button.tsx
"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SyncUserButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/sync-current-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User synced successfully!", {
          description: `Welcome, ${data.user.name}!`,
        });

        // Refresh the page after successful sync
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Sync failed", {
          description: data.error || "Unknown error occurred",
        });
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Sync failed", {
        description: "Network error. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={isLoading}
      variant="outline"
      className="flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      {isLoading ? "Syncing..." : "Sync User"}
    </Button>
  );
}
