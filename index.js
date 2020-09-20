const express = require('express')
require('dotenv').config()
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const axios = require('axios')
const cookieParser = require('cookie-parser')
const port = 3306

const app = express()

// app.get('/', (req, res) => {
//   res.send('Hello OD!')
// })

const routes = require('./routes/index.js')
const db = require('./routes/db.js')

const hbs = exphbs.create({ /* default config */ })

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static('public'))

routes(app)
db(app)

app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`)
})