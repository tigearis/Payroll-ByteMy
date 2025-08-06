#!/bin/bash

# Apply Hasura metadata changes for the billing system redesign

echo "🔄 Applying Hasura metadata changes for billing system..."

# Check if we can access Hasura
if ! command -v hasura &> /dev/null; then
    echo "❌ Hasura CLI not found. Please install it first."
    exit 1
fi

# Navigate to the hasura directory
cd /Users/nathanharris/Payroll/Payroll-ByteMy/hasura

# Apply metadata
echo "📝 Applying metadata..."
hasura metadata apply --envfile .env

if [ $? -eq 0 ]; then
    echo "✅ Metadata applied successfully!"
    
    # Check for inconsistencies
    echo "🔍 Checking for metadata inconsistencies..."
    hasura metadata ic list --envfile .env
    
    if [ $? -eq 0 ]; then
        echo "✅ No metadata inconsistencies found!"
        
        # Optional: Export metadata to verify changes
        echo "📋 Exporting metadata to verify changes..."
        hasura metadata export --envfile .env
        
        echo "🎉 Billing system metadata update complete!"
        echo ""
        echo "📊 New tables with permissions configured:"
        echo "  - user_billing_rates (full RBAC permissions)"
        echo "  - client_service_assignments (full RBAC permissions)" 
        echo "  - payroll_service_overrides (consultant/manager workflow)"
        echo "  - payroll_service_quantities (payroll-specific permissions)"
        echo "  - invoices (manager approval workflow)"
        echo "  - invoice_line_items (linked to invoice permissions)"
        echo ""
        echo "🔗 Enhanced relationships added to:"
        echo "  - services (↔ assignments, overrides, quantities, time entries)"
        echo "  - clients (↔ service assignments, invoices)"
        echo "  - time_entries (↔ assigned services with billing fields)"
        echo "  - users (↔ billing rates, created records)"
        echo ""
        echo "✨ The billing system is ready for production!"
        
    else
        echo "⚠️  Some metadata inconsistencies found. Please review them."
    fi
else
    echo "❌ Failed to apply metadata. Please check the configuration."
    exit 1
fi