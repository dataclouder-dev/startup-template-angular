const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
const assetsPath = path.resolve(__dirname, '..', 'public');

// We re-require or read it directly to ensure we have the absolute latest version if bumped just before
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const newVersion = packageJson.version;

console.log(`🚀 Syncing version ${newVersion} to config files...`);

fs.readdir(assetsPath, (err, files) => {
  if (err) {
    console.error('Error reading assets directory:', err);
    process.exit(1);
  }

  // Filter for config.json and config.*.json
  const configFiles = files.filter((file) => 
    file === 'config.json' || (file.startsWith('config.') && file.endsWith('.json'))
  );

  if (configFiles.length === 0) {
    console.warn('No config files found in public. Nothing to update.');
    return;
  }

  configFiles.forEach((file) => {
    const filePath = path.join(assetsPath, file);
    try {
      const configContent = fs.readFileSync(filePath, 'utf8');
      const configJson = JSON.parse(configContent);

      if (configJson.version !== newVersion) {
        configJson.version = newVersion;
        fs.writeFileSync(filePath, JSON.stringify(configJson, null, 2));
        console.log(`✅ Successfully updated ${file} to version ${newVersion}`);
      } else {
        console.log(`ℹ️  ${file} is already up to date with version ${newVersion}.`);
      }
    } catch (error) {
      console.error(`❌ Failed to update ${file}:`, error);
    }
  });
});
