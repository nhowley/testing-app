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

  const dashboardRoute = (app) => {
    app.route('/dashboard').get(requireLogin, (req, res) => {
      res.render('dashboard', {
        layout: 'default',
        template: 'default-template',
        title: 'Testing APP'
      })
    })
  }

  const reportsWeeklyRoute = (app) => {
    app.route('/reports/weekly').get(requireLogin, (req, res) => {
      res.render('reports-weekly', {
        layout: 'default',
        template: 'default-template',
        title: 'Reports Weekly'
      })
    })
  }

  const reportsMonthlyRoute = (app) => {
    app.route('/reports/monthly').get(requireLogin, (req, res) => {
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
          console.log("user", user)
        if(validPassword){
          req.session.user_id = user[0].user_id;
          res.redirect("/dashboard")
        }else {
          res.send("TRY AGAIN")
        }
    })
  }

  const logoutRoute = (app) => {
    app.route('/logout').get((req, res) => {
        req.session.user_id=null;
        res.redirect("/")
    })}

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

          req.session.user_id = user.user_id; //not sure if this works - need to find a way to edit this

      res.send(hash)
    })
  }

  const secretRoute = (app) => {
    app.route('/secret').get(requireLogin, (req, res) => {
      console.log("user", req.session.user_id)
        res.send("THIS IS A SECRET PAGE")
    })
  }

  const requireLogin = (req, res, next) => {
    if(!req.session.user_id) {
      return res.redirect('/login')
    }
    next();
  }

  module.exports = function routes (app) {
    landingRoute(app)
    reportsWeeklyRoute(app)
    reportsMonthlyRoute(app)
    loginRoute(app)
    registerRoute(app)
    secretRoute(app)
    logoutRoute(app)
    dashboardRoute(app)
  }