const sql = require('mssql');
const xlsx = require('xlsx');
const config = require('./dataConfig');

// Function to generate a random number between a range
function getRandomNumber(min, max, decimalPlaces = 0) {
    const randomNumber = Math.random() * (max - min) + min;
    return parseFloat(randomNumber.toFixed(decimalPlaces));
}

// Function to select a random item from an array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Function to generate today's data and save it to an Excel file
async function generateTodaysDataToExcel() {
    try {
        const today = new Date();
        const postpaidTypes = ['M-MD1', 'M-MD2', 'M-NONMD', 'U-MD1', 'U-MD2', 'U-NONMD'];
        const postpaidMediums = ['remita', 'buypower', 'bank', 'cash', 'banahim', 'pos', 'powershop'];
        const prepaidTypes = ['pre-customer'];
        const prepaidMediums = ['remita', 'buypower'];

        // Prepare data to be written to Excel
        const data = [];

        for (let dt_id = 1; dt_id <= 905; dt_id++) {
            // Generate all combinations for prepaid with random medium
            for (const type of prepaidTypes) {
                const medium = getRandomItem(prepaidMediums);
                const dailyRevenueCollected = getRandomNumber(500000, 900000, 2);
                const customerResponseNumber = getRandomNumber(8, 11);
                data.push({
                    DT_id: dt_id,
                    Date: today.toISOString().split('T')[0],
                    status: 'prepaid',
                    type: type,
                    medium: medium,
                    dailyRevenueCollected: dailyRevenueCollected,
                    customerResponseNumber: customerResponseNumber
                });
            }

            // Generate all combinations for postpaid with random medium
            for (const type of postpaidTypes) {
                const medium = getRandomItem(postpaidMediums);
                const dailyRevenueCollected = getRandomNumber(500000, 900000, 2);
                const customerResponseNumber = getRandomNumber(8, 11);
                data.push({
                    DT_id: dt_id,
                    date: today.toISOString().split('T')[0],
                    status: 'postpaid',
                    type: type,
                    medium: medium,
                    dailyRevenueCollected: dailyRevenueCollected,
                    customerResponseNumber: customerResponseNumber
                });
            }
        }

        // Convert data to worksheet
        const worksheet = xlsx.utils.json_to_sheet(data);

        // Create a new workbook and append the worksheet
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'TodayData');

        // Write the workbook to an Excel file
        const filename = `CollectionsDailyData_${today.toISOString().split('T')[0]}.xlsx`;
        xlsx.writeFile(workbook, filename);

        console.log(`Data saved successfully to ${filename}`);
    } catch (err) {
        console.error('Error generating Excel file:', err);
    }
}

// Run the function
generateTodaysDataToExcel();
