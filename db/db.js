'user strict'

const mysql = require('mysql')
require('dotenv').config()

// // const connection = mysql.createConnection({
// //   host     : 'gnldm1014.siteground.biz',
// //   user     : 'umtnndmjmcezv',
// //   password : process.env.DB_PASS,
// //   database : 'db6hextktaa2yb',
// // })


// const connection = mysql.createConnection(`${process.env.DATABASE_URL}`);

// connection.connect((err) => {
//   if (err) {
//     throw err
//   }
// })

// module.exports = connection

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : DB_HOST,
  user            : DB_USER,
  password        : DB_PASS,
  database        : DB_DATABASE
});

// pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });


module.exports = pool