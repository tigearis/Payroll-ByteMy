/**
 * Extracts parameter names from a GraphQL query string
 * Looks for {{paramName}} syntax in the query
 *
 * @param query The GraphQL query string
 * @returns Array of parameter names
 */
export function extractParametersFromQuery(query: string): string[] {
  // Match all occurrences of {{paramName}}
  const matches = query.match(/\{\{([^}]+)\}\}/g) || [];

  // Extract parameter names and remove duplicates
  const paramNames = matches
    .map(match => match.replace(/\{\{|\}\}/g, ""))
    .filter((value, index, self) => self.indexOf(value) === index);

  return paramNames;
}

/**
 * Validates a GraphQL query string
 *
 * @param query The GraphQL query string
 * @returns Object with validation result
 */
export function validateGraphQLQuery(query: string): {
  valid: boolean;
  error?: string;
} {
  try {
    // Basic validation - check for balanced braces
    const openBraces = (query.match(/\{/g) || []).length;
    const closeBraces = (query.match(/\}/g) || []).length;

    if (openBraces !== closeBraces) {
      return {
        valid: false,
        error: `Unbalanced braces: ${openBraces} opening and ${closeBraces} closing`,
      };
    }

    // Check for query or mutation keyword
    if (!query.trim().match(/^(query|mutation)\s+\w+/i)) {
      return {
        valid: false,
        error:
          "Query must start with 'query' or 'mutation' keyword followed by a name",
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error:
        error instanceof Error ? error.message : "Unknown validation error",
    };
  }
}

/**
 * Formats a GraphQL query string with proper indentation
 *
 * @param query The GraphQL query string
 * @returns Formatted query string
 */
export function formatGraphQLQuery(query: string): string {
  try {
    let formatted = "";
    let indentLevel = 0;
    let inString = false;

    for (let i = 0; i < query.length; i++) {
      const char = query[i];

      // Handle string literals
      if (char === '"' && (i === 0 || query[i - 1] !== "\\")) {
        inString = !inString;
        formatted += char;
        continue;
      }

      if (!inString) {
        if (char === "{") {
          formatted += char;
          formatted += "\n" + " ".repeat(++indentLevel * 2);
        } else if (char === "}") {
          formatted += "\n" + " ".repeat(--indentLevel * 2) + char;
        } else if (char === ",") {
          formatted += char + "\n" + " ".repeat(indentLevel * 2);
        } else {
          formatted += char;
        }
      } else {
        formatted += char;
      }
    }

    return formatted;
  } catch (error) {
    console.error("Error formatting GraphQL query:", error);
    return query; // Return original query if formatting fails
  }
}
