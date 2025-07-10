/**
 * Work Schedule Domain Hooks
 * 
 * This module exports all custom hooks for workload visualization and management.
 * These hooks provide data fetching, state management, and business logic for
 * the workload components.
 */

// Data fetching hooks
export { useWorkloadData } from "./use-workload-data";
export { useTeamCapacity } from "./use-team-capacity";

// GraphQL data hooks
export { useTeamWorkloadGraphQL } from "./use-team-workload-graphql";

// State management hooks
export { useWorkloadState } from "./use-workload-state";

// Re-export types for convenience
export type {
  UseWorkloadDataReturn,
  UseTeamCapacityReturn,
  WorkloadState,
  WorkloadActions,
} from "../types/workload";