/**
 * GraphQL File Transformer for Jest
 * Transforms .graphql files for testing
 */

const { readFileSync } = require('fs');

module.exports = {
  process(src, filename) {
    // Read the GraphQL file content
    const content = readFileSync(filename, 'utf8');
    
    // Return as a string that can be imported in tests
    return {
      code: `module.exports = ${JSON.stringify(content)};`,
    };
  },
};