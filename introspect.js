const { buildSchema, getIntrospectionQuery, printSchema } = require('graphql');
const fetch = require('node-fetch');
const fs = require('fs');

async function introspectSchema() {
  const response = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || process.env.HASURA_GRAPHQL_ADMIN_SECRET
    },
    body: JSON.stringify({
      query: getIntrospectionQuery()
    })
  });

  const { data } = await response.json();
  const schema = buildSchema(data);
  fs.writeFileSync('./shared/schema/schema.graphql', printSchema(schema));
  console.log('Schema written to ./shared/schema/schema.graphql');
}

introspectSchema().catch(console.error);