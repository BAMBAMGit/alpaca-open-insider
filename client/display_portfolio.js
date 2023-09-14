fetch("/api/portfolio")
.then((response) => response.text())
.then((data) => {
    const balanceElement = document.getElementById("portfolio");
    balanceElement.textContent = data;
})
.catch((error) => {
    console.error("Error fetching portfolio: ", error);
    const balanceElement = document.getElementById("portfolio");
    balanceElement.textContent = "Error fetching portfolio";
});