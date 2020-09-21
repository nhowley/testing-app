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

const connection = mysql.createConnection(`mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_DATABASE}`);

connection.connect((err) => {
  if (err) {
    throw err
  }
})

module.exports = connection