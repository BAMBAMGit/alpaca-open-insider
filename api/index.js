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
      if (is_market_open_response == false) {
        const scrape_calc_buy_response = await scrape_calc_buy();
        
        // turn object to string
        // Use Object.keys() to get an array of the object's keys
        const keys = Object.keys(scrape_calc_buy_response);

        // Use map() to create an array of strings in the format "key: value"
        const keyValueStrings = keys.map(key => `${key}: ${scrape_calc_buy_response[key]}`);

        // Use join() to concatenate the array elements into a single string
        const resultString = keyValueStrings.join(', ');


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