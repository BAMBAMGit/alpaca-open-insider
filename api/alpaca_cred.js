const apiKey = 'PK08F3BFE23ORTU21EMY';
const apiSecret = 'fur9KrWlXrX14rz0DgSyHYU7jfD2JfAxz6meWeDE';

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