// Database configuration
const config = {
    user: "",
    password:'',
    server: "",
    database: "",
    options: {
        encrypt: true, // Use encryption
        enableArithAbort: true,
        trustServerCertificate: true // Bypass self-signed certificate issues
    }
};

module.exports = {
    config
}