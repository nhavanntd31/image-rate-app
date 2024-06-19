const fs = require('fs');
const path = require('path');

// Directory containing the files
const directory = 'public/data1';

// Read all files in the directory
fs.readdir(directory, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }
  
  // Sort files numerically by the numbers in their names
  files.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0], 10);
    const numB = parseInt(b.match(/\d+/)[0], 10);
    return numA - numB;
  });

  // Rename each file
  files.forEach((filename, index) => {
    // Extract extension
    const ext = path.extname(filename);
    
    // Create new filename starting from 1
    const newFilename = `${index + 1}${ext}`;
    
    // Construct full paths
    const oldPath = path.join(directory, filename);
    const newPath = path.join(directory, newFilename);
    
    // Rename the file
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error(`Error renaming ${filename}:`, err);
      } else {
        console.log(`Renamed ${filename} to ${newFilename}`);
      }
    });
  });

  console.log('Renaming complete.');
});
