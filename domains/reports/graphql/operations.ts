import { gql } from "@apollo/client";

// Import all GraphQL operations
export const GET_REPORT_METADATA = gql`
  query GetReportMetadata {
    reportMetadata {
      availableFields
      relationships
      domains
    }
  }
`;

export const GET_REPORT_TEMPLATES = gql`
  query GetReportTemplates(
    $userId: String
    $isPublic: Boolean
    $tags: [String!]
  ) {
    reportTemplates(userId: $userId, isPublic: $isPublic, tags: $tags) {
      id
      name
      description
      domains
      fields
      filters {
        field
        operator
        value
        conjunction
      }
      sorts {
        field
        direction
      }
      limit
      createdBy
      createdAt
      updatedAt
      isPublic
      tags
    }
  }
`;

export const GET_REPORT_JOB = gql`
  query GetReportJob($id: ID!) {
    reportJob(id: $id) {
      id
      config
      status
      progress
      error
      result
      startedAt
      completedAt
      userId
    }
  }
`;

export const GENERATE_REPORT = gql`
  mutation GenerateReport($config: JSON!) {
    generateReport(config: $config) {
      id
      config
      status
      progress
      error
      result
      startedAt
      completedAt
      userId
    }
  }
`;

export const SAVE_REPORT_TEMPLATE = gql`
  mutation SaveReportTemplate($template: JSON!) {
    saveReportTemplate(template: $template) {
      id
      name
      description
      domains
      fields
      filters {
        field
        operator
        value
        conjunction
      }
      sorts {
        field
        direction
      }
      limit
      createdBy
      createdAt
      updatedAt
      isPublic
      tags
    }
  }
`;

export const UPDATE_REPORT_TEMPLATE = gql`
  mutation UpdateReportTemplate($id: ID!, $template: JSON!) {
    updateReportTemplate(id: $id, template: $template) {
      id
      name
      description
      domains
      fields
      filters {
        field
        operator
        value
        conjunction
      }
      sorts {
        field
        direction
      }
      limit
      createdBy
      createdAt
      updatedAt
      isPublic
      tags
    }
  }
`;

export const DELETE_REPORT_TEMPLATE = gql`
  mutation DeleteReportTemplate($id: ID!) {
    deleteReportTemplate(id: $id)
  }
`;
