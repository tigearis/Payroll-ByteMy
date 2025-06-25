/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation PlaceholderBillingMutation {\n  __typename\n}": typeof types.PlaceholderBillingMutationDocument,
    "query PlaceholderBillingQuery {\n  __typename\n}": typeof types.PlaceholderBillingQueryDocument,
    "fragment UserCore on users {\n  id\n  name\n  email\n  username\n  role\n  isActive\n  isStaff\n  clerkUserId\n  createdAt\n  updatedAt\n}\n\nfragment UserBasic on users {\n  id\n  name\n  email\n  role\n  isActive\n}\n\nfragment UserWithManager on users {\n  ...UserCore\n  managerId\n  managerUser {\n    ...UserBasic\n  }\n}\n\nfragment RoleCore on roles {\n  id\n  name\n  description\n  displayName\n  priority\n  isSystemRole\n  createdAt\n}\n\nfragment PermissionCore on permissions {\n  id\n  action\n  description\n  resourceId\n  createdAt\n  updatedAt\n}\n\nfragment PermissionWithResource on permissions {\n  ...PermissionCore\n  relatedResource {\n    id\n    name\n    description\n  }\n}\n\nfragment ClientCore on clients {\n  id\n  name\n  contactEmail\n  contactPerson\n  contactPhone\n  active\n  createdAt\n  updatedAt\n}\n\nfragment ClientBasic on clients {\n  id\n  name\n  active\n}\n\nfragment ResourceCore on resources {\n  id\n  name\n  displayName\n  description\n  createdAt\n  updatedAt\n}\n\nfragment UserRoleCore on userRoles {\n  id\n  userId\n  roleId\n  createdAt\n  updatedAt\n}\n\nfragment RolePermissionCore on rolePermissions {\n  id\n  roleId\n  permissionId\n  conditions\n  createdAt\n  updatedAt\n}\n\nfragment AuditFields on auditLogs {\n  id\n  eventTime\n  action\n  resourceType\n  resourceId\n  userId\n  ipAddress\n  userAgent\n  success\n  userEmail\n  userRole\n}": typeof types.UserCoreFragmentDoc,
};
const documents: Documents = {
    "mutation PlaceholderBillingMutation {\n  __typename\n}": types.PlaceholderBillingMutationDocument,
    "query PlaceholderBillingQuery {\n  __typename\n}": types.PlaceholderBillingQueryDocument,
    "fragment UserCore on users {\n  id\n  name\n  email\n  username\n  role\n  isActive\n  isStaff\n  clerkUserId\n  createdAt\n  updatedAt\n}\n\nfragment UserBasic on users {\n  id\n  name\n  email\n  role\n  isActive\n}\n\nfragment UserWithManager on users {\n  ...UserCore\n  managerId\n  managerUser {\n    ...UserBasic\n  }\n}\n\nfragment RoleCore on roles {\n  id\n  name\n  description\n  displayName\n  priority\n  isSystemRole\n  createdAt\n}\n\nfragment PermissionCore on permissions {\n  id\n  action\n  description\n  resourceId\n  createdAt\n  updatedAt\n}\n\nfragment PermissionWithResource on permissions {\n  ...PermissionCore\n  relatedResource {\n    id\n    name\n    description\n  }\n}\n\nfragment ClientCore on clients {\n  id\n  name\n  contactEmail\n  contactPerson\n  contactPhone\n  active\n  createdAt\n  updatedAt\n}\n\nfragment ClientBasic on clients {\n  id\n  name\n  active\n}\n\nfragment ResourceCore on resources {\n  id\n  name\n  displayName\n  description\n  createdAt\n  updatedAt\n}\n\nfragment UserRoleCore on userRoles {\n  id\n  userId\n  roleId\n  createdAt\n  updatedAt\n}\n\nfragment RolePermissionCore on rolePermissions {\n  id\n  roleId\n  permissionId\n  conditions\n  createdAt\n  updatedAt\n}\n\nfragment AuditFields on auditLogs {\n  id\n  eventTime\n  action\n  resourceType\n  resourceId\n  userId\n  ipAddress\n  userAgent\n  success\n  userEmail\n  userRole\n}": types.UserCoreFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation PlaceholderBillingMutation {\n  __typename\n}"): (typeof documents)["mutation PlaceholderBillingMutation {\n  __typename\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PlaceholderBillingQuery {\n  __typename\n}"): (typeof documents)["query PlaceholderBillingQuery {\n  __typename\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment UserCore on users {\n  id\n  name\n  email\n  username\n  role\n  isActive\n  isStaff\n  clerkUserId\n  createdAt\n  updatedAt\n}\n\nfragment UserBasic on users {\n  id\n  name\n  email\n  role\n  isActive\n}\n\nfragment UserWithManager on users {\n  ...UserCore\n  managerId\n  managerUser {\n    ...UserBasic\n  }\n}\n\nfragment RoleCore on roles {\n  id\n  name\n  description\n  displayName\n  priority\n  isSystemRole\n  createdAt\n}\n\nfragment PermissionCore on permissions {\n  id\n  action\n  description\n  resourceId\n  createdAt\n  updatedAt\n}\n\nfragment PermissionWithResource on permissions {\n  ...PermissionCore\n  relatedResource {\n    id\n    name\n    description\n  }\n}\n\nfragment ClientCore on clients {\n  id\n  name\n  contactEmail\n  contactPerson\n  contactPhone\n  active\n  createdAt\n  updatedAt\n}\n\nfragment ClientBasic on clients {\n  id\n  name\n  active\n}\n\nfragment ResourceCore on resources {\n  id\n  name\n  displayName\n  description\n  createdAt\n  updatedAt\n}\n\nfragment UserRoleCore on userRoles {\n  id\n  userId\n  roleId\n  createdAt\n  updatedAt\n}\n\nfragment RolePermissionCore on rolePermissions {\n  id\n  roleId\n  permissionId\n  conditions\n  createdAt\n  updatedAt\n}\n\nfragment AuditFields on auditLogs {\n  id\n  eventTime\n  action\n  resourceType\n  resourceId\n  userId\n  ipAddress\n  userAgent\n  success\n  userEmail\n  userRole\n}"): (typeof documents)["fragment UserCore on users {\n  id\n  name\n  email\n  username\n  role\n  isActive\n  isStaff\n  clerkUserId\n  createdAt\n  updatedAt\n}\n\nfragment UserBasic on users {\n  id\n  name\n  email\n  role\n  isActive\n}\n\nfragment UserWithManager on users {\n  ...UserCore\n  managerId\n  managerUser {\n    ...UserBasic\n  }\n}\n\nfragment RoleCore on roles {\n  id\n  name\n  description\n  displayName\n  priority\n  isSystemRole\n  createdAt\n}\n\nfragment PermissionCore on permissions {\n  id\n  action\n  description\n  resourceId\n  createdAt\n  updatedAt\n}\n\nfragment PermissionWithResource on permissions {\n  ...PermissionCore\n  relatedResource {\n    id\n    name\n    description\n  }\n}\n\nfragment ClientCore on clients {\n  id\n  name\n  contactEmail\n  contactPerson\n  contactPhone\n  active\n  createdAt\n  updatedAt\n}\n\nfragment ClientBasic on clients {\n  id\n  name\n  active\n}\n\nfragment ResourceCore on resources {\n  id\n  name\n  displayName\n  description\n  createdAt\n  updatedAt\n}\n\nfragment UserRoleCore on userRoles {\n  id\n  userId\n  roleId\n  createdAt\n  updatedAt\n}\n\nfragment RolePermissionCore on rolePermissions {\n  id\n  roleId\n  permissionId\n  conditions\n  createdAt\n  updatedAt\n}\n\nfragment AuditFields on auditLogs {\n  id\n  eventTime\n  action\n  resourceType\n  resourceId\n  userId\n  ipAddress\n  userAgent\n  success\n  userEmail\n  userRole\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;