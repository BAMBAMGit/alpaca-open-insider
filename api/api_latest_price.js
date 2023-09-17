const Alpaca = require("@alpacahq/alpaca-trade-api");
const { apiKey, apiSecret, headers } = require('./alpaca_cred');

const alpaca = new Alpaca({
  keyId: apiKey,
  secretKey: apiSecret,
  paper: true,
});

const options = {
  start: new Date(new Date().setDate(new Date().getDate() - 7)), // 1 day ago
  end: new Date(new Date().setDate(new Date().getDate() - 1)), // Current date
  timeframe: "1Day",
};


async function getHistoricalBars(ticker) {
  
  const resp = alpaca.getBarsV2(ticker, options);
  
  var package_ = {}
  for await (let bar of resp) {
    package_[ticker] = bar
  }

  return package_
}

module.exports = getHistoricalBars

// // Define an API endpoint to getHistoricalBars(ticker)
// // For example, if you want to get bars for the ticker "AAPL," you can make a GET request to /api/ticker/bars/AAPL.
// module.exports = function (app) {
//   app.get("/api/ticker/bars/:ticker", async (req, res) => {
//     try {
//       const ticker = req.params.ticker; // Extract the ticker parameter from the URL
//       const bars_result = await getHistoricalBars(ticker);
//       res.send(String(bars_result[ticker]['OpenPrice']));
//     } catch (error) {
//       console.error("Error fetching ticker price in api:", error.message);
//       res.status(500).send("Internal server error");
//     }
//   });
// };


