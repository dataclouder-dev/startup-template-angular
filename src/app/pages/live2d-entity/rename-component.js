#!/usr/bin/env node

/**
 * How to use:
 * 1. Copy the 'generics' folder to your new destination.
 * 2. cd into that folder.
 * 3. Run: node rename-component.js NewComponentName
 * 
 * Example:
 * node rename-component.js OrderManagement
 * 
 * This will:
 * - Rename all files and folders from 'generic' to 'order-management'
 * - Update content: 'Generic' -> 'OrderManagement', 'generic' -> 'orderManagement', 'generic' -> 'order-management'
 * - Rename the current folder to 'order-management'
 */

const { readdirSync, statSync, renameSync, readFileSync, writeFileSync } = require('fs');
const { join, dirname, basename } = require('path');
const readline = require('readline');

// --- Configuration ---
const oldNameBase = 'generic'; // The name currently used in the templates
const newNameInput = process.argv[2];

if (!newNameInput) {
  console.error('\n ⚠️  Usage: node rename-component.js <NewName>');
  console.error(' Example: node rename-component.js CompetitionAnalysis\n');
  process.exit(1);
}

// --- Case Helpers ---
function normalize(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // CamelCase to kebab-case
    .replace(/[_\s]+/g, '-')                // Spaces and underscores to kebab-case
    .toLowerCase();
}

const kebab = normalize(newNameInput);
const pascal = kebab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1);
const upperSnake = kebab.replace(/-/g, '_').toUpperCase();

const oldKebab = oldNameBase.toLowerCase();
const oldPascal = 'Generic';
const oldCamel = 'generic';
const oldUpperSnake = 'GENERIC';

// Plurals (naive but usually enough for standard "generics" templates)
const oldKebabPlural = 'generics';
const oldPascalPlural = 'Generics';
const oldCamelPlural = 'generics';

const kebabPlural = kebab + 's';
const pascalPlural = pascal + 's';
const camelPlural = camel + 's';

console.log(`\n🚀 Preparing to rename '${oldNameBase}' to '${pascal}'...`);
console.log(`   - Kebab-case: ${kebab}`);
console.log(`   - PascalCase: ${pascal}`);
console.log(`   - camelCase:  ${camel}`);
console.log(`   - UPPER_CASE: ${upperSnake}\n`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question(`Proceed with these changes in the current directory? (y/n): `, (answer) => {
  if (answer.toLowerCase() !== 'y') {
    console.log('Operation cancelled.');
    process.exit(0);
  }

  processRenaming('.');
  renameCurrentDir();

  console.log('\n✅ Renaming completed successfully!');
  console.log('💡 Tip: Check your routing and imports in app.module.ts or app.routes.ts\n');
  rl.close();
});

function processRenaming(dir) {
  const items = readdirSync(dir);

  items.forEach((item) => {
    // Skip the script itself and some hidden folders
    if (item === 'rename-component.js' || item === '.git' || item === 'node_modules') return;

    const fullPath = join(dir, item);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      processRenaming(fullPath);
      
      // Rename directory after children are processed
      if (item.toLowerCase().includes(oldKebab)) {
        const newItemName = item
          .replace(new RegExp(oldKebabPlural, 'g'), kebabPlural)
          .replace(new RegExp(oldKebab, 'g'), kebab);
        
        if (newItemName !== item) {
          const newPath = join(dir, newItemName);
          renameSync(fullPath, newPath);
          console.log(`📂 Dir:  ${fullPath} → ${newPath}`);
        }
      }
    } else if (stats.isFile()) {
      updateFileContent(fullPath);
      
      // Rename file
      if (item.toLowerCase().includes(oldKebab)) {
        const newItemName = item
          .replace(new RegExp(oldKebabPlural, 'g'), kebabPlural)
          .replace(new RegExp(oldKebab, 'g'), kebab);
        
        if (newItemName !== item) {
          const newPath = join(dir, newItemName);
          renameSync(fullPath, newPath);
          console.log(`📄 File: ${item} → ${newItemName}`);
        }
      }
    }
  });
}

function updateFileContent(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replacement Order: Longest/Specific first to avoid partial matches
  
  // 1. Plurals
  content = content.replace(new RegExp(oldPascalPlural, 'g'), pascalPlural);
  content = content.replace(new RegExp(oldCamelPlural, 'g'), camelPlural);
  content = content.replace(new RegExp(oldKebabPlural, 'g'), kebabPlural);

  // 2. Singulars
  content = content.replace(new RegExp(oldPascal, 'g'), pascal);
  content = content.replace(new RegExp(oldCamel, 'g'), camel);
  content = content.replace(new RegExp(oldKebab, 'g'), kebab);
  content = content.replace(new RegExp(oldUpperSnake, 'g'), upperSnake);

  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf8');
  }
}

function renameCurrentDir() {
  const currentPath = process.cwd();
  const dirName = basename(currentPath);
  
  if (dirName.toLowerCase() === oldKebab || dirName.toLowerCase() === oldKebabPlural) {
    const parent = dirname(currentPath);
    const newDirName = dirName.toLowerCase() === oldKebabPlural ? kebabPlural : kebab;
    
    console.log(`\n➡️  Renaming current folder: ${dirName} → ${newDirName}`);
    try {
      // Note: renaming the process.cwd() is tricky on some OS, 
      // but renameSync usually works if the process holds no open file handles.
      process.chdir(parent);
      renameSync(dirName, newDirName);
    } catch (err) {
      console.warn(`⚠️  Could not rename the root folder automatically: ${err.message}`);
      console.log(`   Please rename it manually to '${newDirName}'`);
    }
  }
}
