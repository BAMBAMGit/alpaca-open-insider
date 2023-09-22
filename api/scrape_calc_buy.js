const scrape_module = require('./api_scrape.js');
const alpaca_functions = require('./api_account.js');


// get scraped tickers
async function get_scraped_tickers() {
    try {
        const result = await scrape_module();
        console.log('scraped tickers:', result);
        return result
    } catch (error) {
        console.error('Error in checking scraped tickers:', error.message);
    }
}


// get held positions
async function get_positions() {
    try {
      const result = await alpaca_functions.get_positions();
      console.log('positions:', result);
    } catch (error) {
      console.error('Error in checking positions:', error.message);
    }
}


// get account value
async function get_account_value() {
    try {
      const result = await alpaca_functions.account_info();
      return result.portfolio_value
    } catch (error) {
      console.error('Error in checking account value:', error.message);
    } 
}


// get account value
async function get_cash_account_value() {
    try {
      const result = await alpaca_functions.account_info();
      return result.cash
    } catch (error) {
      console.error('Error in checking account value:', error.message);
    }
}


// scrape tickers from open insider, calculate the purchase amounts, and sumbit buy orders
async function scrape_calc_buy() {
    try {

        const ticker_list = await get_scraped_tickers()

        buy_prices = {}

        for (const ticker of ticker_list) {

            try {
              const ticker_bars = await alpaca_functions.getHistoricalBars(ticker);
              const ticker_close = ticker_bars[ticker]['ClosePrice']
              buy_prices[ticker] = ticker_close
            }

            catch (error) {
              console.error('Error in checking latest close prices:', error.message);
            }

        }

        // calculating budget for each ticker, based on portfolio value
        const account_value = await get_account_value()
        const budget_daily_percent = 0.1
        const budget_daily = account_value * budget_daily_percent
        const num_tickers = Object.keys(buy_prices).length
        const budget_daily_stock = budget_daily / num_tickers

        // assign quantity of shares for each stock.
        ticker_quantities = {}
        for (const ticker of Object.keys(buy_prices)) {
            const ticker_price_ = buy_prices[ticker]
            qty_to_buy = budget_daily_stock / ticker_price_
            ticker_quantities[ticker] = Math.trunc(qty_to_buy)
        }
        
        // place orders for each ticker
        for (const ticker of Object.keys(ticker_quantities)) {

          // check to see if we have enough cash to place the order
          const cash_value = await get_cash_account_value()
          const price_ = buy_prices[ticker]
          const quantity_ = ticker_quantities[ticker]
          const cost_ = price_ * quantity_

          // place order
          if (cost_ < cash_value && quantity_ > 0) {
            await alpaca_functions.place_buy_order(ticker, quantity_)
            console.log(ticker + ' Order Placed: ' + ' price = ' + price_ + '  cost = ' + cost_ + '  qty = ' + quantity_)
          }
          
        }

        console.log(ticker_quantities)

        // add timestamp for help with logging errors
        timestamp_object = new Date()
        timestamp_dateString = timestamp_object.toString()
        ticker_quantities['timestamp'] = timestamp_dateString;

        // add tickers object to firebase folder. need to await the upload otherwise the html will be sent via api prior to upload to firebase completing.
        const ticker_quantities_uploaded = await alpaca_functions.set_values_to_firebase(ticker_quantities)

        // get tickers from firebase folder to confirm upload completed.


        console.log('ticker_quantities_uploaded = ' + ticker_quantities_uploaded)
        return ticker_quantities_uploaded

    } catch (error) {
        console.error('Error in getting latest prices:', error.message);
    }
}

module.exports = scrape_calc_buy

// // Define an API endpoint to get_alpaca_positions()
// module.exports = function (app) {
        
//   app.get("/api/scrape_calculate_buy", async (req, res) => {
    
//     try {

//       // check to see if market is open
//       const is_market_open_response = await marketstatus();

//       // if market open then scrape, calculate, send buy orders, and serve ticker/ticker_quantity object via API.
//       if (is_market_open_response) {
        
//         const ticker_quantities = await get_latest_prices();
//         res.send(ticker_quantities);

//       }

//       // if market closed then serve response that market is closed.
//       else {
//         res.send('Market closed. No orders placed.');
//       }

//     } catch (error) {
//       console.error("Error running scrape_calculate_buy:", error.message);
//       res.status(500).send("Internal server error");
//     }
//   });

// };