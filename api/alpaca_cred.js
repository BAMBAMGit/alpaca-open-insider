const apiKey = 'PKS47IC3EM97XWTUNGVP';
const apiSecret = '2a7MKeXwbwVPeis4s0UhjURaPEix1NbRcIlG4gSE';

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