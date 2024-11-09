const sql = require('mssql');
const xlsx = require('xlsx');
const config = require('./dataConfig');

// Function to generate a random number between a range
function getRandomNumber(min, max, decimalPlaces = 0) {
    const randomNumber = Math.random() * (max - min) + min;
    return parseFloat(randomNumber.toFixed(decimalPlaces));
}

// Function to generate and save CommercialMonthlyData_DT to an Excel file
async function generateCommercialMonthlyDataToExcel() {
    try {
        const dates = ['2024-08-31']; // Last day of August 2024
        const postpaidTypes = ['M-MD1', 'M-MD2', 'M-NONMD', 'U-MD1', 'U-MD2', 'U-NONMD'];
        const prepaidTypes = ['pre-customer'];
        const tariffMultiplier = 215;

        const data = [];

        // Iterate through each date
        for (const date of dates) {
            // Iterate through each DT_id
            for (let dt_id = 1; dt_id <= 905; dt_id++) {
                // Prepaid
                const customerPopulation = getRandomNumber(5000, 8000);
                const customerBilled = getRandomNumber(customerPopulation * 0.75, customerPopulation * 0.8);
                const energyBilled = customerBilled * tariffMultiplier;
                const revenueBilled = getRandomNumber(energyBilled * 0.75, energyBilled * 0.8, 2);

                data.push({
                    DT_id: dt_id,
                    Date: date,
                    status: 'prepaid',
                    type: 'pre-customer',
                    EnergyBilled: energyBilled,
                    RevenueBilled: revenueBilled,
                    CustomerPopulation: customerPopulation,
                    CustomerBilled: customerBilled
                });

                // Postpaid
                for (const type of postpaidTypes) {
                    const customerPopulation = getRandomNumber(5000, 8000);
                    const customerBilled = getRandomNumber(customerPopulation * 0.75, customerPopulation * 0.8);
                    const energyBilled = customerBilled * tariffMultiplier;
                    const revenueBilled = getRandomNumber(energyBilled * 0.75, energyBilled * 0.8, 2);

                    data.push({
                        DT_id: dt_id,
                        Date: date,
                        status: 'postpaid',
                        type: type,
                        EnergyBilled: energyBilled,
                        RevenueBilled: revenueBilled,
                        CustomerPopulation: customerPopulation,
                        CustomerBilled: customerBilled
                    });
                }
            }
        }

        // Convert data to worksheet
        const worksheet = xlsx.utils.json_to_sheet(data);

        // Create a new workbook and append the worksheet
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'MonthlyData');

        // Write the workbook to an Excel file
        const filename = `CommercialMonthlyData_2024-08-31.xlsx`;
        xlsx.writeFile(workbook, filename);

        console.log(`Data saved successfully to ${filename}`);
    } catch (err) {
        console.error('Error generating Excel file:', err);
    }
}


// Run the function
generateCommercialMonthlyDataToExcel();
