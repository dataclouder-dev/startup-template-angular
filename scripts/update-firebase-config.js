const fs = require('fs');
const path = require('path');

// Read the temp_config.txt file
const configFile = path.join(__dirname, '../temp_config.txt');
let configContent;
try {
    configContent = fs.readFileSync(configFile, 'utf8');
} catch (error) {
    console.error('Failed to read temp_config.txt:', error);
    process.exit(1);
}

// Extract the configuration object from the content
let firebaseConfig;
try {
    // Find the configuration object in the content using regex
    const configMatch = configContent.match(/firebase\.initializeApp\(({[\s\S]*?})\);/);
    if (!configMatch) {
        throw new Error('Could not find Firebase configuration in temp_config.txt');
    }
    
    // Parse the configuration object
    firebaseConfig = JSON.parse(configMatch[1]);
} catch (error) {
    console.error('Failed to parse Firebase configuration:', error);
    process.exit(1);
}

// Create the new firebase config string
const firebaseConfigString = `  firebase: {
    apiKey: '${firebaseConfig.apiKey}',
    authDomain: '${firebaseConfig.authDomain}',
    projectId: '${firebaseConfig.projectId}',
    storageBucket: '${firebaseConfig.storageBucket}',
    messagingSenderId: '${firebaseConfig.messagingSenderId}',
    appId: '${firebaseConfig.appId}',
  }`;

// Function to update environment file
const updateEnvironmentFile = (filePath) => {
    let envContent;
    try {
        envContent = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Failed to read ${filePath}:`, error);
        process.exit(1);
    }

    // Replace the empty firebase config with the new one
    const updatedContent = envContent.replace(
        /firebase:\s*{[^}]*}/,
        firebaseConfigString
    );

    // Write back to file
    try {
        fs.writeFileSync(filePath, updatedContent);
        console.log(`Firebase config updated successfully in ${filePath}!`);
    } catch (error) {
        console.error(`Failed to write to ${filePath}:`, error);
        process.exit(1);
    }
};

// Update both environment files
const envFile = path.join(__dirname, '../src/environments/environment.ts');
const envProdFile = path.join(__dirname, '../src/environments/environment.prod.ts');

updateEnvironmentFile(envFile);
updateEnvironmentFile(envProdFile);
