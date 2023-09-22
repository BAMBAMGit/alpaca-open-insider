const Alpaca = require("@alpacahq/alpaca-trade-api");
const { apiKey, apiSecret, headers } = require('./api/alpaca_cred');

const alpaca = new Alpaca({
    keyId: apiKey,
    secretKey: apiSecret,
    paper: true,
  });

function get_alpaca_positions() {

    // Define the Alpaca API endpoint you want to access
    const endpoint = 'https://paper-api.alpaca.markets/v2/positions'; // Use the paper trading URL


    // Make the API request
    fetch(endpoint, {
        method: 'GET',
        headers: headers,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle the response data here
            
            console.log(data);

        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });
}

get_alpaca_positions()