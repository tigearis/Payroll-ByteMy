// components/direct-websocket-test.tsx
"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

export function DirectWebSocketTest() {
  const { getToken } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Move the useEffect to the top level
  useEffect(() => {
    console.log("HTTP URL:", process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL);
    console.log("WS URL:", process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_URL);
  }, []);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toISOString().slice(11, 19)}: ${message}`,
    ]);
  };

  const connect = async () => {
    try {
      // Get the WebSocket URL
      const wsUrl =
        process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_URL ||
        process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL?.replace(
          "https://",
          "wss://"
        );
      // Add this to your DirectWebSocketTest component

      if (!wsUrl) {
        addLog("❌ Error: WebSocket URL is not defined");
        return;
      }

      addLog(`🔄 Connecting to ${wsUrl}`);

      // Get authentication token
      const token = await getToken({ template: "hasura" });

      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      // Create WebSocket connection
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Connection opened
      ws.onopen = () => {
        addLog("✅ WebSocket connection established");
        setIsConnected(true);

        // Send connection_init message with auth token
        const initMsg = {
          type: "connection_init",
          payload: {
            headers: {
              authorization: token ? `Bearer ${token}` : "",
            },
          },
        };

        ws.send(JSON.stringify(initMsg));
        addLog("📤 Sent connection initialization");

        // After initialization, send a subscription request
        setTimeout(() => {
          const subscriptionMsg = {
            id: "1",
            type: "subscribe",
            payload: {
              query: `
                subscription TestSubscription {
                  payrolls(limit: 1) {
                    id
                    name
                  }
                }
              `,
            },
          };

          ws.send(JSON.stringify(subscriptionMsg));
          addLog("📤 Sent subscription request");
        }, 1000);
      };

      // Listen for messages
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          addLog(`📥 Received: ${data.type || "unknown type"}`);
          console.log("WebSocket message:", data);

          if (data.type === "connection_ack") {
            addLog("✅ Connection acknowledged by server");
          }

          if (data.type === "next" && data.payload?.data) {
            addLog("✅ Subscription data received");
          }
        } catch (e: any) {
          addLog(`❌ Error parsing message: ${e?.message}`);
        }
      };

      // Connection closed
      ws.onclose = (event) => {
        addLog(`❌ Connection closed: ${event.code} ${event.reason}`);
        setIsConnected(false);
        wsRef.current = null;
      };

      // Connection error
      ws.onerror = (error) => {
        addLog(`❌ WebSocket error`);
        console.error("WebSocket error:", error);
      };
    } catch (error: any) {
      addLog(`❌ Error: ${error?.message}`);
      console.error("WebSocket connection error:", error?.message);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      addLog("🔄 Disconnected from WebSocket");
      setIsConnected(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="font-medium">Direct WebSocket Test</h3>
      <div className="flex gap-2">
        <Button
          onClick={isConnected ? disconnect : connect}
          variant={isConnected ? "destructive" : "default"}
        >
          {isConnected ? "Disconnect" : "Connect WebSocket"}
        </Button>
        <Button variant="outline" onClick={() => setLogs([])}>
          Clear Logs
        </Button>
      </div>

      <div className="h-48 overflow-auto border rounded-md p-2 bg-gray-50 text-sm font-mono">
        {logs.length === 0 ? (
          <p className="text-gray-400">
            No logs yet. Start the WebSocket test.
          </p>
        ) : (
          logs.map((log, i) => <div key={i}>{log}</div>)
        )}
      </div>

      <div className="text-sm">
        <p>
          <strong>Status:</strong> {isConnected ? "Connected" : "Disconnected"}
        </p>
        <p className="mt-1">
          This test bypasses Apollo Client and directly tests the WebSocket
          connection. It will help determine if your Hasura endpoint supports
          WebSockets.
        </p>
      </div>
    </div>
  );
}
