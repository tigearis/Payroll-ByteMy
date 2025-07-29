#!/bin/bash

# Script to fix GraphQL name field references systematically
echo "Fixing GraphQL name field references..."

# Find and fix user name references in queries/mutations/subscriptions
# But preserve payroll names, client names, role names, etc.

# Function to fix user references only
fix_user_name_references() {
    local file=$1
    echo "Processing $file..."
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Fix user references in specific patterns
    # Pattern: user/consultant/manager blocks with name field
    sed -i '' '/primary[Cc]onsultant\|backup[Cc]onsultant\|manager[Uu]ser\|created[Bb]y[Uu]ser\|invited[Bb]y[Uu]ser\|accepted[Bb]y[Uu]ser\|performed[Bb]y[Uu]ser\|role[Uu]ser\|leave[Uu]ser\|author[Uu]ser\|sender[Uu]ser\|approved[Bb]y[Uu]ser/{
        :a
        n
        /^[[:space:]]*name[[:space:]]*$/{
            c\
      firstName\
      lastName\
      computedName
        }
        /^[[:space:]]*}/{
            b
        }
        ba
    }' "$file"
    
    # Fix standalone user queries (but not payroll/client queries)
    sed -i '' '/users.*{/{
        :a
        n
        /^[[:space:]]*name[[:space:]]*$/{
            c\
    firstName\
    lastName\
    computedName
        }
        /^[[:space:]]*}/{
            b
        }
        ba
    }' "$file"
}

# Process key domains
echo "Fixing payrolls domain..."
for file in domains/payrolls/graphql/*.graphql; do
    if [[ -f "$file" ]]; then
        fix_user_name_references "$file"
    fi
done

echo "Fixing email domain..." 
for file in domains/email/graphql/*.graphql; do
    if [[ -f "$file" ]]; then
        fix_user_name_references "$file"
    fi
done

echo "Fixing notes domain..."
for file in domains/notes/graphql/*.graphql; do
    if [[ -f "$file" ]]; then
        fix_user_name_references "$file"
    fi
done

echo "Done! Testing GraphQL generation..."
pnpm codegen 2>&1 | grep -c "Cannot query field \"name\" on type \"users\"" || echo "0"