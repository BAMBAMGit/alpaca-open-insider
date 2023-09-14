fetch("/api/scrape_calculate_buy")
.then((response) => response.text())
.then((data) => {
    const balanceElement = document.getElementById("scrape_calculate_buy");
    balanceElement.textContent = data;
})
.catch((error) => {
    console.error("Error fetching scrape_calculate_buy: ", error);
    const balanceElement = document.getElementById("scrape_calculate_buy");
    balanceElement.textContent = "Error fetching scrape_calculate_buy";
});