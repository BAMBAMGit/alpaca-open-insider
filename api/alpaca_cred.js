const apiKey = 'PKEIUF44MMOJVLI58ET7';
const apiSecret = 'rXBaDP8qxZGzXTK8SrkEguLAn6KEFXjkzqbj9lON';

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