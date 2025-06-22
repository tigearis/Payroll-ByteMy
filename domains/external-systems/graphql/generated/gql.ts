/* eslint-disable */
import * as types from "./graphql";
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

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
  "fragment ExternalSystemCore on external_systems {\n  id\n  name\n  url\n  description\n  icon\n}\n\nfragment ClientExternalSystemCore on client_external_systems {\n  id\n  client_id\n  system_id\n  system_client_id\n}\n\nfragment ClientExternalSystemWithRelations on client_external_systems {\n  ...ClientExternalSystemCore\n  client {\n    id\n    name\n  }\n  external_system {\n    ...ExternalSystemCore\n  }\n}": typeof types.ExternalSystemCoreFragmentDoc;
  "mutation CreateExternalSystem($object: external_systems_insert_input!) {\n  insert_external_systems_one(object: $object) {\n    ...ExternalSystemCore\n  }\n}\n\nmutation UpdateExternalSystem($id: uuid!, $set: external_systems_set_input!) {\n  update_external_systems_by_pk(pk_columns: {id: $id}, _set: $set) {\n    ...ExternalSystemCore\n  }\n}\n\nmutation DeleteExternalSystem($id: uuid!) {\n  delete_external_systems_by_pk(id: $id) {\n    id\n  }\n}\n\nmutation LinkClientToExternalSystem($object: client_external_systems_insert_input!) {\n  insert_client_external_systems_one(object: $object) {\n    ...ClientExternalSystemWithRelations\n  }\n}\n\nmutation UpdateClientExternalSystem($id: uuid!, $set: client_external_systems_set_input!) {\n  update_client_external_systems_by_pk(pk_columns: {id: $id}, _set: $set) {\n    ...ClientExternalSystemWithRelations\n  }\n}\n\nmutation UnlinkClientFromExternalSystem($id: uuid!) {\n  delete_client_external_systems_by_pk(id: $id) {\n    id\n  }\n}\n\nmutation BulkLinkClientsToExternalSystem($objects: [client_external_systems_insert_input!]!) {\n  insert_client_external_systems(objects: $objects) {\n    returning {\n      ...ClientExternalSystemWithRelations\n    }\n    affected_rows\n  }\n}": typeof types.CreateExternalSystemDocument;
  "query GetExternalSystems($where: external_systems_bool_exp, $order_by: [external_systems_order_by!]) {\n  external_systems(where: $where, order_by: $order_by) {\n    ...ExternalSystemCore\n    client_external_systems_aggregate {\n      aggregate {\n        count\n      }\n    }\n  }\n}\n\nquery GetExternalSystemById($id: uuid!) {\n  external_systems_by_pk(id: $id) {\n    ...ExternalSystemCore\n    client_external_systems {\n      ...ClientExternalSystemWithRelations\n    }\n  }\n}\n\nquery GetClientExternalSystems($clientId: uuid!) {\n  client_external_systems(\n    where: {client_id: {_eq: $clientId}}\n    order_by: {created_at: desc}\n  ) {\n    ...ClientExternalSystemWithRelations\n  }\n}\n\nquery GetClientsByExternalSystem($system_id: uuid!) {\n  client_external_systems(\n    where: {system_id: {_eq: $system_id}}\n    order_by: {client: {name: asc}}\n  ) {\n    ...ClientExternalSystemWithRelations\n  }\n}\n\nquery GetExternalSystemUsage {\n  external_systems {\n    ...ExternalSystemCore\n    client_count: client_external_systems_aggregate {\n      aggregate {\n        count\n      }\n    }\n  }\n}": typeof types.GetExternalSystemsDocument;
  "subscription SubscribeToExternalSystems {\n  external_systems(order_by: {name: asc}) {\n    ...ExternalSystemCore\n  }\n}\n\nsubscription SubscribeToClientExternalSystems($clientId: uuid!) {\n  client_external_systems(\n    where: {client_id: {_eq: $clientId}}\n    order_by: {created_at: desc}\n  ) {\n    ...ClientExternalSystemWithRelations\n  }\n}": typeof types.SubscribeToExternalSystemsDocument;
};
const documents: Documents = {
  "fragment ExternalSystemCore on external_systems {\n  id\n  name\n  url\n  description\n  icon\n}\n\nfragment ClientExternalSystemCore on client_external_systems {\n  id\n  client_id\n  system_id\n  system_client_id\n}\n\nfragment ClientExternalSystemWithRelations on client_external_systems {\n  ...ClientExternalSystemCore\n  client {\n    id\n    name\n  }\n  external_system {\n    ...ExternalSystemCore\n  }\n}":
    types.ExternalSystemCoreFragmentDoc,
  "mutation CreateExternalSystem($object: external_systems_insert_input!) {\n  insert_external_systems_one(object: $object) {\n    ...ExternalSystemCore\n  }\n}\n\nmutation UpdateExternalSystem($id: uuid!, $set: external_systems_set_input!) {\n  update_external_systems_by_pk(pk_columns: {id: $id}, _set: $set) {\n    ...ExternalSystemCore\n  }\n}\n\nmutation DeleteExternalSystem($id: uuid!) {\n  delete_external_systems_by_pk(id: $id) {\n    id\n  }\n}\n\nmutation LinkClientToExternalSystem($object: client_external_systems_insert_input!) {\n  insert_client_external_systems_one(object: $object) {\n    ...ClientExternalSystemWithRelations\n  }\n}\n\nmutation UpdateClientExternalSystem($id: uuid!, $set: client_external_systems_set_input!) {\n  update_client_external_systems_by_pk(pk_columns: {id: $id}, _set: $set) {\n    ...ClientExternalSystemWithRelations\n  }\n}\n\nmutation UnlinkClientFromExternalSystem($id: uuid!) {\n  delete_client_external_systems_by_pk(id: $id) {\n    id\n  }\n}\n\nmutation BulkLinkClientsToExternalSystem($objects: [client_external_systems_insert_input!]!) {\n  insert_client_external_systems(objects: $objects) {\n    returning {\n      ...ClientExternalSystemWithRelations\n    }\n    affected_rows\n  }\n}":
    types.CreateExternalSystemDocument,
  "query GetExternalSystems($where: external_systems_bool_exp, $order_by: [external_systems_order_by!]) {\n  external_systems(where: $where, order_by: $order_by) {\n    ...ExternalSystemCore\n    client_external_systems_aggregate {\n      aggregate {\n        count\n      }\n    }\n  }\n}\n\nquery GetExternalSystemById($id: uuid!) {\n  external_systems_by_pk(id: $id) {\n    ...ExternalSystemCore\n    client_external_systems {\n      ...ClientExternalSystemWithRelations\n    }\n  }\n}\n\nquery GetClientExternalSystems($clientId: uuid!) {\n  client_external_systems(\n    where: {client_id: {_eq: $clientId}}\n    order_by: {created_at: desc}\n  ) {\n    ...ClientExternalSystemWithRelations\n  }\n}\n\nquery GetClientsByExternalSystem($system_id: uuid!) {\n  client_external_systems(\n    where: {system_id: {_eq: $system_id}}\n    order_by: {client: {name: asc}}\n  ) {\n    ...ClientExternalSystemWithRelations\n  }\n}\n\nquery GetExternalSystemUsage {\n  external_systems {\n    ...ExternalSystemCore\n    client_count: client_external_systems_aggregate {\n      aggregate {\n        count\n      }\n    }\n  }\n}":
    types.GetExternalSystemsDocument,
  "subscription SubscribeToExternalSystems {\n  external_systems(order_by: {name: asc}) {\n    ...ExternalSystemCore\n  }\n}\n\nsubscription SubscribeToClientExternalSystems($clientId: uuid!) {\n  client_external_systems(\n    where: {client_id: {_eq: $clientId}}\n    order_by: {created_at: desc}\n  ) {\n    ...ClientExternalSystemWithRelations\n  }\n}":
    types.SubscribeToExternalSystemsDocument,
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
export function graphql(
  source: "fragment ExternalSystemCore on external_systems {\n  id\n  name\n  url\n  description\n  icon\n}\n\nfragment ClientExternalSystemCore on client_external_systems {\n  id\n  client_id\n  system_id\n  system_client_id\n}\n\nfragment ClientExternalSystemWithRelations on client_external_systems {\n  ...ClientExternalSystemCore\n  client {\n    id\n    name\n  }\n  external_system {\n    ...ExternalSystemCore\n  }\n}"
): (typeof documents)["fragment ExternalSystemCore on external_systems {\n  id\n  name\n  url\n  description\n  icon\n}\n\nfragment ClientExternalSystemCore on client_external_systems {\n  id\n  client_id\n  system_id\n  system_client_id\n}\n\nfragment ClientExternalSystemWithRelations on client_external_systems {\n  ...ClientExternalSystemCore\n  client {\n    id\n    name\n  }\n  external_system {\n    ...ExternalSystemCore\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation CreateExternalSystem($object: external_systems_insert_input!) {\n  insert_external_systems_one(object: $object) {\n    ...ExternalSystemCore\n  }\n}\n\nmutation UpdateExternalSystem($id: uuid!, $set: external_systems_set_input!) {\n  update_external_systems_by_pk(pk_columns: {id: $id}, _set: $set) {\n    ...ExternalSystemCore\n  }\n}\n\nmutation DeleteExternalSystem($id: uuid!) {\n  delete_external_systems_by_pk(id: $id) {\n    id\n  }\n}\n\nmutation LinkClientToExternalSystem($object: client_external_systems_insert_input!) {\n  insert_client_external_systems_one(object: $object) {\n    ...ClientExternalSystemWithRelations\n  }\n}\n\nmutation UpdateClientExternalSystem($id: uuid!, $set: client_external_systems_set_input!) {\n  update_client_external_systems_by_pk(pk_columns: {id: $id}, _set: $set) {\n    ...ClientExternalSystemWithRelations\n  }\n}\n\nmutation UnlinkClientFromExternalSystem($id: uuid!) {\n  delete_client_external_systems_by_pk(id: $id) {\n    id\n  }\n}\n\nmutation BulkLinkClientsToExternalSystem($objects: [client_external_systems_insert_input!]!) {\n  insert_client_external_systems(objects: $objects) {\n    returning {\n      ...ClientExternalSystemWithRelations\n    }\n    affected_rows\n  }\n}"
): (typeof documents)["mutation CreateExternalSystem($object: external_systems_insert_input!) {\n  insert_external_systems_one(object: $object) {\n    ...ExternalSystemCore\n  }\n}\n\nmutation UpdateExternalSystem($id: uuid!, $set: external_systems_set_input!) {\n  update_external_systems_by_pk(pk_columns: {id: $id}, _set: $set) {\n    ...ExternalSystemCore\n  }\n}\n\nmutation DeleteExternalSystem($id: uuid!) {\n  delete_external_systems_by_pk(id: $id) {\n    id\n  }\n}\n\nmutation LinkClientToExternalSystem($object: client_external_systems_insert_input!) {\n  insert_client_external_systems_one(object: $object) {\n    ...ClientExternalSystemWithRelations\n  }\n}\n\nmutation UpdateClientExternalSystem($id: uuid!, $set: client_external_systems_set_input!) {\n  update_client_external_systems_by_pk(pk_columns: {id: $id}, _set: $set) {\n    ...ClientExternalSystemWithRelations\n  }\n}\n\nmutation UnlinkClientFromExternalSystem($id: uuid!) {\n  delete_client_external_systems_by_pk(id: $id) {\n    id\n  }\n}\n\nmutation BulkLinkClientsToExternalSystem($objects: [client_external_systems_insert_input!]!) {\n  insert_client_external_systems(objects: $objects) {\n    returning {\n      ...ClientExternalSystemWithRelations\n    }\n    affected_rows\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetExternalSystems($where: external_systems_bool_exp, $order_by: [external_systems_order_by!]) {\n  external_systems(where: $where, order_by: $order_by) {\n    ...ExternalSystemCore\n    client_external_systems_aggregate {\n      aggregate {\n        count\n      }\n    }\n  }\n}\n\nquery GetExternalSystemById($id: uuid!) {\n  external_systems_by_pk(id: $id) {\n    ...ExternalSystemCore\n    client_external_systems {\n      ...ClientExternalSystemWithRelations\n    }\n  }\n}\n\nquery GetClientExternalSystems($clientId: uuid!) {\n  client_external_systems(\n    where: {client_id: {_eq: $clientId}}\n    order_by: {created_at: desc}\n  ) {\n    ...ClientExternalSystemWithRelations\n  }\n}\n\nquery GetClientsByExternalSystem($system_id: uuid!) {\n  client_external_systems(\n    where: {system_id: {_eq: $system_id}}\n    order_by: {client: {name: asc}}\n  ) {\n    ...ClientExternalSystemWithRelations\n  }\n}\n\nquery GetExternalSystemUsage {\n  external_systems {\n    ...ExternalSystemCore\n    client_count: client_external_systems_aggregate {\n      aggregate {\n        count\n      }\n    }\n  }\n}"
): (typeof documents)["query GetExternalSystems($where: external_systems_bool_exp, $order_by: [external_systems_order_by!]) {\n  external_systems(where: $where, order_by: $order_by) {\n    ...ExternalSystemCore\n    client_external_systems_aggregate {\n      aggregate {\n        count\n      }\n    }\n  }\n}\n\nquery GetExternalSystemById($id: uuid!) {\n  external_systems_by_pk(id: $id) {\n    ...ExternalSystemCore\n    client_external_systems {\n      ...ClientExternalSystemWithRelations\n    }\n  }\n}\n\nquery GetClientExternalSystems($clientId: uuid!) {\n  client_external_systems(\n    where: {client_id: {_eq: $clientId}}\n    order_by: {created_at: desc}\n  ) {\n    ...ClientExternalSystemWithRelations\n  }\n}\n\nquery GetClientsByExternalSystem($system_id: uuid!) {\n  client_external_systems(\n    where: {system_id: {_eq: $system_id}}\n    order_by: {client: {name: asc}}\n  ) {\n    ...ClientExternalSystemWithRelations\n  }\n}\n\nquery GetExternalSystemUsage {\n  external_systems {\n    ...ExternalSystemCore\n    client_count: client_external_systems_aggregate {\n      aggregate {\n        count\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "subscription SubscribeToExternalSystems {\n  external_systems(order_by: {name: asc}) {\n    ...ExternalSystemCore\n  }\n}\n\nsubscription SubscribeToClientExternalSystems($clientId: uuid!) {\n  client_external_systems(\n    where: {client_id: {_eq: $clientId}}\n    order_by: {created_at: desc}\n  ) {\n    ...ClientExternalSystemWithRelations\n  }\n}"
): (typeof documents)["subscription SubscribeToExternalSystems {\n  external_systems(order_by: {name: asc}) {\n    ...ExternalSystemCore\n  }\n}\n\nsubscription SubscribeToClientExternalSystems($clientId: uuid!) {\n  client_external_systems(\n    where: {client_id: {_eq: $clientId}}\n    order_by: {created_at: desc}\n  ) {\n    ...ClientExternalSystemWithRelations\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
