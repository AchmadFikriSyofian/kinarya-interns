const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kinarya_interns',
});

connection.connect((error) => {
    if(error) {
        console.error('Error in database', error);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = { connection };