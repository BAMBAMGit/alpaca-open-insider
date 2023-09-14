// fetch ticker list, scraped from open insider
fetch("/api/ticker/list")
.then((response) => response.text())
.then((data_tickers_list) => {
    // now we have ticker list in an array, ex [PFHO,CDXS,TSNDF,MRAI]
    const dataArray = JSON.parse(data_tickers_list);

    // let's get the latest price of each ticker from our API and store it in an object.
    ticker_prices_string = ''

    for (const ticker of dataArray) {
        fetch("/api/ticker/bars/" + ticker)
        .then((response) => response.text())
        .then((data) => {
            ticker_prices_string = ticker_prices_string + ' / ' + ticker + ': ' + data

            const balanceElement = document.getElementById("balance");
            balanceElement.textContent = ticker_prices_string;

        })
        .catch((error) => {
            console.error("Error fetching price:", error);
        });

    }

})
.catch((error) => {
    console.error("Error fetching ticker list: ", error);
    const balanceElement = document.getElementById("ticker_list");
    balanceElement.textContent = "Error fetching ticker list";
});




// fetch("/api/ticker/bars/AAPL")
//     .then((response) => response.text())
//     .then((data) => {
//         const balanceElement = document.getElementById("balance");
//         balanceElement.textContent = data;
//     })
//     .catch((error) => {
//         console.error("Error fetching ticker price:", error);
//         const balanceElement = document.getElementById("balance");
//         balanceElement.textContent = "Error fetching balance";
//     });