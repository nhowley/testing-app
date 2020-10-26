const express = require('express')
require('dotenv').config()
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const axios = require('axios')
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 80
const session = require('express-session')
const path = require('path')

const app = express()

// app.get('/', (req, res) => {
//   res.send('Hello OD!')
// })

// const routes = require('./routes/index.js')
// const routes2 = require('./routes/index2.js')
const db = require('./routes/db.js')

const hbs = exphbs.create({ /* default config */ })

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(session({secret: 'notagoodsecret'}))

app.route('/').get((req, res) => {
  
  res.sendFile(path.join(__dirname, 'react-dashboard/dist', 'index.html'))
})



// routes(app)
db(app)
// routes2(app)

app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`)
})