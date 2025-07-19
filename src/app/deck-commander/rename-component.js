// 1) How to use: 'cd src/CompetitorAnalysis' or folder where the script is located and run 'node script_change.js'.
//    The script will rename files/folders/content inside, and also the folder from where it is run.
// 2) Dont forget to change the oldName and newName variables
// 3) Manually import the Module and change path in app.module.ts

// 4) Necesita ajustos en el html, debe cambiar con kabeb case, pero la ai le cuesta mucho arreglar esto, a ver que hago despues
const { readdirSync, statSync, renameSync, readFileSync, writeFileSync } = require('fs');
const { join, dirname, basename } = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const directory = './';
const oldName = 'DeckCommander';
const newName = 'DeckCommander'; // Replace this with your desired name use a format AllCapName

function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

const newNameKebabCase = toKebabCase(newName);

const newNameCapitalized = newName.charAt(0).toUpperCase() + newName.slice(1);

function renameFiles(dir) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      // Always continue renaming inside the directory
      renameFiles(filePath);

      if (file.toLowerCase().includes(oldName.toLowerCase())) {
        // Rename directories containing the old name using kebab case
        const newDirName = file.replace(new RegExp(oldName, 'gi'), newNameKebabCase);
        const newDirPath = join(dir, newDirName);
        try {
          renameSync(filePath, newDirPath);
          console.log(`Renamed directory: ${file} → ${newDirName}`);
        } catch (err) {
          console.error(`Error renaming directory ${file}:`, err);
        }
      }
    } else if (stats.isFile()) {
      // Read the file content
      let content = readFileSync(filePath, 'utf8');

      // Replace import paths with kebab-case
      content = content.replace(
        new RegExp(`(from\\s+['\"])(.*)${oldName}(.*['\"])`, 'g'),
        (match, prefix, path, suffix) => `${prefix}${path}${newNameKebabCase}${suffix}`,
      );

      // Replace occurrences of the old name with the new name in the content
      // For variable/class names, we still use camelCase and capitalized versions
      content = content.replace(new RegExp(oldName, 'g'), newName);
      content = content.replace(new RegExp(oldName.charAt(0).toUpperCase() + oldName.slice(1), 'g'), newNameCapitalized);

      // Write the updated content back to the file
      writeFileSync(filePath, content, 'utf8');

      if (file.toLowerCase().includes(oldName.toLowerCase())) {
        // Rename files containing the old name using kebab case
        const newFileName = file.replace(new RegExp(oldName, 'gi'), newNameKebabCase);
        const newPath = join(dir, newFileName);
        try {
          renameSync(filePath, newPath);
          console.log(`Renamed: ${file} → ${newFileName}`);
        } catch (err) {
          console.error(`Error renaming ${file}:`, err);
        }
      }
    }
  });
}

if (!newName) {
  console.error(' ⚠️ Not Yet: Please set the newName variable before running the script. Line 12 🤔 should be SINGULAR name not plural');
  process.exit(1);
}

rl.question(`Are you sure you want to change all occurrences of '${oldName}' to '${newName}'? (y/n): `, (answer) => {
  if (answer.toLowerCase() === 'y') {
    console.log('Proceeding with renaming...');
    // Execute the function
    renameFiles(directory);

    // Rename the current directory itself
    const currentDirPath = process.cwd();
    const parentDir = dirname(currentDirPath);
    const currentDirName = basename(currentDirPath);

    if (currentDirName.toLowerCase() === oldName.toLowerCase()) {
      const newDirNameKebabCase = toKebabCase(newName);
      try {
        // To rename the current directory, we need to be in its parent directory
        process.chdir(parentDir);
        renameSync(currentDirName, newDirNameKebabCase);
        console.log(`Renamed current directory: ${currentDirName} → ${newDirNameKebabCase}`);
        // Change back to the newly named directory so the process ends in the right place.
        process.chdir(newDirNameKebabCase);
      } catch (err) {
        console.error(`Error renaming current directory ${currentDirName}:`, err);
      }
    }

    console.log('Renaming completed, dont forget to manually import the new name in app.module.ts');
  } else {
    console.log('Operation cancelled.');
  }
  rl.close();
});
