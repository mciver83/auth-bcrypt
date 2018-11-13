const express = require('express')
const session = require('express-session')
const massive = require('massive')
const bodyParser = require('body-parser')
require('dotenv').config()

const AuthCtrl = require('./controllers/Auth')

const app = express()
const { SERVER_PORT: PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

massive(CONNECTION_STRING).then(db => {
  app.set('db', db)
  console.log('db connected!')
})

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(bodyParser.json())

app.post('/auth/register', AuthCtrl.register)
app.post('/auth/login', AuthCtrl.login)
app.get('/auth/logout', AuthCtrl.logout)

app.get('/auth/currentUser', (req, res) => {
  res.send(req.session.user || null)
})

app.listen(PORT, () => {
  console.log('listening on port', PORT)
})
