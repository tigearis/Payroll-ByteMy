/**
 * Floating AI Assistant Component
 *
 * Provides a floating chat interface accessible from any page
 */

"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AIChat } from "@/components/ai/chat-interface";
import { useFeatureFlag } from "@/lib/feature-flags";

interface FloatingPosition {
  bottom: number;
  right: number;
}

interface AssistantState {
  isOpen: boolean;
  isMinimized: boolean;
  position: FloatingPosition;
  hasNewSuggestions: boolean;
}

export function AIAssistantFloat() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const isAIFloatEnabled = useFeatureFlag('aiFloat');
  const [assistantState, setAssistantState] = useState<AssistantState>({
    isOpen: false,
    isMinimized: false,
    position: { bottom: 20, right: 20 },
    hasNewSuggestions: false,
  });

  useEffect(() => {
    const handleOpen = () => {
      setAssistantState(prev => ({ ...prev, isOpen: true }));
    };

    const handleClose = () => {
      setAssistantState(prev => ({ ...prev, isOpen: false }));
    };

    const handleMessage = (event: CustomEvent) => {
      console.log("AI Assistant message:", event.detail.message);
    };

    window.addEventListener("ai-assistant-open", handleOpen as EventListener);
    window.addEventListener("ai-assistant-close", handleClose as EventListener);
    window.addEventListener(
      "ai-assistant-message",
      handleMessage as EventListener
    );

    return () => {
      window.removeEventListener(
        "ai-assistant-open",
        handleOpen as EventListener
      );
      window.removeEventListener(
        "ai-assistant-close",
        handleClose as EventListener
      );
      window.removeEventListener(
        "ai-assistant-message",
        handleMessage as EventListener
      );
    };
  }, []);

  if (!isLoaded || !user || !isAIFloatEnabled) {
    return null;
  }

  return (
    <div
      className="fixed z-50"
      style={{
        bottom: assistantState.position.bottom,
        right: assistantState.position.right,
      }}
    >
      {assistantState.isOpen ? (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg w-80 h-[480px] flex flex-col">
          <div className="flex justify-between items-center p-3 border-b bg-gray-50 rounded-t-lg">
            <h3 className="text-sm font-semibold text-gray-800">AI Assistant</h3>
            <button
              onClick={() =>
                setAssistantState(prev => ({ ...prev, isOpen: false }))
              }
              className="text-gray-500 hover:text-gray-700 text-lg leading-none"
            >
              ×
            </button>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <AIChat
              context={{
                pathname: pathname,
                suggestions: [
                  "Show me recent payrolls",
                  "List active clients",
                  "What's today's schedule?",
                  "How many staff are working today?",
                ],
              }}
              compact={true}
              className="h-full flex flex-col"
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAssistantState(prev => ({ ...prev, isOpen: true }))}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        >
          💬
        </button>
      )}
    </div>
  );
}

// Hook for controlling the assistant from other components
export function useAIAssistant() {
  const openAssistant = () => {
    window.dispatchEvent(new CustomEvent("ai-assistant-open"));
  };

  const closeAssistant = () => {
    window.dispatchEvent(new CustomEvent("ai-assistant-close"));
  };

  const sendMessage = (message: string) => {
    window.dispatchEvent(
      new CustomEvent("ai-assistant-message", {
        detail: { message },
      })
    );
  };

  return {
    openAssistant,
    closeAssistant,
    sendMessage,
  };
}
