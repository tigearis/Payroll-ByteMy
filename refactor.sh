#!/bin/bash

set -euo pipefail

echo "🔧 Starting codebase refactor..."

# Phase 1: Critical Duplications
echo "🔥 Removing critical duplicate directories..."
rm -rf api/ \
       \(auth\)/ \
       \(dashboard\)/ \
       auth/ \
       security/ \
       ui/ \
       design-tokens/ \
       audit/graphql/ \
       billing/graphql/ \
       clients/graphql/ \
       holidays/graphql/ \
       leave/graphql/ \
       notes/graphql/ \
       payrolls/graphql/ \
       staff/graphql/ \
       users/graphql/ \
       work-schedule/graphql/ \
       graphql/ \
       fragments/ \
       mutations/ \
       queries/ \
       subscriptions/

echo "🔥 Removing individual root-level duplicates..."
rm -f apollo-client.ts \
      apollo-provider.tsx \
      server-apollo-client.ts \
      api-auth.ts \
      auth-context.tsx \
      debug-auth.ts \
      utils.ts \
      date-utils.ts \
      payroll-service.ts \
      secure-hasura-service.ts \
      user-sync.ts \
      optimistic-updates.ts \
      holiday-sync-service.ts \
      payroll-date-service.ts

# Phase 2: Component Reorganisation
echo "📦 Moving components into /components/..."
mkdir -p components/auth

mv auth/* components/auth/ 2>/dev/null || true

mv add-note.tsx components/
mv ai-chat.tsx components/
mv australian-tax-calculator.tsx components/
mv client-card.tsx components/
mv dashboard-shell.tsx components/
mv hasura-test.tsx components/
mv jwt-test-panel.tsx components/
mv main-nav.tsx components/
mv user-nav.tsx components/
mv sidebar.tsx components/
mv payroll-*.tsx components/
mv upcoming-payrolls.tsx components/
mv urgent-alerts.tsx components/
mv modal-form.tsx components/
mv notes-*.tsx components/
mv clients-table.tsx components/
mv payrolls-table.tsx components/
mv export-*.tsx components/
mv refresh-button.tsx components/
mv sync-user-button.tsx components/
mv theme-toggle.tsx components/

# Phase 3: Webhook Structure Fix
echo "🔧 Fixing webhook directory structure..."
mkdir -p app/api/webhooks/clerk
mv app/api/clerk-webhooks/route.ts app/api/webhooks/clerk/route.ts
rm -rf app/api/clerk-webhooks/

# Phase 4: Hook Organisation
echo "🎣 Moving hooks to /hooks/..."
mkdir -p hooks
mv use*.ts hooks/
mv use*.tsx hooks/

# Phase 5: Type Organisation
echo "📝 Moving type files..."
mkdir -p types lib/auth
mv interface.ts types/ 2>/dev/null || true
mv enums.ts types/ 2>/dev/null || true
mv scalars.ts types/ 2>/dev/null || true
mv permissions.ts lib/auth/ 2>/dev/null || true

# Phase 6: Cleanup Operations
echo "🧹 Cleaning up backup, temp, and legacy docs..."
find . -name "*.backup" -delete
find . -name "*.bak" -delete
find . -name "*.old" -delete

mkdir -p docs/legacy
shopt -s extglob
mv !("CLAUDE.md"|"README.md")*.md docs/legacy/ 2>/dev/null || true

rm -rf statsig/ projects/ todos/ local/

# Phase 7: Config Consolidation
echo "⚙️ Consolidating configuration files..."
mkdir -p config
mv codegen*.ts config/ 2>/dev/null || true
mv eslint.config.* config/ 2>/dev/null || true
mv jest.* config/ 2>/dev/null || true
mv vercel*.json config/ 2>/dev/null || true

echo "✅ Codebase refactor complete!"
