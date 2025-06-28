// Script to fix user metadata via Clerk API
// Replace YOUR_USER_ID and YOUR_DATABASE_UUID with actual values

const userId = "user_2yU7Nspg9Nemmy1FdKE1SFIofms"; // Your Clerk user ID
const databaseId = "YOUR_DATABASE_UUID"; // Get this from your database

fetch(`https://api.clerk.com/v1/users/${userId}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    public_metadata: {
      role: "developer",
      databaseId: databaseId,
      permissions: ["read", "write", "create", "delete", "admin"],
      isStaff: true
    }
  })
});

// Or use this curl command:
/*
curl -X PATCH https://api.clerk.com/v1/users/user_2yU7Nspg9Nemmy1FdKE1SFIofms \
  -H "Authorization: Bearer ${CLERK_SECRET_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "public_metadata": {
      "role": "developer", 
      "databaseId": "YOUR_DATABASE_UUID",
      "permissions": ["read", "write", "create", "delete", "admin"],
      "isStaff": true
    }
  }'
*/