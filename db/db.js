'user strict'

const mysql = require('mysql');
const { env } = require('process');
require('dotenv').config()

// const connection = mysql.createConnection({
//   host     : 'gnldm1014.siteground.biz',
//   user     : 'umtnndmjmcezv',
//   password : process.env.DB_PASS,
//   database : 'db6hextktaa2yb',
// })

const connection = mysql.createConnection(`mysql://${process.env.DB_USER}:${process.env.DB_PASS}@gnldm1014.siteground.biz/${process.env.DB_DATABASE}`);

// const connection = new Pool({
//   user: 'dbuser',
//   host: 'database.server.com',
//   database: 'mydb',
//   password: 'secretpassword',
//   port: 3211,
// })

connection.connect((err) => {
  if (err) {
    throw err
  }
})

module.exports = connection