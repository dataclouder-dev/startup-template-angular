const fs = require('fs');
const path = require('path');

const directory = './';

function renameSourceFiles(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            // Recursively process subdirectories
            renameSourceFiles(filePath);
        } else if (stats.isFile() && file.toLowerCase().includes('source')) {
            // Rename files containing 'source'
            const newName = file.replace(/source/gi, 'generic');
            const newPath = path.join(dir, newName);
            
            try {
                fs.renameSync(filePath, newPath);
                console.log(`Renamed: ${file} → ${newName}`);
            } catch (err) {
                console.error(`Error renaming ${file}:`, err);
            }
        }
    });
}

// Execute the function
renameSourceFiles(directory);