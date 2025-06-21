#!/bin/bash

# Script to detect unwanted lock files in the repository
# Prevents accidental commits of package-lock.json or yarn.lock

# Check for package-lock.json
if [ -f package-lock.json ]; then
  echo "❌ Error: Found package-lock.json file."
  echo "This project uses pnpm. Please remove package-lock.json and use pnpm-lock.yaml instead."
  echo "Run: rm package-lock.json && pnpm install"
  exit 1
fi

# Check for yarn.lock
if [ -f yarn.lock ]; then
  echo "❌ Error: Found yarn.lock file."
  echo "This project uses pnpm. Please remove yarn.lock and use pnpm-lock.yaml instead."
  echo "Run: rm yarn.lock && pnpm install"
  exit 1
fi

echo "✅ No unwanted lock files found!"
exit 0 