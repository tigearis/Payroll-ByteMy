// components/hasura-ws-test.tsx
"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

export function HasuraWebSocketTest() {
  const { getToken } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().slice(11, 19)}: ${message}`]);
  };

  useEffect(() => {
    // Log environment variables on component mount
    const httpUrl = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
    const wsUrl = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_URL;
    
    addLog(`HTTP URL: ${httpUrl || 'not set'}`);
    addLog(`WS URL: ${wsUrl || 'not set'}`);
  }, []);

  const connect = async () => {
    try {
      // Get Hasura WebSocket URL
      let wsUrl = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_URL;
      const httpUrl = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
      
      if (!wsUrl && httpUrl) {
        // Derive WebSocket URL from HTTP URL
        const urlParts = httpUrl.split('://');
        if (urlParts.length === 2) {
          wsUrl = `wss://${urlParts[1]}`;
          addLog(`Using derived WS URL: ${wsUrl}`);
        } else {
          addLog(`❌ Cannot derive WS URL from HTTP URL: ${httpUrl}`);
          return;
        }
      } else if (wsUrl) {
        addLog(`Using explicit WS URL: ${wsUrl}`);
      } else {
        addLog("❌ No WebSocket URL available");
        return;
      }
      
      // Get authentication token
      const token = await getToken({ template: "hasura" });
      addLog(`Auth token: ${token ? "Present" : "Missing"}`);
      
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      // Create WebSocket connection
      addLog(`🔄 Connecting to Hasura: ${wsUrl}`);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      // Connection opened
      ws.onopen = () => {
        addLog("✅ WebSocket connection established");
        setIsConnected(true);
        
        // GraphQL over WebSocket protocol requires a connection_init message
        const initMsg = {
          type: "connection_init",
          payload: {
            headers: {
              Authorization: token ? `Bearer ${token}` : ""
            }
          }
        };
        
        ws.send(JSON.stringify(initMsg));
        addLog("📤 Sent connection initialization with auth");
        
        // After a moment, send a simple subscription
        setTimeout(() => {
          const subscriptionMsg = {
            id: "1",
            type: "subscribe",
            payload: {
              query: `
                subscription TestSub {
                  payrolls(limit: 1) {
                    id
                    name
                  }
                }
              `
            }
          };
          
          ws.send(JSON.stringify(subscriptionMsg));
          addLog("📤 Sent subscription request");
        }, 1000);
      };
      
      // Listen for messages
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          addLog(`📥 Received: ${data.type || "unknown message type"}`);
          console.log("Hasura WS message:", data);
          
          if (data.type === "connection_ack") {
            addLog("✅ Connection acknowledged by Hasura");
          }
          
          if (data.type === "next" && data.payload?.data) {
            addLog("✅ Subscription data received");
          }
          
          if (data.type === "error") {
            addLog(`❌ GraphQL error: ${JSON.stringify(data.payload)}`);
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
        console.error("Hasura WebSocket error:", error);
      };
      
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      console.error("Hasura WebSocket error:", error);
    }
  };
  
  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      addLog("🔄 Disconnected from Hasura WebSocket");
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
      <h3 className="font-medium">Hasura WebSocket Test</h3>
      <div className="flex gap-2">
        <Button 
          onClick={isConnected ? disconnect : connect} 
          variant={isConnected ? "destructive" : "default"}
        >
          {isConnected ? "Disconnect" : "Connect to Hasura"}
        </Button>
        <Button variant="outline" onClick={() => setLogs([])}>
          Clear Logs
        </Button>
      </div>
      
      <div className="h-48 overflow-auto border rounded-md p-2 bg-gray-50 text-sm font-mono">
        {logs.length === 0 ? (
          <p className="text-gray-400">No logs yet. Start the Hasura WebSocket test.</p>
        ) : (
          logs.map((log, i) => <div key={i}>{log}</div>)
        )}
      </div>
      
      <p className="text-sm">
        This test attempts a direct WebSocket connection to your Hasura instance
        using the GraphQL over WebSocket protocol.
      </p>
    </div>
  );
}
