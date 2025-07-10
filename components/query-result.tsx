"use client"

import { CopyIcon, CheckIcon } from "@radix-ui/react-icons"
import { Code, BarChart3, TableIcon, Eye } from "lucide-react"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface QueryResultProps {
  content: string
}

export function QueryResult({ content }: QueryResultProps) {
  const [copiedQuery, setCopiedQuery] = useState(false)

  // Try to parse the content as JSON to see if it contains structured data
  let parsedContent
  try {
    parsedContent = JSON.parse(content)
  } catch {
    // If it's not JSON, treat it as markdown/text
    parsedContent = null
  }

  const copyQuery = async (query: string) => {
    await navigator.clipboard.writeText(query)
    setCopiedQuery(true)
    setTimeout(() => setCopiedQuery(false), 2000)
  }

  // If we have structured data with query and results
  if (parsedContent && parsedContent.query && parsedContent.data) {
    const { query, data, summary, insights } = parsedContent

    return (
      <div className="space-y-4">
        {/* Summary */}
        {summary && (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        )}

        {/* Data Visualization */}
        <Tabs defaultValue="formatted" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="formatted" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Formatted</span>
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center space-x-2">
              <TableIcon className="h-4 w-4" />
              <span>Table</span>
            </TabsTrigger>
            <TabsTrigger value="query" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Query</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="formatted" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <DataFormatter data={data} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <DataTable data={data} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="query" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">GraphQL Query</CardTitle>
                <Button variant="outline" size="sm" onClick={() => copyQuery(query)}>
                  {copiedQuery ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    <code>{query}</code>
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Insights */}
        {insights && insights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {insights.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Badge variant="outline" className="mt-0.5">
                      {index + 1}
                    </Badge>
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Otherwise, render as markdown
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}

function DataFormatter({ data }: { data: any }) {
  if (Array.isArray(data)) {
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <ObjectFormatter obj={item} />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (typeof data === "object" && data !== null) {
    return <ObjectFormatter obj={data} />
  }

  return <div className="text-sm text-gray-600">{String(data)}</div>
}

function ObjectFormatter({ obj }: { obj: any }) {
  return (
    <div className="space-y-2">
      {Object.entries(obj).map(([key, value]) => (
        <div key={key} className="flex items-start space-x-3">
          <Badge variant="secondary" className="text-xs">
            {key}
          </Badge>
          <div className="flex-1">
            {typeof value === "object" && value !== null ? (
              Array.isArray(value) ? (
                <div className="space-y-1">
                  {value.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600 pl-2 border-l-2 border-gray-200">
                      {typeof item === "object" ? JSON.stringify(item) : String(item)}
                    </div>
                  ))}
                </div>
              ) : (
                <ObjectFormatter obj={value} />
              )
            ) : (
              <span className="text-sm text-gray-900">{String(value)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function DataTable({ data }: { data: any }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="p-8 text-center text-gray-500">No tabular data to display</div>
  }

  const columns = Object.keys(data[0])

  return (
    <ScrollArea className="h-96">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column} className="font-medium">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column} className="text-sm">
                  {typeof row[column] === "object" && row[column] !== null
                    ? JSON.stringify(row[column])
                    : String(row[column] || "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}
