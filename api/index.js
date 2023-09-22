// USE THIS APP TO RUN NODE.JS FILES. this is attached to the index.html and can call node.js files when the client website is loaded.

const path = require('path');
const express = require('express');
const app = express();

const scrape_calc_buy = require("./scrape_calc_buy.js");
const alpaca_functions = require('./api_account.js');


// making an api for '/' that responds with dynamic html
app.get('/', async (req, res) => {
    
    // check to see if market is open
    try {
      const is_market_open_response = await alpaca_functions.isMarketOpen();
      console.log('is market open?:', is_market_open_response);

      // if market open then scrape, calculate, send buy orders, and serve html with ticker/ticker_quantity via API.
      if (is_market_open_response == true) {
        const scrape_calc_buy_response = await scrape_calc_buy();
        
        // turn object to string
        const keys = Object.keys(scrape_calc_buy_response);  // Use Object.keys() to get an array of the object's keys
        const keyValueStrings = keys.map(key => `${key}: ${scrape_calc_buy_response[key]}`);  // Use map() to create an array of strings in the format "key: value"
        const resultString = keyValueStrings.join(', ');  // Use join() to concatenate the array elements into a single string

        // Render the HTML with the node.js data
        const renderedHtml = `
        <html>
          <body>
            <p>scrape_calc_buy_response: ${resultString}</p>
          </body>
        </html>
        `;

        res.send(renderedHtml);
      }

      // if market closed then serve response that market is closed.
      else {
        // Render the HTML with the response that market is closed
        const renderedHtml = `
        <html>
          <body>
            <p>'Market closed. No orders placed.'</p>
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