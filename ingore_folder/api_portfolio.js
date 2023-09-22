const Alpaca = require("@alpacahq/alpaca-trade-api");
const { apiKey, apiSecret, headers } = require('./api/alpaca_cred');

const alpaca = new Alpaca({
    keyId: apiKey,
    secretKey: apiSecret,
    paper: true,
});
  
// Get a list of all of our positions and return in JSON format
async function get_alpaca_positions() {
    try {
        const portfolio = await alpaca.getPositions();
        return portfolio;

    } catch (error) {
        throw error;
    }
}

// get_alpaca_positions()

// // Define an API endpoint to get_alpaca_positions()
// module.exports = function (app) {
        
//     app.get("/api/portfolio", async (req, res) => {
        
//         try {
//             const positions = await get_alpaca_positions();
//             res.send(positions);

//         } catch (error) {
//             console.error("Error fetching positions:", error.message);
//             res.status(500).send("Internal server error");
//         }
//     });

// };


module.exports = get_alpaca_positions