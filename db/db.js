'user strict'

const mysql = require('mysql')
require('dotenv').config()

const connection = mysql.createConnection({
  host     : 'gnldm1014.siteground.biz',
  user     : 'umtnndmjmcezv',
  password : process.env.DB_PASS,
  database : 'db6hextktaa2yb',
})

connection.connect((err) => {
  if (err) {
    throw err
  }
})

module.exports = connection