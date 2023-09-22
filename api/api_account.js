const Alpaca = require("@alpacahq/alpaca-trade-api");
const { apiKey, apiSecret, headers } = require('./alpaca_cred');

const alpaca = new Alpaca({
    keyId: apiKey,
    secretKey: apiSecret,
    paper: true,
});


async function get_account_info() { 

    try {
        const account = await alpaca.getAccount();
        return account;

    } catch (error) {
        throw error;
    }

}

exports.account_info = get_account_info


// ------------------------------------------------------------------------------------------------


// Get a list of all of our positions and return in JSON format
async function get_positions() {
  try {
      const portfolio = await alpaca.getPositions();
      return portfolio;

  } catch (error) {
      throw error;
  }
}

exports.get_positions = get_positions


// ------------------------------------------------------------------------------------------------


// Function to check if the market is open
async function isMarketOpen() {
  
  // Alpaca API base URL
  const baseURL = 'https://paper-api.alpaca.markets'; // Use 'https://api.alpaca.markets' for the live market
  
  try {
    const response = await fetch(`${baseURL}/v2/clock`, {
      method: 'GET',
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': apiSecret,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const marketStatus = await response.json();
    return marketStatus.is_open

  } catch (error) {
    console.error('Error checking market status:', error.message);
  }
}

exports.isMarketOpen = isMarketOpen


// ------------------------------------------------------------------------------------------------

// Getting latest bars --> this helps calculate how many shares of each stock to buy

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

exports.getHistoricalBars = getHistoricalBars



// ------------------------------------------------------------------------------------------------


function place_order (ticker, quantity_) {

  // Submit a market order to buy 1 share of Apple at market price
  alpaca.createOrder({
  symbol: ticker,
  qty: quantity_,
  side: "buy",
  type: "market",
  time_in_force: "day",
  });

}

exports.place_order = place_order


// ------------------------------------------------------------------------------------------------

// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set } = require("firebase/database");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const database = getDatabase(app);

async function setValueToTodayFolder(myValues) {

  try {

    const myValues_for_firebase = await myValues;

    // Save to "open_folder"
    // today's date in datestring 'YYYY-MM-DD' format for folder naming
    const today = new Date();
    const todayDateString = getTodayDateString(today)
    const open_folder_name = 'open_folder'
    const open_folder_path = open_folder_name + '/' + todayDateString

    // target date 14 days in future in datestring 'YYYY-MM-DD' format for folder naming
    const targetDate = calculateTargetDate();  // Calculate the target date 14 days in future
    const targetDateString = getTodayDateString(targetDate)
    const close_folder_name = 'close_folder'
    const close_folder_path = close_folder_name + '/' + targetDateString

    // // References to the Firebase folder with today's and target dates
    // const folderRefOpen = ref(database, open_folder_path);
    // const folderRefClose = ref(database, close_folder_path);

    await setToFirebase(open_folder_path, todayDateString, myValues)
    await setToFirebase(close_folder_path, targetDateString, myValues)

    return myValues

  } catch (error) {
    throw error;
  }

}


// set values to firebase
async function setToFirebase(folder_path, folder_date_name, values_) {

  // Reference to the Firebase folder with today's date
  const folderRef = ref(database, folder_path);

  // Set the values in open_date folder for today's date
  set(folderRef, values_)
  .then(() => {
    console.log(`Values set in close_folder ${folder_date_name}`);

  })
  .catch((error) => {
    console.error(`Error setting values: ${error}`);
  });

}


// find trading date 14 days in future --> for closing position

// Define the array of holiday dates for 2023 (as provided earlier)
const holidayDates2023 = [
  new Date(2023, 0, 2),     // New Year's Day (observed)
  new Date(2023, 0, 16),    // Martin Luther King Jr. Day
  new Date(2023, 1, 20),    // Presidents' Day
  new Date(2023, 3, 7),     // Good Friday
  new Date(2023, 4, 29),    // Memorial Day
  new Date(2023, 5, 19),    // Juneteenth
  new Date(2023, 6, 4),     // Independence Day (observed)
  new Date(2023, 8, 4),     // Labor Day
  new Date(2023, 10, 23),   // Thanksgiving Day
  new Date(2023, 11, 25)    // Christmas Day
];

// Function to add 14 days to today's date and adjust if necessary
function calculateTargetDate() {
  // Get today's date
  const today = new Date();

  // Add 14 days to today's date
  const targetDate = new Date(today);
  targetDate.setDate(targetDate.getDate() + 14);

  // Check if the target date falls on a weekend or holiday
  while (targetDate.getDay() === 0 || targetDate.getDay() === 6 || isHoliday(targetDate)) {
      targetDate.setDate(targetDate.getDate() - 1); // Adjust to the previous weekday
  }

  return targetDate;
}

// Function to check if a given date is a holiday
function isHoliday(date) {
  return holidayDates2023.some(holiday => {
      return date.toDateString() === holiday.toDateString();
  });
}

// function which converts date object (const today = new Date();) into date string in "YYYY-MM-DD" format for firebase folder naming.
function getTodayDateString(date_to_convert) {

      // Get today's date in the "YYYY-MM-DD" format
      const yyyy = date_to_convert.getFullYear();
      const mm = String(date_to_convert.getMonth() + 1).padStart(2, '0'); // January is 0!
      const dd = String(date_to_convert.getDate()).padStart(2, '0');
      const DateString = `${yyyy}-${mm}-${dd}`;

      return DateString

}

exports.set_values_to_firebase = setValueToTodayFolder


// ------------------------------------------------------------------------------------------------

