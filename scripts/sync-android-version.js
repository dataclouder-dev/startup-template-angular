const fs = require('fs');
const path = require('path');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

// Read build.gradle
const gradlePath = path.join('android', 'app', 'build.gradle');
const gradleContent = fs.readFileSync(gradlePath, 'utf8');

// Get current versionCode and increment it
const versionCodeMatch = gradleContent.match(/versionCode\s+(\d+)/);
const currentVersionCode = versionCodeMatch ? parseInt(versionCodeMatch[1]) : 0;
const newVersionCode = currentVersionCode + 1;

// Replace both versionCode and versionName
let updatedGradleContent = gradleContent
    .replace(/versionCode\s+\d+/, `versionCode ${newVersionCode}`)
    .replace(/versionName\s+["'].*["']/, `versionName "${version}"`);

// Write back to build.gradle
fs.writeFileSync(gradlePath, updatedGradleContent);

console.log(`Updated Android versionName to ${version} and versionCode to ${newVersionCode}`); 