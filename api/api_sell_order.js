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
        const result = await get(ref(db, `close_folder/${formattedDateString}`))

        if (result.exists()) {
            return result.val();
        } else {
            console.log("No data available");
        }

    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error for error handling at a higher level
    }
}


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

    const data = await get_close_data_from_firebase('2023-10-06')

    try {

        // place sell order for each ticker from firebase data
        for (const ticker in data) {
            if (ticker !== 'timestamp') {

                quantity_ = data[ticker]
                await place_sell_order (ticker, quantity_)

                console.log(quantity_ + ' ' + ticker + ' sold')
                
            }
        }

        return data

    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error for error handling at a higher level
    }

}


// ------------------------------------------------------------------------------------------------
// Set API endpoint

const express = require('express');
const router = express.Router();

// Define your API endpoint
router.get('/check_firebase_and_close_queue', async (req, res) => {
    try {
      // Call your function
      const result = await check_firebase_and_close_queue();
  
      // Send the result as JSON response
      res.json({ result });

    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;
