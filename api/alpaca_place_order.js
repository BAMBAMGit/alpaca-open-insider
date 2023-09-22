const Alpaca = require("@alpacahq/alpaca-trade-api");
const { apiKey, apiSecret, headers } = require('./alpaca_cred');

const alpaca = new Alpaca({
    keyId: apiKey,
    secretKey: apiSecret,
    paper: true,
  });

function place_order (ticker, quantity_) {

    return
    // Submit a market order to buy 1 share of Apple at market price
    alpaca.createOrder({
    symbol: ticker,
    qty: quantity_,
    side: "buy",
    type: "market",
    time_in_force: "day",
    });

}

module.exports = place_order