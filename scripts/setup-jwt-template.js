// @ts-nocheck
// scripts/setup-jwt-template.js
require("dotenv").config({ path: ".env.local" });

const { clerkClient } = require("@clerk/nextjs/server");

const templatePayload = {
  name: "hasura",
  claims: {
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": [
        "viewer",
        "consultant",
        "manager",
        "org_admin",
        "developer",
      ],
      "x-hasura-default-role": "{{user.public_metadata.role}}",
      "x-hasura-user-id": "{{user.public_metadata.databaseId}}",
      "x-hasura-clerk-user-id": "{{user.id}}",
      "x-hasura-permissions":
        "{{JSON.stringify(user.public_metadata.permissions)}}",
    },
  },
  tokenLifetime: 3600,
  custom_signing_key: false,
  signing_key_id: null,
  signing_algorithm: "RS256",
  claims_in_: "header",
  allowed_clock_skew: 60,
};

async function createOrUpdateJwtTemplate() {
  try {
    const clerk = clerkClient;
    const templates = await clerk.jwtTemplates.getJwtTemplateList();
    const existingTemplate = templates.find((t) => t.name === "hasura");

    if (existingTemplate) {
      // Update existing template
      const updatedTemplate = await clerk.jwtTemplates.updateJwtTemplate(
        existingTemplate.id,
        {
          claims: templatePayload.claims,
          tokenLifetime: templatePayload.tokenLifetime,
        }
      );
      console.log("✅ Hasura JWT template updated", updatedTemplate);
    } else {
      // Create new template
      const newTemplate = await clerk.jwtTemplates.createJwtTemplate(
        templatePayload
      );
      console.log("✅ Hasura JWT template created", newTemplate);
    }
  } catch (error) {
    console.error("❌ Failed to create/update Hasura JWT template:", error);
  }
}

createOrUpdateJwtTemplate();
