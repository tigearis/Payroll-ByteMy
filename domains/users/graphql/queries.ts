import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      firstName
      lastName
      computedName
      email
      role
      isActive
      isStaff
      managerId
      clerkUserId
      createdAt
      updatedAt
      managerUser {
        id
        firstName
        lastName
        computedName
        email
        role
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: uuid!) {
    usersByPk(id: $id) {
      id
      firstName
      lastName
      computedName
      email
      role
      isActive
      isStaff
      managerId
      clerkUserId
      createdAt
      updatedAt
      managerUser {
        id
        firstName
        lastName
        computedName
        email
        role
      }
    }
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($id: uuid!, $role: String!) {
    updateUsersByPk(pkColumns: { id: $id }, _set: { role: $role }) {
      id
      role
      updatedAt
    }
  }
`;

export const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($id: uuid!, $isActive: Boolean!) {
    updateUsersByPk(pkColumns: { id: $id }, _set: { isActive: $isActive }) {
      id
      isActive
      updatedAt
    }
  }
`;