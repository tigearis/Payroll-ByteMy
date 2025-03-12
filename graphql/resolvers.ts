// graphql/resolvers.ts

import { GraphQLError } from 'graphql'
import { HasuraRole } from "@/utils/auth"
import { adminClient } from "@/lib/apollo-admin"
import { gql } from "@apollo/client"

// Define types for context and inputs
interface GraphQLContext {
  userId?: string;
  hasuraClaims?: {
    'x-hasura-default-role': string;
    'x-hasura-user-id': string;
    'x-hasura-allowed-roles': string[];
  };
}

interface PayrollInput {
  clientId: string;
  name: string;
  cycleId: string;
  dateTypeId: string;
  dateValue?: number;
  primaryConsultantId?: string;
  backupConsultantId?: string;
  managerId?: string;
  processingDaysBeforeEft: number;
  payrollSystem?: string;
  status: string;
}

interface NoteInput {
  entityType: 'payroll' | 'client';
  entityId: string;
  userId?: string;
  content: string;
  isImportant?: boolean;
}

interface Note {
  id: string;
  entity_type: 'payroll' | 'client';
  entity_id: string;
  user_id?: string;
  content: string;
  is_important: boolean;
  created_at: string;
  updated_at: string;
}

interface Payroll {
  id: string;
  name: string;
  client_id: string;
  cycle_id: string;
  date_type_id: string;
  date_value?: number;
  primary_consultant_id?: string;
  backup_consultant_id?: string;
  manager_id?: string;
  processing_days_before_eft: number;
  payroll_system?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Client {
  id: string;
  name: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Helper function to verify user has required roles
const verifyUserRole = (userRole: string | undefined, allowedRoles: HasuraRole[]): boolean => {
  if (!userRole || !allowedRoles.includes(userRole as HasuraRole)) {
    throw new GraphQLError('Unauthorized', {
      extensions: {
        code: 'FORBIDDEN',
        http: { status: 403 }
      }
    })
  }
  
  return true
}

// Helper function to check note access
const checkNoteAccess = async (userId: string, noteId: string, entityType: 'client' | 'payroll', context: GraphQLContext): Promise<boolean> => {
  const userRole = context.hasuraClaims?.['x-hasura-default-role']
  
  // Admin and managers can do anything
  if (['org_admin', 'manager'].includes(userRole || '')) {
    return true
  }

  // Find the note
  const { data } = await adminClient.query({
    query: gql`
      query GetNote($id: ID!) {
        note(id: $id) {
          id
          entity_type
          entity_id
          user_id
        }
      }
    `,
    variables: { id: noteId }
  });

  const note = data.note as Note | null;
  if (!note) {
    throw new GraphQLError('Note not found', {
      extensions: {
        code: 'NOT_FOUND',
        http: { status: 404 }
      }
    });
  }

  // Consultant specific logic
  if (userRole === 'consultant') {
    if (entityType === 'payroll') {
      // Check if consultant is assigned to this payroll
      const { data: payrollData } = await adminClient.query({
        query: gql`
          query CheckPayrollAssignment($payrollId: ID!, $userId: ID!) {
            payroll(id: $payrollId) {
              id
              primary_consultant_id
              backup_consultant_id
            }
          }
        `,
        variables: { 
          payrollId: note.entity_id,
          userId
        }
      });

      const payroll = payrollData.payroll as Payroll | null;
      if (payroll && (payroll.primary_consultant_id === userId || payroll.backup_consultant_id === userId)) {
        return true;
      }
    }
  }

  // Note owner can always edit their own notes
  if (note.user_id === userId) {
    return true;
  }

  throw new GraphQLError('Unauthorized to access this note', {
    extensions: {
      code: 'FORBIDDEN',
      http: { status: 403 }
    }
  });
}

export const resolvers = {
  Query: {
    payrolls: async (_: unknown, __: unknown, context: GraphQLContext) => {
      // Ensure user is authenticated
      if (!context.userId) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      // Verify role-based access
      const userRole = context.hasuraClaims?.['x-hasura-default-role']
      const allowedRoles: HasuraRole[] = ['org_admin', 'manager', 'consultant']
      verifyUserRole(userRole, allowedRoles)

      const { data } = await adminClient.query({
        query: gql`
          query GetPayrolls {
            payrolls {
              id
              name
              client_id
              cycle_id
              date_type_id
              date_value
              primary_consultant_id
              backup_consultant_id
              manager_id
              processing_days_before_eft
              payroll_system
              status
              created_at
              updated_at
            }
          }
        `
      });

      return data.payrolls as Payroll[];
    },

    payroll: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.userId) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const userRole = context.hasuraClaims?.['x-hasura-default-role']
      const allowedRoles: HasuraRole[] = ['org_admin', 'manager', 'consultant']
      verifyUserRole(userRole, allowedRoles)

      const { data } = await adminClient.query({
        query: gql`
          query GetPayroll($id: ID!) {
            payroll(id: $id) {
              id
              name
              client_id
              cycle_id
              date_type_id
              date_value
              primary_consultant_id
              backup_consultant_id
              manager_id
              processing_days_before_eft
              payroll_system
              status
              created_at
              updated_at
              client {
                name
              }
              primaryConsultant {
                name
              }
              backupConsultant {
                name
              }
              manager {
                name
              }
            }
          }
        `,
        variables: { id }
      });

      if (!data.payroll) {
        throw new GraphQLError('Payroll not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 }
          }
        });
      }

      return data.payroll as Payroll;
    },

    clients: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.userId) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const userRole = context.hasuraClaims?.['x-hasura-default-role']
      const allowedRoles: HasuraRole[] = ['org_admin', 'manager', 'consultant']
      verifyUserRole(userRole, allowedRoles)

      const { data } = await adminClient.query({
        query: gql`
          query GetClients {
            clients {
              id
              name
              contact_person
              contact_email
              contact_phone
              active
              created_at
              updated_at
            }
          }
        `
      });

      return data.clients as Client[];
    },

    client: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.userId) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const userRole = context.hasuraClaims?.['x-hasura-default-role']
      const allowedRoles: HasuraRole[] = ['org_admin', 'manager', 'consultant']
      verifyUserRole(userRole, allowedRoles)

      const { data } = await adminClient.query({
        query: gql`
          query GetClient($id: ID!) {
            client(id: $id) {
              id
              name
              contact_person
              contact_email
              contact_phone
              active
              created_at
              updated_at
              payrolls {
                id
                name
                status
              }
            }
          }
        `,
        variables: { id }
      });

      if (!data.client) {
        throw new GraphQLError('Client not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 }
          }
        });
      }

      return data.client as Client;
    },

    staff: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.userId) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const userRole = context.hasuraClaims?.['x-hasura-default-role']
      const allowedRoles: HasuraRole[] = ['org_admin', 'manager']
      verifyUserRole(userRole, allowedRoles)

      const { data } = await adminClient.query({
        query: gql`
          query GetStaff {
            staff {
              id
              name
              email
              phone
              position
              active
              created_at
              updated_at
            }
          }
        `
      });

      return data.staff as StaffMember[];
    },

    staffMember: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.userId) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const userRole = context.hasuraClaims?.['x-hasura-default-role']
      const allowedRoles: HasuraRole[] = ['org_admin', 'manager']
      verifyUserRole(userRole, allowedRoles)

      const { data } = await adminClient.query({
        query: gql`
          query GetStaffMember($id: ID!) {
            staff_member(id: $id) {
              id
              name
              email
              phone
              position
              active
              created_at
              updated_at
              primaryPayrolls {
                id
                name
              }
              backupPayrolls {
                id
                name
              }
              managedPayrolls {
                id
                name
              }
            }
          }
        `,
        variables: { id }
      });

      if (!data.staff_member) {
        throw new GraphQLError('Staff member not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 }
          }
        });
      }

      return data.staff_member as StaffMember;
    },

    // Note Queries
    payrollNotes: async (_: unknown, { payrollId }: { payrollId: string }, context: GraphQLContext) => {
      if (!context.userId) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const userRole = context.hasuraClaims?.['x-hasura-default-role']
      const allowedRoles: HasuraRole[] = ['org_admin', 'manager', 'consultant']
      verifyUserRole(userRole, allowedRoles)

      const { data } = await adminClient.query({
        query: gql`
          query GetPayrollNotes($payrollId: ID!) {
            notes(where: {entity_type: {_eq: "payroll"}, entity_id: {_eq: $payrollId}}) {
              id
              content
              is_important
              user_id
              created_at
              updated_at
              user {
                name
                email
              }
            }
          }
        `,
        variables: { payrollId }
      });

      return data.notes as Note[];
    },

    clientNotes: async (_: unknown, { clientId }: { clientId: string }, context: GraphQLContext) => {
      if (!context.userId) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const userRole = context.hasuraClaims?.['x-hasura-default-role']
      const allowedRoles: HasuraRole[] = ['org_admin', 'manager', 'consultant']
      verifyUserRole(userRole, allowedRoles)

      const { data } = await adminClient.query({
        query: gql`
          query GetClientNotes($clientId: ID!) {
            notes(where: {entity_type: {_eq: "client"}, entity_id: {_eq: $clientId}}) {
              id
              content
              is_important
              user_id
              created_at
              updated_at
              user {
                name
                email
              }
            }
          }
        `,
        variables: { clientId }
      });

      return data.notes as Note[];
    }
  },

  Mutation: {
    createPayroll: async (_: unknown, { input }: { input: PayrollInput }, context: GraphQLContext) => {
      if (!context.userId) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const userRole = context.hasuraClaims?.['x-hasura-default-role']
      const allowedRoles: HasuraRole[] = ['org_admin', 'manager']
      verifyUserRole(userRole, allowedRoles)

      const { data } = await adminClient.mutate({
        mutation: gql`
          mutation CreatePayroll($input: PayrollInput!) {
            createPayroll(input: $input) {
              id
              name
              status
            }
          }
        `,
        variables: { input }
      });

      return data.createPayroll as Payroll;
    },

    updatePayroll: async (_: unknown, { id, input }: { id: string; input: PayrollInput }, context: GraphQLContext) => {
      if (!context.userId) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const userRole = context.hasuraClaims?.['x-hasura-default-role']
      const allowedRoles: HasuraRole[] = ['org_admin', 'manager']
      verifyUserRole(userRole, allowedRoles)

      const { data } = await adminClient.mutate({
        mutation: gql`
          mutation UpdatePayroll($id: ID!, $input: PayrollInput!) {
            updatePayroll(id: $id, input: $input) {
              id
              name
              status
            }
          }
        `,
        variables: { id, input }
      });

      if (!data.updatePayroll) {
        throw new GraphQLError('Payroll not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 }
          }
        });
      }

      return data.updatePayroll as Payroll;
    },

    // Note Mutations
    addPayrollNote: async (_: unknown, { payrollId, content, isImportant = false }: { payrollId: string, content: string, isImportant?: boolean }, context: GraphQLContext) => {
      if (!context.userId) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const userRole = context.hasuraClaims?.['x-hasura-default-role']
      const allowedRoles: HasuraRole[] = ['org_admin', 'manager', 'consultant']
      verifyUserRole(userRole, allowedRoles)

      // For consultants, check if they're assigned to this payroll
      if (userRole === 'consultant') {
        const { data } = await adminClient.query({
          query: gql`
            query CheckPayrollAssignment($payrollId: ID!, $userId: ID!) {
              payroll(id: $payrollId) {
                id
                primary_consultant_id
                backup_consultant_id
              }
            }
          `,
          variables: { 
            payrollId,
            userId: context.userId
          }
        });

        const payroll = data.payroll as Payroll | null;
        if (!payroll || (payroll.primary_consultant_id !== context.userId && payroll.backup_consultant_id !== context.userId)) {
          throw new GraphQLError('Unauthorized to add note to this payroll', {
            extensions: {
              code: 'FORBIDDEN',
              http: { status: 403 }
            }
          });
        }
      }

      const { data } = await adminClient.mutate({
        mutation: gql`
          mutation AddPayrollNote($input: NoteInput!) {
            addNote(input: $input) {
              id
              content
              is_important
              created_at
              user {
                name
              }
            }
          }
        `,
        variables: {
          input: {
            entityType: 'payroll',
            entityId: payrollId,
            userId: context.userId,
            content,
            isImportant
          } as NoteInput
        }
      });

      return data.addNote as Note;
    },

    updatePayrollNote: async (_: unknown, { noteId, content, isImportant }: { noteId: string, content?: string, isImportant?: boolean }, context: GraphQLContext) => {
      if (!context.userId) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      // Check note access permissions
      await checkNoteAccess(context.userId, noteId, 'payroll', context);

      const updateData: Partial<NoteInput> = { entityType: 'payroll', entityId: noteId };
      if (content !== undefined) updateData.content = content;
      if (isImportant !== undefined) updateData.isImportant = isImportant;

      const { data } = await adminClient.mutate({
        mutation: gql`
          mutation UpdateNote($id: ID!, $input: NoteInput!) {
            updateNote(id: $id, input: $input) {
              id
              content
              is_important
              updated_at
            }
          }
        `,
        variables: { 
          id: noteId,
          input: updateData
        }
      });

      return data.updateNote as Note;
    },

    deletePayrollNote: async (_: unknown, { noteId }: { noteId: string }, context: GraphQLContext) => {
      if (!context.userId) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      // Check note access permissions
      await checkNoteAccess(context.userId, noteId, 'payroll', context);

      const { data } = await adminClient.mutate({
        mutation: gql`
          mutation DeleteNote($id: ID!) {
            deleteNote(id: $id)
          }
        `,
        variables: { id: noteId }
      });

      return data.deleteNote as boolean;
    },

    addClientNote: async (_: unknown, { clientId, content, isImportant = false }: { clientId: string, content: string, isImportant?: boolean }, context: GraphQLContext) => {
      if (!context.userId) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      const userRole = context.hasuraClaims?.['x-hasura-default-role']
      const allowedRoles: HasuraRole[] = ['org_admin', 'manager', 'consultant']
      verifyUserRole(userRole, allowedRoles)

      const { data } = await adminClient.mutate({
        mutation: gql`
          mutation AddClientNote($input: NoteInput!) {
            addNote(input: $input) {
              id
              content
              is_important
              created_at
              user {
                name
              }
            }
          }
        `,
        variables: {
          input: {
            entityType: 'client',
            entityId: clientId,
            userId: context.userId,
            content,
            isImportant
          } as NoteInput
        }
      });

      return data.addNote as Note;
    },

    updateClientNote: async (_: unknown, { noteId, content, isImportant }: { noteId: string, content?: string, isImportant?: boolean }, context: GraphQLContext) => {
      if (!context.userId) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      // Check note access permissions
      await checkNoteAccess(context.userId, noteId, 'client', context);

      const updateData: Partial<NoteInput> = { entityType: 'client', entityId: noteId };
      if (content !== undefined) updateData.content = content;
      if (isImportant !== undefined) updateData.isImportant = isImportant;

      const { data } = await adminClient.mutate({
        mutation: gql`
          mutation UpdateNote($id: ID!, $input: NoteInput!) {
            updateNote(id: $id, input: $input) {
              id
              content
              is_important
              updated_at
            }
          }
        `,
        variables: { 
          id: noteId,
          input: updateData
        }
      });

      return data.updateNote as Note;
    },

    deleteClientNote: async (_: unknown, { noteId }: { noteId: string }, context: GraphQLContext) => {
      if (!context.userId) {
        throw new GraphQLError('Unauthenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }

      // Check note access permissions
      await checkNoteAccess(context.userId, noteId, 'client', context);

      const { data } = await adminClient.mutate({
        mutation: gql`
          mutation DeleteNote($id: ID!) {
            deleteNote(id: $id)
          }
        `,
        variables: { id: noteId }
      });

      return data.deleteNote as boolean;
    },
  },

  // Resolvers for nested relationships
  Payroll: {
    client: async (parent: Payroll) => {
      const { data } = await adminClient.query({
        query: gql`
          query GetClient($id: ID!) {
            client(id: $id) {
              id
              name
              contact_person
              contact_email
              contact_phone
              active
            }
          }
        `,
        variables: { id: parent.client_id }
      });
      
      return data.client as Client;
    },
    primaryConsultant: async (parent: Payroll) => {
      if (!parent.primary_consultant_id) return null;
      
      const { data } = await adminClient.query({
        query: gql`
          query GetStaffMember($id: ID!) {
            staff_member(id: $id) {
              id
              name
              email
            }
          }
        `,
        variables: { id: parent.primary_consultant_id }
      });
      
      return data.staff_member as StaffMember;
    },
    backupConsultant: async (parent: Payroll) => {
      if (!parent.backup_consultant_id) return null;
      
      const { data } = await adminClient.query({
        query: gql`
          query GetStaffMember($id: ID!) {
            staff_member(id: $id) {
              id
              name
              email
            }
          }
        `,
        variables: { id: parent.backup_consultant_id }
      });
      
      return data.staff_member as StaffMember;
    },
    manager: async (parent: Payroll) => {
      if (!parent.manager_id) return null;
      
      const { data } = await adminClient.query({
        query: gql`
          query GetStaffMember($id: ID!) {
            staff_member(id: $id) {
              id
              name
              email
            }
          }
        `,
        variables: { id: parent.manager_id }
      });
      
      return data.staff_member as StaffMember;
    },
    notes: async (parent: Payroll) => {
      const { data } = await adminClient.query({
        query: gql`
          query GetPayrollNotes($payrollId: ID!) {
            notes(where: {entity_type: {_eq: "payroll"}, entity_id: {_eq: $payrollId}}) {
              id
              content
              is_important
              user_id
              created_at
              updated_at
              user {
                name
                email
              }
            }
          }
        `,
        variables: { payrollId: parent.id }
      });
      
      return data.notes as Note[];
    }
  },

  Client: {
    payrolls: async (parent: Client) => {
      const { data } = await adminClient.query({
        query: gql`
          query GetClientPayrolls($clientId: ID!) {
            payrolls(where: { client_id: { _eq: $clientId } }) {
              id
              name
              status
            }
          }
        `,
        variables: { clientId: parent.id }
      });
      
      return data.payrolls as Payroll[];
    },
    notes: async (parent: Client) => {
      const { data } = await adminClient.query({
        query: gql`
          query GetClientNotes($clientId: ID!) {
            notes(where: {entity_type: {_eq: "client"}, entity_id: {_eq: $clientId}}) {
              id
              content
              is_important
              user_id
              created_at
              updated_at
              user {
                name
                email
              }
            }
          }
        `,
        variables: { clientId: parent.id }
      });
      
      return data.notes as Note[];
    }
  },

  Staff: {
    primaryPayrolls: async (parent: StaffMember) => {
      const { data } = await adminClient.query({
        query: gql`
          query GetPrimaryPayrolls($staffId: ID!) {
            payrolls(where: { primary_consultant_id: { _eq: $staffId } }) {
              id
              name
              status
            }
          }
        `,
        variables: { staffId: parent.id }
      });
      
      return data.payrolls as Payroll[];
    },
    backupPayrolls: async (parent: StaffMember) => {
      const { data } = await adminClient.query({
        query: gql`
          query GetBackupPayrolls($staffId: ID!) {
            payrolls(where: { backup_consultant_id: { _eq: $staffId } }) {
              id
              name
              status
            }
          }
        `,
        variables: { staffId: parent.id }
      });
      
      return data.payrolls as Payroll[];
    },
    managedPayrolls: async (parent: StaffMember) => {
      const { data } = await adminClient.query({
        query: gql`
          query GetManagedPayrolls($staffId: ID!) {
            payrolls(where: { manager_id: { _eq: $staffId } }) {
              id
              name
              status
            }
          }
        `,
        variables: { staffId: parent.id }
      });
      
      return data.payrolls as Payroll[];
    },
  },

  Note: {
    user: async (parent: Note) => {
      if (!parent.user_id) return null;
      
      const { data } = await adminClient.query({
        query: gql`
          query GetUser($id: ID!) {
            user(id: $id) {
              id
              name
              email
            }
          }
        `,
        variables: { id: parent.user_id }
      });
      
      return data.user as User;
    }
  }
}