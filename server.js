const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

// Serve static files from the /sanity-studio/dist/static directory with the /static prefix
app.use('/static', express.static(path.join(__dirname, 'sanity-studio', 'dist', 'static')));

// Serve the built Sanity Studio from the /admin path
app.use('/admin', express.static(path.join(__dirname, 'sanity-studio', 'dist')));

// Serve additional static files from sanity-studio
app.use('/sanity-studio', express.static(path.join(__dirname, 'sanity-studio')));

// Serve other static files from the root directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve the main index.html for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Redirect any unknown paths under /admin to the index.html of the Sanity CMS
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'sanity-studio', 'dist', 'index.html'));
});

// Handle other paths by serving the main site's index.html (for SPA support)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
