// components/simple-ws-test.tsx
"use client";

import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

export function SimpleWebSocketTest() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().slice(11, 19)}: ${message}`]);
  };

  // TODO: Review useEffect dependencies for exhaustive-deps rule
  useEffect(() => {
    // Log environment variables on component mount
    console.log("HTTP URL:", process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL);
    console.log("WS URL:", process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_URL);
  }, []);

  const connect = () => {
    try {
      // Use a known echo server for initial testing
      const testUrl = "wss://echo.websocket.org";
      addLog(`🔄 Connecting to test echo server: ${testUrl}`);
      
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      // Create WebSocket connection
      const ws = new WebSocket(testUrl);
      wsRef.current = ws;
      
      // Connection opened
      ws.onopen = () => {
        addLog("✅ WebSocket connection established");
        setIsConnected(true);
        
        // Send a test message
        ws.send("Hello WebSocket!");
        addLog("📤 Sent: Hello WebSocket!");
      };
      
      // Listen for messages
      ws.onmessage = (event) => {
        addLog(`📥 Received: ${event.data}`);
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
      addLog(`❌ Error: ${error.message}`);
      console.error("WebSocket connection error:", error);
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
      <h3 className="font-medium">Simple WebSocket Test</h3>
      <div className="flex gap-2">
        <Button 
          onClick={isConnected ? disconnect : connect} 
          variant={isConnected ? "destructive" : "default"}
        >
          {isConnected ? "Disconnect" : "Connect to Echo Server"}
        </Button>
        <Button variant="outline" onClick={() => setLogs([])}>
          Clear Logs
        </Button>
      </div>
      
      <div className="h-48 overflow-auto border rounded-md p-2 bg-gray-50 text-sm font-mono">
        {logs.length === 0 ? (
          <p className="text-gray-400">No logs yet. Start the WebSocket test.</p>
        ) : (
          logs.map((log, i) => <div key={i}>{log}</div>)
        )}
      </div>
      
      <p className="text-sm">
        This test uses a public echo server to verify basic WebSocket functionality.
        If this works but your Hasura connection doesn&apos;t, the issue is specific to your Hasura configuration.
      </p>
    </div>
  );
}
