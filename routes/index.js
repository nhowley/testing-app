// var bodyParser = require('body-parser')

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

    app.route('/login').post((req, res) => {
      console.log("req.body", req.body)
      res.send(req.body)
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

    app.route('/register').post((req, res) => {
      console.log("req.body", req.body)
      res.send(req.body)
    })
  }



  module.exports = function routes (app) {
    landingRoute(app)
    reportsWeeklyRoute(app)
    reportsMonthlyRoute(app)
    loginRoute(app)
    registerRoute(app)
  }