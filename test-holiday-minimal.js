// Simple test to isolate GraphQL mutation issues
const { ApolloClient, InMemoryCache, gql, createHttpLink } = require('@apollo/client');
const fetch = require('cross-fetch');

const client = new ApolloClient({
  link: createHttpLink({
    uri: 'https://hasura.bytemy.com.au/v1/graphql',
    fetch,
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || 'your-admin-secret',
    }
  }),
  cache: new InMemoryCache(),
});

const TEST_MUTATION = gql`
  mutation TestInsertHoliday($objects: [holidaysInsertInput!]!) {
    bulkInsertHolidays(
      objects: $objects
      onConflict: {
        constraint: holidays_pkey
        updateColumns: [name]
      }
    ) {
      affectedRows
      returning {
        id
        name
        date
      }
    }
  }
`;

async function testSingleHoliday() {
  try {
    console.log('Testing single holiday insertion...');
    
    const testHoliday = {
      date: '2025-01-01',
      localName: 'Test Holiday',
      name: 'Test Holiday',
      countryCode: 'AU',
      region: ['NSW'],
      isFixed: true,
      isGlobal: false,
      launchYear: 2025,
      types: ['public'],
      updatedAt: new Date().toISOString(),
    };
    
    console.log('Test holiday object:', JSON.stringify(testHoliday, null, 2));
    
    const result = await client.mutate({
      mutation: TEST_MUTATION,
      variables: { objects: [testHoliday] }
    });
    
    console.log('✅ Success!', result.data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.graphQLErrors) {
      console.error('GraphQL Errors:', JSON.stringify(error.graphQLErrors, null, 2));
    }
    if (error.networkError) {
      console.error('Network Error:', error.networkError);
    }
  }
}

testSingleHoliday();