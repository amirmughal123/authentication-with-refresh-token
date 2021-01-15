const express = require ('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()
const port = 3000
// middlewares
app.use(bodyParser.json());
app.use(cookieParser())

// db Connection
mongoose.connect(process.env.DB_URI, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true
}).then(res => {
  app.listen(port, () => console.log('Server is up and running'))
}).catch(err => {
  console.log('DB connection error: ', err)
})

app.use(require('./routes/authRoutes'))
app.use(require('./routes/tokenRoute'))
