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
    "query GetDashboardStats {\n  recent_payrolls: payrolls(\n    limit: 5\n    order_by: {updatedAt: desc}\n    where: {supersededDate: {_is_null: true}}\n  ) {\n    id\n    name\n    client {\n      id\n      name\n    }\n  }\n  active_users_count: usersAggregate(where: {isActive: {_eq: true}}) {\n    aggregate {\n      count\n    }\n  }\n  active_clients_count: clientsAggregate(where: {active: {_eq: true}}) {\n    aggregate {\n      count\n    }\n  }\n  recent_payroll_dates: payrollDates(\n    limit: 10\n    order_by: {adjustedEftDate: desc}\n    where: {adjustedEftDate: {_gte: \"now()\"}}\n  ) {\n    id\n    adjustedEftDate\n    processingDate\n    payroll {\n      id\n      name\n      client {\n        name\n      }\n    }\n  }\n}\n\nquery GetSystemStats {\n  total_payrolls: payrollsAggregate {\n    aggregate {\n      count\n    }\n  }\n  total_clients: clientsAggregate {\n    aggregate {\n      count\n    }\n  }\n  total_users: usersAggregate {\n    aggregate {\n      count\n    }\n  }\n}\n\nquery GetUpcomingPayrolls {\n  payrolls(\n    where: {supersededDate: {_is_null: true}}\n    order_by: {updatedAt: desc}\n    limit: 10\n  ) {\n    id\n    name\n    client {\n      id\n      name\n    }\n  }\n}": typeof types.GetDashboardStatsDocument,
};
const documents: Documents = {
    "query GetDashboardStats {\n  recent_payrolls: payrolls(\n    limit: 5\n    order_by: {updatedAt: desc}\n    where: {supersededDate: {_is_null: true}}\n  ) {\n    id\n    name\n    client {\n      id\n      name\n    }\n  }\n  active_users_count: usersAggregate(where: {isActive: {_eq: true}}) {\n    aggregate {\n      count\n    }\n  }\n  active_clients_count: clientsAggregate(where: {active: {_eq: true}}) {\n    aggregate {\n      count\n    }\n  }\n  recent_payroll_dates: payrollDates(\n    limit: 10\n    order_by: {adjustedEftDate: desc}\n    where: {adjustedEftDate: {_gte: \"now()\"}}\n  ) {\n    id\n    adjustedEftDate\n    processingDate\n    payroll {\n      id\n      name\n      client {\n        name\n      }\n    }\n  }\n}\n\nquery GetSystemStats {\n  total_payrolls: payrollsAggregate {\n    aggregate {\n      count\n    }\n  }\n  total_clients: clientsAggregate {\n    aggregate {\n      count\n    }\n  }\n  total_users: usersAggregate {\n    aggregate {\n      count\n    }\n  }\n}\n\nquery GetUpcomingPayrolls {\n  payrolls(\n    where: {supersededDate: {_is_null: true}}\n    order_by: {updatedAt: desc}\n    limit: 10\n  ) {\n    id\n    name\n    client {\n      id\n      name\n    }\n  }\n}": types.GetDashboardStatsDocument,
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
export function graphql(source: "query GetDashboardStats {\n  recent_payrolls: payrolls(\n    limit: 5\n    order_by: {updatedAt: desc}\n    where: {supersededDate: {_is_null: true}}\n  ) {\n    id\n    name\n    client {\n      id\n      name\n    }\n  }\n  active_users_count: usersAggregate(where: {isActive: {_eq: true}}) {\n    aggregate {\n      count\n    }\n  }\n  active_clients_count: clientsAggregate(where: {active: {_eq: true}}) {\n    aggregate {\n      count\n    }\n  }\n  recent_payroll_dates: payrollDates(\n    limit: 10\n    order_by: {adjustedEftDate: desc}\n    where: {adjustedEftDate: {_gte: \"now()\"}}\n  ) {\n    id\n    adjustedEftDate\n    processingDate\n    payroll {\n      id\n      name\n      client {\n        name\n      }\n    }\n  }\n}\n\nquery GetSystemStats {\n  total_payrolls: payrollsAggregate {\n    aggregate {\n      count\n    }\n  }\n  total_clients: clientsAggregate {\n    aggregate {\n      count\n    }\n  }\n  total_users: usersAggregate {\n    aggregate {\n      count\n    }\n  }\n}\n\nquery GetUpcomingPayrolls {\n  payrolls(\n    where: {supersededDate: {_is_null: true}}\n    order_by: {updatedAt: desc}\n    limit: 10\n  ) {\n    id\n    name\n    client {\n      id\n      name\n    }\n  }\n}"): (typeof documents)["query GetDashboardStats {\n  recent_payrolls: payrolls(\n    limit: 5\n    order_by: {updatedAt: desc}\n    where: {supersededDate: {_is_null: true}}\n  ) {\n    id\n    name\n    client {\n      id\n      name\n    }\n  }\n  active_users_count: usersAggregate(where: {isActive: {_eq: true}}) {\n    aggregate {\n      count\n    }\n  }\n  active_clients_count: clientsAggregate(where: {active: {_eq: true}}) {\n    aggregate {\n      count\n    }\n  }\n  recent_payroll_dates: payrollDates(\n    limit: 10\n    order_by: {adjustedEftDate: desc}\n    where: {adjustedEftDate: {_gte: \"now()\"}}\n  ) {\n    id\n    adjustedEftDate\n    processingDate\n    payroll {\n      id\n      name\n      client {\n        name\n      }\n    }\n  }\n}\n\nquery GetSystemStats {\n  total_payrolls: payrollsAggregate {\n    aggregate {\n      count\n    }\n  }\n  total_clients: clientsAggregate {\n    aggregate {\n      count\n    }\n  }\n  total_users: usersAggregate {\n    aggregate {\n      count\n    }\n  }\n}\n\nquery GetUpcomingPayrolls {\n  payrolls(\n    where: {supersededDate: {_is_null: true}}\n    order_by: {updatedAt: desc}\n    limit: 10\n  ) {\n    id\n    name\n    client {\n      id\n      name\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;