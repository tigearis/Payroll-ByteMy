/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

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
    "fragment UserFragment on users {\n  id\n  name\n  username\n  role\n  is_active\n  is_staff\n  manager_id\n  created_at\n  updated_at\n}\n\nfragment UserWithManagerFragment on users {\n  ...UserFragment\n  manager {\n    id\n    name\n    is_staff\n  }\n}": typeof types.UserFragmentFragmentDoc,
    "mutation CreateUser($input: users_insert_input!) {\n  insert_users_one(object: $input) {\n    ...UserFragment\n  }\n}\n\nmutation UpdateUser($id: uuid!, $changes: users_set_input!) {\n  update_users_by_pk(pk_columns: {id: $id}, _set: $changes) {\n    ...UserFragment\n  }\n}\n\nmutation UpdateMyProfile($id: uuid!, $name: String, $email: String, $username: String) {\n  update_users_by_pk(\n    pk_columns: {id: $id}\n    _set: {name: $name, email: $email, username: $username}\n  ) {\n    ...UserFragment\n  }\n}\n\nmutation DeleteUser($id: uuid!) {\n  delete_users_by_pk(id: $id) {\n    id\n    name\n    email\n  }\n}": typeof types.CreateUserDocument,
    "query GetUsers($limit: Int = 50, $offset: Int = 0, $where: users_bool_exp = {}, $order_by: [users_order_by!] = [{created_at: desc}]) {\n  users(limit: $limit, offset: $offset, where: $where, order_by: $order_by) {\n    ...UserFragment\n    manager {\n      id\n      name\n    }\n  }\n  users_aggregate(where: $where) {\n    aggregate {\n      count\n    }\n  }\n}\n\nquery GetUserById($id: uuid!) {\n  users_by_pk(id: $id) {\n    ...UserWithManagerFragment\n  }\n}\n\nquery GetStaffMembers($limit: Int = 50, $where: users_bool_exp = {is_staff: {_eq: true}}, $order_by: [users_order_by!] = [{name: asc}]) {\n  users(limit: $limit, where: $where, order_by: $order_by) {\n    ...UserFragment\n    manager {\n      id\n      name\n    }\n  }\n  users_aggregate(where: $where) {\n    aggregate {\n      count\n    }\n  }\n}": typeof types.GetUsersDocument,
    "subscription UsersUpdated($where: users_bool_exp = {}) {\n  users(where: $where, order_by: {updated_at: desc}) {\n    ...UserFragment\n    manager {\n      id\n      name\n    }\n  }\n}\n\nsubscription UserProfileUpdated($userId: uuid!) {\n  users_by_pk(id: $userId) {\n    ...UserWithManagerFragment\n  }\n}": typeof types.UsersUpdatedDocument,
};
const documents: Documents = {
    "fragment UserFragment on users {\n  id\n  name\n  username\n  role\n  is_active\n  is_staff\n  manager_id\n  created_at\n  updated_at\n}\n\nfragment UserWithManagerFragment on users {\n  ...UserFragment\n  manager {\n    id\n    name\n    is_staff\n  }\n}": types.UserFragmentFragmentDoc,
    "mutation CreateUser($input: users_insert_input!) {\n  insert_users_one(object: $input) {\n    ...UserFragment\n  }\n}\n\nmutation UpdateUser($id: uuid!, $changes: users_set_input!) {\n  update_users_by_pk(pk_columns: {id: $id}, _set: $changes) {\n    ...UserFragment\n  }\n}\n\nmutation UpdateMyProfile($id: uuid!, $name: String, $email: String, $username: String) {\n  update_users_by_pk(\n    pk_columns: {id: $id}\n    _set: {name: $name, email: $email, username: $username}\n  ) {\n    ...UserFragment\n  }\n}\n\nmutation DeleteUser($id: uuid!) {\n  delete_users_by_pk(id: $id) {\n    id\n    name\n    email\n  }\n}": types.CreateUserDocument,
    "query GetUsers($limit: Int = 50, $offset: Int = 0, $where: users_bool_exp = {}, $order_by: [users_order_by!] = [{created_at: desc}]) {\n  users(limit: $limit, offset: $offset, where: $where, order_by: $order_by) {\n    ...UserFragment\n    manager {\n      id\n      name\n    }\n  }\n  users_aggregate(where: $where) {\n    aggregate {\n      count\n    }\n  }\n}\n\nquery GetUserById($id: uuid!) {\n  users_by_pk(id: $id) {\n    ...UserWithManagerFragment\n  }\n}\n\nquery GetStaffMembers($limit: Int = 50, $where: users_bool_exp = {is_staff: {_eq: true}}, $order_by: [users_order_by!] = [{name: asc}]) {\n  users(limit: $limit, where: $where, order_by: $order_by) {\n    ...UserFragment\n    manager {\n      id\n      name\n    }\n  }\n  users_aggregate(where: $where) {\n    aggregate {\n      count\n    }\n  }\n}": types.GetUsersDocument,
    "subscription UsersUpdated($where: users_bool_exp = {}) {\n  users(where: $where, order_by: {updated_at: desc}) {\n    ...UserFragment\n    manager {\n      id\n      name\n    }\n  }\n}\n\nsubscription UserProfileUpdated($userId: uuid!) {\n  users_by_pk(id: $userId) {\n    ...UserWithManagerFragment\n  }\n}": types.UsersUpdatedDocument,
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
export function graphql(source: "fragment UserFragment on users {\n  id\n  name\n  username\n  role\n  is_active\n  is_staff\n  manager_id\n  created_at\n  updated_at\n}\n\nfragment UserWithManagerFragment on users {\n  ...UserFragment\n  manager {\n    id\n    name\n    is_staff\n  }\n}"): (typeof documents)["fragment UserFragment on users {\n  id\n  name\n  username\n  role\n  is_active\n  is_staff\n  manager_id\n  created_at\n  updated_at\n}\n\nfragment UserWithManagerFragment on users {\n  ...UserFragment\n  manager {\n    id\n    name\n    is_staff\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateUser($input: users_insert_input!) {\n  insert_users_one(object: $input) {\n    ...UserFragment\n  }\n}\n\nmutation UpdateUser($id: uuid!, $changes: users_set_input!) {\n  update_users_by_pk(pk_columns: {id: $id}, _set: $changes) {\n    ...UserFragment\n  }\n}\n\nmutation UpdateMyProfile($id: uuid!, $name: String, $email: String, $username: String) {\n  update_users_by_pk(\n    pk_columns: {id: $id}\n    _set: {name: $name, email: $email, username: $username}\n  ) {\n    ...UserFragment\n  }\n}\n\nmutation DeleteUser($id: uuid!) {\n  delete_users_by_pk(id: $id) {\n    id\n    name\n    email\n  }\n}"): (typeof documents)["mutation CreateUser($input: users_insert_input!) {\n  insert_users_one(object: $input) {\n    ...UserFragment\n  }\n}\n\nmutation UpdateUser($id: uuid!, $changes: users_set_input!) {\n  update_users_by_pk(pk_columns: {id: $id}, _set: $changes) {\n    ...UserFragment\n  }\n}\n\nmutation UpdateMyProfile($id: uuid!, $name: String, $email: String, $username: String) {\n  update_users_by_pk(\n    pk_columns: {id: $id}\n    _set: {name: $name, email: $email, username: $username}\n  ) {\n    ...UserFragment\n  }\n}\n\nmutation DeleteUser($id: uuid!) {\n  delete_users_by_pk(id: $id) {\n    id\n    name\n    email\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetUsers($limit: Int = 50, $offset: Int = 0, $where: users_bool_exp = {}, $order_by: [users_order_by!] = [{created_at: desc}]) {\n  users(limit: $limit, offset: $offset, where: $where, order_by: $order_by) {\n    ...UserFragment\n    manager {\n      id\n      name\n    }\n  }\n  users_aggregate(where: $where) {\n    aggregate {\n      count\n    }\n  }\n}\n\nquery GetUserById($id: uuid!) {\n  users_by_pk(id: $id) {\n    ...UserWithManagerFragment\n  }\n}\n\nquery GetStaffMembers($limit: Int = 50, $where: users_bool_exp = {is_staff: {_eq: true}}, $order_by: [users_order_by!] = [{name: asc}]) {\n  users(limit: $limit, where: $where, order_by: $order_by) {\n    ...UserFragment\n    manager {\n      id\n      name\n    }\n  }\n  users_aggregate(where: $where) {\n    aggregate {\n      count\n    }\n  }\n}"): (typeof documents)["query GetUsers($limit: Int = 50, $offset: Int = 0, $where: users_bool_exp = {}, $order_by: [users_order_by!] = [{created_at: desc}]) {\n  users(limit: $limit, offset: $offset, where: $where, order_by: $order_by) {\n    ...UserFragment\n    manager {\n      id\n      name\n    }\n  }\n  users_aggregate(where: $where) {\n    aggregate {\n      count\n    }\n  }\n}\n\nquery GetUserById($id: uuid!) {\n  users_by_pk(id: $id) {\n    ...UserWithManagerFragment\n  }\n}\n\nquery GetStaffMembers($limit: Int = 50, $where: users_bool_exp = {is_staff: {_eq: true}}, $order_by: [users_order_by!] = [{name: asc}]) {\n  users(limit: $limit, where: $where, order_by: $order_by) {\n    ...UserFragment\n    manager {\n      id\n      name\n    }\n  }\n  users_aggregate(where: $where) {\n    aggregate {\n      count\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription UsersUpdated($where: users_bool_exp = {}) {\n  users(where: $where, order_by: {updated_at: desc}) {\n    ...UserFragment\n    manager {\n      id\n      name\n    }\n  }\n}\n\nsubscription UserProfileUpdated($userId: uuid!) {\n  users_by_pk(id: $userId) {\n    ...UserWithManagerFragment\n  }\n}"): (typeof documents)["subscription UsersUpdated($where: users_bool_exp = {}) {\n  users(where: $where, order_by: {updated_at: desc}) {\n    ...UserFragment\n    manager {\n      id\n      name\n    }\n  }\n}\n\nsubscription UserProfileUpdated($userId: uuid!) {\n  users_by_pk(id: $userId) {\n    ...UserWithManagerFragment\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;