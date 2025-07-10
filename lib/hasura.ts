interface HasuraConfig {
  endpoint: string
  adminSecret: string
  role?: string
}

export async function executeHasuraQuery(config: HasuraConfig, query: string, variables: Record<string, any> = {}) {
  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": config.adminSecret,
      ...(config.role && { "x-hasura-role": config.role }),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const result = await response.json()

  if (result.errors) {
    throw new Error(result.errors[0].message)
  }

  return result.data
}

export async function introspectSchema(config: HasuraConfig) {
  const introspectionQuery = `
    query IntrospectionQuery {
      __schema {
        queryType {
          fields {
            name
            type {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
            args {
              name
              type {
                name
                kind
                ofType {
                  name
                  kind
                  ofType {
                    name
                    kind
                  }
                }
              }
            }
          }
        }
        types {
          name
          kind
          fields {
            name
            type {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
          }
        }
      }
    }
  `

  try {
    const result = await executeHasuraQuery(config, introspectionQuery)
    
    // Process the introspection result to extract table information
    const tables = processIntrospectionResult(result)
    
    return tables
  } catch (error) {
    console.error('❌ [Hasura Introspection] Failed to introspect schema:', error)
    // Return empty array on error, will fall back to static schema
    return []
  }
}

function processIntrospectionResult(introspectionData: any) {
  const schema = introspectionData.__schema
  const queryFields = schema.queryType.fields
  const types = schema.types

  // Extract table information from query fields
  const tables = queryFields
    .filter((field: any) => {
      // Filter out aggregate and connection fields, focus on main table queries
      return !field.name.includes("_aggregate") && !field.name.includes("_by_pk") && !field.name.startsWith("__")
    })
    .map((field: any) => {
      const tableName = field.name

      // Find the corresponding type definition
      const tableType = types.find(
        (type: any) => type.name === field.type.name || (field.type.ofType && type.name === field.type.ofType.name),
      )

      if (!tableType || !tableType.fields) {
        return null
      }

      // Extract column information
      const columns = tableType.fields
        .filter((field: any) => !field.name.startsWith("__"))
        .map((field: any) => ({
          name: field.name,
          type: getFieldType(field.type),
          nullable: field.type.kind !== "NON_NULL",
          isPrimaryKey: field.name === "id" || field.name.endsWith("_id"),
          isForeignKey: field.name.endsWith("_id") && field.name !== "id",
        }))

      // Extract relationship information (simplified)
      const relationships = tableType.fields
        .filter((field: any) => {
          const fieldType = field.type.ofType || field.type
          return fieldType.kind === "OBJECT" && types.some((t: any) => t.name === fieldType.name && t.kind === "OBJECT")
        })
        .map((field: any) => ({
          name: field.name,
          type: field.type.kind === "LIST" ? "array" : "object",
          remoteTable: (field.type.ofType || field.type).name,
        }))

      return {
        name: tableName,
        columns,
        relationships,
      }
    })
    .filter(Boolean)

  return tables
}

function getFieldType(type: any): string {
  if (!type || typeof type !== 'object') {
    return "Unknown"
  }

  if (type.kind === "NON_NULL") {
    return type.ofType ? getFieldType(type.ofType) : "Unknown"
  }

  if (type.kind === "LIST") {
    return type.ofType ? `[${getFieldType(type.ofType)}]` : "[Unknown]"
  }

  return type.name || "Unknown"
}
