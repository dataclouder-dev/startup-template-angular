console.log('Syncing project version');
const fs = require('fs');
const path = require('path');

// Resolve paths relative to project root
const projectRoot = path.resolve(__dirname, '..');

// Read package.json version
const packageJsonPath = path.join(projectRoot, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

console.log(`Current version: ${version}`);

// Paths to environment files
const envPaths = [
  path.join(projectRoot, 'src', 'environments', 'environment.ts'),
  path.join(projectRoot, 'src', 'environments', 'environment.qa.ts'),
  path.join(projectRoot, 'src', 'environments', 'environment.semipro.ts'),
  path.join(projectRoot, 'src', 'environments', 'environment.prod.ts')
];

// Update each environment file
envPaths.forEach(envPath => {
  try {
    if (!fs.existsSync(envPath)) {
      console.error(`File not found: ${envPath}`);
      return;
    }

    let content = fs.readFileSync(envPath, 'utf8');
    
    // Replace version in environment file
    // This regex looks for the version property and updates its value
    const newContent = content.replace(
      /(version:\s*['"])[^'"]*(['"])/,
      `$1${version}$2`
    );
    
    if (content === newContent) {
      console.log(`No version changes needed in ${envPath}`);
    } else {
      fs.writeFileSync(envPath, newContent);
      console.log(`Updated ${envPath} with version ${version}`);
    }
  } catch (error) {
    console.error(`Error processing ${envPath}:`, error);
  }
});
