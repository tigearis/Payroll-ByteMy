"use client"

import { ReloadIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { CheckCircle, Download, Server } from "lucide-react"
import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AVAILABLE_MODELS } from "@/lib/ollama-provider"

interface OllamaSetupProps {
  onConfigSave: (config: { baseURL: string; model: string }) => void
}

export function OllamaSetup({ onConfigSave }: OllamaSetupProps) {
  const [baseURL, setBaseURL] = useState("http://localhost:11434")
  const [selectedModel, setSelectedModel] = useState<string>("llama3.1:8b")
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [isPullingModel, setIsPullingModel] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    checkConnection()
  }, [baseURL])

  const checkConnection = async () => {
    if (!baseURL) return

    setIsConnecting(true)
    setConnectionStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch(`${baseURL}/api/tags`)
      if (response.ok) {
        const data = await response.json()
        const models = data.models?.map((m: any) => m.name) || []
        setAvailableModels(models)
        setConnectionStatus("success")
      } else {
        throw new Error("Failed to connect to Ollama")
      }
    } catch (error) {
      setConnectionStatus("error")
      setErrorMessage("Cannot connect to Ollama. Make sure Ollama is running.")
      setAvailableModels([])
    } finally {
      setIsConnecting(false)
    }
  }

  const pullModel = async (model: string) => {
    setIsPullingModel(true)
    setErrorMessage("")

    try {
      const response = await fetch(`${baseURL}/api/pull`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: model }),
      })

      if (response.ok) {
        // Refresh available models after pulling
        await checkConnection()
      } else {
        throw new Error("Failed to pull model")
      }
    } catch (error) {
      setErrorMessage(`Failed to pull model ${model}`)
    } finally {
      setIsPullingModel(false)
    }
  }

  const handleSave = () => {
    if (connectionStatus === "success" && selectedModel) {
      onConfigSave({ baseURL, model: selectedModel })
    }
  }

  const isModelAvailable = availableModels.includes(selectedModel)

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Server className="h-5 w-5" />
          <span>Ollama Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Settings */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baseURL">Ollama Base URL</Label>
            <Input
              id="baseURL"
              type="url"
              placeholder="http://localhost:11434"
              value={baseURL}
              onChange={(e) => setBaseURL(e.target.value)}
            />
          </div>

          {/* Connection Status */}
          {connectionStatus === "success" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Connected to Ollama successfully! Found {availableModels.length} models.
              </AlertDescription>
            </Alert>
          )}

          {connectionStatus === "error" && (
            <Alert className="border-red-200 bg-red-50">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
                <div className="mt-2 text-sm">
                  <p>To install and run Ollama:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>
                      Visit{" "}
                      <a href="https://ollama.ai" className="underline" target="_blank" rel="noopener noreferrer">
                        ollama.ai
                      </a>{" "}
                      to download
                    </li>
                    <li>Install Ollama on your system</li>
                    <li>
                      Run: <code className="bg-gray-100 px-1 rounded">ollama serve</code>
                    </li>
                    <li>
                      Pull a model: <code className="bg-gray-100 px-1 rounded">ollama pull llama3.1:8b</code>
                    </li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {isConnecting && (
            <div className="flex items-center space-x-2 text-gray-500">
              <ReloadIcon className="h-4 w-4 animate-spin" />
              <span>Connecting to Ollama...</span>
            </div>
          )}
        </div>

        {/* Model Selection */}
        {connectionStatus === "success" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model">Select Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a model" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_MODELS.map((model) => (
                    <SelectItem key={model} value={model}>
                      <div className="flex items-center justify-between w-full">
                        <span>{model}</span>
                        {availableModels.includes(model) ? (
                          <Badge variant="secondary" className="ml-2">
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="ml-2">
                            Not Downloaded
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model Status */}
            {selectedModel && !isModelAvailable && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <Download className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <div className="flex items-center justify-between">
                    <span>Model "{selectedModel}" is not available locally.</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => pullModel(selectedModel)}
                      disabled={isPullingModel}
                      className="bg-transparent"
                    >
                      {isPullingModel ? (
                        <>
                          <ReloadIcon className="h-4 w-4 mr-2 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download Model
                        </>
                      )}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Available Models List */}
            {availableModels.length > 0 && (
              <div className="space-y-2">
                <Label>Available Models</Label>
                <div className="flex flex-wrap gap-2">
                  {availableModels.map((model) => (
                    <Badge
                      key={model}
                      variant={model === selectedModel ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => setSelectedModel(model)}
                    >
                      {model}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={checkConnection}
            disabled={isConnecting || !baseURL}
            variant="outline"
            className="flex-1 bg-transparent"
          >
            {isConnecting ? (
              <>
                <ReloadIcon className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>

          <Button
            onClick={handleSave}
            disabled={connectionStatus !== "success" || !selectedModel || !isModelAvailable}
            className="flex-1"
          >
            Continue with {selectedModel}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
