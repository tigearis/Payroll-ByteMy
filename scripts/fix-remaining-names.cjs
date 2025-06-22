#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Additional patterns to fix the remaining issues
const ADDITIONAL_FIXES = [
  // Constants that should have underscores
  { from: /\bCOLUMNDEFINITIONS\b/g, to: 'COLUMN_DEFINITIONS' },
  { from: /\bPAYROLLCYCLES\b/g, to: 'PAYROLL_CYCLES' },
  { from: /\bAVAILABLEPERMISSIONS\b/g, to: 'AVAILABLE_PERMISSIONS' },
  { from: /\bFILENAMING_PATTERNS\b/g, to: 'FILE_NAMING_PATTERNS' },
  { from: /\bIDENTIFIERPATTERNS\b/g, to: 'IDENTIFIER_PATTERNS' },
  { from: /\bADMINROLES\b/g, to: 'ADMIN_ROLES' },
  { from: /\bCUSTOMPERMISSIONS\b/g, to: 'CUSTOM_PERMISSIONS' },
  { from: /\bUSERROLES\b/g, to: 'USER_ROLES' },
  { from: /\bVALIDROLES\b/g, to: 'VALID_ROLES' },
  { from: /\bSIGNINGCONFIG\b/g, to: 'SIGNING_CONFIG' },
  { from: /\bRATELIMITS\b/g, to: 'RATE_LIMITS' },
  { from: /\bROUTELIMITS\b/g, to: 'ROUTE_LIMITS' },
  { from: /\bSUSPICIOUSPATTERNS\b/g, to: 'SUSPICIOUS_PATTERNS' },
  { from: /\bMFAREQUIRED_ROLES\b/g, to: 'MFA_REQUIRED_ROLES' },
  { from: /\bMFAREQUIRED_ROUTES\b/g, to: 'MFA_REQUIRED_ROUTES' },
  
  // Properties that should be snake_case
  { from: /\.failedoperations\b/g, to: '.failed_operations' },
  { from: /\.dataaccess_summary\b/g, to: '.data_access_summary' },
  { from: /\.authevents_summary\b/g, to: '.auth_events_summary' },
  
  // Variables that got corrupted
  { from: /\bexternalaccounts\b/g, to: 'external_accounts' },
  { from: /\bpayrollcycle_type\b/g, to: 'payroll_cycle_type' },
  { from: /\bpayrolldate_type\b/g, to: 'payroll_date_type' },
  { from: /\baffectedassignments\b/g, to: 'affected_assignments' },
  
  // Contact field fixes
  { from: /\.contactemail\b/g, to: '.contact_email' },
  { from: /\.contactphone\b/g, to: '.contact_phone' },
  { from: /\.contactperson\b/g, to: '.contact_person' },
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    for (const pattern of ADDITIONAL_FIXES) {
      const originalContent = content;
      content = content.replace(pattern.from, pattern.to);
      if (content !== originalContent) {
        changed = true;
      }
    }
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function fixDirectory(dir) {
  let totalFixed = 0;
  
  function processDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, .git, .next, etc.
        if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(item)) {
          processDirectory(itemPath);
        }
      } else if (stat.isFile()) {
        // Process TypeScript, JavaScript, and JSX files
        if (/\.(ts|tsx|js|jsx)$/.test(item)) {
          if (fixFile(itemPath)) {
            totalFixed++;
          }
        }
      }
    }
  }
  
  console.log('🔧 Fixing remaining naming issues...');
  processDirectory(dir);
  console.log(`\n✨ Fixed ${totalFixed} files.`);
}

// Run the fix
const projectRoot = path.join(__dirname, '..');
fixDirectory(projectRoot);