const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, "../")));

// Serve Sanity Studio static files from /admin
app.use('/admin', express.static(path.join(__dirname, "../dist", "sanity-studio", "dist")));

// Serve static files within the Sanity Studio's dist directory with /static prefix
app.use('/static', express.static(path.join(__dirname, "../sanity-studio", "dist", "static")));

// Serve additional static files from sanity-studio
app.use('/sanity-studio', express.static(path.join(__dirname, "../sanity-studio")));

// Route to index.html for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// Redirect any unknown paths under /admin to the index.html of the Sanity CMS
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'sanity-studio', 'dist', 'index.html'));
});

// Handle other paths by serving the main site's index.html (for SPA support)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
