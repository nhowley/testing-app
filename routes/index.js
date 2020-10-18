const bcrypt = require('bcrypt')
const db = require('../db/db');
const axios = require('axios')


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
    app.route('/dashboard').get(requireCoach, (req, res) => {
      res.render('dashboard', {
        layout: 'default',
        template: 'default-template',
        title: 'Testing APP'
      })
    })
  }

  const reportsWeeklyRoute = (app) => {
    app.route('/reports/weekly').get(requireCoach, (req, res) => {
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
      console.log("email", email)

      let user;
      await axios.get(`http://localhost:3306/find-user/${email}`)
            .then((res) => {
              user=res.data
            })
            .catch((err) => {
                console.log(err)
      })

      const validPassword = bcrypt.compare(password, user.password)

      if(validPassword){
        req.session.user_id = user[0].user_id;
        req.session.isClient = user[0].isClient;
        req.session.isCoach = user[0].isCoach;
        if(user[0].isCoach){
          res.redirect("/dashboard")
        } else {
          res.redirect("/secret")
        }
        
      } else {
        res.send("TRY AGAIN")
      }

    })
  }

  const logoutRoute = (app) => {
    app.route('/logout').get((req, res) => {
        req.session.destroy();
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

      await axios.get(`http://localhost:3306/register-user/${email}?phone=${phone}&firstName=${firstName}&lastName=${lastName}&hash=${hash}`)
            .then((res) => {
              console.log("res", res)
            })
            .catch((err) => {
                console.log(err)
      })

          // req.session.user_id = user.user_id; //not sure if this works - need to find a way to edit this

      res.send(hash)
    })
  }

  const secretRoute = (app) => {
    app.route('/secret').get(requireClient, (req, res) => {
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

  const requireCoach = (req, res, next) => {
    if(!req.session.isCoach) {
      return res.redirect('/login')
    }
    next();
  } 

  const requireClient = (req, res, next) => {
    if(!req.session.isClient) {
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