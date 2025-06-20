// components/subscription-test.tsx
"use client";

import { gql, useSubscription } from "@apollo/client";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

// Import extracted GraphQL operations
const TEST_SUBSCRIPTION = gql`
  subscription TestSubscription {
    payrolls(limit: 1) {
      id
      name
      updated_at
    }
  }
`;

export function SubscriptionTest() {
  const [isActive, setIsActive] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString().slice(11, 19)}: ${message}`]);
  };

  const { data, loading, error } = useSubscription(TEST_SUBSCRIPTION, {
    skip: !isActive,
    onSubscriptionData: () => {
      addLog("✅ Received subscription data");
    },
    onSubscriptionComplete: () => {
      addLog("✅ Subscription completed");
    },
    onError: (err) => {
      addLog(`❌ Error: ${err.message}`);
      console.error("Subscription error details:", err);
    },
  });

  useEffect(() => {
    if (isActive) {
      addLog("🔄 Subscription started");
    }
  }, [isActive]);

  useEffect(() => {
    if (error) {
      console.error("Full error object:", error);
    }
  }, [error]);

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="font-medium">WebSocket Subscription Test</h3>
      <div className="flex gap-2">
        <Button onClick={() => setIsActive(!isActive)}>
          {isActive ? "Stop Subscription" : "Start Subscription"}
        </Button>
        <Button variant="outline" onClick={() => setLogs([])}>
          Clear Logs
        </Button>
      </div>
      
      <div className="h-48 overflow-auto border rounded-md p-2 bg-gray-50 text-sm font-mono">
        {logs.length === 0 ? (
          <p className="text-gray-400">No logs yet. Start the subscription test.</p>
        ) : (
          logs.map((log, i) => <div key={i}>{log}</div>)
        )}
      </div>

      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          <strong>Error:</strong> {error.message}
        </div>
      )}
    </div>
  );
}