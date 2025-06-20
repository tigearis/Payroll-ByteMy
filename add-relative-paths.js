import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Convert `import.meta.url` to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root directory (entire project)
const ROOT_DIR = path.resolve(__dirname);

// Directories to exclude
const EXCLUDED_DIRS = new Set(["node_modules", ".next", ".vercel"]);

// Function to get the relative path comment
const getRelativePathComment = (filePath) => {
  let relativePath = path.relative(ROOT_DIR, filePath);
  return `// ${relativePath.replace(/\\/g, "/")}`;
};

// Function to process a file
const processFile = (filePath) => {
  if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) return;

  const content = fs.readFileSync(filePath, "utf8").trim();
  const lines = content.split("\n");

  // Check if the first line is a relative path comment
  const pathRegex = /^\/\/\s*.*\.(ts|tsx)/;
  if (lines.length > 0 && pathRegex.test(lines[0])) {
    // Remove old comment
    lines.shift();
  }

  // Add new relative path comment
  const newContent = `${getRelativePathComment(filePath)}\n${lines.join("\n")}`;

  // Overwrite file with updated content
  fs.writeFileSync(filePath, newContent, "utf8");
  console.log(`Updated: ${filePath}`);
};

// Function to scan directories recursively (excluding certain folders)
const scanDirectory = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      if (!EXCLUDED_DIRS.has(file)) {
        scanDirectory(fullPath); // Only scan if not in excluded list
      }
    } else {
      processFile(fullPath);
    }
  });
};

// Start processing
console.log("Updating relative path comments for all files (excluding node_modules, .next, .vercel)...");
scanDirectory(ROOT_DIR);
console.log("✅ All files updated!");
