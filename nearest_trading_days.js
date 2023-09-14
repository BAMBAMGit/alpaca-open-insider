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