fetch("/api/ticker/list")
.then((response) => response.text())
.then((data) => {
    const balanceElement = document.getElementById("ticker_list");
    balanceElement.textContent = data;
})
.catch((error) => {
    console.error("Error fetching ticker list: ", error);
    const balanceElement = document.getElementById("ticker_list");
    balanceElement.textContent = "Error fetching ticker list";
});