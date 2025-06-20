// Client Domain - Main Export
// Central access point for all client-related functionality

// GraphQL operations and types
export * from "./graphql/generated";

// Services
export * from "./services/client.service";

// Re-export common operations for backward compatibility
export {
  GET_CLIENTS_BY_ID,
  GET_CLIENTS,
  CREATE_CLIENT,
  UPDATE_CLIENT,
  DELETE_CLIENT,
} from "./services/client.service";