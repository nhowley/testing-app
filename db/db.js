'user strict'

const mysql = require('mysql');
const { env } = require('process');
require('dotenv').config()
const { Pool, Client } = require('pg')

// const connection = mysql.createConnection({
//   host     : 'gnldm1014.siteground.biz',
//   user     : 'umtnndmjmcezv',
//   password : process.env.DB_PASS,
//   database : 'db6hextktaa2yb',
// })

const connection = mysql.createConnection(`${process.env.DATABASE_URL}`);

// const connection = new Pool({
//   user: 'wkjrrgatzzehmi',
//   host: 'ec2-54-228-209-117.eu-west-1.compute.amazonaws.com',
//   database: 'd98k2uh7gfp8f5',
//   password: '0d1b97da4e0ae5fd9bd13327843717cfe1165cb29592817faf5fd1ef13d532f8',
//   port: 5432,
// })

connection.connect((err) => {
  if (err) {
    throw err
  }
})

module.exports = connection