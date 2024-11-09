const sql = require('mssql');
// const config = require('./dataConfig'); // Your DB config

const config = {
    user: "",
    password: '',
    server: "",
    database: "",
    options: {
        encrypt: true, // Use encryption
        enableArithAbort: true,
        trustServerCertificate: true // Bypass self-signed certificate issues
    }
};

// Function to get random PaymentStatus based on 76% current and 24% outstanding
function getRandomPaymentStatus() {
    const randomValue = Math.random();
    return randomValue < 0.76 ? 'current' : 'outstanding';
}

// Function to update PaymentStatus in CollectionsDailyData_DT
async function updatePaymentStatus() {
    try {
        // Connect to the database
        await sql.connect(config);

        // Fetch all DT_ids and update their PaymentStatus
        const query = `SELECT DT_id, [Date] FROM CollectionsDailyData_DT`;
        const result = await sql.query(query);

        const records = result.recordset;

        // Iterate over each record and update PaymentStatus
        for (const record of records) {
            const paymentStatus = getRandomPaymentStatus();
            
            // Ensure the date is in YYYY-MM-DD format
            const formattedDate = new Date(record.Date).toISOString().split('T')[0];
            
            const updateQuery = `
                UPDATE CollectionsDailyData_DT
                SET PaymentStatus = '${paymentStatus}'
                WHERE DT_id = ${record.DT_id} AND [Date] = '${formattedDate}';
            `;
            await sql.query(updateQuery);
        }

        console.log('PaymentStatus updated successfully.');
    } catch (err) {
        console.error('Error updating PaymentStatus:', err);
    } finally {
        sql.close(); // Close the connection
    }
}

// Run the function
updatePaymentStatus();
