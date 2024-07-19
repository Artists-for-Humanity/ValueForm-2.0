const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, ".")));

// Serve Sanity Studio static files from /admin
app.use('/admin', express.static(path.join(__dirname, "sanity-studio", "dist")));

// Serve static files within the Sanity Studio's dist directory
app.use('/admin/static', (req, res, next) => {
  console.log(`Serving static file: ${req.path}`);
  next();
}, express.static(path.join(__dirname, "sanity-studio", "dist", "static")));


// Route to index.html for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route to index.html for /admin (Sanity Studio entry point)
// Note: This route must come after the static file serving route
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'sanity-studio', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
