const sql = require('mssql');
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

// Function to populate CollectionsDailyData_DT table
async function populateCollectionsDailyData() {
    try {
        // Connect to the database
        await sql.connect(config);

        const startDate = new Date('2019-01-01');
        const endDate = new Date('2019-03-31');

        const postpaidTypes = ['M-MD1', 'M-MD2', 'M-NONMD', 'U-MD1', 'U-MD2', 'U-NONMD'];
        const postpaidMediums = ['remita', 'buypower', 'bank', 'cash', 'banahim', 'pos', 'powershop'];
        const prepaidTypes = ['pre-customer'];
        const prepaidMediums = ['remita', 'buypower'];

        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            for (let dt_id = 1; dt_id <= 905; dt_id++) {
                // Insert all combinations for prepaid with random medium
                for (const type of prepaidTypes) {
                    const medium = getRandomItem(prepaidMediums);
                    const dailyRevenueCollected = getRandomNumber(500000, 900000, 2);
                    const customerResponseNumber = getRandomNumber(8, 11);
                    const query = `
                        INSERT INTO CollectionsDailyData_DT (DT_id, [Date], [status], [type], [medium], [dailyRevenueCollected], [customerResponseNumber])
                        VALUES (${dt_id}, '${currentDate.toISOString().split('T')[0]}', 'prepaid', '${type}', '${medium}', ${dailyRevenueCollected}, ${customerResponseNumber});
                    `;
                    await sql.query(query);
                }

                // Insert all combinations for postpaid with random medium
                for (const type of postpaidTypes) {
                    const medium = getRandomItem(postpaidMediums);
                    const dailyRevenueCollected = getRandomNumber(500000, 900000, 2);
                    const customerResponseNumber = getRandomNumber(8, 11);
                    const query = `
                        INSERT INTO CollectionsDailyData_DT (DT_id, [Date], [status], [type], [medium], [dailyRevenueCollected], [customerResponseNumber])
                        VALUES (${dt_id}, '${currentDate.toISOString().split('T')[0]}', 'postpaid', '${type}', '${medium}', ${dailyRevenueCollected}, ${customerResponseNumber});
                    `;
                    await sql.query(query);
                }
            }

            // Move to the next day
            currentDate.setDate(currentDate.getDate() + 1);
        }

        console.log('Data populated successfully.');
    } catch (err) {
        console.error('Error populating data:', err);
    } finally {
        sql.close(); // Close the connection
    }
}

// Run the function
populateCollectionsDailyData();
