// USE THIS APP TO RUN NODE.JS FILES. this is attached to the index.html and can call node.js files when the client website is loaded.

const path = require('path');
const express = require('express');
const app = express();


// Serve static files (including 'index.html') from the root directory
app.use(express.static(path.join(__dirname, '..')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// // Serve your 'index.html' file when someone visits the root URL ("/")
// app.get('/', (req, res) => {
//   const indexPath = path.join(__dirname, 'index.html');
//   res.sendFile(indexPath);
// });

require("./test--static-backup.js")(app);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});