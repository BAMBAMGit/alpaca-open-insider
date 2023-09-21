const apiKey = 'PKBCYJAHVY9HIIH1DTOQ';
const apiSecret = 'Wei6GoEqUCGahlCh82taXdRx6zH1Yoqxh7qbBHU8';

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