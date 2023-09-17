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


// // Define an API endpoint to get_account_info()
// module.exports = function (app) {
        
//     app.get("/api/account", async (req, res) => {
        
//         try {
//             const account = await get_account_info();
//             res.send(account);

//         } catch (error) {
//             console.error("Error fetching account:", error.message);
//             res.status(500).send("Internal server error");
//         }
//     });

// };


exports.account_info = get_account_info




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

function setValueToTodayFolder(myValues) {
  // Get today's date in the "YYYY-MM-DD" format
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const dd = String(today.getDate()).padStart(2, '0');
  const todayDateString = `${yyyy}-${mm}-${dd}`;

  // Reference to the Firebase folder with today's date
  const folderRef = ref(database, todayDateString);

  // Set the values in the folder
  set(folderRef, myValues)
    .then(() => {
      console.log(`Values set in folder ${todayDateString}`);
    })
    .catch((error) => {
      console.error(`Error setting values: ${error}`);
    });
}



// // Example usage
// const myValues = {
//   key1: "value1",
//   key2: "value2"
// };

// setValueToTodayFolder(myValues);



exports.set_values_to_firebase = setValueToTodayFolder