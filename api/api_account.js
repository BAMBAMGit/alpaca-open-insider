const Alpaca = require("@alpacahq/alpaca-trade-api");
const { apiKey, apiSecret, headers } = require('./alpaca_cred');

const alpaca = new Alpaca({
    keyId: apiKey,
    secretKey: apiSecret,
    paper: true,
});


async function get_account_info() { 

    try {
        const account = await alpaca.getAccount();
        return account;

    } catch (error) {
        throw error;
    }

}


// Define an API endpoint to get_account_info()
module.exports = function (app) {
        
    app.get("/api/account", async (req, res) => {
        
        try {
            const account = await get_account_info();
            res.send(account);

        } catch (error) {
            console.error("Error fetching account:", error.message);
            res.status(500).send("Internal server error");
        }
    });

};


module.exports = get_account_info