const express = require('express');
const path = require('path');
const fs = require('fs');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const app = express();
const pinnedFolderPath = path.join(__dirname, 'pages', 'articles', 'pinned');


const port = process.env.PORT || 3000;

// LiveReload: watch the built files in /dist
const liveReloadServer = livereload.createServer({
  // common web assets we care about
  exts: ["html", "css", "js", "png", "jpg", "jpeg", "svg", "gif", "mp4", "webm"],
  delay: 100
});
liveReloadServer.watch(path.join(__dirname, 'dist'));


// Serve static files from the /sanity-studio/dist/static directory with the /static prefix
// app.use('/static', express.static(path.join(__dirname, 'sanity-studio', 'dist', 'static')));

// Serve the built Sanity Studio from the /admin path
// app.use('/admin', express.static(path.join(__dirname, 'sanity-studio', 'dist')));

// Serve additional static files from sanity-studio
// app.use('/sanity-studio', express.static(path.join(__dirname, 'sanity-studio')));

// Inject the LiveReload script into served HTML
app.use(connectLivereload());
// Serve other static files from the root directory
app.use(express.static(path.join(__dirname, 'dist')));

// Endpoint to fetch files in the pinned folder
app.get('/files', (req, res) => {
    fs.readdir(pinnedFolderPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            res.status(500).json({ error: 'Unable to read files' });
        } else {
            res.json(files); // Respond with the list of files
        }
    });
});

// Serve the main home.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Redirect any unknown paths under /admin to the index.html of the Sanity CMS
// app.get('/admin/*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'sanity-studio', 'dist', 'index.html'));
// });

// Handle other paths by serving the main site's home.html (for SPA support)
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Nudge the browser to refresh once LiveReload connects
liveReloadServer.server?.once('connection', () => {
  setTimeout(() => liveReloadServer.refresh('/'), 100);
});
