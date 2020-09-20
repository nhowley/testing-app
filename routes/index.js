const landingRoute = (app) => {
    app.route('/').get((req, res) => {
      res.render('landing', {
        layout: 'landing',
        template: 'landing-template',
        title: 'Testing APP'
      })
    })
  }


  module.exports = function routes (app) {
    landingRoute(app)
  }