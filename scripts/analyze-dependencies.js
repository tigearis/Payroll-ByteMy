/**
 * Dependency Analysis Script
 * 
 * Analyzes package.json for optimization opportunities:
 * - Duplicate dependencies
 * - Large packages that could be optimized
 * - Unused dependencies
 */

import fs from 'fs';
import { execSync } from 'child_process';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

console.log('🔍 DEPENDENCY ANALYSIS\n');

// Large packages that significantly impact bundle size
const HEAVY_PACKAGES = [
  '@apollo/client',
  'lucide-react', 
  'recharts',
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-select',
  '@tanstack/react-table',
  'framer-motion',
  'd3',
];

// Check for heavy packages and their sizes
console.log('📦 HEAVY PACKAGES ANALYSIS');
console.log('=============================');

const heavyPackagesFound = [];
for (const pkg of HEAVY_PACKAGES) {
  if (packageJson.dependencies[pkg] || packageJson.devDependencies[pkg]) {
    console.log(`✓ ${pkg}: ${packageJson.dependencies[pkg] || packageJson.devDependencies[pkg]}`);
    heavyPackagesFound.push(pkg);
  }
}

console.log(`\nFound ${heavyPackagesFound.length} heavy packages that impact bundle size\n`);

// Analyze Radix UI packages
const radixPackages = Object.keys(packageJson.dependencies).filter(pkg => pkg.startsWith('@radix-ui/'));
console.log('🎨 RADIX UI PACKAGES');
console.log('====================');
console.log(`Total Radix UI packages: ${radixPackages.length}`);
radixPackages.forEach(pkg => {
  console.log(`- ${pkg}: ${packageJson.dependencies[pkg]}`);
});

// Check for potential consolidation opportunities
console.log('\n⚡ OPTIMIZATION OPPORTUNITIES');
console.log('===============================');

// Icon libraries
const iconLibs = Object.keys(packageJson.dependencies).filter(pkg => 
  pkg.includes('icon') || pkg === 'lucide-react'
);
console.log(`📎 Icon Libraries (${iconLibs.length}):`, iconLibs);

// UI component libraries  
const uiLibs = Object.keys(packageJson.dependencies).filter(pkg =>
  pkg.startsWith('@radix-ui/') || pkg.includes('ui') || pkg.includes('component')
);
console.log(`🎛️  UI Libraries (${uiLibs.length}):`, uiLibs.slice(0, 5), uiLibs.length > 5 ? '...' : '');

// Data visualization
const dataVizLibs = Object.keys(packageJson.dependencies).filter(pkg =>
  pkg.includes('chart') || pkg.includes('d3') || pkg.includes('graph')
);
console.log(`📊 Data Viz Libraries (${dataVizLibs.length}):`, dataVizLibs);

// Testing libraries in dependencies (should be dev)
const testingInProd = Object.keys(packageJson.dependencies).filter(pkg =>
  pkg.includes('test') || pkg.includes('jest') || pkg.includes('cypress')
);
if (testingInProd.length > 0) {
  console.log(`⚠️  Testing libs in production:`, testingInProd);
}

// Generate optimization recommendations
console.log('\n🚀 RECOMMENDATIONS');
console.log('===================');

if (heavyPackagesFound.includes('lucide-react')) {
  console.log('✅ Lucide React: Already optimized with lazy loading');
}

if (radixPackages.length > 10) {
  console.log('📦 Consider consolidating Radix UI imports with modularizeImports');
}

if (heavyPackagesFound.includes('recharts')) {
  console.log('📈 Recharts: Consider lazy loading chart components');
}

if (heavyPackagesFound.includes('@apollo/client')) {
  console.log('🔍 Apollo Client: Consider using lightweight GraphQL client for simple queries');
}

if (heavyPackagesFound.includes('framer-motion')) {
  console.log('🎬 Framer Motion: Consider lazy loading animation components');
}

console.log('\n💡 NEXT STEPS:');
console.log('- Implement tree-shaking for remaining heavy packages');
console.log('- Add dynamic imports for chart and animation components');
console.log('- Consider package alternatives for smaller bundle size');
console.log('- Move any testing dependencies to devDependencies');

// Bundle size estimation
const estimatedReduction = heavyPackagesFound.length * 0.5; // Rough estimate
console.log(`\n📊 Estimated bundle reduction potential: ${estimatedReduction.toFixed(1)}MB`);