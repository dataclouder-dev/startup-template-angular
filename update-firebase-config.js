const fs = require('fs');

// Get Firebase configuration from command line argument
const firebaseConfigStr = process.argv[2];
if (!firebaseConfigStr) {
    console.error('Firebase configuration must be provided as command line argument');
    process.exit(1);
}

// Parse the Firebase configuration
let firebaseConfig;
try {
    // Parse the configuration object directly
    firebaseConfig = JSON.parse(firebaseConfigStr);
} catch (error) {
    console.error('Failed to parse Firebase configuration:', error);
    process.exit(1);
}

// Read environment.ts
const envFile = './src/environments/environment.ts';
let envContent = fs.readFileSync(envFile, 'utf8');

// Create the new firebase config string
const firebaseConfigString = `  firebase: {
    apiKey: '${firebaseConfig.apiKey}',
    authDomain: '${firebaseConfig.authDomain}',
    projectId: '${firebaseConfig.projectId}',
    storageBucket: '${firebaseConfig.storageBucket}',
    messagingSenderId: '${firebaseConfig.messagingSenderId}',
    appId: '${firebaseConfig.appId}',
  }`;

// Replace the empty firebase config with the new one
const updatedContent = envContent.replace(
    /firebase:\s*{[^}]*}/,
    firebaseConfigString
);

// Write back to file
fs.writeFileSync(envFile, updatedContent);
console.log('Firebase config updated successfully!');
