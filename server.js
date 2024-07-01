const express = require('express');
const path = require('path');
const app = express();

// const port = 3000; // You can change this to any port you prefer
const port = process.env.PORT || 3000;


// Serve static files from the /sanity-studio/dist/static directory with the /static prefix
app.use('/static', express.static(path.join(__dirname, 'sanity-studio', 'dist', 'static')));

// Serve the built Sanity Studio from the /admin path
app.use('/admin', express.static(path.join(__dirname, 'sanity-studio', 'dist')));

// Serve other static files from the root directory
// app.use(express.static(path.join(__dirname, 'public'))); // Update 'public' to your main site directory if different
app.use(express.static(path.join(__dirname, 'dist')));

// Serve the main index.html for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Redirect any unknown paths to the index.html of the admin (SPA support)
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'sanity-studio', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
