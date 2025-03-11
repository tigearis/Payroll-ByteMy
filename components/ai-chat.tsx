"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function AIChat() {
  const [messages, setMessages] = useState<{ role: "system" | "user"; content: string }[]>([])
  const [input, setInput] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.body) {
        console.error("Response body is empty")
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let text = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        text += decoder.decode(value)
      }

      const aiMessage = { role: "system" as const, content: text }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error streaming response:", error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div key={index} className={message.role === "user" ? "text-right" : ""}>
              <p className="font-medium">{message.role === "user" ? "You:" : "AI:"}</p>
              <p>{message.content}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input placeholder="Ask me anything..." value={input} onChange={(e) => setInput(e.target.value)} />
          <Button type="submit">Send</Button>
        </form>
      </CardContent>
    </Card>
  )
}

