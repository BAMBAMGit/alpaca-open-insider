const apiKey = 'PK2ZPZITV5UCCO0PG3BP';
const apiSecret = 'aIhIynby9iGieEbexdWcpAcTuculi3wGbHThXCYa';

// Set up the request headers with your API credentials
const headers = new Headers({
    'APCA-API-KEY-ID': apiKey,
    'APCA-API-SECRET-KEY': apiSecret,
});

module.exports = {
    apiKey,
    apiSecret,
    headers
  };