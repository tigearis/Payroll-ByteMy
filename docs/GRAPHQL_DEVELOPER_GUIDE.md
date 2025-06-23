# GraphQL Developer Guide - Optimized Operations

**Last Updated**: June 23, 2025  
**Version**: 2.0 (Post-Audit)  
**Target Audience**: Frontend Developers, Full-Stack Developers  

## Quick Start

### Installing Dependencies

```bash
# Install GraphQL dependencies (already included)
pnpm install @apollo/client graphql

# Generate types after schema changes
pnpm codegen
```

### Basic Usage Patterns

```typescript
// 1. Import from domain-specific generated types
import { GetUsersPaginatedDocument } from '@/domains/users/graphql/generated/graphql';
import { useQuery } from '@apollo/client';

// 2. Use typed operations with variables
const { data, loading, error } = useQuery(GetUsersPaginatedDocument, {
  variables: {
    limit: 20,
    offset: 0,
    where: { isActive: { _eq: true } }
  }
});

// 3. Handle data with full type safety
if (data?.users) {
  data.users.forEach(user => {
    console.log(user.name); // ✅ Fully typed
  });
}
```

## Fragment System Guide

### Fragment Hierarchy

Every domain follows a consistent 4-level fragment hierarchy:

```typescript
// Level 1: Minimal (for dropdowns, quick lists)
UserMinimal: { id, name }

// Level 2: Summary (for cards, previews)  
UserSummary: { ...UserMinimal, role, isActive, isStaff }

// Level 3: ListItem (for tables, lists)
UserListItem: { ...UserSummary, email, managerId, updatedAt }

// Level 4: Complete (for detail views)
UserComplete: { ...UserListItem, createdAt, notes, lastLoginAt }
```

### Choosing the Right Fragment

```typescript
// ✅ Good: Use minimal for dropdowns
const UserDropdown = () => {
  const { data } = useQuery(GetUsersQuickListDocument); // Uses UserMinimal
  return (
    <select>
      {data?.users.map(user => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  );
};

// ✅ Good: Use summary for cards
const UserCard = ({ userId }: { userId: string }) => {
  const { data } = useQuery(GetUserCardDocument, { 
    variables: { id: userId } 
  }); // Uses UserSummary
  
  return (
    <div className="card">
      <h3>{data?.user.name}</h3>
      <span>{data?.user.role}</span>
      <span>{data?.user.isActive ? 'Active' : 'Inactive'}</span>
    </div>
  );
};

// ✅ Good: Use listItem for tables
const UserTable = () => {
  const { data } = useQuery(GetUsersPaginatedDocument); // Uses UserListItem
  return (
    <table>
      {data?.users.map(user => (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
          <td>{user.updatedAt}</td>
        </tr>
      ))}
    </table>
  );
};

// ✅ Good: Use complete for detail views
const UserProfile = ({ userId }: { userId: string }) => {
  const { data } = useQuery(GetUserDetailDocument, { 
    variables: { id: userId } 
  }); // Uses UserComplete
  
  return (
    <div className="profile">
      <h1>{data?.user.name}</h1>
      <p>Email: {data?.user.email}</p>
      <p>Role: {data?.user.role}</p>
      <p>Created: {data?.user.createdAt}</p>
      <p>Last Login: {data?.user.lastLoginAt}</p>
      <p>Notes: {data?.user.notes}</p>
    </div>
  );
};
```

## Pagination Patterns

### Standard Pagination

All major entities support consistent pagination:

```typescript
const UsersList = () => {
  const [page, setPage] = useState(0);
  const limit = 20;
  
  const { data, loading, fetchMore } = useQuery(GetUsersPaginatedDocument, {
    variables: {
      limit,
      offset: page * limit,
      where: { isActive: { _eq: true } },
      orderBy: [{ name: 'asc' }]
    }
  });

  const totalUsers = data?.usersAggregate?.aggregate?.count || 0;
  const totalPages = Math.ceil(totalUsers / limit);

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
      fetchMore({
        variables: {
          offset: (page + 1) * limit
        }
      });
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      
      <div className="users-list">
        {data?.users?.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      
      <div className="pagination">
        <button 
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
        >
          Previous
        </button>
        
        <span>Page {page + 1} of {totalPages}</span>
        
        <button 
          onClick={handleNextPage}
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};
```

### Infinite Scroll Pagination

```typescript
const InfiniteUsersList = () => {
  const { data, loading, fetchMore } = useQuery(GetUsersPaginatedDocument, {
    variables: {
      limit: 20,
      offset: 0,
      where: { isActive: { _eq: true } }
    }
  });

  const loadMore = () => {
    if (!loading && data?.users) {
      fetchMore({
        variables: {
          offset: data.users.length
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          
          return {
            ...fetchMoreResult,
            users: [...prev.users, ...fetchMoreResult.users]
          };
        }
      });
    }
  };

  return (
    <div>
      {data?.users?.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
      
      {loading && <div>Loading more...</div>}
      
      <button onClick={loadMore} disabled={loading}>
        Load More
      </button>
    </div>
  );
};
```

## Search Patterns

### Fuzzy Search with Pagination

```typescript
const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, loading } = useQuery(SearchUsersPaginatedDocument, {
    variables: {
      searchTerm: `%${debouncedSearch}%`,
      limit: 20,
      offset: 0
    },
    skip: !debouncedSearch
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {loading && <div>Searching...</div>}
      
      {data?.users?.length === 0 && (
        <div>No users found for "{debouncedSearch}"</div>
      )}
      
      <div className="search-results">
        {data?.users?.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};
```

## Real-time Subscriptions

### Basic Subscription Usage

```typescript
const UserStatusTracker = ({ userId }: { userId: string }) => {
  const { data, loading } = useSubscription(UserStatusUpdatesDocument, {
    variables: { userId }
  });

  return (
    <div className="status-indicator">
      {loading && <div>Connecting...</div>}
      {data?.users?.[0] && (
        <div className={`status ${data.users[0].isActive ? 'active' : 'inactive'}`}>
          {data.users[0].isActive ? 'Online' : 'Offline'}
        </div>
      )}
    </div>
  );
};
```

### Subscription with Optimistic Updates

```typescript
const LiveUsersList = () => {
  const { data: staticData } = useQuery(GetUsersListDocument);
  
  const { data: liveData } = useSubscription(UsersListUpdatesDocument, {
    onData: ({ data }) => {
      // Handle real-time updates
      console.log('User list updated:', data.data);
    }
  });

  // Merge static and live data
  const users = liveData?.users || staticData?.users || [];

  return (
    <div className="live-users-list">
      <div className="connection-status">
        🟢 Live Updates Active
      </div>
      
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};
```

## Mutation Patterns

### Basic CRUD Operations

```typescript
const UserManager = () => {
  const [createUser] = useMutation(CreateUserDocument);
  const [updateUser] = useMutation(UpdateUserDocument);
  const [deleteUser] = useMutation(DeleteUserDocument);

  const handleCreateUser = async (userData: CreateUserInput) => {
    try {
      const { data } = await createUser({
        variables: { object: userData },
        refetchQueries: [GetUsersPaginatedDocument]
      });
      
      console.log('User created:', data?.insertUser);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (id: string, changes: UpdateUserInput) => {
    try {
      const { data } = await updateUser({
        variables: { id, changes },
        optimisticResponse: {
          updateUser: {
            __typename: 'users',
            id,
            ...changes
          }
        }
      });
      
      console.log('User updated:', data?.updateUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser({
        variables: { id },
        update: (cache) => {
          // Remove from cache
          cache.evict({ id: `users:${id}` });
          cache.gc();
        }
      });
      
      console.log('User deleted');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      {/* User management UI */}
    </div>
  );
};
```

### Optimistic Updates

```typescript
const UserRoleChanger = ({ userId, currentRole }: { userId: string, currentRole: string }) => {
  const [updateRole] = useMutation(UpdateStaffRoleDocument);

  const handleRoleChange = async (newRole: string) => {
    try {
      await updateRole({
        variables: {
          clerkUserId: userId,
          newRole
        },
        optimisticResponse: {
          updateUsers: {
            __typename: 'users_mutation_response',
            returning: [{
              __typename: 'users',
              id: userId,
              role: newRole,
              updatedAt: new Date().toISOString()
            }]
          }
        }
      });
    } catch (error) {
      console.error('Role update failed:', error);
      // Optimistic update will be reverted automatically
    }
  };

  return (
    <select value={currentRole} onChange={(e) => handleRoleChange(e.target.value)}>
      <option value="viewer">Viewer</option>
      <option value="consultant">Consultant</option>
      <option value="manager">Manager</option>
      <option value="org_admin">Org Admin</option>
    </select>
  );
};
```

## Error Handling

### Comprehensive Error Handling

```typescript
const UserDataComponent = () => {
  const { data, loading, error } = useQuery(GetUsersDocument);

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    // Log error for debugging
    console.error('GraphQL Error:', error);
    
    // Handle different error types
    if (error.networkError) {
      return <div>Network error. Please check your connection.</div>;
    }
    
    if (error.graphQLErrors?.length > 0) {
      const firstError = error.graphQLErrors[0];
      
      if (firstError.extensions?.code === 'validation-failed') {
        return <div>Invalid data. Please check your input.</div>;
      }
      
      if (firstError.extensions?.code === 'access-denied') {
        return <div>You don't have permission to view this data.</div>;
      }
    }
    
    return <div>Something went wrong. Please try again.</div>;
  }

  return (
    <div>
      {data?.users?.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};
```

### Error Boundaries

```typescript
class GraphQLErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('GraphQL Error Boundary:', error, errorInfo);
    
    // Log to audit system
    if (error.message.includes('GraphQL')) {
      // Handle GraphQL-specific errors
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong with the data.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
const App = () => (
  <GraphQLErrorBoundary>
    <UserDataComponent />
  </GraphQLErrorBoundary>
);
```

## Performance Optimization

### Apollo Client Cache Configuration

```typescript
import { InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache({
  typePolicies: {
    users: {
      fields: {
        // Pagination merge function
        users: {
          keyArgs: ['where', 'order_by'],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          }
        }
      }
    },
    
    payrolls: {
      fields: {
        payrolls: {
          keyArgs: ['where', 'order_by'],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          }
        }
      }
    }
  }
});
```

### Prefetching Data

```typescript
const UsersList = () => {
  const client = useApolloClient();
  
  const { data } = useQuery(GetUsersPaginatedDocument);

  const prefetchUserDetail = (userId: string) => {
    client.query({
      query: GetUserDetailDocument,
      variables: { id: userId }
    });
  };

  return (
    <div>
      {data?.users?.map(user => (
        <div
          key={user.id}
          onMouseEnter={() => prefetchUserDetail(user.id)}
        >
          <UserCard user={user} />
        </div>
      ))}
    </div>
  );
};
```

### Lazy Loading

```typescript
const LazyUserDetail = React.lazy(() => import('./UserDetail'));

const UserCard = ({ user }: { user: UserSummary }) => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <button onClick={() => setShowDetail(!showDetail)}>
        {showDetail ? 'Hide' : 'Show'} Details
      </button>
      
      {showDetail && (
        <Suspense fallback={<div>Loading details...</div>}>
          <LazyUserDetail userId={user.id} />
        </Suspense>
      )}
    </div>
  );
};
```

## Testing Patterns

### Mocking GraphQL Operations

```typescript
import { MockedProvider } from '@apollo/client/testing';

const userMocks = [
  {
    request: {
      query: GetUsersDocument,
      variables: { limit: 20, offset: 0 }
    },
    result: {
      data: {
        users: [
          { id: '1', name: 'John Doe', role: 'manager', isActive: true },
          { id: '2', name: 'Jane Smith', role: 'consultant', isActive: true }
        ],
        usersAggregate: { aggregate: { count: 2 } }
      }
    }
  }
];

const TestComponent = () => (
  <MockedProvider mocks={userMocks} addTypename={false}>
    <UsersList />
  </MockedProvider>
);
```

### Testing Subscriptions

```typescript
import { MockedProvider } from '@apollo/client/testing';

const subscriptionMocks = [
  {
    request: {
      query: UserStatusUpdatesDocument,
      variables: { userId: '1' }
    },
    result: {
      data: {
        users: [{ id: '1', isActive: true, lastLoginAt: '2025-06-23T10:00:00Z' }]
      }
    }
  }
];

const TestSubscriptionComponent = () => (
  <MockedProvider mocks={subscriptionMocks} addTypename={false}>
    <UserStatusTracker userId="1" />
  </MockedProvider>
);
```

## Common Patterns

### Conditional Queries

```typescript
const UserProfile = ({ userId }: { userId?: string }) => {
  const { data, loading } = useQuery(GetUserDetailDocument, {
    variables: { id: userId! },
    skip: !userId
  });

  if (!userId) {
    return <div>No user selected</div>;
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1>{data?.user?.name}</h1>
      {/* User profile content */}
    </div>
  );
};
```

### Polling with Smart Intervals

```typescript
const LiveDashboard = () => {
  const { data } = useQuery(GetUnifiedDashboardDataDocument, {
    variables: {
      from_date: new Date().toISOString().split('T')[0],
      limit: 5
    },
    pollInterval: 30000, // Poll every 30 seconds
    errorPolicy: 'all'
  });

  return (
    <div className="dashboard">
      <DashboardStats data={data} />
    </div>
  );
};
```

### Dependent Queries

```typescript
const UserPayrolls = ({ userId }: { userId: string }) => {
  // First query: Get user details
  const { data: userData } = useQuery(GetUserDetailDocument, {
    variables: { id: userId }
  });

  // Second query: Get payrolls (depends on first query)
  const { data: payrollData } = useQuery(GetPayrollsByUserDocument, {
    variables: { userId },
    skip: !userData?.user
  });

  return (
    <div>
      {userData?.user && (
        <h2>Payrolls for {userData.user.name}</h2>
      )}
      
      {payrollData?.payrolls?.map(payroll => (
        <PayrollCard key={payroll.id} payroll={payroll} />
      ))}
    </div>
  );
};
```

## Security Best Practices

### Input Validation

```typescript
const CreateUserForm = () => {
  const [createUser] = useMutation(CreateUserDocument);

  const handleSubmit = async (formData: CreateUserInput) => {
    // Validate input before sending
    if (!formData.name?.trim()) {
      throw new Error('Name is required');
    }
    
    if (!formData.email?.includes('@')) {
      throw new Error('Valid email is required');
    }

    try {
      await createUser({
        variables: { object: formData }
      });
    } catch (error) {
      console.error('Creation failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### Audit Logging

```typescript
const AuditedUserUpdate = ({ userId }: { userId: string }) => {
  const [updateUser] = useMutation(UpdateUserDocument);

  const handleUpdate = async (changes: UpdateUserInput) => {
    try {
      await updateUser({
        variables: { id: userId, changes },
        context: {
          auditEvent: {
            action: 'user.update',
            resourceId: userId,
            resourceType: 'user',
            metadata: changes
          }
        }
      });
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div>
      {/* Update form */}
    </div>
  );
};
```

## Troubleshooting

### Common Issues

1. **Type Errors After Schema Changes**
   ```bash
   # Regenerate types
   pnpm codegen
   
   # Clear cache if needed
   rm -rf node_modules/.cache
   ```

2. **Fragment Not Found Errors**
   ```typescript
   // Make sure you're importing from the correct domain
   import { UserSummaryFragmentDoc } from '@/domains/users/graphql/generated/graphql';
   ```

3. **Permission Denied Errors**
   ```bash
   # Check permissions
   pnpm fix:permissions:dry-run
   
   # Fix permissions
   pnpm fix:permissions
   ```

4. **Cache Issues**
   ```typescript
   // Clear specific cache entries
   client.cache.evict({ fieldName: 'users' });
   client.cache.gc();
   
   // Or reset entire cache
   client.clearStore();
   ```

### Performance Debugging

```typescript
// Enable Apollo Client DevTools
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NODE_ENV === 'development'
});

// Log query performance
const withPerformanceLogging = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const startTime = performance.now();
    
    useEffect(() => {
      const endTime = performance.now();
      console.log(`Component rendered in ${endTime - startTime}ms`);
    });

    return <WrappedComponent {...props} />;
  };
};
```

## Next Steps

### Recommended Learning Path

1. **Start with Basic Queries**: Use the fragment hierarchy patterns
2. **Add Pagination**: Implement list views with pagination
3. **Implement Search**: Add search functionality to your components
4. **Add Real-time Updates**: Implement subscriptions for live data
5. **Optimize Performance**: Use proper caching and prefetching
6. **Add Error Handling**: Implement comprehensive error boundaries
7. **Write Tests**: Create tests for your GraphQL components

### Advanced Topics

- **Query Batching**: Combine multiple operations
- **Advanced Caching**: Implement Redis for server-side caching
- **Performance Monitoring**: Integrate Apollo Studio
- **Custom Directives**: Create reusable GraphQL directives

---

**Need Help?**
- Check the [GraphQL Operations Guide](/docs/GRAPHQL_OPERATIONS_GUIDE.md)
- Review the [Audit Report](/docs/GRAPHQL_AUDIT_REPORT.md)
- Consult the [CLAUDE.md](/CLAUDE.md) for project-specific guidance