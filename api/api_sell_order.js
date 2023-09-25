const Alpaca = require("@alpacahq/alpaca-trade-api");
const { apiKey, apiSecret, headers } = require('./alpaca_cred');

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


////////////// USE THIS TO SELL A BUNCH OF TICKERS INSTEAD OF PLACING INDIVIDUAL ORDERS ON THE WEB
// tickers_arr = ['BFS','DV', 'GLSI', 'HPK','IHT']
// quantities = [0, 0, 0, 0, 0]

// for (var i = 0; i < tickers_arr.length; i++) {
//     var ticker = tickers_arr[i];
//     var quantity_ = quantities[i];
    
//     place_sell_order (ticker, quantity_)

//     console.log('sold ' + ticker + ' ' + quantity_)

// }

// node api_sell_order.js

// ------------------------------------------------------------------------------------------------

// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, child, get } = require("firebase/database");

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD2tGeepolQanvYk7hHdUC0D3dMT7_fZG0",
    authDomain: "open-insider.firebaseapp.com",
    databaseURL: "https://open-insider-default-rtdb.firebaseio.com",
    projectId: "open-insider",
    storageBucket: "open-insider.appspot.com",
    messagingSenderId: "436931876090",
    appId: "1:436931876090:web:f8e3450126b5fc4d7c6543",
    measurementId: "G-EQ9N777R6Y"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


// ------------------------------------------------------------------------------------------------
// get data from close_folder in firebase


async function get_close_data_from_firebase(formattedDateString) {
    try {
        // make promise
        const result = await get(ref(db, `open_folder/${formattedDateString}`))

        if (result.exists()) {
            return result.val();
        } else {
            console.log("No data available in close_folder for date: " + formattedDateString);
        }

    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error for error handling at a higher level
    }
}


// ------------------------------------------------------------------------------------------------
// check for a pending order under a ticker's name, if it exists, then cancel that order

async function check_for_open_orders_and_cancel_pending(ticker) {

    // Get the last 100 of our closed orders
    const orders = await alpaca
    .getOrders({
    status: "open",
    limit: 10000,
    nested: true, // show nested multi-leg orders
    })

    for (const order of orders) {
        if (ticker == order['symbol']) {
            console.log('Open order exists for ' + ticker + ". Will need to cancel order to continue.")
            
            // get order ID
            const orderId = order['id']

            // cancel order
            try {
                await alpaca.cancelOrder(orderId)
                console.log('Order canceled: ' + ticker)
            } catch (error) {
                console.error(error);
                // throw error; // Rethrow the error for error handling at a higher level
            }
        }
    }

}

// const mylist = ['AAPL', 'TSLA', 'META'];
// for (const ticker of mylist) {
//     check_orders_and_cancel_pending(ticker)
// }


// ------------------------------------------------------------------------------------------------
// check firebase and sell and tickers in the close_folder for today's date

async function check_firebase_and_close_queue() {

    // Get the current  date in 'YYY-MM-DD' format
    var currentDate = new Date();

    // Extract year, month, and day
    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month since it's 0-indexed
    var day = currentDate.getDate().toString().padStart(2, '0');

    // Create the yyyy-mm-dd string
    var formattedDateString = year + '-' + month + '-' + day;

    const data = await get_close_data_from_firebase(formattedDateString)

    try {

        // place sell order for each ticker from firebase data
        for (const ticker in data) {
            if (ticker !== 'timestamp') {  //&& ticker !=='GLSI' && ticker != 'HPK' && ticker != 'IHT'

                // get quantity to sell from firebase data download
                quantity_ = data[ticker]

                // get positions from alpaca to compare with ticker to sell from firebase data
                positions = await alpaca.getPositions()

                // iterate through each position to see if ticker is in our alpaca positions
                for (position of positions) {
                    symb = position['symbol']
                    qty_ = position['qty']

                    // are there enough shares of given ticker in alpaca portfolio?
                    if (ticker == symb && qty_ >= quantity_) {


                        // make sure there are no open orders on the ticker. if so, cancel the open order before continuing.
                        await check_for_open_orders_and_cancel_pending(ticker)

                        // place the sell order
                        await place_sell_order (ticker, quantity_)
                        console.log(ticker + ' sold ' + quantity_ + ' shares. Remaining shares: ' + qty_ - quantity_)

                    }
                }

            }
        }

        return data

    } catch (error) {
        console.error(error);
        // throw error; // Rethrow the error for error handling at a higher level
    }

}

exports.check_firebase_and_close_queue = check_firebase_and_close_queue;

// ------------------------------------------------------------------------------------------------
