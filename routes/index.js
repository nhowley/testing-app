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



  module.exports = function routes (app) {
    landingRoute(app)
    reportsWeeklyRoute(app)
    reportsMonthlyRoute(app)
  }