import { gql } from "@apollo/client";

// Placeholder queries file - these queries should be moved to the main GraphQL files
// This file exists to prevent import errors during the cleanup process

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      firstName
      lastName
      computedName
      email
      role
      position
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const USER_QUERIES = {
  GET_ALL_USERS,
  // Add other specific user queries here if needed
  placeholder: 'This file prevents import errors'
};

export default USER_QUERIES;