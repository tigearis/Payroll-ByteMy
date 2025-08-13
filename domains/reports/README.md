# Enhanced Report Builder

This directory contains the implementation of the enhanced report builder for Payroll ByteMy. The report builder provides multiple ways for users to create and manage reports, from a guided step-by-step approach to advanced GraphQL queries with AI assistance.

## Features

### Guided Report Builder

A step-by-step wizard that guides users through the report creation process:

1. **Domain Selection**: Choose which data domains to include in the report
2. **Field Selection**: Select specific fields to include from each domain
3. **Filter Builder**: Add conditions to filter the data
4. **Visualization**: Configure how the report data should be displayed
5. **Review & Save**: Review the report configuration and save it as a template

### AI-Assisted Query Builder

An AI-powered interface for creating reports using natural language:

- Describe the report you want in plain English
- AI generates a GraphQL query based on your description
- Edit the generated query if needed
- Save the query as a template for future use

### Advanced Query Builder

For power users who need more control:

- GraphQL editor with syntax highlighting
- Schema explorer to browse available fields
- Parameter management with type validation
- Query execution with results preview
- Save queries as templates

### Saved Reports Management

A comprehensive interface for managing report templates:

- Browse saved reports
- Share reports with other users
- Schedule reports to run automatically
- Export reports in various formats

## Component Structure

```
reports/
├── components/
│   ├── ai-assisted/
│   │   ├── AIAssistedQueryBuilder.tsx
│   │   └── AIQuerySuggestions.tsx
│   ├── guided-builder/
│   │   ├── DomainSelector.tsx
│   │   ├── FieldSelector.tsx
│   │   ├── GuidedReportBuilder.tsx
│   │   ├── SimpleFilterBuilder.tsx
│   │   ├── VisualizationConfigurator.tsx
│   │   └── ReportSummary.tsx
│   ├── graphql-builder/
│   │   └── GraphQLQueryBuilder.tsx
│   ├── shared/
│   │   ├── ReportPreview.tsx
│   │   └── SavedReportsList.tsx
│   └── schema-explorer/
│       └── SchemaExplorer.tsx
├── hooks/
│   ├── useAIQueryGeneration.ts
│   ├── useReportMetadata.ts
│   ├── useReportOperations.ts
│   ├── useReportPreview.ts
│   └── useReportTemplates.ts
└── types/
    ├── filter.types.ts
    └── report.types.ts
```

## Usage

The main entry point is the `ReportBuilder` component in `components/reports/report-builder.tsx`. This component provides a tabbed interface for accessing the different report creation methods.

```tsx
import { ReportBuilder } from "@/components/reports/report-builder";

export default function ReportsPage() {
  return (
    <div>
      <h1>Reports</h1>
      <ReportBuilder />
    </div>
  );
}
```

## API Endpoints

### `/api/reports/ai/generate-query`

Generates a GraphQL query based on a natural language description.

**Request:**

```json
{
  "prompt": "Show me payroll totals by department for last quarter"
}
```

**Response:**

```json
{
  "query": "query PayrollByDepartment { ... }",
  "explanation": "This query shows payroll totals grouped by department...",
  "parameters": {}
}
```

## Future Enhancements

- **Enhanced AI capabilities**: Improve query generation with more context
- **Visual query builder**: Drag-and-drop interface for building queries
- **Report sharing**: Enhanced sharing capabilities with fine-grained permissions
- **Advanced visualizations**: More chart types and customization options
- **Mobile optimization**: Better support for report creation on mobile devices
