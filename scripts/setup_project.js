#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, ans => {
    resolve(ans.trim());
  }));
}

async function main() {
  console.log("\n1. Starting project setup script...");


  const officialDomain = await askQuestion("Enter official domain (e.g., dataclouder.dev,  my-startup.com, my-project.io): ");
  if (!officialDomain || officialDomain.trim() === "") {
    console.error("Official domain cannot be empty.");
    rl.close();
    process.exit(1);
  }

  const domainParts = officialDomain.split('.');
  if (domainParts.length < 2 || domainParts.some(part => part.length === 0) || officialDomain.startsWith('.') || officialDomain.endsWith('.')) {
    console.error("Invalid domain format. Must be like 'name.ext' (e.g., my-startup.com), cannot start or end with a dot, and parts cannot be empty.");
    rl.close();
    process.exit(1);
  }

  const extension = domainParts.pop();
  const projectName = domainParts.join('.');

  // Validate projectName
  if (!projectName || !projectName.match(/^[a-zA-Z0-9.-]+$/) || projectName.startsWith('-') || projectName.endsWith('-')) {
    console.error("Invalid project name derived from domain. Use letters, numbers, dots, or hyphens. Cannot start or end with a hyphen, and must not be empty or contain invalid characters.");
    rl.close();
    process.exit(1);
  }

  // Validate extension
  if (!extension.match(/^[a-zA-Z0-9]+$/)) {
    console.error("Invalid extension part of the domain. Use letters or numbers, and must not be empty.");
    rl.close();
    process.exit(1);
  }

  console.log("\nUser inputs (will be set in Makefile):");
  console.log(`  Official Domain: ${officialDomain}`);
  console.log(`  Project Name (PROJECT_NAME): ${projectName}`);
  console.log(`  Extension (EXT): ${extension}`);

  const makefilePath = path.join(process.cwd(), 'makefile');

  try {
    if (!fs.existsSync(makefilePath)) {
      console.error(`Error: Makefile not found at ${makefilePath}. Make sure you are in the project root directory.`);
      process.exit(1);
    }
    let makefileContent = fs.readFileSync(makefilePath, 'utf8');
    console.log("\n2. Updating Makefile default values for ENV, EXT, PROJECT_NAME...");

    makefileContent = makefileContent.replace(/^(EXT \?= ).*$/m, `$1${extension}`);
    makefileContent = makefileContent.replace(/^(PROJECT_NAME \?= ).*$/m, `$1${projectName}`);
    // PROJECT_ID and APP_ID lines in Makefile are intentionally not replaced here.
    // Their definitions in the Makefile use $(ENV), $(PROJECT_NAME), $(EXT), which are being set above.

    fs.writeFileSync(makefilePath, makefileContent, 'utf8');
    console.log("2. Makefile updated successfully.");

    console.log("\n3. Running 'make rename-project'...");
    execSync('make rename-project', { stdio: 'inherit' });
    console.log("3. 'make rename-project' completed.");

    console.log("\n4. Running 'make init-firebase'...");
    execSync('make init-firebase', { stdio: 'inherit' });
    console.log("4. 'make init-firebase' completed.");

    console.log("\n5. Setup script finished successfully!");
    console.log("You can now start the development server with 'npm run start' or 'make start'.");

  } catch (error) {
    console.error("\nAn error occurred during script execution:");
    console.error(error.message);
    if (error.stdout) console.error("STDOUT:", error.stdout.toString());
    if (error.stderr) console.error("STDERR:", error.stderr.toString());
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();