fetch("/api/account")
.then((response) => response.text())
.then((data) => {
    const balanceElement = document.getElementById("account");
    balanceElement.textContent = data;
})
.catch((error) => {
    console.error("Error fetching account: ", error);
    const balanceElement = document.getElementById("account");
    balanceElement.textContent = "Error fetching account";
});