const isMarketOpen = require('./alpaca_is_market_open.js');
const scrape_module = require('./api_scrape.js');
const positions_module = require('./api_portfolio.js');
const account_module = require('./api_account.js');
const yesterday_price_module = require('./api_latest_price.js');
const place_order = require('./alpaca_place_order.js');

// check if the market is open
async function marketstatus() {
    try {
      const result = await isMarketOpen();
      console.log('is market open?:', result);
      return result

    } catch (error) {
      console.error('Error in checking if market is open:', error.message);
    }
}


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
      const result = await positions_module();
      console.log('positions:', result);
    } catch (error) {
      console.error('Error in checking positions:', error.message);
    }
}


// get account value
async function get_account_value() {
    try {
      const result = await account_module();
      console.log('account value:', result.portfolio_value);
      return result.portfolio_value
    } catch (error) {
      console.error('Error in checking account value:', error.message);
    } 
}


// get account value
async function get_cash_account_value() {
    try {
      const result = await account_module();
      console.log('account cash value:', result.cash);
      return result.cash
    } catch (error) {
      console.error('Error in checking account value:', error.message);
    }
}


// scrape tickers from open insider, calculate the purchase amounts, and sumbit buy orders
async function get_latest_prices() {
    try {

        const ticker_list = await get_scraped_tickers()
        console.log(ticker_list)

        buy_prices = {}

        for (const ticker of ticker_list) {

            try {
                const ticker_bars = await yesterday_price_module(ticker);
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

          console.log(cash_value)
          console.log(price_)
          console.log(quantity_)
          console.log(cost_)

          // place order
          if (cost_ < cash_value && quantity_ > 0) {
            place_order(ticker, quantity_)
          }
          
        }

        return ticker_quantities

    } catch (error) {
        console.error('Error in getting latest prices:', error.message);
    }
}


// Define an API endpoint to get_alpaca_positions()
module.exports = function (app) {
        
  app.get("/api/scrape_calculate_buy", async (req, res) => {
    
    try {

      // check to see if market is open
      const is_market_open_response = await marketstatus();

      // if market open then scrape, calculate, send buy orders, and serve ticker/ticker_quantity object via API.
      if (is_market_open_response) {
        
        const ticker_quantities = await get_latest_prices();
        res.send(ticker_quantities);

      }

      // if market closed then serve response that market is closed.
      else {
        res.send('Market closed. No orders placed.');
      }

    } catch (error) {
      console.error("Error running scrape_calculate_buy:", error.message);
      res.status(500).send("Internal server error");
    }
  });

};