// scripts/copy-icons.js
const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, '../node_modules/@adobe/coral-spectrum/dist/resources/icons');
const targetDir = path.resolve(__dirname, '../public/icons');

// Create the target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy all files from source to target
fs.readdirSync(sourceDir).forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  if (fs.statSync(sourcePath).isFile()) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied: ${file}`);
  }
});

console.log('All icons copied successfully!');