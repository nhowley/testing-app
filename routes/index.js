const landingRoute = (app) => {
    app.route('/').get((req, res) => {
      res.render('landing', {
        layout: 'default',
        template: 'default-template',
        title: 'Testing APP'
      })
    })
  }


  const reportsRoute = (app) => {
    app.route('/reports').get((req, res) => {
      res.render('reports', {
        layout: 'default',
        template: 'default-template',
        title: 'Reports'
      })
    })
  }



  module.exports = function routes (app) {
    landingRoute(app)
    reportsRoute(app)
  }