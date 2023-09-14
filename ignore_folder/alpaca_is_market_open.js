// node doc returns true/false if market is open

const fetch = require('node-fetch');
const { apiKey, apiSecret, headers } = require('../api/alpaca_cred');


// // Replace these with your Alpaca API keys
// const apiKey = 'PK6I50R1Z0780WZ61OQ2';
// const apiSecret = 'rXBaDP8qxZGzXTK8SrkEguLAn6KEFXjkzqbj9lON';

// Alpaca API base URL
const baseURL = 'https://paper-api.alpaca.markets'; // Use 'https://api.alpaca.markets' for the live market

// Function to check if the market is open
async function isMarketOpen() {
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

module.exports = isMarketOpen