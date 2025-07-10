"use client"

import { ChevronDownIcon, ChevronRightIcon, ReloadIcon } from "@radix-ui/react-icons"
import { Table, Key, Link } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SchemaExplorerProps {
  hasuraConfig: {
    endpoint: string
    adminSecret: string
    role?: string
  }
}

interface TableInfo {
  name: string
  columns: Array<{
    name: string
    type: string
    nullable: boolean
    isPrimaryKey: boolean
    isForeignKey: boolean
  }>
  relationships: Array<{
    name: string
    type: "object" | "array"
    remoteTable: string
  }>
}

export function SchemaExplorer({ hasuraConfig }: SchemaExplorerProps) {
  const [schema, setSchema] = useState<TableInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchSchema()
  }, [hasuraConfig])

  const fetchSchema = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/schema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hasuraConfig),
      })

      const result = await response.json()

      if (result.success) {
        setSchema(result.schema)
      } else {
        setError(result.error || "Failed to fetch schema")
      }
    } catch (err) {
      setError("Failed to fetch schema")
    } finally {
      setLoading(false)
    }
  }

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables)
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName)
    } else {
      newExpanded.add(tableName)
    }
    setExpandedTables(newExpanded)
  }

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-500">
          <ReloadIcon className="h-4 w-4 animate-spin" />
          <span>Loading schema...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800 text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchSchema} className="mt-2 bg-transparent">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Database Schema</h3>
          <Badge variant="outline">{schema.length} tables</Badge>
        </div>

        {schema.map((table) => (
          <Collapsible
            key={table.name}
            open={expandedTables.has(table.name)}
            onOpenChange={() => toggleTable(table.name)}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                <div className="flex items-center space-x-2">
                  {expandedTables.has(table.name) ? (
                    <ChevronDownIcon className="h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4" />
                  )}
                  <Table className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{table.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {table.columns.length} cols
                  </Badge>
                </div>
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="ml-6 mt-2 space-y-2">
              {/* Columns */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Columns</p>
                {table.columns.map((column) => (
                  <div key={column.name} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono">{column.name}</span>
                      {column.isPrimaryKey && <Key className="h-3 w-3 text-yellow-600" />}
                      {column.isForeignKey && <Link className="h-3 w-3 text-blue-600" />}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {column.type}
                      </Badge>
                      {!column.nullable && (
                        <Badge variant="secondary" className="text-xs">
                          NOT NULL
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Relationships */}
              {table.relationships.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Relationships</p>
                  {table.relationships.map((rel) => (
                    <div key={rel.name} className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm">
                      <span className="font-mono">{rel.name}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant={rel.type === "array" ? "default" : "secondary"} className="text-xs">
                          {rel.type === "array" ? "One-to-Many" : "Many-to-One"}
                        </Badge>
                        <span className="text-xs text-gray-600">→ {rel.remoteTable}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </ScrollArea>
  )
}
