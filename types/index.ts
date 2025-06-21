/**
 * Types Index - Central export point for all type definitions
 *
 * This file provides a centralized access point for all types while maintaining
 * the domain-driven organization structure underneath.
 */

// Shared types (cross-domain)
export * from "./enums";
export * from "./scalars";

// Domain-specific types
export * from "../domains/clients/types";
export * from "../domains/users/types";
export * from "../domains/work-schedule/types";

// Legacy compatibility - gradually migrate away from these
// export * from "./interface"; // Commented out due to type conflicts
