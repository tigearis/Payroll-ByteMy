#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

async function debugDetection() {
  console.log('🔍 Debugging file detection logic');
  
  const allApiFiles = await glob('./app/api/**/route.ts', { cwd: process.cwd() });
  console.log(`📁 Total API files found: ${allApiFiles.length}`);
  
  let filesWithConsole = 0;
  let filesWithEnterpriseImports = 0;
  let filesNeedingConversion = 0;
  
  for (const filePath of allApiFiles) {
    const fullPath = path.join(process.cwd(), filePath);
    const content = await fs.promises.readFile(fullPath, 'utf-8');
    
    const hasConsoleStatements = /console\.(log|error|warn|info)/.test(content);
    const hasEnterpriseImports = content.includes('from "@/lib/logging/enterprise-logger"');
    
    if (hasConsoleStatements) {
      filesWithConsole++;
      console.log(`📝 Has console: ${filePath}`);
    }
    
    if (hasEnterpriseImports) {
      filesWithEnterpriseImports++;
      console.log(`✅ Has enterprise: ${filePath}`);
    }
    
    if (hasConsoleStatements && !hasEnterpriseImports) {
      filesNeedingConversion++;
      console.log(`🔄 Needs conversion: ${filePath}`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`- Total files: ${allApiFiles.length}`);
  console.log(`- Files with console: ${filesWithConsole}`);
  console.log(`- Files with enterprise imports: ${filesWithEnterpriseImports}`);
  console.log(`- Files needing conversion: ${filesNeedingConversion}`);
}

debugDetection();