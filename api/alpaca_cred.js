const apiKey = 'PKUKLUTBAUW9LITRTVFL';
const apiSecret = '2GZu6fqitkZqA7GIRJLocL8bQlLYwhItClua8CoQ';

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