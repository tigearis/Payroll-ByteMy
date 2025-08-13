"use client";

import { useQuery, gql } from "@apollo/client";
import { Search, ChevronRight, ChevronDown, Database, Key } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// GraphQL queries for schema metadata
export const GET_SCHEMA_METADATA = gql`
  query GetSchemaMetadata {
    __schema {
      types {
        name
        kind
        description
        fields {
          name
          description
          type {
            name
            kind
            ofType {
              name
              kind
              fields {
                name
                description
                type {
                  name
                  kind
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_USER_TABLE_PERMISSIONS = gql`
  query GetUserTablePermissions {
    userAccessibleTables {
      tableSchema
      tableName
      permissions
    }
  }
`;

interface SchemaExplorerProps {
  onSelectField: (field: string) => void;
  className?: string;
}

export function SchemaExplorer({
  onSelectField,
  className,
}: SchemaExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>(
    {}
  );

  // Fetch schema metadata
  const { data: schemaData, loading: schemaLoading } =
    useQuery(GET_SCHEMA_METADATA);

  // Fetch user table permissions
  const { data: permissionsData, loading: permissionsLoading } = useQuery(
    GET_USER_TABLE_PERMISSIONS,
    { fetchPolicy: "cache-first" }
  );

  const loading = schemaLoading || permissionsLoading;

  // Process schema data
  const types =
    schemaData?.__schema?.types?.filter((type: any) => {
      // Filter out internal types
      return type?.kind === "OBJECT" && !type?.name?.startsWith("__");
    }) || [];

  // Process permissions data
  const accessibleTables =
    permissionsData?.userAccessibleTables?.reduce(
      (acc: Record<string, any>, table: any) => {
        acc[`${table.tableSchema}_${table.tableName}`] = table;
        return acc;
      },
      {}
    ) || {};

  // Filter types based on search term
  const filteredTypes = types.filter((type: any) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      type?.name?.toLowerCase().includes(searchLower) ||
      type?.description?.toLowerCase().includes(searchLower) ||
      type?.fields?.some(
        (field: any) =>
          field?.name?.toLowerCase().includes(searchLower) ||
          field?.description?.toLowerCase().includes(searchLower)
      )
    );
  });

  const toggleType = (typeName: string) => {
    setExpandedTypes(prev => ({
      ...prev,
      [typeName]: !prev[typeName],
    }));
  };

  const toggleField = (fieldPath: string) => {
    setExpandedFields(prev => ({
      ...prev,
      [fieldPath]: !prev[fieldPath],
    }));
  };

  const handleSelectField = (field: string) => {
    onSelectField(field);
  };

  return (
    <div className={className}>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search schema..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <ScrollArea className="h-[500px]">
          <div className="space-y-1">
            {filteredTypes.map((type: any) => (
              <div key={type.name} className="rounded-md">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-2 font-mono text-sm"
                  onClick={() => toggleType(type.name)}
                >
                  {expandedTypes[type.name] ? (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}
                  <Database className="h-4 w-4 mr-2" />
                  {type.name}
                </Button>

                {expandedTypes[type.name] && type.fields && (
                  <div className="ml-6 space-y-1 mt-1">
                    {type.fields.map((field: any) => {
                      const fieldPath = `${type.name}.${field.name}`;
                      const isExpandable =
                        field.type.kind === "OBJECT" ||
                        field.type.kind === "LIST";

                      return (
                        <div key={fieldPath}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start px-2 font-mono text-xs"
                            onClick={() => {
                              if (isExpandable) {
                                toggleField(fieldPath);
                              } else {
                                handleSelectField(field.name);
                              }
                            }}
                          >
                            {isExpandable ? (
                              expandedFields[fieldPath] ? (
                                <ChevronDown className="h-3 w-3 mr-2" />
                              ) : (
                                <ChevronRight className="h-3 w-3 mr-2" />
                              )
                            ) : (
                              <Key className="h-3 w-3 mr-2" />
                            )}
                            {field.name}
                            <span className="ml-2 text-muted-foreground">
                              {field.type.name || field.type.ofType?.name || ""}
                              {field.type.kind === "LIST" && "[]"}
                            </span>
                          </Button>

                          {isExpandable &&
                            expandedFields[fieldPath] &&
                            field.type.ofType?.fields && (
                              <div className="ml-6 space-y-1 mt-1">
                                {field.type.ofType.fields.map(
                                  (subField: any) => (
                                    <Button
                                      key={`${fieldPath}.${subField.name}`}
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start px-2 font-mono text-xs"
                                      onClick={() =>
                                        handleSelectField(
                                          `${field.name} { ${subField.name} }`
                                        )
                                      }
                                    >
                                      <Key className="h-3 w-3 mr-2" />
                                      {subField.name}
                                      <span className="ml-2 text-muted-foreground">
                                        {subField.type.name ||
                                          subField.type.ofType?.name ||
                                          ""}
                                      </span>
                                    </Button>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
