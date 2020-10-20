const bcrypt = require('bcrypt')
const db = require('../db/db');
const axios = require('axios');
require('dotenv').config();

const HOST_URL = process.env.HOST;


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
      title: 'Testing APP',
      isClient: req.session.isClient,
      isCoach: req.session.isCoach,
    })
  })
}

const macroCalcRoute = (app) => {
  app.route('/macro-calculator').get(requireCoach, (req, res) => {
    res.render('macro-calculator', {
      layout: 'default',
      template: 'default-template',
      title: 'Macro Calculator',
      isClient: req.session.isClient,
      isCoach: req.session.isCoach,
    })
  })
}

const getClients = async () => {
  try {
    let clients  = await axios.get(`${HOST_URL}/get-clients`)
    console.log("clients in getClients", clients)
    return clients
  } catch (error) {
    return console.error(error)
  }
}

const clientsRoute = (app) => {
  app.route('/clients').get(requireCoach, async (req, res) => {
    let clients = await getClients()
    console.log("clients", clients)
    res.render('clients', {
      layout: 'default',
      template: 'default-template',
      title: 'Clients',
      isClient: req.session.isClient,
      isCoach: req.session.isCoach,
      clients: clients
    })
  })

app.route('/add-client').post(async (req, res) => {
    const { email, firstName, lastName, gender } = req.body
    const randomString = Math.random().toString(36).slice(-8);
    const hash = await bcrypt.hash(randomString, 12);
    const coach = req.session.user_id
    // console.log("req.body", req.body);

    await axios.get(`${HOST_URL}/add-client/${email}?gender=${gender}&firstName=${firstName}&lastName=${lastName}&hash=${hash}&coach=${coach}`)
          .then((res) => {
            // console.log("res", res)
            console.log("randomString", randomString)
            
          })
          .catch((err) => {
              console.log(err)
    })

    res.redirect("/clients")
  })
}

const reportsWeeklyRoute = (app) => {
  app.route('/reports/weekly').get(requireCoach, (req, res) => {
    res.render('reports-weekly', {
      layout: 'default',
      template: 'default-template',
      title: 'Reports Weekly',
      isClient: req.session.isClient,
      isCoach: req.session.isCoach,
    })
  })
}

const reportsMonthlyRoute = (app) => {
  app.route('/reports/monthly').get(requireCoach, (req, res) => {
    res.render('reports-monthly', {
      layout: 'default',
      template: 'default-template',
      title: 'Reports Monthly',
      isClient: req.session.isClient,
      isCoach: req.session.isCoach,
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

    app.route('/login/:userType').post(async (req, res) => {
      const { password, email } = req.body
      const userType = req.params.userType
      console.log("email", email)

      if (userType === "coach"){
        let user;
        await axios.get(`${HOST_URL}/find-user/${email}`)
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
          res.redirect("/dashboard")
          
        } else {
          res.send("TRY AGAIN")
        }
      }

      else {
        console.log("client login")
        let user;
        await axios.get(`${HOST_URL}/find-client/${email}`)
              .then((res) => {
                user=res.data
              })
              .catch((err) => {
                  console.log(err)
        })

        const validPassword = bcrypt.compare(password, user.password)

        if(validPassword){
          req.session.user_id = user[0].client_id;
          req.session.isClient = user[0].isClient;
          req.session.isCoach = user[0].isCoach;
          res.redirect("/dashboard")
          
        } else {
          res.send("TRY AGAIN")
        }
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

      await axios.get(`${HOST_URL}/register-user/${email}?phone=${phone}&firstName=${firstName}&lastName=${lastName}&hash=${hash}`)
            .then((res) => {
              // console.log("res", res)
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
    console.log("req.session.user_id", req.session.user_id)
    if(!req.session.user_id) {
      return res.redirect('/login')
    }
    next();
  }

  const requireCoach = (req, res, next) => {
    console.log("req.session.user_id", req.session.user_id)
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
    macroCalcRoute(app)
    clientsRoute(app)
  }