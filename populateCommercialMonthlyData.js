const sql = require('mssql');
const config = require('./dataConfig');

// Function to generate a random number between a range
function getRandomNumber(min, max, decimalPlaces = 0) {
    const randomNumber = Math.random() * (max - min) + min;
    return parseFloat(randomNumber.toFixed(decimalPlaces));
}

// Function to populate CommercialMonthlyData_DT table
async function populateCommercialMonthlyData() {
    try {
        // Connect to the database
        await sql.connect(config);

        const dates = ['2019-01-31', '2019-02-28', '2019-03-31']; // Last days of the three months
        const postpaidTypes = ['M-MD1', 'M-MD2', 'M-NONMD', 'U-MD1', 'U-MD2', 'U-NONMD'];
        const prepaidTypes = ['pre-customer'];
        const tariffMultiplier = 215;

        // Iterate through each date
        for (const date of dates) {
            // Iterate through each DT_id
            for (let dt_id = 1; dt_id <= 905; dt_id++) {
                // Prepaid
                const customerPopulation = getRandomNumber(5000, 8000);
                const customerBilled = getRandomNumber(customerPopulation * 0.75, customerPopulation * 0.8);
                const energyBilled = customerBilled * tariffMultiplier;
                const revenueBilled = getRandomNumber(energyBilled * 0.75, energyBilled * 0.8, 2);

                const prepaidQuery = `
                    INSERT INTO CommercialMonthlyData_DT (DT_id, [Date], [status], [type], [EnergyBilled], [RevenueBilled], [CustomerPopulation], [CustomerBilled])
                    VALUES (${dt_id}, '${date}', 'prepaid', 'pre-customer', ${energyBilled}, ${revenueBilled}, ${customerPopulation}, ${customerBilled});
                `;
                await sql.query(prepaidQuery);

                // Postpaid
                for (const type of postpaidTypes) {
                    const customerPopulation = getRandomNumber(5000, 8000);
                    const customerBilled = getRandomNumber(customerPopulation * 0.75, customerPopulation * 0.8);
                    const energyBilled = customerBilled * tariffMultiplier;
                    const revenueBilled = getRandomNumber(energyBilled * 0.75, energyBilled * 0.8, 2);

                    const postpaidQuery = `
                        INSERT INTO CommercialMonthlyData_DT (DT_id, [Date], [status], [type], [EnergyBilled], [RevenueBilled], [CustomerPopulation], [CustomerBilled])
                        VALUES (${dt_id}, '${date}', 'postpaid', '${type}', ${energyBilled}, ${revenueBilled}, ${customerPopulation}, ${customerBilled});
                    `;
                    await sql.query(postpaidQuery);
                }
            }
        }

        console.log('Data populated successfully.');
    } catch (err) {
        console.error('Error populating data:', err);
    } finally {
        sql.close(); // Close the connection
    }
}

// Run the function
populateCommercialMonthlyData();