// document.getElementById('scrapeButton').addEventListener('click', () => {
//     scrapeAndDisplayData();
// });


const holidayDates2023 = [
    new Date(2023, 0, 2),    // New Year's Day (observed)
    new Date(2023, 0, 16),   // Martin Luther King Jr. Day
    new Date(2023, 1, 20),   // Presidents' Day
    new Date(2023, 3, 7),    // Good Friday
    new Date(2023, 4, 29),   // Memorial Day
    new Date(2023, 5, 19),   // Juneteenth
    new Date(2023, 6, 4),    // Independence Day (observed)
    new Date(2023, 8, 4),    // Labor Day
    new Date(2023, 10, 23),  // Thanksgiving Day
    new Date(2023, 11, 25),   // Christmas Day
];

function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 represents Sunday, 6 represents Saturday
}

function isHoliday(date) {
    for (const holidayDate of holidayDates2023) {
        if (
            date.getFullYear() === holidayDate.getFullYear() &&
            date.getMonth() === holidayDate.getMonth() &&
            date.getDate() === holidayDate.getDate()
        ) {
            return true;
        }
    }
    return false;
}

function findNearestBackwardWeekday(date) {
    date.setDate(date.getDate() - 1)
    if (isWeekend(date) || isHoliday(date)) {
        return findNearestBackwardWeekday(date);
    }
    else {
        return date
    };
}

function findNearestForwardWeekday(date) {
    date.setDate(date.getDate() + 1)
    if (isWeekend(date) || isHoliday(date)) {
        return findNearestForwardWeekday(date);
    }
    else {
        return date
    };
}

var today = new Date();
previousTradingDay = findNearestBackwardWeekday(today)
today = new Date();
nextTradingDay = findNearestForwardWeekday(today)

console.log("Today:", new Date());
console.log("Previous Trading Day:", previousTradingDay);
console.log("Next Trading Day:", nextTradingDay);


// convert a JavaScript date to the "MM/DD/YYYY" format for insertion into the url we are scraping from open-insider
function formatDateToEncodedString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${month}%2F${day}%2F${year}`;
}

const reformattedDate_previousTradingDay = formatDateToEncodedString(previousTradingDay);




const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function scrapeAndDisplayData() {
    
    const url = 'http://openinsider.com/screener?s=&o=&pl=4&ph=&ll=&lh=&fd=-1&fdr='+reformattedDate_previousTradingDay+'+-+'+reformattedDate_previousTradingDay+'&td=0&tdr=&fdlyl=&fdlyh=5&daysago=&xp=1&vl=&vh=&ocl=&och=&sic1=-1&sicl=100&sich=9999&iscob=1&isceo=1&ispres=1&iscoo=1&iscfo=1&grp=2&nfl=&nfh=&nil=1&nih=&nol=1&noh=&v2l=20&v2h=&oc2l=&oc2h=&sortcol=0&cnt=100&page=1'
    
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const data = [];

        $('table.tinytable tr').each((index, row) => {
            const cols = $(row).find('td');
            if (cols.length > 0) {
                const rowData = [];
                cols.each((colIndex, col) => {
                    rowData.push($(col).text().trim());
                });
                data.push(rowData);
            }
        });

        const tickers = data.map(subarray => subarray[3]);
        console.log('last trading day inside trades: ' + tickers);

        return tickers;

    } catch (error) {
        console.error('Error:', error);
        return 'Scraping failed.';
    }
}




// Define an API endpoint to scrapeAndDisplayData()
module.exports = function (app) {
        
    app.get("/api/ticker/list", async (req, res) => {
        try {
            const tickers_result = await scrapeAndDisplayData();
            res.send(tickers_result);
        } catch (error) {
            console.error("Error fetching ticker list:", error.message);
            res.status(500).send("Internal server error");
        }
    });

};


// add an additional export which can be accessed like this:
// const myModule = require('./api_scrape');
// console.log(myModule.scrapeAndDisplayData); // Accessing a named export

module.exports = scrapeAndDisplayData