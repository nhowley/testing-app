const bcrypt = require('bcrypt')
const db = require('../db/db');

const landingRoute = (app) => {
    app.route('/').get((req, res) => {
      res.render('landing', {
        layout: 'default',
        template: 'default-template',
        title: 'Testing APP'
      })
    })
  }

  const reportsWeeklyRoute = (app) => {
    app.route('/reports/weekly').get((req, res) => {
      res.render('reports-weekly', {
        layout: 'default',
        template: 'default-template',
        title: 'Reports Weekly'
      })
    })
  }

  const reportsMonthlyRoute = (app) => {
    app.route('/reports/monthly').get((req, res) => {
      res.render('reports-monthly', {
        layout: 'default',
        template: 'default-template',
        title: 'Reports Monthly'
      })
    })
  }

  const loginRoute = (app) => {
    app.route('/login').get((req, res) => {
      res.render('login', {
        layout: 'default',
        template: 'default-template',
        title: 'Login'
      })
    })

    app.route('/login').post(async (req, res) => {
      const { password, email } = req.body
      console.log("req.body", req.body)

      let query = `SELECT * FROM users WHERE email='${email}'`
          // console.log(query)
          let user = await new Promise((resolve, reject) => db.query(query, (err, Qresults) => {
              if (err) {
                  console.log('🐣')
                  reject(err)
              } else {
                  console.log('🥚')
                  resolve(Qresults)
              }
          }))

        const validPassword = bcrypt.compare(password, user.password)

        if(validPassword){
          res.send("YAY")
        }else {
          res.send("TRY AGAIN")
        }
    })
  }

  const registerRoute = (app) => {
    app.route('/register').get((req, res) => {
      res.render('register', {
        layout: 'default',
        template: 'default-template',
        title: 'Login'
      })
    })

    app.route('/register').post(async (req, res) => {
      const { password, email, phone, firstName, lastName } = req.body
      const hash = await bcrypt.hash(password, 12);
      console.log("req.body", req.body)

      let query = `INSERT INTO users (email,firstName,lastName,phone,password)`
          query += ` VALUES ("${email}", "${firstName}", "${lastName}", "${phone}", "${hash}"`
          query += `)`
          // console.log(query)
          let results = await new Promise((resolve, reject) => db.query(query, (err, Qresults) => {
              if (err) {
                  console.log('🐣')
                  reject(err)
              } else {
                  console.log('🥚')
                  resolve(Qresults)
              }
          }))

      res.send(hash)
    })
  }

  module.exports = function routes (app) {
    landingRoute(app)
    reportsWeeklyRoute(app)
    reportsMonthlyRoute(app)
    loginRoute(app)
    registerRoute(app)
  }