// USE THIS APP TO RUN NODE.JS FILES. this is attached to the index.html and can call node.js files when the client website is loaded.

const express = require("express");
const app = express();

// Middleware setup, such as body parsing and CORS configuration
// app.use(express.json());
// app.use(cors());

// Serve your index.html file as a static file
app.use(express.static(__dirname));

// Include your Node.js scripts
// require("./api_scrape.js")(app);
// require("./api_latest_price.js")(app);
// require("./api_portfolio.js")(app);
// require("./api_account.js")(app);
require("./test.js")(app);
// ...

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});