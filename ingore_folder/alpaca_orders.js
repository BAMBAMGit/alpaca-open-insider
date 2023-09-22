const { apiKey, apiSecret, headers } = require('./api/alpaca_cred');

function get_alpaca_orders() {

    const endpoint = 'https://paper-api.alpaca.markets/v2/orders'; // Use the paper trading URL for testing

    // Make the API request using the fetch method
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
            console.log('All Orders:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

get_alpaca_orders()