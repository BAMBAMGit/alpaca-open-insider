const Alpaca = require("@alpacahq/alpaca-trade-api");
const { apiKey, apiSecret, headers } = require('./api/alpaca_cred');

const alpaca = new Alpaca({
    keyId: apiKey,
    secretKey: apiSecret,
    paper: true,
});

async function place_sell_order (ticker, quantity_) {

    // Submit a market order to buy 1 share of Apple at market price
    alpaca.createOrder({
    symbol: ticker,
    qty: quantity_,
    side: "sell",
    type: "market",
    time_in_force: "day",
    });
  
}

tickers_arr = ['BFS','DV', 'GLSI', 'HPK','IHT']
quantities = [16, 21, 66, 37, 456]


for (var i = 0; i < tickers_arr.length; i++) {
    var ticker = tickers_arr[i];
    var quantity_ = quantities[i];
    
    place_sell_order (ticker, quantity_)

    console.log('sold ' + ticker + ' ' + quantity_)

}
// node api_sell_order.js