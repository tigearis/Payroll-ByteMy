// Check what payroll statuses are actually used in the database

const HASURA_URL = 'https://hasura.bytemy.com.au/v1/graphql';
const HASURA_SECRET = '3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=';

const query = `
  query GetPayrollStatuses {
    payrolls(distinct_on: status) {
      status
    }
  }
`;

async function checkStatuses() {
  try {
    const response = await fetch(HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_SECRET,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL Errors:', JSON.stringify(result.errors, null, 2));
    } else {
      console.log('Payroll statuses in use:');
      result.data.payrolls.forEach(p => {
        console.log(`- ${p.status}`);
      });
    }
  } catch (error) {
    console.error('Network Error:', error.message);
  }
}

checkStatuses();