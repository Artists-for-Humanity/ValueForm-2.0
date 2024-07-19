const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'sanity-studio', 'dist', 'index.html');
const oldBasePath = '/static/';
const newBasePath = '/admin/static/';

fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading index.html:', err);
    return;
  }

  if (!data.includes(oldBasePath)) {
    console.log('No paths to update in index.html');
    return;
  }

  const result = data.replace(new RegExp(oldBasePath, 'g'), newBasePath);

  fs.writeFile(indexPath, result, 'utf8', (err) => {
    if (err) {
      console.error('Error writing index.html:', err);
    } else {
      console.log('Base path updated successfully in index.html');
    }
  });
});
