const bcrypt = require('bcrypt')
const db = require('../db/db');
const axios = require('axios');
require('dotenv').config();



const landingRoute = (app) => {
    app.route('/').get((req, res) => {
        res.sendFile(path.join(__dirname, 'login.handlebars'))
    })
}


  module.exports = function routes (app) {
    landingRoute(app)
  }