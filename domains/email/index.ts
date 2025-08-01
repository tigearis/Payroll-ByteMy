// Email Domain Exports
// Security Classification: HIGH - Email communication system

// Types - explicit exports to avoid naming conflicts
export type { 
  EmailAnalytics as EmailAnalyticsType,
  EmailTemplate,
  EmailSendLog,
  EmailDraft,
  EmailVariable,
  EmailCategory
} from './types';

// Services
export { resendService } from './services/resend-service';
export { templateService } from './services/template-service';
export { variableProcessor } from './services/variable-processor';

// Components
export * from './components';

// GraphQL (will be available after codegen)
export * from './graphql/generated/graphql';