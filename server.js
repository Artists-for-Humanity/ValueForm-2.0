const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, ".")));

// Serve Sanity Studio from /admin
app.use('/admin', express.static(path.join(__dirname, "sanity-studio", "dist", "index.html")));

// Route to index.html for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "sanity-studio", "dist", "index.html"));
});

// Route to index.html for /admin (Sanity Studio entry point)
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'sanity-studio', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
