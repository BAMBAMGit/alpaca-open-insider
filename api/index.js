// USE THIS APP TO RUN NODE.JS FILES. this is attached to the index.html and can call node.js files when the client website is loaded.

const path = require('path');
const express = require('express');
const app = express();

const scrape_calc_buy = require("./test.js");
const isMarketOpen = require('./alpaca_is_market_open.js');


// making an api for '/' that responds with dynamic html
app.get('/', async (req, res) => {
    
    // check to see if market is open
    try {
      const is_market_open_response = await isMarketOpen();
      console.log('is market open?:', is_market_open_response);

      // if market open then scrape, calculate, send buy orders, and serve ticker/ticker_quantity object via API.
      if (is_market_open_response) {
        const scrape_calc_buy_response = await scrape_calc_buy();

        // Render the HTML with the node.js data
        const renderedHtml = `
        <html>
          <head>
            <!-- Your HTML head content here -->
          </head>
          <body>
            <h1>Your Website</h1>
            <p>scrape_calc_buy_response: ${scrape_calc_buy_response}</p>
          </body>
        </html>
        `;

        res.send(renderedHtml);
      }

      // if market closed then serve response that market is closed.
      else {
        const scrape_calc_buy_response = 'Market closed. No orders placed.'

        // Render the HTML with the response that market is closed
        const renderedHtml = `
        <html>
          <head>
            <!-- Your HTML head content here -->
          </head>
          <body>
            <h1>Your Website</h1>
            <p>${scrape_calc_buy_response}</p>
          </body>
        </html>
        `;

        res.send(renderedHtml);
      }

    } catch (error) {
      console.error('Error in checking if market is open:', error.message);
    }

});


// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});