#!/bin/bash

# Test the holiday sync endpoint to see exact error
echo "Testing holiday sync endpoint..."

curl -X POST https://payroll.bytemy.com.au/api/holidays/sync \
  -H "Content-Type: application/json" \
  -H "Cookie: $(echo 'your-session-cookie-here')" \
  -d '{"force": false}' \
  -v 2>&1

echo -e "\n\nIf you get a 401, you need to add proper authentication cookie"
echo "The error above should show the exact issue"